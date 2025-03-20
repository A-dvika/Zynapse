// src/app/api/github/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/db';

export async function GET(_req: NextRequest) {
  try {
    // Example: fetch top 10 starred repos from DB
    const repos = await prisma.gitHubRepo.findMany({
      orderBy: {
        stars: 'desc',
      },
      take: 10,
    });

    // Example: fetch top 5 language stats
    const languageStats = await prisma.gitHubLanguageStat.findMany({
      orderBy: {
        repoCount: 'desc',
      },
      take: 5,
    });

    // Could also fetch issues here
    const issues = await prisma.gitHubIssue.findMany({
      orderBy: {
        comments: 'desc',
      },
      take: 10,
    });

    return NextResponse.json({ repos, languageStats, issues });
  } catch (error) {
    console.error('Error in GET /api/github:', error);
    return NextResponse.json({ error: 'Failed to fetch GitHub data' }, { status: 500 });
  }
}
