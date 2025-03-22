// app/api/reddit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { fetchRedditTrends } from '../../../../lib/reddit';

export async function GET() {
  try {
    const data = await fetchRedditTrends();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET /api/reddit:', error);
    return NextResponse.json({ error: 'Failed to fetch Reddit data' }, { status: 500 });
  }
}
