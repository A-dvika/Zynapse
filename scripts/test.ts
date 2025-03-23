import dotenv from "dotenv";
dotenv.config();

import prisma from "../lib/db";

async function checkQueries() {
  try {
    // Define the date range: from 7 days ago until now
    const now = new Date();
    const endDate = now; // Use the current moment as the end date
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 7);

    console.log(`Fetching records from ${startDate.toISOString()} to ${endDate.toISOString()}\n`);

    // Product Hunt posts: using aggregatedAt (or change to createdAt if needed)
    const productHuntPosts = await prisma.productHuntPost.findMany({
      where: { aggregatedAt: { gte: startDate, lt: endDate } },
      orderBy: { aggregatedAt: "desc" },
      take: 5,
    });
    console.log(`Product Hunt Posts (count: ${productHuntPosts.length}):`);
    if (productHuntPosts.length === 0) {
      console.log("No Product Hunt posts found for this date range.");
    } else {
      console.log(productHuntPosts);
    }
    console.log("\n--------------------------------\n");

    // GitHub repos: using createdAt (or consider updatedAt/pushedAt if more appropriate)
    const gitHubRepos = await prisma.gitHubRepo.findMany({
      where: { createdAt: { gte: startDate, lt: endDate } },
      orderBy: { stars: "desc" },
      take: 5,
    });
    console.log(`GitHub Repos (count: ${gitHubRepos.length}):`);
    if (gitHubRepos.length === 0) {
      console.log("No GitHub repositories found for this date range.");
    } else {
      console.log(gitHubRepos);
    }
    console.log("\n--------------------------------\n");

    // Stack Overflow questions: using creationDate
    const stackOverflowQuestions = await prisma.stackOverflowQuestion.findMany({
      where: { creationDate: { gte: startDate, lt: endDate } },
      orderBy: { score: "desc" },
      take: 5,
    });
    console.log(`Stack Overflow Questions (count: ${stackOverflowQuestions.length}):`);
    if (stackOverflowQuestions.length === 0) {
      console.log("No Stack Overflow questions found for this date range.");
    } else {
      console.log(stackOverflowQuestions);
    }
    console.log("\n--------------------------------\n");

    // Social Media posts: using createdAt
    const socialMediaPosts = await prisma.socialMediaPost.findMany({
      where: { createdAt: { gte: startDate, lt: endDate } },
      orderBy: { createdAt: "desc" },
      take: 5,
    });
    console.log(`Social Media Posts (count: ${socialMediaPosts.length}):`);
    if (socialMediaPosts.length === 0) {
      console.log("No Social Media posts found for this date range.");
    } else {
      console.log(socialMediaPosts);
    }
    console.log("\n--------------------------------\n");
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkQueries();
