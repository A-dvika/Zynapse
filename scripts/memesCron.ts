import { fetchAllMemes } from "../lib/memes";
import prisma from "../lib/db";

async function run() {
  try {
    const memes = await fetchAllMemes();
    console.log(`Fetched ${memes.length} memes from all sources.`);
    for (const meme of memes) {
      await prisma.meme.upsert({
        where: { id: meme.id },
        update: {
          platform: meme.platform,
          title: meme.title,
          caption: meme.caption,
          imageUrl: meme.imageUrl,
          upvotes: meme.upvotes,
          link: meme.link,
          createdAt: new Date(meme.createdAt),
        },
        create: {
          id: meme.id,
          platform: meme.platform,
          title: meme.title,
          caption: meme.caption,
          imageUrl: meme.imageUrl,
          upvotes: meme.upvotes,
          link: meme.link,
          createdAt: new Date(meme.createdAt),
        },
      });
    }
    console.log("Memes saved to DB successfully.");
  } catch (error) {
    console.error("Error in memes cron job:", error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
