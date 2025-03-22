import dotenv from "dotenv";
dotenv.config();

import prisma from "../lib/db";
import { generateSummary } from "../lib/ai";

async function run() {
  try {
    // Define last week's date range.
    // In this example, "last week" means the previous 7 days (not including today).
    const now = new Date();
    const endDate = new Date(now);
    endDate.setHours(0, 0, 0, 0); // Today at midnight (start of day)
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 7); // 7 days ago

    // Query data from multiple models.
    const redditPosts = await prisma.redditPost.findMany({
      where: { createdAt: { gte: startDate, lt: endDate } },
      orderBy: { upvotes: "desc" },
      take: 5,
    });

    const gitHubRepos = await prisma.gitHubRepo.findMany({
      where: { createdAt: { gte: startDate, lt: endDate } },
      orderBy: { stars: "desc" },
      take: 5,
    });

    const gitHubIssues = await prisma.gitHubIssue.findMany({
      where: { createdAt: { gte: startDate, lt: endDate } },
      orderBy: { comments: "desc" },
      take: 5,
    });

    const stackOverflowQuestions = await prisma.stackOverflowQuestion.findMany({
      where: { creationDate: { gte: startDate, lt: endDate } },
      orderBy: { score: "desc" },
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

    // Build an aggregated context string.
    let contextText = `**Weekly Report Data (from ${startDate.toDateString()} to ${endDate.toDateString()}):**\n\n`;

    contextText += `### Reddit Posts (Top 5 by Upvotes):\n`;
    redditPosts.forEach((post: { title: string; subreddit: string; upvotes: number }) => {
      contextText += `- ${post.title} (Subreddit: ${post.subreddit}, Upvotes: ${post.upvotes})\n`;
    });
    contextText += `\n`;

    contextText += `### GitHub Repos (Top 5 by Stars):\n`;
    gitHubRepos.forEach((repo: { fullName: string; stars: number; forks: number }) => {
      contextText += `- ${repo.fullName} (Stars: ${repo.stars}, Forks: ${repo.forks})\n`;
    });
    contextText += `\n`;

    contextText += `### GitHub Issues (Top 5 by Comments):\n`;
    gitHubIssues.forEach((issue: { title: string; repoName: string; comments: number }) => {
      contextText += `- ${issue.title} (Repo: ${issue.repoName}, Comments: ${issue.comments})\n`;
    });
    contextText += `\n`;

    contextText += `### StackOverflow Questions (Top 5 by Score):\n`;
    stackOverflowQuestions.forEach((q: { title: string; score: number; answerCount: number }) => {
      contextText += `- ${q.title} (Score: ${q.score}, Answers: ${q.answerCount})\n`;
    });
    contextText += `\n`;

    contextText += `### Hacker News Items (Top 5 by Score):\n`;
    hackerNewsItems.forEach((item: { title: string; score: number; comments: number }) => {
      contextText += `- ${item.title} (Score: ${item.score}, Comments: ${item.comments})\n`;
    });
    contextText += `\n`;

    contextText += `### Tech News Items (Latest 5):\n`;
    techNewsItems.forEach((item: { title: string; source: string }) => {
      contextText += `- ${item.title} (Source: ${item.source})\n`;
    });
    contextText += `\n`;

    contextText += `### Social Media Posts (Latest 5):\n`;
    socialMediaPosts.forEach((post: { content: string; platform: string }) => {
      const excerpt = post.content.slice(0, 50).replace(/\n/g, " ") + "...";
      contextText += `- ${post.platform}: ${excerpt}\n`;
    });
    contextText += `\n`;

    contextText += `### Memes (Top 5 by Upvotes):\n`;
    memes.forEach((meme: { title?: string; platform: string; upvotes?: number }) => {
      contextText += `- ${meme.title || "No Title"} (Platform: ${meme.platform}, Upvotes: ${meme.upvotes ?? 0})\n`;
    });
    contextText += `\n`;

    // Build a prompt for Gemini to generate a comprehensive weekly report.
    const prompt = `You are an expert data analyst and report generator. Using the data provided below, create a comprehensive weekly report that summarizes the key trends, notable highlights, and any significant insights observed over the past week. Your report should be well-structured, include multiple paragraphs, and offer analysis and, if applicable, recommendations for improvements or further investigation.

Data:
${contextText}

Please generate a detailed, insightful weekly report.`;

    // Generate the weekly report using Gemini.
    const weeklyReport = await generateSummary(prompt);

    // Log the weekly report (or store it in your database, send it via email, etc.)
    console.log("Weekly Report Generated:\n", weeklyReport);
  } catch (error) {
    console.error("Error generating weekly report:", error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
