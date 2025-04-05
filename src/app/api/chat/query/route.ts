import { NextRequest, NextResponse } from "next/server";
import { generateEmbedding } from "../../../../../lib/embedding";
import { generateSummary, generateClassification } from "../../../../../lib/ai";
import { index } from "../../../../../lib/pinecone";
import { redisClient } from "../../../../../lib/cache";
import { fetchGoogleSearchResults } from "../../../../../lib/googleSearch";
import { fetchYoutubeResults } from "../../../../../lib/youtubeSearch";

// Define an interface for Pinecone matches.
interface PineconeMatch {
  metadata?: {
    text?: string;
  }
}

/**
 * Check if the query is a simple greeting.
 */
function isGreeting(query: string): boolean {
  const greetings = ["hi", "hello", "hey", "howdy"];
  return greetings.includes(query.toLowerCase().trim());
}

/**
 * Look for sensitive info like phone numbers, emails, passwords, or credit card numbers.
 */
function containsSensitiveInfo(text: string): boolean {
  const patterns = [
    /\b\d{10}\b/, // phone numbers
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/, // email addresses
    /\bpassword\b/i,
    /\b(?:\d[ -]*?){13,16}\b/, // credit card numbers
  ];
  return patterns.some((pattern) => pattern.test(text));
}

/**
 * Retrieve context from Pinecone based on the query embedding.
 */
async function getPineconeContext(queryEmbedding: number[]): Promise<string> {
  const pineconeResponse = await index.query({
    vector: queryEmbedding,
    topK: 3,
    includeMetadata: true,
  });
  const matches = (pineconeResponse.matches as PineconeMatch[]) || [];
  return matches
    .map((m) => m.metadata?.text?.trim() || "")
    .filter((text) => text.length > 0)
    .join("\n\n");
}

/**
 * Fetch external context concurrently from Google and YouTube.
 */
async function getExternalContext(query: string): Promise<{ context: string; usedExternal: boolean }> {
  // Execute both external searches concurrently.
  const [googleResults, youtubeResults] = await Promise.all([
    fetchGoogleSearchResults(query, 3).catch((err) => {
      console.error("Google search error:", err);
      return [];
    }),
    fetchYoutubeResults(query, 3).catch((err) => {
      console.error("YouTube search error:", err);
      return [];
    }),
  ]);

  const googleContext =
    googleResults.length > 0
      ? googleResults
          .map(
            (res: { title: string; snippet: string; link: string }) =>
              `**Google:** [${res.title}](${res.link}) - ${res.snippet}`
          )
          .join("\n\n")
      : "";
  const youtubeContext =
    youtubeResults.length > 0
      ? youtubeResults
          .map(
            (res: { title: string; description: string; link: string }) =>
              `**YouTube:** [${res.title}](${res.link}) - ${res.description}`
          )
          .join("\n\n")
      : "";

  const finalContext = [googleContext, youtubeContext]
    .filter((ctx) => ctx.trim().length > 0)
    .join("\n\n");

  return { context: finalContext, usedExternal: finalContext.trim().length > 0 };
}

/**
 * Main handler for the chat API.
 */
export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    if (!query) {
      throw new Error("Query not provided.");
    }

    // Block any sensitive user data.
    if (containsSensitiveInfo(query)) {
      return NextResponse.json({
        answer: "Please do not enter personal or sensitive information.",
        source: "security",
      });
    }

    // If it's a greeting, handle it separately.
    if (isGreeting(query)) {
      return NextResponse.json({
        answer: "Hello! Ask me anything related to tech or programming.",
        source: "greeting",
      });
    }

    // Domain classification using chain-of-prompting.
    const classificationPrompt = `Is the following query related to technology, programming, AI, gadgets, software, or hardware? Answer "yes" or "no".\n\nQuery: ${query}`;
    const domainClassification = await generateClassification(classificationPrompt);
    if (!domainClassification.toLowerCase().includes("yes")) {
      return NextResponse.json({
        answer: "Sorry, I can only help with questions related to technology or programming.",
        source: "domain-guard",
      });
    }

    // Check Redis cache for an existing answer.
    const cacheKey = `chat:${query}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return NextResponse.json({ answer: cached, source: "cache" });
    }

    // Generate the embedding for the query.
    const queryEmbedding = await generateEmbedding(query);

    // Try to get context from Pinecone.
    let finalContext = await getPineconeContext(queryEmbedding);
    let usedExternal = false;

    // If no context is found, fallback to external searches.
    if (!finalContext) {
      console.log(`No Pinecone context found for "${query}". Fetching external data...`);
      const externalResult = await getExternalContext(query);
      finalContext = externalResult.context;
      usedExternal = externalResult.usedExternal;
    }

    // If still no context is available, return a fallback answer.
    if (!finalContext) {
      const fallback = "Sorry, I couldn’t find relevant tech-related info for that query.";
      await redisClient.set(cacheKey, fallback, { EX: 3600 });
      return NextResponse.json({ answer: fallback, source: "fallback" });
    }

    // Build a detailed prompt for the AI model.
    const dataSource = usedExternal ? "Google & YouTube search results" : "our aggregated dashboard data";
    const prompt = `You are a helpful tech assistant with access to ${dataSource}.

Context:
${finalContext}

User Question:
${query}

Provide a detailed, clear, multi-paragraph answer that includes relevant Markdown formatted links if needed.`;

    // Generate the final answer using the AI model.
    const answer = await generateSummary(prompt);

    // Cache the generated answer.
    await redisClient.set(cacheKey, answer, { EX: 3600 });

    return NextResponse.json({ answer, source: usedExternal ? "external" : "dashboard" });
  } catch (error: unknown) {
    console.error("Error processing chat query API:", error);
    return NextResponse.json(
      { error: "Failed to process query" },
      { status: 500 }
    );
  }
}
