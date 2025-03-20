import prisma from "../lib/db";

async function test() {
  try {
    const memes = await prisma.meme.findMany();
    console.log("Fetched memes:", memes);
  } catch (error) {
    console.error("Error fetching memes:", error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
