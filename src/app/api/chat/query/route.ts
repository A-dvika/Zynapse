import { NextRequest, NextResponse } from "next/server";
import { generateEmbedding } from "../../../../../lib/embedding";
import { generateSummary, generateClassification } from "../../../../../lib/ai";
import { index } from "../../../../../lib/pinecone";
import { redisClient } from "../../../../../lib/cache";
import { fetchGoogleSearchResults } from "../../../../../lib/googleSearch";
import { fetchYoutubeResults } from "../../../../../lib/youtubeSearch";

// ----------------------------------------------------------------------
// Interfaces & Helper Types
// ----------------------------------------------------------------------

interface PineconeMatch {
  metadata?: {
    text?: string;
    title?: string;
    summary?: string;
    tags?: string;
    url?: string;
    link?: string;
    [key: string]: any;
  };
  score?: number;
}

interface ContextResult {
  context: string;
  sourceUrls: string[];
  usedExternal?: boolean;
}

// ----------------------------------------------------------------------
// Utility functions
// ----------------------------------------------------------------------

/**
 * Check if the query is a simple greeting.
 */
function isGreeting(query: string): boolean {
  const greetings = ["hi", "hello", "hey", "howdy"];
  return greetings.includes(query.toLowerCase().trim());
}

/**
 * Check for sensitive information.
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

// ----------------------------------------------------------------------
// Context retrieval functions
// ----------------------------------------------------------------------

/**
 * Retrieve and extract context from Pinecone based on the query embedding.
 * It checks for a direct "text" field first; if not present, it combines
 * "title", "summary", and "tags". It also extracts a source URL if available.
 */
async function getPineconeContext(queryEmbedding: number[]): Promise<ContextResult> {
  const pineconeResponse = await index.query({
    vector: queryEmbedding,
    topK: 3,
    includeMetadata: true,
  });
  const matches = (pineconeResponse.matches as PineconeMatch[]) || [];

  const chunks: { text: string; url?: string }[] = [];
  matches.forEach((match) => {
    const meta = match.metadata || {};
    const url = meta.url || meta.link; // Use const here since url is never reassigned
    let chunkText = "";

    if (meta.text && meta.text.trim().length > 0) {
      chunkText = meta.text.trim();
    } else {
      const title = meta.title ? `**${meta.title.trim()}**` : "";
      const summary = meta.summary ? meta.summary.trim() : "";
      const tags = meta.tags ? `Tags: ${meta.tags.trim()}` : "";
      chunkText = [title, summary, tags].filter(Boolean).join("\n");
    }
    if (chunkText) {
      chunks.push({ text: chunkText, url });
    }
  });

  const context = chunks.map((chunk) => chunk.text).join("\n\n");
  const sourceUrls = chunks
    .filter((chunk) => chunk.url && chunk.url.trim().length > 0)
    .map((chunk) => chunk.url!.trim());
    
  console.log("🔍 Pinecone context extracted:", chunks);
  return { context, sourceUrls };
}

/**
 * Fetch external context concurrently from Google and YouTube.
 * Each result is formatted with a Markdown link and snippet/description,
 * and the URLs are collected.
 */
async function getExternalContext(query: string): Promise<ContextResult> {
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

  const sourceUrls: string[] = []; // Use const here since sourceUrls is never reassigned
  const googleContext =
    googleResults.length > 0
      ? googleResults
          .map((res: { title: string; snippet: string; link: string }) => {
            sourceUrls.push(res.link);
            return `**Google:** [${res.title}](${res.link}) - ${res.snippet}`;
          })
          .join("\n\n")
      : "";

  const youtubeContext =
    youtubeResults.length > 0
      ? youtubeResults
          .map((res: { title: string; description: string; link: string }) => {
            sourceUrls.push(res.link);
            return `**YouTube:** [${res.title}](${res.link}) - ${res.description}`;
          })
          .join("\n\n")
      : "";

  const finalContext = [googleContext, youtubeContext]
    .filter((ctx) => ctx.trim().length > 0)
    .join("\n\n");

  console.log("🔍 External context extracted:", finalContext);
  return { context: finalContext, sourceUrls, usedExternal: finalContext.trim().length > 0 };
}

// ----------------------------------------------------------------------
// Main API Handler
// ----------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    if (!query) {
      return NextResponse.json({ error: "Query not provided." }, { status: 400 });
    }

    // Block sensitive user data.
    if (containsSensitiveInfo(query)) {
      return NextResponse.json({
        answer: "Please do not enter personal or sensitive information.",
        source: "security",
      });
    }

    // Handle greeting queries directly.
    if (isGreeting(query)) {
      return NextResponse.json({
        answer: "Hello! Ask me anything related to tech or programming.",
        source: "greeting",
      });
    }

    // Domain classification check.
    const classificationPrompt = `Is the following query related to technology, programming, AI, gadgets, software, or hardware? Answer "yes" or "no".\n\nQuery: ${query}`;
    const domainClassification = await generateClassification(classificationPrompt);
    if (!domainClassification.toLowerCase().includes("yes")) {
      return NextResponse.json({
        answer: "Sorry, I can only help with questions related to technology or programming.",
        source: "domain-guard",
      });
    }

    // Check Redis cache to reuse previously computed answer.
    const cacheKey = `chat:${query}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return NextResponse.json({ answer: cached, source: "cache" });
    }

    // Generate the embedding for the query.
    const queryEmbedding = await generateEmbedding(query);

    // Get context from both Pinecone and external sources concurrently.
    const [pineconeResult, externalResult] = await Promise.all([
      getPineconeContext(queryEmbedding),
      getExternalContext(query),
    ]);

    // Combine both context parts and source URLs.
    const contextParts: string[] = [];
    if (pineconeResult.context && pineconeResult.context.trim().length > 0) {
      contextParts.push(pineconeResult.context);
    }
    if (externalResult.context && externalResult.context.trim().length > 0) {
      contextParts.push(externalResult.context);
    }
    const finalContext = contextParts.join("\n\n");
    const allSourceUrls = [
      ...(pineconeResult.sourceUrls || []),
      ...(externalResult.sourceUrls || []),
    ];

    // If no context was retrieved, return a fallback answer.
    if (!finalContext || finalContext.trim().length === 0) {
      const fallback = "Sorry, I couldn’t find relevant tech-related info for that query.";
      await redisClient.set(cacheKey, fallback, { EX: 3600 });
      return NextResponse.json({ answer: fallback, source: "fallback" });
    }

    // Determine the data source description.
    let dataSource = "";
    if (pineconeResult.context && externalResult.context) {
      dataSource = "Pinecone, Google & YouTube search results";
    } else if (pineconeResult.context) {
      dataSource = "Pinecone data";
    } else if (externalResult.context) {
      dataSource = "Google & YouTube search results";
    }

    // Build the prompt for the AI model.
    const prompt = `You are a helpful tech assistant with access to ${dataSource}.
    
Context:
${finalContext}

User Question:
${query}

Answer (please provide clear explanations and include references when possible, with source URLs):`;

    // Generate the final answer using the AI model.
    const answer = await generateSummary(prompt);

    // Cache the generated answer for 1 hour.
    await redisClient.set(cacheKey, answer, { EX: 3600 });

    // Return the answer along with the data source and the list of source URLs.
    return NextResponse.json({
      answer,
      source: dataSource,
      sourceUrls: allSourceUrls,
    });
  } catch (error: unknown) {
    console.error("🔥 Error processing chat query API:", error);
    return NextResponse.json({ error: "Failed to process query." }, { status: 500 });
  }
}
