import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { generateEmbedding } from "../../../../lib/embedding";
import { index2 } from "../../../../lib/pinecone";
import prisma from "../../../../lib/db";
import { authOptions } from "../../../../lib/auth";
import { redisClient } from "../../../../lib/cache";
import { generateSummary } from "../../../../lib/ai";

export async function GET(request: Request) {
  try {
    // 1. Get user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse query params
    const { searchParams } = new URL(request.url);
    const sourceParam = searchParams.get("source"); // e.g. "stackoverflow", "producthunt", "gadgets", "hackernews", "all"
    const typeParam = searchParams.get("type");         // e.g. "question", "repo", "article"
    const topKParam = searchParams.get("topK");         // e.g. "30"
    const discoverParam = searchParams.get("discover"); // "1" or undefined
    const topK = topKParam ? parseInt(topKParam, 10) : 30;

    // 3. Fetch user preferences
    const userPreferences = await prisma.userPreferences.findUnique({
      where: { userId: session.user.id },
    });
    if (!userPreferences) {
      return NextResponse.json({ error: "No user preferences" }, { status: 404 });
    }

    const { interests, sources, contentTypes } = userPreferences;

    // 4. Build a detailed prompt with Gemini to produce a richer profile summary
    const summaryPrompt = `
      The user is interested in: ${interests.join(", ")}.
      They prefer content from: ${sources.join(", ")}.
      They like content types such as: ${contentTypes.join(", ")}.
      Write a concise summary describing what kind of personalized content would be most valuable and interesting for this user.
    `;
    
    // Generate the summary from Gemini.
    const smartProfileText = await generateSummary(summaryPrompt);

    // 5. Generate the embedding for the user's refined profile text
    let userEmbedding: number[];
    try {
      userEmbedding = await generateEmbedding(smartProfileText);
    } catch (err) {
      return NextResponse.json({ error: "Failed to generate user embedding" }, { status: 500 });
    }

    // 6. Create a unique cache key for this query
    const cacheKey = `for-you:${session.user.id}:${sourceParam || "all"}:${typeParam || "all"}:${topK}:${discoverParam || "0"}`;
    const cachedResult = await redisClient.get(cacheKey);
    if (cachedResult) {
      console.log("Cache hit for key:", cacheKey);
      return NextResponse.json(JSON.parse(cachedResult));
    }
    console.log("Cache miss for key:", cacheKey);

    // 7. Build a Pinecone filter based on query parameters
    const pineconeFilter: Record<string, any> = {};
    const isDiscover = discoverParam === "1";
    const isAll = sourceParam === "all";
    if (!isDiscover && !isAll && sourceParam) {
      pineconeFilter.source = sourceParam.toLowerCase();
    }
    if (typeParam && typeParam !== "all") {
      pineconeFilter.type = typeParam.toLowerCase();
    }

    // 8. Query Pinecone with the generated embedding and filters
    const filterKeys = Object.keys(pineconeFilter);
    const pineconeResult = await index2.query({
      vector: userEmbedding,
      topK,
      includeMetadata: true,
      filter: filterKeys.length > 0 ? pineconeFilter : undefined,
    });

    if (!pineconeResult?.matches) {
      // Cache empty result for 1 hour
      await redisClient.setEx(cacheKey, 3600, JSON.stringify([]));
      return NextResponse.json([], { status: 200 });
    }

    // Existing re-ranking logic
const resultsWithReRank = pineconeResult.matches.map((match) => {
  const meta = match.metadata || {}
  const itemTags = meta.tags || []
  const overlapCount = itemTags.filter((tag: string) => interests.includes(tag)).length
  const adjustedScore = match.score + overlapCount * 0.01

  return {
    ...meta,
    relevanceScore: Math.round(adjustedScore * 100),
  }
})

// 👇 ADD THIS FILTER for discover
let finalResults = resultsWithReRank
if (isDiscover) {
  finalResults = resultsWithReRank.filter((item) => item.relevanceScore < 40)
}

// Sort by relevance descending
finalResults.sort((a, b) => b.relevanceScore - a.relevanceScore)

// Limit to topK and cache
await redisClient.setEx(cacheKey, 3600, JSON.stringify(finalResults.slice(0, topK)))
return NextResponse.json(finalResults.slice(0, topK))

  } catch (err: any) {
    console.error("Error in /api/for-you:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
