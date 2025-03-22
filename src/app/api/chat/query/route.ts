import { NextRequest, NextResponse } from "next/server";
import { generateEmbedding } from "../../../../../lib/embedding"; // Your embedding code
import { generateSummary } from "../../../../../lib/ai"; // Your Gemini LLM function
import { index } from "../../../../../lib/pinecone"; // Pinecone index
import { redisClient } from "../../../../../lib/cache"; // Redis client
import { fetchGoogleSearchResults } from "../../../../../lib/googleSearch";
import { fetchYoutubeResults } from "../../../../../lib/youtubeSearch";

/**
 * Simple check for greeting-like messages.
 */
function isGreeting(query: string) {
  const greetings = ["hi", "hello", "hey", "howdy"];
  return greetings.includes(query.toLowerCase().trim());
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    if (!query) throw new Error("Query not provided.");

    // 1) Handle basic greetings.
    if (isGreeting(query)) {
      return NextResponse.json({
        answer: "Hello! How can I help you today?",
        source: "greeting",
      });
    }

    // 2) Check Redis cache first.
    const cacheKey = `chat:${query}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return NextResponse.json({ answer: cached, source: "cache" });
    }

    // 3) Convert user query to embedding.
    const queryEmbedding = await generateEmbedding(query);

    // 4) Query Pinecone for relevant aggregated summaries.
    const pineconeResponse = await index.query({
      vector: queryEmbedding,
      topK: 3,
      includeMetadata: true,
    });
    const matches = pineconeResponse.matches || [];

    let finalContext = "";
    let usedExternal = false;

    // Build context from Pinecone if available.
    if (matches.length > 0) {
      finalContext = matches
        .map((m: any) => m.metadata?.text ?? "")
        .filter((txt: string) => txt.trim().length > 0)
        .join("\n\n");
    }

    // 5) If no Pinecone context, fallback to Google and YouTube search.
    if (!finalContext) {
      console.log(`No Pinecone context for "${query}". Trying Google search...`);
      const googleResults = await fetchGoogleSearchResults(query, 3);
      let googleContext = "";
      if (googleResults.length > 0) {
        googleContext = googleResults
          .map(
            (res: { title: string; snippet: string; link: string }) =>
              `**Google:** [${res.title}](${res.link}) - ${res.snippet}`
          )
          .join("\n\n");
      }

      console.log(`Trying YouTube search for "${query}"...`);
      const youtubeResults = await fetchYoutubeResults(query, 3);
      let youtubeContext = "";
      if (youtubeResults.length > 0) {
        youtubeContext = youtubeResults
          .map(
            (res: { title: string; description: string; link: string }) =>
              `**YouTube:** [${res.title}](${res.link}) - ${res.description}`
          )
          .join("\n\n");
      }

      finalContext = [googleContext, youtubeContext]
        .filter((ctx) => ctx.trim().length > 0)
        .join("\n\n");
      usedExternal = true;
    }

    // 6) If still no context found, bail out.
    if (!finalContext) {
      const fallback =
        "Sorry, I couldn’t find relevant info for that query right now.";
      await redisClient.set(cacheKey, fallback, { EX: 3600 });
      return NextResponse.json({ answer: fallback, source: "fallback" });
    }

    // 7) Build a detailed prompt for Gemini.
    // We now ask for a comprehensive, multi-paragraph explanation.
    const dataSource = usedExternal ? "Google & YouTube search results" : "our aggregated dashboard data";
    const prompt = `You are a knowledgeable assistant with access to ${dataSource}. 

Below is the context extracted from these sources:
${finalContext}

User's Question:
${query}

Please provide a detailed, comprehensive answer in multiple paragraphs. Explain the topic thoroughly and include any relevant links formatted in Markdown (e.g., [Title](https://link.com)).`;

    // 8) Generate the final answer using Gemini.
    const answer = await generateSummary(prompt);

    // 9) Cache the answer for future queries.
    await redisClient.set(cacheKey, answer, { EX: 3600 });

    return NextResponse.json({ answer, source: usedExternal ? "external" : "dashboard" });
  } catch (error: any) {
    console.error("Error in chat query API:", error);
    return NextResponse.json(
      { error: "Failed to process query" },
      { status: 500 }
    );
  }
}
