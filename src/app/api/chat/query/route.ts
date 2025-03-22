import { NextRequest, NextResponse } from "next/server";
import { generateEmbedding } from "../../../../../lib/embedding"; // Your Cohere or OpenAI embedding code
import { generateSummary } from "../../../../../lib/ai"; // Your Gemini LLM function
import { index } from "../../../../../lib/pinecone"; // Pinecone index
import { redisClient } from "../../../../../lib/cache"; // Redis
import { fetchGoogleSearchResults } from "../../../../../lib/googleSearch";

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

    // We'll build context from Pinecone if we find relevant data.
    let finalContext = "";
    let usedGoogle = false;

    if (matches.length > 0) {
      finalContext = matches
        .map((m: any) => m.metadata?.text ?? "")
        .filter((txt: string) => txt.trim().length > 0)
        .join("\n\n");
    }

    // 5) If Pinecone didn't give us any results, fallback to Google.
    if (!finalContext) {
      console.log(`No Pinecone context for "${query}". Trying Google search...`);
      const googleResults = await fetchGoogleSearchResults(query, 3);
      if (googleResults.length > 0) {
        usedGoogle = true;
        finalContext = googleResults
          .map(
            (res: { title: string; snippet: string; link: string }) =>
              `Title: ${res.title}\nSnippet: ${res.snippet}\nLink: ${res.link}`
          )
          .join("\n\n");
      }
    }

    // If still no context found, bail out.
    if (!finalContext) {
      const fallback =
        "Sorry, I couldn’t find relevant info for that query right now.";
      await redisClient.set(cacheKey, fallback, { EX: 3600 });
      return NextResponse.json({ answer: fallback, source: "fallback" });
    }

   // In your src/app/api/chat/query/route.ts file
const dataSource = usedGoogle ? "Google search results" : "our aggregated dashboard data";
const prompt = `You are a helpful assistant with access to ${dataSource}:

${finalContext}

User's Question:
${query}

When including references or links in your answer, please format them using Markdown syntax (e.g., [Reuters](https://www.reuters.com/technology/)) so that they are clickable. Provide a concise yet accurate answer.`;


    // 7) Generate the final answer with Gemini.
    const answer = await generateSummary(prompt);

    // 8) Cache the answer.
    await redisClient.set(cacheKey, answer, { EX: 3600 });

    // 9) Return the answer along with the debug field.
    return NextResponse.json({ answer, source: usedGoogle ? "google" : "dashboard" });
  } catch (error: any) {
    console.error("Error in chat query API:", error);
    return NextResponse.json(
      { error: "Failed to process query" },
      { status: 500 }
    );
  }
}
