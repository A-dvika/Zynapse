// scripts/githubCron.ts
import { fetchTrendingRepos, fetchActiveIssues, analyzeLanguages } from '../lib/github';
import prisma from '../lib/db'; 
import { redisClient } from '../lib/cache'; 

async function run() {
  try {
    
    const trendingRepos = await fetchTrendingRepos();
    console.log('Fetched trending repos:', trendingRepos.length);

    
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
            id: issue.id.toString(), 
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

    
    const languageStats = analyzeLanguages(trendingRepos);
    for (const stat of languageStats) {
      await prisma.gitHubLanguageStat.upsert({
        where: { language: stat.language },
        update: { repoCount: stat.repoCount },
        create: { language: stat.language, repoCount: stat.repoCount },
      });
    }

    
    await redisClient.set('github:trendingRepos', JSON.stringify(trendingRepos), { EX: 3600 });
    await redisClient.set('github:languageStats', JSON.stringify(languageStats), { EX: 3600 });

    console.log('GitHub data saved to DB and cached successfully.');
  } catch (error) {
    console.error('Error in GitHub cron job:', error);
  } finally {
    await prisma.$disconnect();
    
  }
}

run();
