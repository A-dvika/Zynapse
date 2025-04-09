import { NextResponse } from "next/server";
import { getServerSession, Session } from "next-auth";
import { generateEmbedding } from "../../../../lib/embedding";
import { index2 } from "../../../../lib/pinecone";
import prisma from "../../../../lib/db";
import { authOptions } from "../../../../lib/auth";
import { redisClient } from "../../../../lib/cache";
import { generateSummary } from "../../../../lib/ai";

export async function GET(request: Request) {
  try {
    // 1. Get user session
    const session = await getServerSession(authOptions) as Session & { user: { id: string } };
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // 2. Parse query parameters and set defaults
    const { searchParams } = new URL(request.url);
    const sourceParam = searchParams.get("source") ?? "all";
    const typeParam = searchParams.get("type") ?? "all";
    const topK = searchParams.get("topK") ? parseInt(searchParams.get("topK")!, 10) : 30;
    const discoverParam = searchParams.get("discover") ?? "0";
    
    // 3. Fetch user preferences from the database
    const userPreferences = await prisma.userPreferences.findUnique({
      where: { userId: session.user.id },
    });
    if (!userPreferences) {
      return NextResponse.json({ error: "No user preferences" }, { status: 404 });
    }
    const { interests, sources, contentTypes } = userPreferences;
    
    // 4. Build a detailed prompt for Gemini to produce a richer profile summary
    const summaryPrompt = `
      The user is interested in: ${interests.join(", ")}.
      They prefer content from: ${sources.join(", ")}.
      They like content types such as: ${contentTypes.join(", ")}.
      Write a concise summary describing what kind of personalized content would be most valuable for this user.
    `;
    const smartProfileText = await generateSummary(summaryPrompt);
    
    // 5. Generate the embedding using the refined text
    let userEmbedding: number[];
    try {
      userEmbedding = await generateEmbedding(smartProfileText);
    } catch (err) {
      return NextResponse.json({ error: "Failed to generate user embedding" }, { status: 500 });
    }
    
    // 6. Create a unique cache key based on user and query parameters
    const cacheKey = `for-you:${session.user.id}:${sourceParam}:${typeParam}:${topK}:${discoverParam}`;
    const cachedResult = await redisClient.get(cacheKey);
    if (cachedResult) {
      console.log("Cache hit for key:", cacheKey);
      return NextResponse.json(JSON.parse(cachedResult));
    }
    console.log("Cache miss for key:", cacheKey);
    
    // 7. Build a Pinecone filter based on query parameters
    const pineconeFilter: Record<string, any> = {};
    const isDiscover = discoverParam === "1";
    if (!isDiscover && sourceParam !== "all") {
      pineconeFilter.source = sourceParam.toLowerCase();
    }
    if (typeParam !== "all") {
      pineconeFilter.type = typeParam.toLowerCase();
    }
    
    // 8. Query Pinecone with the generated embedding and filters
    const pineconeResult = await index2.query({
      vector: userEmbedding,
      topK,
      includeMetadata: true,
      filter: Object.keys(pineconeFilter).length > 0 ? pineconeFilter : undefined,
    });
    
    if (!pineconeResult?.matches) {
      await redisClient.setEx(cacheKey, 3600, JSON.stringify([]));
      return NextResponse.json([], { status: 200 });
    }
    
    // 9. Re-rank results by tag overlap with user interests
    let resultsWithReRank = pineconeResult.matches.map((match) => {
      const meta = match.metadata || {};
      const itemTags = meta.tags || [];
      const overlapCount = Array.isArray(itemTags) ? itemTags.filter((tag: string) => interests.includes(tag)).length : 0;
      const adjustedScore = (match.score ?? 0) + overlapCount * 0.01;
      return {
        ...meta,
        relevanceScore: Math.round(adjustedScore * 100),
      };
    });
    
    // 10. If this is a discover query, filter for lower relevance items (< 40% match)
    if (isDiscover) {
      resultsWithReRank = resultsWithReRank.filter(item => item.relevanceScore < 40);
    }
    
    // 11. Sort the final results by relevance descending and limit to topK
    resultsWithReRank.sort((a, b) => b.relevanceScore - a.relevanceScore);
    const finalResults = resultsWithReRank.slice(0, topK);
    
    // 12. Cache the final results for 1 hour (3600 seconds)
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(finalResults));
    
    return NextResponse.json(finalResults);
  } catch (err: any) {
    console.error("Error in /api/for-you:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
