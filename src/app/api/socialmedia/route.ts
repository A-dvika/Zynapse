// src/app/api/socialmedia/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/db';

export async function GET(_: NextRequest) {
  try {
    const posts = await prisma.socialMediaPost.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error in GET /api/socialmedia:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Social Media data' },
      { status: 500 }
    );
  }
}
