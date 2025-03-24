import { NextResponse } from 'next/server';
import prisma from '../../../../lib/db';

export async function GET() {
  try {
    const posts = await prisma.socialMediaPost.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json(posts); // ✅ Directly return posts (no extra `{ posts }` wrapper)
  } catch (error) {
    console.error('Error in GET /api/socialmedia:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Social Media data' },
      { status: 500 }
    );
  }
}
