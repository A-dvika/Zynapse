// src/app/api/hackernews/route.ts
import { NextResponse } from 'next/server';
import prisma from '../../../../lib/db';

export async function GET() {
  try {
    // For instance, fetch top 10 stories by score
    const hackerNewsStories = await prisma.hackerNewsItem.findMany({
      orderBy: { score: 'desc' },
      take: 10,
    });

    // Or fetch all tech news items
    const techNewsItems = await prisma.techNewsItem.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ hackerNewsStories, techNewsItems });
  } catch (error) {
    console.error('Error in GET /api/hackernews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Hacker News data' },
      { status: 500 }
    );
  }
}
