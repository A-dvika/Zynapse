import { fetchTwitterBuzz, fetchMastodonBuzz } from '../lib/socialMedia';
import prisma from '../lib/db';

async function run() {
  try {
    // Fetch tech-related tweets from Twitter
    const twitterPosts = await fetchTwitterBuzz(10);
    console.log('Fetched Twitter buzz:', twitterPosts.length);
    
    // Upsert Twitter data into your database
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
      // Add a short delay between requests if needed
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    
    // Fetch public tech-related posts from Mastodon
    const mastodonPosts = await fetchMastodonBuzz(10);
    console.log('Fetched Mastodon buzz:', mastodonPosts.length);
    
    // Upsert Mastodon data into your database
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
