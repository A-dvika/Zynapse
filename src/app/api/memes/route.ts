import { NextResponse } from "next/server";
import prisma from "../../../../lib/db";

// console.log("Prisma client keys:", Object.keys(prisma)); // Add this for debugging

export async function GET() {
  try {
    const memes = await prisma.meme.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return NextResponse.json({ memes });
  } catch (error) {
    console.error("Error in GET /api/memes:", error);
    return NextResponse.json({ error: "Failed to fetch memes" }, { status: 500 });
  }
}
