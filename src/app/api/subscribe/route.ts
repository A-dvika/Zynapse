import { NextRequest, NextResponse } from 'next/server';
import { subscribeNewsletter } from '../../../../lib/newsletter';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, topics, sources, frequency } = body;

    // Basic validation for email
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required and must be a string.' }, { status: 400 });
    }

    // Optionally, add more validation for topics, sources, and frequency here

    const subscription = await subscribeNewsletter({ email, name, topics, sources, frequency });
    return NextResponse.json({ message: 'Subscription successful', subscription });
  } catch (error) {
    console.error('Error subscribing:', error);
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 });
  }
}
