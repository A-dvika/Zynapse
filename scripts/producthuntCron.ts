import { fetchProductHuntPosts, ProductHuntPost } from '../lib/producthunt';
import prisma from '../lib/db';

async function run() {
  try {
    const token = process.env.PRODUCT_HUNT_TOKEN;
    if (!token) {
      throw new Error('Product Hunt token not provided in environment variables.');
    }

    const posts: ProductHuntPost[] = await fetchProductHuntPosts(10, token);
    console.log('Fetched Product Hunt posts:', posts.length);

    for (const post of posts) {
      await prisma.productHuntPost.upsert({
        where: { id: post.id },
        update: {
          name: post.name,
          tagline: post.tagline,
          url: post.url,
          votesCount: post.votesCount,
          commentsCount: post.commentsCount,
          createdAt: new Date(post.createdAt),
          thumbnailUrl: post.thumbnailUrl,
          description: post.description,
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
          thumbnailUrl: post.thumbnailUrl,
          description: post.description,
        },
      });
      
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
