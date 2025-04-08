import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../lib/auth"
import prisma from "../../../../lib/db"


export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { action, itemId } = await req.json()

    if (!action || !itemId) {
      return NextResponse.json({ error: "Missing action or itemId" }, { status: 400 })
    }

    // Optional: prevent duplicates (e.g., multiple likes in a row)
    const existing = await prisma.userHistory.findFirst({
      where: {
        userId: session.user.id,
        contentId: itemId,
        action,
      },
      orderBy: { createdAt: "desc" },
    })

    // Avoid duplicate for "like", "save", "dismiss" actions within the same hour
    if (["like", "save", "dismiss"].includes(action) && existing) {
      const oneHourAgo = new Date(Date.now() - 1000 * 60 * 60)
      if (existing.createdAt > oneHourAgo) {
        return NextResponse.json({ status: "already exists recently" })
      }
    }

    await prisma.userHistory.create({
      data: {
        userId: session.user.id,
        contentId: itemId,
        action,
      },
    })

    return NextResponse.json({ status: "success" })
  } catch (err) {
    console.error("Failed to log action:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
