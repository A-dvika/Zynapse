import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/db';

export async function GET() {
  try {
    // Calculate total items across all content types
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
    
    const totalItems = redditCount + githubCount + stackoverflowCount + hackernewsCount + technewsCount + producthuntCount;
    
    // Calculate average engagement
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
    
    const averageEngagement = count > 0 ? Math.round(totalEngagement / count) : 0;
    
    // Get top categories
    const languageStats = await prisma.gitHubLanguageStat.findMany({
      orderBy: {
        repoCount: 'desc',
      },
      take: 5,
    });
    
    const topCategories = languageStats.map(stat => ({
      name: stat.language,
      count: stat.repoCount,
    }));
    
    // Calculate growth rate (this is a placeholder - you'd need to implement this based on historical data)
    const growthRate = 12;
    
    return NextResponse.json({
      totalItems,
      averageEngagement,
      topCategories,
      growthRate,
    });
  } catch (error) {
    console.error('Error in GET /api/content/analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content analytics data' },
      { status: 500 }
    );
  }
} 