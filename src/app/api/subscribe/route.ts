import { NextRequest, NextResponse } from 'next/server';
import { subscribeNewsletter } from '../../../../lib/newsletter';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    // Basic validation
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required and must be a string.' }, { status: 400 });
    }

    // Optionally: validate email format using regex or a library

    const subscription = await subscribeNewsletter({ email, name });
    return NextResponse.json({ message: 'Subscription successful', subscription });
  } catch (error) {
    console.error('Error subscribing:', error);
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 });
  }
}
