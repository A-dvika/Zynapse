import dotenv from "dotenv";
dotenv.config();

import prisma from "../lib/db";
import { generateSummary } from "../lib/ai";

async function run() {
  try {
    const now = new Date();
    const endDate = now;
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 7);
    const weekStart = new Date(startDate); // used to save with summaries

    const apiKey = process.env.NEWS_API_KEY;
    let gadgetArticles: any[] = [];

    if (apiKey) {
      const url = `https://newsapi.org/v2/everything?q=gadgets&sortBy=publishedAt&language=en&apiKey=${apiKey}`;
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const newsData = await res.json();
        gadgetArticles = newsData.articles.slice(0, 5);
      } else {
        console.error("Failed to fetch gadget news from NewsAPI.");
      }
    }

    const redditPosts = await prisma.redditPost.findMany({
      where: { createdAt: { gte: startDate, lt: endDate } },
      orderBy: { upvotes: "desc" },
      take: 5,
    });

    const hackerNewsItems = await prisma.hackerNewsItem.findMany({
      where: { createdAt: { gte: startDate, lt: endDate } },
      orderBy: { score: "desc" },
      take: 5,
    });

    const techNewsItems = await prisma.techNewsItem.findMany({
      where: { createdAt: { gte: startDate, lt: endDate } },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const productHuntPosts = await prisma.productHuntPost.findMany({
      where: { createdAt: { gte: startDate, lt: endDate } },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const gitHubRepos = await prisma.gitHubRepo.findMany({
      where: { updatedAt: { gte: startDate, lt: endDate } },
      orderBy: { stars: "desc" },
      take: 5,
    });

    const socialMediaPosts = await prisma.socialMediaPost.findMany({
      where: { createdAt: { gte: startDate, lt: endDate } },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const memes = await prisma.meme.findMany({
      where: { createdAt: { gte: startDate, lt: endDate } },
      orderBy: { upvotes: "desc" },
      take: 5,
    });

    const redditData = redditPosts
      .map((post) => `- ${post.title} (Subreddit: ${post.subreddit}, Upvotes: ${post.upvotes})`)
      .join("\n");

    const gitHubData = gitHubRepos
      .map((repo) => `- ${repo.fullName} (Stars: ${repo.stars}, Forks: ${repo.forks})`)
      .join("\n");

    const hackerNewsData = hackerNewsItems
      .map((item) => `- ${item.title} (Score: ${item.score}, Comments: ${item.comments})`)
      .join("\n");

    const techNewsData = techNewsItems
      .map((item) => `- ${item.title} (Source: ${item.source || "N/A"})`)
      .join("\n");

    const socialMediaData = socialMediaPosts
      .map((post) => `- ${post.platform}: ${post.content.slice(0, 50)}...`)
      .join("\n");

    const memesData = memes
      .map((meme) => `- ${meme.title || "No Title"} (Platform: ${meme.platform}, Upvotes: ${meme.upvotes ?? 0})`)
      .join("\n");

    const productHuntData = productHuntPosts
      .map((post) => `- ${post.name} (Upvotes: ${post.votesCount})`)
      .join("\n");

    const gadgetNewsData = gadgetArticles
      .map(
        (article) =>
          `- ${article.title} (Source: ${article.source.name}, Published At: ${new Date(
            article.publishedAt
          ).toDateString()})`
      )
      .join("\n");

    // Chain of Thought Summaries
    const summaries: Record<string, string> = {
      Reddit: await generateSummary(`Summarize the following Reddit posts:\n\n${redditData}`),
      GitHub: await generateSummary(`Summarize the following GitHub repositories:\n\n${gitHubData}`),
      HackerNews: await generateSummary(`Summarize the following Hacker News items:\n\n${hackerNewsData}`),
      TechNews: await generateSummary(`Summarize the following tech news:\n\n${techNewsData}`),
      SocialMedia: await generateSummary(`Summarize the following social media posts:\n\n${socialMediaData}`),
      Memes: await generateSummary(`Summarize the following memes:\n\n${memesData}`),
      ProductHunt: await generateSummary(`Summarize the following Product Hunt posts:\n\n${productHuntData}`),
      GadgetNews: await generateSummary(`Summarize the following gadget news:\n\n${gadgetNewsData}`),
    };

    // Save each source summary to DB
    for (const [source, summary] of Object.entries(summaries)) {
      await prisma.sourceSummary.upsert({
        where: {
          source_weekStart: {
            source,
            weekStart,
          },
        },
        update: { summary },
        create: {
          source,
          summary,
          weekStart,
        },
      });
    }

    // Combine into newsletter context
    const aggregatedContext = `
**Weekly Report Summary (from ${startDate.toDateString()} to ${endDate.toDateString()}):**

${Object.entries(summaries)
  .map(([source, summary]) => `**${source}:**\n${summary}`)
  .join("\n\n")}
`;

    // Final email generation
    const finalPrompt = `You are an expert data analyst and a skilled storyteller. Write an exciting weekly email report for our valued users, summarizing the week's top highlights. Be warm, fun, and clear. Use emojis if it helps. Here's the data:\n\n${aggregatedContext}`;
    const weeklyReport = await generateSummary(finalPrompt);

    // Save final report
    await prisma.dataSummary.upsert({
      where: { source: "weekly" },
      update: { summary: weeklyReport },
      create: { source: "weekly", summary: weeklyReport },
    });

    console.log("✅ Weekly report & individual summaries saved.");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
