// scripts/socialMediaCron.ts
import { fetchTwitterBuzz, fetchMastodonBuzz } from '../lib/socialMedia';
import prisma from '../lib/db';

async function run() {
  try {
    // Fetch Twitter posts
    const twitterPosts = await fetchTwitterBuzz(10);
    console.log('Fetched Twitter buzz:', twitterPosts.length);
    for (const post of twitterPosts) {
      await prisma.socialMediaPost.upsert({
        where: { id: post.id },
        update: {
          content: post.content,
          author: post.author,
          hashtags: post.hashtags,
          url: post.url,
          score: post.score,
          createdAt: new Date(post.createdAt),
        },
        create: {
          id: post.id,
          platform: post.platform,
          content: post.content,
          author: post.author,
          hashtags: post.hashtags,
          url: post.url,
          score: post.score,
          createdAt: new Date(post.createdAt),
          aggregatedAt: new Date(),
        },
      });
    }

    // Fetch Mastodon posts
    const mastodonPosts = await fetchMastodonBuzz(10);
    console.log('Fetched Mastodon buzz:', mastodonPosts.length);
    for (const post of mastodonPosts) {
      await prisma.socialMediaPost.upsert({
        where: { id: post.id },
        update: {
          content: post.content,
          author: post.author,
          hashtags: post.hashtags,
          url: post.url,
          score: post.score,
          createdAt: new Date(post.createdAt),
        },
        create: {
          id: post.id,
          platform: post.platform,
          content: post.content,
          author: post.author,
          hashtags: post.hashtags,
          url: post.url,
          score: post.score,
          createdAt: new Date(post.createdAt),
          aggregatedAt: new Date(),
        },
      });
    }
    console.log('Social Media Buzz data saved to DB successfully.');
  } catch (error) {
    console.error('Error in Social Media Buzz cron job:', error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
