// app/api/producthunt/route.ts
import { NextResponse } from 'next/server';
import prisma from '../../../../lib/db';

export async function GET() {
  try {
    // Fetch all Product Hunt posts from the database, sorted by the time they were aggregated
    const posts = await prisma.productHuntPost.findMany({
      orderBy: { aggregatedAt: 'desc' },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching Product Hunt posts from DB:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts from the database.' },
      { status: 500 }
    );
  }
}
