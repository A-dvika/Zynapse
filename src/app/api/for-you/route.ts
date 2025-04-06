// src/app/api/for-you/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/db";
import { generateEmbedding } from "../../../../lib/embedding";
import { index2 } from "../../../../lib/pinecone";

export async function GET(request: Request) {
  try {
    console.log("🔐 Authenticating user...");
    const session = await getServerSession(authOptions);
    if (!session) {
      console.log("❌ Not signed in.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;
    console.log("✅ User ID:", userId);

    // Step 1: Fetch user preferences
    console.log("📥 Fetching preferences...");
    const preferences = await prisma.userPreferences.findUnique({ where: { userId } });
    console.log("✅ Preferences fetched:", preferences);

    // Step 2: Fetch preferred content from Content table based on user interests (using tags)
    let preferredContent = [];
    if (preferences && preferences.interests && preferences.interests.length > 0) {
      console.log("📥 Fetching preferred content from database...");
      preferredContent = await prisma.content.findMany({
        where: {
          tags: { hasSome: preferences.interests },
        },
        take: 10,
      });
      console.log("✅ Preferred content count:", preferredContent.length);
    }

    // Step 3: Build a text summary from the preferred content
    // (combine summaries if available; fallback to title if not)
    let preferredText = "";
    if (preferredContent.length > 0) {
      preferredText = preferredContent
        .map((item) => item.summary || item.title)
        .join(" ");
    } else if (preferences) {
      preferredText = `Interests: ${preferences.interests.join(", ")}. Sources: ${preferences.sources.join(", ")}.`;
    } else {
      preferredText = "General tech news and updates.";
    }
    console.log("✅ Preferred text for discovery:", preferredText);

    // Step 4: Generate embedding from the preferred text
    console.log("📡 Generating embedding...");
    const userVector = await generateEmbedding(preferredText);
    if (!userVector || !Array.isArray(userVector)) {
      throw new Error("❌ generateEmbedding failed or returned invalid result.");
    }
    console.log("✅ Embedding generated, vector length:", userVector.length);

    // Step 5: Build Pinecone filter using preferred sources (if provided)
    console.log("🧾 Building Pinecone filter...");
    let filter: Record<string, any> = {};
    if (preferences?.sources && preferences.sources.length > 0) {
      filter.source = { $in: preferences.sources };
    }
    console.log("✅ Pinecone filter:", filter);

    // Step 6: Query Pinecone for discovery recommendations (similar to the preferred content)
    console.log("🔍 Querying Pinecone for discovery recommendations...");
    const queryResponse = await index2.query({
      vector: userVector,
      topK: 10,
      includeMetadata: true,
      filter: Object.keys(filter).length > 0 ? filter : undefined,
    });
    console.log("✅ Pinecone returned results:", queryResponse.matches?.length ?? 0);

    const recommended = queryResponse.matches?.map((match) => ({
      id: match.id,
      score: match.score,
      title: match.metadata?.title,
      summary: match.metadata?.summary,
      url: match.metadata?.url,
      source: match.metadata?.source,
      type: match.metadata?.type,
      tags: match.metadata?.tags ?? [],
    })) ?? [];

    // Return both preferred and discovery (recommended) content
    return NextResponse.json({ preferred: preferredContent, recommended });
  } catch (error: any) {
    console.error("🔥 ERROR TRACE:");
    console.error(error.message);
    console.error(error.stack);
    return NextResponse.json(
      { error: "Internal Server Error", detail: error.message },
      { status: 500 }
    );
  }
}
