// src/app/api/for-you/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/db";
import { generateEmbedding } from "../../../../lib/embedding";
import { index2 } from "../../../../lib/pinecone";

export async function GET(request: Request) {
  try {
    console.log("🔐 Step 1: Authenticating user...");
    const session = await getServerSession(authOptions);
    if (!session) {
      console.log("❌ Not signed in.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;
    console.log("✅ User ID:", userId);

    // Step 2: Fetch user preferences
    console.log("📥 Step 2: Fetching preferences...");
    const preferences = await prisma.userPreferences.findUnique({ where: { userId } });
    console.log("✅ Preferences fetched:", preferences);

    // Step 3: Fetch recent user behavior
    console.log("📥 Step 3: Fetching recent user behavior...");
    const recentBehavior = await prisma.userHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    console.log(`✅ Fetched ${recentBehavior.length} recent activity entries`);

    // Step 4: Build user profile summary text
    console.log("🧠 Step 4: Building user profile text...");
    let userProfileText = "";
    if (preferences) {
      userProfileText += `Interests: ${preferences.interests.join(", ")}. `;
      userProfileText += `Sources: ${preferences.sources.join(", ")}. `;
      // Note: Removing contentTypes from the text since you don't want to filter by type.
    }
    if (recentBehavior.length > 0) {
      const activities = recentBehavior.map((a) => a.summary || "").join(" ");
      userProfileText += `Recent activity: ${activities}`;
    }
    if (!userProfileText) {
      userProfileText = "General tech news and updates.";
    }
    console.log("✅ Final user profile text:", userProfileText);

    // Step 5: Generate embedding
    console.log("📡 Step 5: Generating embedding...");
    const userVector = await generateEmbedding(userProfileText);
    if (!userVector || !Array.isArray(userVector)) {
      throw new Error("❌ generateEmbedding failed or returned invalid result.");
    }
    console.log("✅ Embedding generated, vector length:", userVector.length);

    // Step 6: Build Pinecone filter (without type filter)
    console.log("🧾 Step 6: Building Pinecone filter...");
    let filter: Record<string, any> = {};
    if (preferences?.sources?.length) {
      filter.source = { $in: preferences.sources };
    }
    console.log("✅ Pinecone filter:", filter);

    // Step 7: Query Pinecone
    console.log("🔍 Step 7: Querying Pinecone...");
    const queryResponse = await index2.query({
      vector: userVector,
      topK: 10,
      includeMetadata: true,
      filter: Object.keys(filter).length > 0 ? filter : undefined,
    });
    console.log("✅ Pinecone returned results:", queryResponse.matches?.length ?? 0);

    const recommendations = queryResponse.matches?.map((match) => ({
      id: match.id,
      score: match.score,
      title: match.metadata?.title,
      summary: match.metadata?.summary,
      url: match.metadata?.url,
      source: match.metadata?.source,
      type: match.metadata?.type,
      tags: match.metadata?.tags ?? [],
    })) ?? [];

    return NextResponse.json({ recommendations });
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
