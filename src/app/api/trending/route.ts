import { NextRequest, NextResponse } from "next/server"

import { subDays } from "date-fns"
import prisma from "../../../../lib/db"

// Utility: handle zero division
function computeGrowth(current: number, past: number): number {
  if (past === 0 && current > 0) {
    // If there's no past score but we have a current score, call it 100% or a big number
    return 100
  }
  if (past === 0 && current === 0) {
    return 0
  }
  return ((current - past) / past) * 100
}

export async function GET(req: NextRequest) {
  try {
    const now = new Date()
    const sevenDaysAgo = subDays(now, 7)
    const fourteenDaysAgo = subDays(now, 14)

    // 1. Current 7-day window
    // Summation of 'score' across all content that was created in the last 7 days
    // unnest(tags) => each tag in array becomes its own row
    const currentData: Array<{ tag: string; total_score: number }> = await prisma.$queryRaw`
      SELECT tag AS tag, COALESCE(SUM(score), 0) AS total_score
      FROM (
        SELECT UNNEST("Content".tags) AS tag, "Content".score
        FROM "Content"
        WHERE "Content"."createdAt" >= ${sevenDaysAgo}
      ) AS sub
      GROUP BY tag
    `

    // 2. Previous 7-day window
    const pastData: Array<{ tag: string; total_score: number }> = await prisma.$queryRaw`
      SELECT tag AS tag, COALESCE(SUM(score), 0) AS total_score
      FROM (
        SELECT UNNEST("Content".tags) AS tag, "Content".score
        FROM "Content"
        WHERE "Content"."createdAt" >= ${fourteenDaysAgo}
          AND "Content"."createdAt" < ${sevenDaysAgo}
      ) AS sub
      GROUP BY tag
    `

    // 3. Merge + compute growth
    const trendingMap: Record<string, { tag: string; current: number; past: number }> = {}

    // fill current
    for (const row of currentData) {
      trendingMap[row.tag] = {
        tag: row.tag,
        current: Number(row.total_score) || 0,
        past: 0,
      }
    }

    // fill past
    for (const row of pastData) {
      if (!trendingMap[row.tag]) {
        trendingMap[row.tag] = {
          tag: row.tag,
          current: 0,
          past: Number(row.total_score) || 0,
        }
      } else {
        trendingMap[row.tag].past = Number(row.total_score) || 0
      }
    }

    // 4. Build final array
    const trendingArray = Object.values(trendingMap).map(({ tag, current, past }) => {
      const growth = computeGrowth(current, past)
      return {
        id: tag,
        name: tag,
        count: current,
        growth: Math.round(growth),
        category: "tag", // optional, or you can guess category from tag
      }
    })

    // 5. Sort by growth desc + limit top 20
    trendingArray.sort((a, b) => b.growth - a.growth)
    const topTrending = trendingArray.slice(0, 20)

    return NextResponse.json(topTrending)
  } catch (error) {
    console.error("Error computing trending tags:", error)
    return new NextResponse("Error", { status: 500 })
  }
}
