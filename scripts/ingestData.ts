// scripts/ingestData.ts
import dotenv from "dotenv";
dotenv.config();

import prisma from "../lib/db"; // Your Prisma client instance
import axios from "axios";
import { index } from "../lib/pinecone"; // Your Pinecone index instance
import { redisClient } from "../lib/cache";

/**
 * Uniform type for the aggregated records from DataSummary.
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
    console.error(
      "Error generating embedding with Cohere:",
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * Ingest aggregated summary data from the DataSummary table,
 * generate embeddings (with caching), and upsert the resulting vectors into Pinecone.
 */
async function ingestAggregatedSummaries() {
  try {
    // Query all aggregated summaries (or filter by date if needed)
    const summaries = await prisma.dataSummary.findMany() as { source: string; summary: string; createdAt: Date; updatedAt: Date }[];
    console.log(`Total aggregated summaries found: ${summaries.length}`);

    // Build unified records from the summaries
    const records: RecordItem[] = summaries.map((summary: { source: string; summary: string; createdAt: Date; updatedAt: Date }) => ({
      id: `datasummary-${summary.source}`, // unique ID per summary source
      text: summary.summary,
      metadata: {
        source: summary.source,
        createdAt: summary.createdAt,
        updatedAt: summary.updatedAt,
      },
    }));

    // Process each aggregated summary record
    for (const record of records) {
      if (!record.text) continue;

      const cacheKey = `embedding:${record.id}`;
      let embedding: number[] | null = null;

      // Check if an embedding is already cached in Redis.
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
        // Fallback: generate the embedding if cache operation fails.
        embedding = await generateEmbedding(record.text);
      }

      console.log(`Embedding dimension for ${record.id}: ${embedding.length}`);

      // Prepare vector object for Pinecone upsert.
      const vector = {
        id: record.id,
        values: embedding,
        metadata: record.metadata,
      };

      // Upsert the vector into Pinecone (using an array of vectors).
      await index.upsert([vector]);
      console.log(`Upserted vector for ${record.id}`);
    }
    console.log("All aggregated summaries ingested and upserted successfully.");
  } catch (error) {
    console.error("Error during ingestion of aggregated summaries:", error);
  } finally {
    await prisma.$disconnect();
  }
}

ingestAggregatedSummaries();
