// scripts/ingestData.ts
import dotenv from "dotenv";
dotenv.config();

import prisma from "../lib/db"; // Your Prisma client
import axios from "axios";
import { index } from "../lib/pinecone";
import { redisClient } from "../lib/cache";

/**
 * Uniform type for the records you're going to embed and upsert.
 */
type RecordItem = {
  id: string;
  text: string;
  metadata: Record<string, any>;
};

/**
 * Generate an embedding for the given text using Cohere's Embedding API.
 * This example uses the "embed-english-light-v2.0" model.
 */
async function generateEmbedding(text: string): Promise<number[]> {
  const cohereApiKey = process.env.COHERE_API_KEY;
  if (!cohereApiKey) {
    throw new Error("COHERE_API_KEY is not set.");
  }

  const url = "https://api.cohere.ai/embed";
  try {
    const response = await axios.post(
      url,
      {
        texts: [text],
        model: "embed-english-light-v2.0", // Adjust model name if needed
      },
      {
        headers: {
          Authorization: `Bearer ${cohereApiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Cohere returns an "embeddings" array. Since we passed one text, extract the first embedding.
    const embedding = response.data.embeddings[0] as number[];
    return embedding;
  } catch (error: any) {
    console.error("Error generating embedding with Cohere:", error.response?.data || error.message);
    throw error;
  }
}

/**
 * Ingest relevant data from multiple Prisma models, generate embeddings (with caching),
 * and upsert the resulting vectors (with metadata) into Pinecone.
 */
async function ingestRelevantData() {
  try {
    // 1) Query data from various Prisma models:
    const techNews = await prisma.techNewsItem.findMany();
    const socialMedia = await prisma.socialMediaPost.findMany();
    const memes = await prisma.meme.findMany();
    const hackerNews = await prisma.hackerNewsItem.findMany();
    const githubIssues = await prisma.gitHubIssue.findMany();
    const soQuestions = await prisma.stackOverflowQuestion.findMany();

    // 2) Build an array of unified records.
    const records: RecordItem[] = [];

    // ---- TechNewsItem: combine title and summary ----
    for (const item of techNews) {
      if (item.title || item.summary) {
        records.push({
          id: `technews-${item.id}`,
          text: `${item.title ?? ""} ${item.summary ?? ""}`.trim(),
          metadata: {
            source: "TechNewsItem",
            url: item.url,
          },
        });
      }
    }

    // ---- SocialMediaPost: use content ----
    for (const item of socialMedia) {
      if (item.content) {
        records.push({
          id: `social-${item.id}`,
          text: item.content,
          metadata: {
            source: "SocialMediaPost",
            url: item.url,
          },
        });
      }
    }

    // ---- Meme: combine title and caption ----
    for (const item of memes) {
      if (item.title || item.caption) {
        records.push({
          id: `meme-${item.id}`,
          text: `${item.title ?? ""} ${item.caption ?? ""}`.trim(),
          metadata: {
            source: "Meme",
            url: item.link,
            imageUrl: item.imageUrl,
          },
        });
      }
    }

    // ---- HackerNewsItem: use title ----
    for (const item of hackerNews) {
      if (item.title) {
        records.push({
          id: `hackernews-${item.id}`,
          text: item.title,
          metadata: {
            source: "HackerNewsItem",
            url: item.url,
          },
        });
      }
    }

    // ---- GitHubIssue: use title ----
    for (const item of githubIssues) {
      if (item.title) {
        records.push({
          id: `githubissue-${item.id}`,
          text: item.title,
          metadata: {
            source: "GitHubIssue",
            url: item.issueUrl,
          },
        });
      }
    }

    // ---- StackOverflowQuestion: use title ----
    for (const item of soQuestions) {
      if (item.title) {
        records.push({
          id: `soquestion-${item.id}`,
          text: item.title,
          metadata: {
            source: "StackOverflowQuestion",
            url: item.link,
          },
        });
      }
    }

    console.log(`Total relevant records: ${records.length}`);

    // 3) Process each record: check cache, generate an embedding if needed, and upsert into Pinecone.
    for (const record of records) {
      if (!record.text) continue;

      const cacheKey = `embedding:${record.id}`;
      let embedding: number[] | null = null;

      // Check if embedding is already cached in Redis.
      try {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
          embedding = JSON.parse(cached) as number[];
          console.log(`Using cached embedding for ${record.id}`);
        } else {
          embedding = await generateEmbedding(record.text);
          await redisClient.set(cacheKey, JSON.stringify(embedding));
          console.log(`Generated and cached embedding for ${record.id}`);
        }
      } catch (cacheError) {
        console.error(`Cache error for record ${record.id}:`, cacheError);
        // Fallback: generate embedding if cache operation fails.
        embedding = await generateEmbedding(record.text);
      }

      // Debug: Log the dimension of the embedding
      console.log(`Embedding dimension for ${record.id}: ${embedding.length}`);

      const vector = {
        id: record.id,
        values: embedding,
        metadata: record.metadata,
      };

      // Upsert the vector into Pinecone by passing an array of vectors.
      await index.upsert([vector]);
      console.log(`Upserted vector for ${record.id}`);
    }
    console.log("All relevant data ingested and upserted successfully.");
  } catch (error) {
    console.error("Error during ingestion:", error);
  } finally {
    await prisma.$disconnect();
  }
}

ingestRelevantData();
