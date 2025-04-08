import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { index2 } from "../lib/pinecone";
import { generateSummary } from "../lib/ai";

const prisma = new PrismaClient();

type ContentItem = {
  id: string;
  type: string;
  title: string;
  url: string;
  summary?: string | null;
  tags: string[];
  relevanceScore?: number;
};

function inferSourceFromType(type: string): string {
  const lower = type.toLowerCase();
  if (lower.includes("github")) return "github";
  if (lower.includes("reddit")) return "reddit";
  if (lower.includes("hackernews")) return "hackernews";
  if (lower.includes("producthunt")) return "producthunt";
  if (lower.includes("devto")) return "devto";
  return "unknown";
}

async function enhanceWithGemini(content: ContentItem): Promise<string> {
  let prompt = "";
  switch (content.type) {
    case "RedditPost":
      prompt = `Summarize and add context to this Reddit post title: "${content.title}"`;
      break;
    case "GitHubRepo":
      prompt = `Generate a detailed description for the GitHub repo "${content.title}" with tags: ${content.tags.join(
        ", "
      )}.`;
      break;
    case "GitHubIssue":
      prompt = `Expand this GitHub issue title with additional context: "${content.title}"`;
      break;
    case "HackerNewsItem":
      prompt = `Provide a concise one-liner summary for this Hacker News item titled: "${content.title}"`;
      break;
    default:
      return content.summary ? `${content.title} - ${content.summary}` : content.title;
  }

  try {
    const res = await generateSummary(prompt);
    return res || content.title;
  } catch {
    return content.title;
  }
}

// New: Infer tags via Gemini
async function inferTagsWithGemini(content: ContentItem): Promise<string[]> {
  const baseSummary = content.summary || "";
  const prompt = `Generate a comma-separated list of relevant tags for:
Title: "${content.title}"
Summary: "${baseSummary}"
Tags only.`;
  try {
    const tagString = await generateSummary(prompt);
    return tagString.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
  } catch {
    return [];
  }
}

async function generateEmbedding(text: string): Promise<number[]> {
  const key = process.env.COHERE_API_KEY;
  if (!key) throw new Error("COHERE_API_KEY not set.");

  const res = await fetch("https://api.cohere.ai/embed", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      texts: [text],
      model: "embed-english-light-v2.0",
    }),
  });
  const data = await res.json();
  return data.embeddings[0] as number[];
}

async function saveToPinecone(content: ContentItem, emb: number[], finalSummary: string) {
  const metadata = {
    id: content.id,
    title: content.title,
    url: content.url,
    tags: content.tags,
    summary: finalSummary,
    type: content.type,
    source: inferSourceFromType(content.type),
    relevanceScore: content.relevanceScore || 0,
  };

  const vector = {
    id: content.id,
    values: emb,
    metadata,
  };

  await index2.upsert([vector]);
}

// Utility to get the start of today's date
function getStartOfToday(): Date {
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Sets time to midnight
  return now;
}

async function processContentItems() {
  try {
    // Only process contents created today.
    const startOfToday = getStartOfToday();

    const contents = await prisma.content.findMany({
      where: {
        createdAt: { gte: startOfToday },
      },
    });

    for (const c of contents) {
      const item: ContentItem = {
        id: c.id,
        type: c.type,
        title: c.title,
        url: c.url,
        summary: c.summary,
        tags: c.tags || [],
      };

      // Optional: Infer new tags via Gemini if needed.
      const newTags = await inferTagsWithGemini(item);
      if (newTags.length) {
        item.tags = Array.from(new Set([...item.tags, ...newTags]));
      }

      // Enhance the summary for certain types using Gemini.
      let finalSummary: string;
      if (["RedditPost", "GitHubRepo", "GitHubIssue", "HackerNewsItem", "Meme"].includes(item.type)) {
        finalSummary = await enhanceWithGemini(item);
      } else {
        finalSummary = item.summary ? `${item.title} - ${item.summary}` : item.title;
      }

      let embedding: number[];
      try {
        embedding = await generateEmbedding(finalSummary);
      } catch {
        continue;
      }

      if (!embedding?.length) continue;

      await saveToPinecone(item, embedding, finalSummary);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

processContentItems()
  .then(() => {
    process.exit(0);
  })
  .catch(() => {
    process.exit(1);
  });
