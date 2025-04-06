// src/app/api/history/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/db";

export async function POST(request: Request) {
  try {
    const { contentId, action } = await request.json();

    if (!contentId || !action) {
      return NextResponse.json(
        { error: "Missing contentId or action" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    // Optionally, check if the content exists.
    const content = await prisma.content.findUnique({
      where: { id: contentId },
    });
    if (!content) {
      return NextResponse.json(
        { error: "Invalid contentId: content not found" },
        { status: 400 }
      );
    }

    const history = await prisma.userHistory.create({
      data: { userId, contentId, action },
    });

    return NextResponse.json({ history });
  } catch (error) {
    console.error("Error saving history:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
