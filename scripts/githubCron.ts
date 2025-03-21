// scripts/githubCron.ts
import { fetchTrendingRepos, fetchActiveIssues, analyzeLanguages } from '../lib/github';
import prisma from '../lib/db'; // Your existing Prisma client instance
import { redisClient } from '../lib/cache'; // Redis client for caching

async function run() {
  try {
    // 1) Fetch trending repos
    const trendingRepos = await fetchTrendingRepos();
    console.log('Fetched trending repos:', trendingRepos.length);

    // 2) Upsert each repo and its issues into the database
    for (const repo of trendingRepos) {
      await prisma.gitHubRepo.upsert({
        where: { fullName: repo.fullName },
        update: {
          name: repo.name,
          url: repo.url,
          stars: repo.stars,
          forks: repo.forks,
          watchers: repo.watchers,
          pushedAt: new Date(repo.pushedAt),
          language: repo.language,
        },
        create: {
          id: repo.id,
          name: repo.name,
          fullName: repo.fullName,
          url: repo.url,
          stars: repo.stars,
          forks: repo.forks,
          watchers: repo.watchers,
          pushedAt: new Date(repo.pushedAt),
          language: repo.language,
        },
      });

      // 3) For each repo, fetch top active issues and upsert them into the database
      const issues = await fetchActiveIssues(repo.fullName);
      for (const issue of issues) {
        await prisma.gitHubIssue.upsert({
          where: { issueUrl: issue.issueUrl },
          update: {
            title: issue.title,
            author: issue.author,
            comments: issue.comments,
            updatedAt: new Date(issue.updatedAt),
          },
          create: {
            id: issue.id.toString(), // store the issue id as a string
            repoName: issue.repoName,
            issueUrl: issue.issueUrl,
            title: issue.title,
            author: issue.author,
            comments: issue.comments,
            createdAt: new Date(issue.createdAt),
            updatedAt: new Date(issue.updatedAt),
          },
        });
      }
    }

    // 4) Update language stats
    const languageStats = analyzeLanguages(trendingRepos);
    for (const stat of languageStats) {
      await prisma.gitHubLanguageStat.upsert({
        where: { language: stat.language },
        update: { repoCount: stat.repoCount },
        create: { language: stat.language, repoCount: stat.repoCount },
      });
    }

    // 5) Cache the fetched data in Redis for one hour (3600 seconds)
    await redisClient.set('github:trendingRepos', JSON.stringify(trendingRepos), { EX: 3600 });
    await redisClient.set('github:languageStats', JSON.stringify(languageStats), { EX: 3600 });

    console.log('GitHub data saved to DB and cached successfully.');
  } catch (error) {
    console.error('Error in GitHub cron job:', error);
  } finally {
    await prisma.$disconnect();
    // Optionally, you can disconnect from Redis if this script isn't long-running.
    // await redisClient.disconnect();
  }
}

run();
