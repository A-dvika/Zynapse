import { fetchTwitterBuzz, fetchMastodonBuzz } from '../lib/socialMedia';
import prisma from '../lib/db';

async function run() {
  try {
    // Fetch latest Twitter & Mastodon posts
    const twitterPosts = await fetchTwitterBuzz(15);
    const mastodonPosts = await fetchMastodonBuzz(5);

    const allPosts = [...twitterPosts, ...mastodonPosts];
    console.log(`Fetched ${allPosts.length} social media posts.`);

    // Upsert posts into the database
    for (const post of allPosts) {
      await prisma.socialMediaPost.upsert({
        where: { id: post.id },
        update: {
          content: post.content,
          author: post.author,
          hashtags: post.hashtags,
          // hashtags: JSON.stringify(post.hashtags), // Convert array to string
          url: post.url,
          score: post.score||0,
          createdAt: new Date(post.createdAt),
        },
        create: {
          id: post.id,
          platform: post.platform,
          content: post.content,
          author: post.author,
          hashtags: post.hashtags,
          // hashtags: JSON.stringify(post.hashtags), // Convert array to string
          url: post.url,
          score: post.score||0,
          createdAt: new Date(post.createdAt),
          aggregatedAt: new Date(),
        },
      });
    }

    console.log('Saved Social Media Buzz data to DB.');
  } catch (error) {
    console.error('Error in socialMediaCron job:', error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
