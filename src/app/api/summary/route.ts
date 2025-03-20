import { NextResponse } from "next/server";
import prisma from "../../../../lib/db";
import { generateSummary } from "../../../../lib/ai";
import { redisClient } from "../../../../lib/cache";

export async function POST(request: Request) {
  try {
    const { card } = await request.json();
    if (!card) throw new Error("Card type not provided.");

    const today = new Date().toISOString().slice(0, 10);
    const cacheKey = `summary:${card}:${today}`;

    // Check if the summary exists in cache
    const cachedSummary = await redisClient.get(cacheKey);
    if (cachedSummary) {
      return NextResponse.json({ summary: cachedSummary });
    }

    // Build context based on the card type.
    let contextText = "";
    if (card === "reddit") {
      const posts = await prisma.redditPost.findMany({
        orderBy: { upvotes: "desc" },
        take: 5,
      });
      contextText = posts
        .map((post: any) => `Title: ${post.title}\nUpvotes: ${post.upvotes}`)
        .join("\n\n");
    } else if (card === "github") {
      const repos = await prisma.gitHubRepo.findMany({
        orderBy: { stars: "desc" },
        take: 5,
      });
      contextText = repos
        .map((repo: any) => `Repo: ${repo.fullName}\nStars: ${repo.stars}`)
        .join("\n\n");
    } else if (card === "stackoverflow") {
      const questions = await prisma.stackOverflowQuestion.findMany({
        orderBy: { score: "desc" },
        take: 5,
      });
      contextText = questions
        .map((q: any) => `Title: ${q.title}\nScore: ${q.score}`)
        .join("\n\n");
    } else {
      throw new Error("Unsupported card type.");
    }

    // Build the prompt for Gemini
    const prompt = `Summarize the following trending ${card} data succinctly for a dashboard overview:\n\n${contextText}\n\nProvide a concise summary.`;

    // Generate the summary using Gemini
    const summary = await generateSummary(prompt);

    // Cache the summary in Redis with a TTL of 24 hours (86400 seconds)
    await redisClient.set(cacheKey, summary, { EX: 86400 });
    console.log(`Cached summary under key ${cacheKey}`);

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error("Error in on-demand summary API:", error);
    return NextResponse.json(
      { summary: "Sorry, we couldn't generate a summary at this time." },
      { status: 500 }
    );
  }
}
