import { fetchProductHuntPosts, ProductHuntPost } from '../lib/producthunt';
import prisma from '../lib/db';

async function run() {
  try {
    // Get the Product Hunt API token from environment variables.
    const token = process.env.PRODUCT_HUNT_TOKEN;
    if (!token) {
      throw new Error('Product Hunt token not provided in environment variables.');
    }

    // Fetch the latest Product Hunt posts
    const posts: ProductHuntPost[] = await fetchProductHuntPosts(10, token);
    console.log('Fetched Product Hunt posts:', posts.length);

    // Upsert each post into your database using Prisma.
    for (const post of posts) {
      await prisma.ProductHuntPost.upsert({
        where: { id: post.id },
        update: {
          name: post.name,
          tagline: post.tagline,
          url: post.url,
          votesCount: post.votesCount,
          commentsCount: post.commentsCount,
          createdAt: new Date(post.createdAt),
        },
        create: {
          id: post.id,
          name: post.name,
          tagline: post.tagline,
          url: post.url,
          votesCount: post.votesCount,
          commentsCount: post.commentsCount,
          createdAt: new Date(post.createdAt),
          aggregatedAt: new Date(),
        },
      });
      // Optional: add a short delay between upserts
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    console.log('Product Hunt data saved to DB successfully.');
  } catch (error) {
    console.error('Error in Product Hunt cron job:', error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
