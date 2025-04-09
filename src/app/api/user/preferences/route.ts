import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";




import { generateAndCacheUserEmbedding } from "@/jobs/embeddingJob";
import { redisClient } from "../../../../../lib/cache";
import { index2 } from "../../../../../lib/pinecone";
import { authOptions } from "../../../../../lib/auth";
import prisma from "../../../../../lib/db";

export async function GET(request: Request) {
  try {
    // 1. Authenticate user session.
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // 2. Parse query parameters.
    const { searchParams } = new URL(request.url);
    const sourceParam = searchParams.get("source") ?? "all";
    const typeParam = searchParams.get("type") ?? "all";
    const topK = parseInt(searchParams.get("topK") || "30", 10);
    const discoverParam = searchParams.get("discover") ?? "0";
    const isDiscover = discoverParam === "1";

    // 3. Check for cached query results.
    const cacheKey = `for-you:${session.user.id}:${sourceParam}:${typeParam}:${topK}:${discoverParam}`;
    try {
      const cachedResults = await redisClient.get(cacheKey);
      if (cachedResults) {
        console.log("Results cache hit:", cacheKey);
        return NextResponse.json(JSON.parse(cachedResults));
      }
    } catch (err) {
      console.warn("Redis read error:", err);
    }

    // 4. Retrieve user preferences from the database.
    const userPreferences = await prisma.userPreferences.findUnique({
      where: { userId: session.user.id },
    });
    if (!userPreferences) {
      return NextResponse.json({ error: "No user preferences found" }, { status: 404 });
    }
    const { interests, sources, contentTypes } = userPreferences;

    // 5. Retrieve or generate the user embedding.
    const profileKey = `profile-embedding:${session.user.id}`;
    let userEmbedding: number[] | null = null;
    try {
      const cachedEmbedding = await redisClient.get(profileKey);
      if (cachedEmbedding) {
        userEmbedding = JSON.parse(cachedEmbedding);
      } else {
        userEmbedding = await generateAndCacheUserEmbedding(
          session.user.id,
          interests,
          sources,
          contentTypes
        );
      }
    } catch (e) {
      console.warn("Error retrieving or generating embedding:", e);
      return NextResponse.json(
        { error: "Failed to retrieve user embedding" },
        { status: 500 }
      );
    }

    // 6. Build a Pinecone filter based on query parameters.
    const pineconeFilter: Record<string, any> = {};
    if (!isDiscover && sourceParam !== "all") {
      pineconeFilter.source = sourceParam.toLowerCase();
    }
    if (typeParam !== "all") {
      pineconeFilter.type = typeParam.toLowerCase();
    }

    // 7. Query Pinecone using the embedding.
    const pineconeResult = await index2.query({
      vector: userEmbedding,
      topK,
      includeMetadata: true,
      filter: Object.keys(pineconeFilter).length ? pineconeFilter : undefined,
    });
    
    // 8. Re-rank results based on tag overlap with the user’s interests.
    const matches = pineconeResult?.matches || [];
    const results = matches
      .map((match) => {
        const meta = match.metadata || {};
        const tags = meta.tags || [];
        const overlapCount = tags.filter((tag: string) => interests.includes(tag)).length;
        const relevanceScore = Math.round((match.score + overlapCount * 0.01) * 100);
        return { ...meta, relevanceScore };
      })
      .filter((item) => !isDiscover || item.relevanceScore < 40)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, topK);

    // 9. Cache the results for future calls.
    try {
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(results));
    } catch (err) {
      console.warn("Redis cache write error:", err);
    }

    // 10. Return the final results.
    return NextResponse.json(results);
  } catch (err) {
    console.error("Error in /api/for-you:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
