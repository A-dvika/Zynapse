// app/api/track/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";


import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/db";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
  
    const { contentId, action } = await req.json();
  
    if (!contentId || !action) {
      return NextResponse.json({ error: "Missing contentId or action" }, { status: 400 });
    }
  
    try {
      // Check if the content exists in the Content table
      const existingContent = await prisma.content.findUnique({
        where: { id: contentId },
      });
      
      // Option 1: Create the content record if it doesn't exist (if appropriate)
      if (!existingContent) {
        await prisma.content.create({
          data: {
            id: contentId,
            // Add any required fields for the Content model here
            // e.g., title: "GitHub Analytics Dashboard" (if applicable)
          },
        });
      }
      
      // Now create the UserHistory record
      await prisma.userHistory.create({
        data: {
          userId: session.user.id,
          contentId,
          action,
        },
      });
  
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error logging user action:", error);
      return NextResponse.json({ error: "Failed to log action" }, { status: 500 });
    }
  }