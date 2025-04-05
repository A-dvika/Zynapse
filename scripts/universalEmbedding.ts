// scripts/universalEmbedding.ts
import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { index2 } from "../lib/pinecone"; // Your Pinecone client/index instance
import { redisClient } from "../lib/cache"; // Your Redis client (if available)

const prisma = new PrismaClient();

type ContentItem = {
  id: string;
  type: string;
  title: string;
  url: string;
  summary?: string | null;
  tags: string[];
};

/**
 * Enhance content using Gemini if the content type is sparse.
 * Falls back to the original title if Gemini fails.
 */
async function enhanceWithGemini(content: ContentItem): Promise<string> {
  let prompt = "";
  switch (content.type) {
    case "RedditPost":
      prompt = `Summarize and add context to this Reddit post title: "${content.title}"`;
      break;
    case "GitHubRepo":
      prompt = `Generate a detailed description for the GitHub repository named "${content.title}" with tags: ${content.tags.join(", ")}.`;
      break;
    case "GitHubIssue":
      prompt = `Expand this GitHub issue title with additional context: "${content.title}"`;
      break;
    case "HackerNewsItem":
      prompt = `Provide a concise one-liner summary for this Hacker News item titled: "${content.title}"`;
      break;
    case "Meme":
      prompt = `Describe the sentiment and context of this meme. Title: "${content.title}"${
        content.summary ? `, Caption: "${content.summary}"` : ""
      }`;
      break;
    default:
      return content.summary ? `${content.title} - ${content.summary}` : content.title;
  }

  console.log(`Calling Gemini for content ${content.id} with prompt: ${prompt}`);

  try {
    const response = await axios.post(
      process.env.GEMINI_API_URL!,
      { prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 15000, // 15 seconds timeout
      }
    );
    const enhancedText: string = response.data.enhancedText;
    console.log(`Gemini response for content ${content.id}: ${enhancedText}`);
    return enhancedText || content.title;
  } catch (error: any) {
    console.error(
      `Gemini enhancement failed for content ${content.id}:`,
      error.response?.data || error.message
    );
    return content.title;
  }
}

/**
 * Generate an embedding for a given text using Cohere.
 */
async function generateEmbedding(text: string): Promise<number[]> {
  const cohereApiKey = process.env.COHERE_API_KEY;
  if (!cohereApiKey) {
    throw new Error("COHERE_API_KEY is not set.");
  }
  const url = "https://api.cohere.ai/embed";
  console.log(`Generating embedding for text (length: ${text.length})...`);

  try {
    const response = await axios.post(
      url,
      {
        texts: [text],
        model: "embed-english-light-v2.0",
      },
      {
        headers: {
          Authorization: `Bearer ${cohereApiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 15000, // 15 seconds timeout
      }
    );
    const embedding = response.data.embeddings[0] as number[];
    console.log(`Embedding generated (dimension: ${embedding.length})`);
    return embedding;
  } catch (error: any) {
    console.error(
      "Error generating embedding with Cohere:",
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * Save the embedding and metadata to Pinecone.
 */
async function saveToPinecone(content: ContentItem, embedding: number[]): Promise<void> {
  const metadata = {
    id: content.id,
    type: content.type,
    title: content.title,
    url: content.url,
    tags: content.tags,
    ...(content.summary ? { summary: content.summary } : {}),
  };

  const vector = {
    id: content.id,
    values: embedding,
    metadata,
  };

  console.log(`Upserting vector to Pinecone for content ${content.id}...`);

  try {
    await index2.upsert([vector]);
    console.log(`Successfully upserted vector for content ${content.id}`);
  } catch (error: any) {
    console.error(
      `Failed to save to Pinecone for content ${content.id}:`,
      error.response?.data || error.message
    );
  }
}

/**
 * Main processing function:
 * 1. Loop through all Content items.
 * 2. Enhance content with Gemini if necessary.
 * 3. Generate embedding with Cohere.
 * 4. Save the vector to Pinecone.
 */
async function processContentItems() {
  console.info("Starting universal embedding process...");

  try {
    const contents = await prisma.content.findMany();
    console.info(`Found ${contents.length} content items.`);

    let processedCount = 0;
    for (const content of contents) {
      console.info(`Processing content ${content.id} of type ${content.type}...`);
      // Map Prisma result to our ContentItem type
      const contentItem: ContentItem = {
        id: content.id,
        type: content.type,
        title: content.title,
        url: content.url,
        summary: content.summary,
        tags: content.tags,
      };

      // Determine the text to embed: enhance with Gemini for specific types.
      let textToEmbed: string;
      if (
        ["RedditPost", "GitHubRepo", "GitHubIssue", "HackerNewsItem", "Meme"].includes(contentItem.type)
      ) {
        const cacheKey = `enhanced:${contentItem.id}`;
        let enhancedText: string | null = null;
        try {
          enhancedText = await redisClient.get(cacheKey);
          if (enhancedText) {
            console.info(`Using cached enhanced text for content ${contentItem.id}`);
          } else {
            enhancedText = await enhanceWithGemini(contentItem);
            await redisClient.set(cacheKey, enhancedText);
            console.info(`Cached enhanced text for content ${contentItem.id}`);
          }
        } catch (cacheError) {
          console.error(`Cache error for content ${contentItem.id}:`, cacheError);
          enhancedText = await enhanceWithGemini(contentItem);
        }
        textToEmbed = enhancedText;
      } else {
        textToEmbed = contentItem.summary
          ? `${contentItem.title} - ${contentItem.summary}`
          : contentItem.title;
      }

      console.info(`Text to embed for content ${contentItem.id}: ${textToEmbed}`);

      // Generate embedding via Cohere.
      let embedding: number[];
      try {
        embedding = await generateEmbedding(textToEmbed);
      } catch (embError) {
        console.error(`Skipping content ${contentItem.id} due to embedding error.`);
        continue;
      }

      if (!embedding || embedding.length === 0) {
        console.error(`No embedding generated for content ${contentItem.id}, skipping.`);
        continue;
      }

      // Save vector to Pinecone.
      await saveToPinecone(contentItem, embedding);
      processedCount++;
    }
    console.info(`Finished processing ${processedCount} content items out of ${contents.length}.`);
  } catch (error: any) {
    console.error("Error processing content items:", error);
  } finally {
    await prisma.$disconnect();
    console.info("Prisma client disconnected. Process complete.");
  }
}

processContentItems()
  .then(() => {
    console.info("Universal embedding process finished successfully.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fatal error during processing:", error);
    process.exit(1);
  });
