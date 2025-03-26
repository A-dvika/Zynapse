// app/api/reddit/route.ts
import { NextResponse } from 'next/server';
import prisma from '../../../../lib/db';

export async function GET() {
  try {
    const posts = await prisma.redditPost.findMany({
      orderBy: {
        upvotes: 'desc',
      },
      take: 20, // limit to top 20 posts
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error in GET /api/reddit:', error);
    return NextResponse.json({ error: 'Failed to fetch Reddit data from DB' }, { status: 500 });
  }
}
