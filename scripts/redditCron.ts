import { fetchRedditTrends } from '../lib/reddit';
import prisma from '../lib/db';

async function run() {
  try {
    const trends = await fetchRedditTrends();
    console.log('Fetched Reddit trends:', trends);

    for (const trend of trends) {
      await prisma.redditPost.upsert({
        where: { id: trend.id },
        update: { ...trend },
        create: { ...trend },
      });
    }
    console.log('Saved Reddit trends to DB.');
  } catch (error) {
    console.error('Error in redditCron job:', error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
