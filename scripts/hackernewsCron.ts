// scripts/hackernewsCron.ts
import { fetchHackerNewsStories, fetchTechNewsFeed } from '../lib/hackernews';
import prisma from '../lib/db';

async function run() {
  try {
   
    const hnStories = await fetchHackerNewsStories(10);
    console.log('Fetched Hacker News stories:', hnStories.length);

   
    for (const story of hnStories) {
      await prisma.hackerNewsItem.upsert({
        where: { id: story.id }, // HN story ID
        update: {
          title: story.title,
          url: story.url,
          author: story.author,
          score: story.score,
          comments: story.comments,
          createdAt: new Date(story.createdAt),
        },
        create: {
          id: story.id,
          title: story.title,
          url: story.url,
          author: story.author,
          score: story.score,
          comments: story.comments,
          createdAt: new Date(story.createdAt),
        },
      });
    }

    
    const techNews = await fetchTechNewsFeed();
    console.log('Fetched Tech News items:', techNews.length);

    for (const item of techNews) {
      await prisma.techNewsItem.upsert({
        where: { id: item.id }, 
        update: {
          title: item.title,
          url: item.url,
          source: item.source,
          summary: item.summary,
        },
        create: {
          id: item.id,
          title: item.title,
          url: item.url,
          source: item.source,
          summary: item.summary,
        },
      });
    }

    console.log('Hacker News & Tech News data saved to DB successfully.');
  } catch (error) {
    console.error('Error in Hacker News cron job:', error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
