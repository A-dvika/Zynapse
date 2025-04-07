import { NextResponse } from 'next/server';
import prisma from '../../../../lib/db';

export async function GET() {
  try {
    // Fetch GitHub language statistics
    const languageStats = await prisma.gitHubLanguageStat.findMany({
      orderBy: {
        repoCount: 'desc',
      },
      take: 10,
    });

    // Fetch Stack Overflow tag statistics
    const tagStats = await prisma.stackOverflowTagStat.findMany({
      orderBy: {
        questionCount: 'desc',
      },
      take: 10,
    });

    // Fetch GitHub repositories for activity data
    const repos = await prisma.gitHubRepo.findMany({
      orderBy: {
        pushedAt: 'desc',
      },
      take: 100,
    });

    // Process repos to get activity over time
    const activityData = processActivityData(repos);

    // Fetch engagement metrics
    const engagementMetrics = {
      stars: repos.reduce((sum, repo) => sum + repo.stars, 0),
      forks: repos.reduce((sum, repo) => sum + repo.forks, 0),
      watchers: repos.reduce((sum, repo) => sum + repo.watchers, 0),
      comments: 0, // This would come from issues or other sources
    };

    // Fetch top contributors (this is a placeholder - you'd need to implement this based on your data)
    const topContributors = [
      { name: 'User 1', contributions: 120 },
      { name: 'User 2', contributions: 85 },
      { name: 'User 3', contributions: 64 },
      { name: 'User 4', contributions: 42 },
      { name: 'User 5', contributions: 30 },
    ];

    // Calculate content metrics
    const contentMetrics = {
      totalItems: await calculateTotalItems(),
      averageEngagement: await calculateAverageEngagement(),
      topCategories: await getTopCategories(),
      growthRate: 12, // This would be calculated based on historical data
    };

    return NextResponse.json({
      languageDistribution: languageStats,
      activityOverTime: activityData,
      engagementMetrics,
      topContributors,
      contentMetrics,
    });
  } catch (error) {
    console.error('Error in GET /api/analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}

// Helper function to process activity data
function processActivityData(repos: any[]) {
  // Group repos by month
  const activityByMonth: Record<string, number> = {};
  
  repos.forEach(repo => {
    const date = new Date(repo.pushedAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!activityByMonth[monthKey]) {
      activityByMonth[monthKey] = 0;
    }
    
    activityByMonth[monthKey]++;
  });
  
  // Convert to array format for chart
  return Object.entries(activityByMonth)
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

// Helper function to calculate total items
async function calculateTotalItems() {
  const [
    redditCount,
    githubCount,
    stackoverflowCount,
    hackernewsCount,
    technewsCount,
    producthuntCount,
  ] = await Promise.all([
    prisma.redditPost.count(),
    prisma.gitHubRepo.count(),
    prisma.stackOverflowQuestion.count(),
    prisma.hackerNewsItem.count(),
    prisma.techNewsItem.count(),
    prisma.productHuntPost.count(),
  ]);
  
  return redditCount + githubCount + stackoverflowCount + hackernewsCount + technewsCount + producthuntCount;
}

// Helper function to calculate average engagement
async function calculateAverageEngagement() {
  const [
    redditPosts,
    githubRepos,
    stackoverflowQuestions,
    hackernewsItems,
    producthuntPosts,
  ] = await Promise.all([
    prisma.redditPost.findMany({ take: 100 }),
    prisma.gitHubRepo.findMany({ take: 100 }),
    prisma.stackOverflowQuestion.findMany({ take: 100 }),
    prisma.hackerNewsItem.findMany({ take: 100 }),
    prisma.productHuntPost.findMany({ take: 100 }),
  ]);
  
  let totalEngagement = 0;
  let count = 0;
  
  // Reddit engagement (upvotes + comments)
  redditPosts.forEach(post => {
    totalEngagement += post.upvotes + post.comments;
    count++;
  });
  
  // GitHub engagement (stars + forks + watchers)
  githubRepos.forEach(repo => {
    totalEngagement += repo.stars + repo.forks + repo.watchers;
    count++;
  });
  
  // Stack Overflow engagement (score + viewCount)
  stackoverflowQuestions.forEach(question => {
    totalEngagement += question.score + question.viewCount;
    count++;
  });
  
  // Hacker News engagement (score + comments)
  hackernewsItems.forEach(item => {
    totalEngagement += item.score + item.comments;
    count++;
  });
  
  // Product Hunt engagement (votesCount + commentsCount)
  producthuntPosts.forEach(post => {
    totalEngagement += post.votesCount + post.commentsCount;
    count++;
  });
  
  return count > 0 ? Math.round(totalEngagement / count) : 0;
}

// Helper function to get top categories
async function getTopCategories() {
  const languageStats = await prisma.gitHubLanguageStat.findMany({
    orderBy: {
      repoCount: 'desc',
    },
    take: 5,
  });
  
  return languageStats.map(stat => ({
    name: stat.language,
    count: stat.repoCount,
  }));
} 