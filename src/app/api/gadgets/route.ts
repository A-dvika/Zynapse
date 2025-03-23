// app/api/gadgets/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'NEWS_API_KEY is not set in environment variables.' },
        { status: 500 }
      );
    }

    // Query NewsAPI for gadget-related articles.
    const url = `https://newsapi.org/v2/everything?q=gadgets&sortBy=publishedAt&language=en&apiKey=${apiKey}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch gadget news from NewsAPI.' },
        { status: 500 }
      );
    }

    const data = await res.json();
    // Return the array of articles (NewsAPI returns articles in the "articles" field).
    return NextResponse.json(data.articles);
  } catch (error) {
    console.error('Error in /api/gadgets:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
