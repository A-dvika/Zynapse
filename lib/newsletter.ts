// lib/newsletter.ts
import prisma from './db';

interface SubscriptionInput {
  email: string;
  name?: string;
}

export async function subscribeNewsletter({ email, name }: SubscriptionInput) {
  // Upsert the subscription so that if the email already exists, update it; otherwise, create it.
  const subscription = await prisma.newsletterSubscription.upsert({
    where: { email },
    update: { name, subscribedAt: new Date() },
    create: { email, name, subscribedAt: new Date() },
  });
  return subscription;
}
