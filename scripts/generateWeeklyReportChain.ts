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
    // Gadget news articles from NewsAPI
    const apiKey = process.env.NEWS_API_KEY;
    let gadgetArticles: any[] = [];
    if (apiKey) {
      const url = `https://newsapi.org/v2/everything?q=gadgets&sortBy=publishedAt&language=en&apiKey=${apiKey}`;
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const newsData = await res.json();
        // Take the top 5 articles
        gadgetArticles = newsData.articles.slice(0, 5);
      } else {
        console.error("Failed to fetch gadget news from NewsAPI.");
      }
    } else {
      console.error("NEWS_API_KEY is not set in environment variables.");
    }

    
    // 2. Query Data from Various Models
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
    // Product Hunt posts: using createdAt if aggregatedAt isn’t being set as expected.
const productHuntPosts = await prisma.productHuntPost.findMany({
  where: { createdAt: { gte: startDate, lt: endDate } },
  orderBy: { createdAt: 'desc' },
  take: 5,
});

// GitHub repos: using updatedAt to reflect recent activity.
const gitHubRepos = await prisma.gitHubRepo.findMany({
  where: { updatedAt: { gte: startDate, lt: endDate } },
  orderBy: { stars: "desc" },
  take: 5,
});



// Social Media posts: using createdAt.
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

    // 3. Create Raw Data Strings for Each Category
    const redditData = redditPosts
      .map(
        (post: { title: string; subreddit: string; upvotes: number }) =>
          `- ${post.title} (Subreddit: ${post.subreddit}, Upvotes: ${post.upvotes})`
      )
      .join("\n");

    const gitHubData = gitHubRepos
      .map(
        (repo: { fullName: string; stars: number; forks: number }) =>
          `- ${repo.fullName} (Stars: ${repo.stars}, Forks: ${repo.forks})`
      )
      .join("\n");

    

    const hackerNewsData = hackerNewsItems
      .map(
        (item: { title: string; score: number; comments: number }) =>
          `- ${item.title} (Score: ${item.score}, Comments: ${item.comments})`
      )
      .join("\n");

      const techNewsData = techNewsItems
      .map((item: { title: string; source: string | null }) =>
        `- ${item.title} (Source: ${item.source || "N/A"})`
      )
      .join("\n");
    

    const socialMediaData = socialMediaPosts
      .map(
        (post: { platform: string; content: string }) =>
          `- ${post.platform}: ${post.content.slice(0, 50)}...`
      )
      .join("\n");

      const memesData = memes
      .map(
        (meme: { title: string | null; platform: string; upvotes: number | null }) =>
          `- ${meme.title || "No Title"} (Platform: ${meme.platform}, Upvotes: ${meme.upvotes ?? 0})`
      )
      .join("\n");
      
      const productHuntData = productHuntPosts
      .map(
        (post: { name: string; votesCount: number }) =>
          `- ${post.name} (Upvotes: ${post.votesCount})`
      )
      .join("\n");

    const gadgetNewsData = gadgetArticles
      .map(
        (article: { title: string; source: { name: string }; publishedAt: string }) =>
          `- ${article.title} (Source: ${article.source.name}, Published At: ${new Date(article.publishedAt).toDateString()})`
      )
      .join("\n");

    // 4. Generate Individual Summaries for Each Category (Chain-of-Thought Step)
    const redditSummary = await generateSummary(`Summarize the following Reddit posts from last week in a concise paragraph, highlighting key trends and popular topics:
    
${redditData}`);

    const gitHubSummary = await generateSummary(`Summarize the following GitHub repositories from last week. Highlight the most popular projects and any notable activity:
    
${gitHubData}`);


    const hackerNewsSummary = await generateSummary(`Summarize the following Hacker News items from last week, noting any significant tech discussions or headlines:
    
${hackerNewsData}`);

    const techNewsSummary = await generateSummary(`Summarize the following tech news items from last week, providing key headlines and insights:
    
${techNewsData}`);

    const socialMediaSummary = await generateSummary(`Summarize the following social media posts from last week, focusing on the overall sentiment and trends:
    
${socialMediaData}`);

    const memesSummary = await generateSummary(`Summarize the following memes from last week, highlighting any trends or viral topics:
    
${memesData}`);
// New summaries for the additional data sources
const productHuntSummary = await generateSummary(`Summarize the following Product Hunt posts from last week in a concise paragraph, highlighting key trends and standout projects:
    
  ${productHuntData}`);
  
      const gadgetNewsSummary = await generateSummary(`Summarize the following gadget news articles from last week in a concise paragraph, emphasizing any notable tech innovations or trends:
      
  ${gadgetNewsData}`);

    // 5. Combine the Individual Summaries into an Aggregated Context
    const aggregatedContext = `
**Weekly Report Summary (from ${startDate.toDateString()} to ${endDate.toDateString()}):**

**Reddit:**  
${redditSummary}

**GitHub:**  
${gitHubSummary}


**Hacker News:**  
${hackerNewsSummary}

**Tech News:**  
${techNewsSummary}

**Social Media:**  
${socialMediaSummary}

**Memes:**  
${memesSummary}
  **Product Hunt:**  
${productHuntSummary}

**Gadget News:**  
${gadgetNewsSummary}
    `;
    // 6. Generate the Final Weekly Report with an Engaging Email Tone
    const finalPrompt = `You are an expert data analyst and a skilled storyteller. Imagine you are writing an exciting weekly email report for our valued users that highlights the most important and engaging trends from the past week, no need to give any subject I have already set that. The report should be warm, inviting, and easy to understand without any technical jargon, you can use emojis too, butonly use where it makes sense, you can use quotes too . Focus on key highlights, surprising trends, and actionable insights that will excite and inform our users. Use a conversational tone and include clear, enthusiastic recommendations.

Here is the aggregated data from last week:
${aggregatedContext}

Please generate a comprehensive and engaging weekly report email that captures the excitement of the week's events and provides valuable insights for our users.Please don't give any subject`;

    const weeklyReport = await generateSummary(finalPrompt);

    // 7. Save (upsert) the weekly report into Prisma (DataSummary table with source "weekly")
    await prisma.dataSummary.upsert({
      where: { source: "weekly" },
      update: { summary: weeklyReport },
      create: { source: "weekly", summary: weeklyReport },
    });

    console.log("Weekly Report Generated and Saved:\n", weeklyReport);
  } catch (error) {
    console.error("Error generating weekly report:", error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
