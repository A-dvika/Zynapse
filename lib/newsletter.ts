import prisma from "./db"



export async function subscribeNewsletter({
  email,
  name,
  topics = [],
  sources = [],
  frequency = "weekly",
}: {
  email: string
  name?: string
  topics?: string[]
  sources?: string[]
  frequency?: string
}) {
  return await prisma.newsletterSubscription.upsert({
    where: { email },
    update: { name, sources, frequency },
    create: { email, name, sources, frequency },
  });
}
