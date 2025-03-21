// pages/api/chat.ts




import axios from "axios";
import dotenv from "dotenv";
import { index } from "../../../../lib/pinecone";
import { generateSummary } from "../../../../lib/ai";
import { redisClient } from "../../../../lib/cache";
dotenv.config();
// src/app/api/chat/route.ts
import { NextResponse } from "next/server";

import { generateEmbedding } from "../../../../lib/embedding";

export async function POST(request: Request) {
  try {
    const { question } = await request.json();
    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    // 1. Check Redis for a cached answer.
    const cacheKey = `chat:${question}`;
    const cachedAnswer = await redisClient.get(cacheKey);
    if (cachedAnswer) {
      return NextResponse.json({ answer: cachedAnswer, source: "cache" });
    }

    // 2. Compute query embedding using the shared function.
    const queryEmbedding = await generateEmbedding(question);

    // 3. Query Pinecone for the top matching vectors.
    const queryResponse = await index.query({
      vector: queryEmbedding,
      topK: 5,
      includeMetadata: true,
    });

    let context = "";
    if (queryResponse.matches && queryResponse.matches.length > 0) {
      context = queryResponse.matches
        .map((match) => {
          const meta = match.metadata as Record<string, any>;
          // Use metadata fields relevant for context (adjust as needed).
          return meta.title || meta.source || "";
        })
        .join("\n");
    }

    // 4. Construct the prompt by combining context and the question.
    const prompt = `Context:\n${context}\n\nQuestion:\n${question}\n\nAnswer:`;

    // 5. Send the prompt to your Gemini LLM to generate the answer.
    const answer = await generateSummary(prompt);

    // 6. Cache the answer in Redis for 1 hour.
    await redisClient.set(cacheKey, answer, { EX: 3600 });

    return NextResponse.json({ answer, source: "LLM" });
  } catch (error) {
    console.error("Error in chatbot endpoint:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
