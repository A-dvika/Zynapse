import { NextRequest, NextResponse } from "next/server";
import { differenceInHours, subHours } from "date-fns";
import prisma from "../../../../lib/db";

// Weights — feel free to tune based on experimentation
const ALPHA = 1;     // momentum
const BETA = 1;      // cumulative engagement
const GAMMA = 1.2;   // recency decay

export async function GET(req: NextRequest) {
  try {
    const now = new Date();
    const sixHoursAgo = subHours(now, 6);
    const twelveHoursAgo = subHours(now, 12);

    // Get Et: Engagement in current time window
    const currentData: Array<{ tag: string; score: number }> = await prisma.$queryRaw`
      SELECT tag, SUM(score) as score
      FROM (
        SELECT UNNEST("Content".tags) AS tag, "Content".score
        FROM "Content"
        WHERE "Content"."createdAt" >= ${sixHoursAgo}
      ) AS sub
      GROUP BY tag
    `;

    // Get Et-1: Engagement in previous time window
    const pastData: Array<{ tag: string; score: number }> = await prisma.$queryRaw`
      SELECT tag, SUM(score) as score
      FROM (
        SELECT UNNEST("Content".tags) AS tag, "Content".score
        FROM "Content"
        WHERE "Content"."createdAt" >= ${twelveHoursAgo} AND "Content"."createdAt" < ${sixHoursAgo}
      ) AS sub
      GROUP BY tag
    `;

    // Get E_total and average age T (in hours)
    const totalData: Array<{ tag: string; total: number; avgAge: number }> = await prisma.$queryRaw`
      SELECT tag, SUM(score) as total, AVG(EXTRACT(EPOCH FROM (${now} - "createdAt")) / 3600) AS avgAge
      FROM (
        SELECT UNNEST("Content".tags) AS tag, "Content".score, "Content"."createdAt"
        FROM "Content"
      ) AS sub
      GROUP BY tag
    `;

    // Merge into one map
    const trendingMap: Record<string, any> = {};

    for (const { tag, score } of currentData) {
      trendingMap[tag] = { tag, Et: Number(score), Et_1: 0, E_total: 0, T: 12 };
    }

    for (const { tag, score } of pastData) {
      trendingMap[tag] = trendingMap[tag] || { tag, Et: 0, E_total: 0, T: 12 };
      trendingMap[tag].Et_1 = Number(score);
    }

    for (const { tag, total, avgAge } of totalData) {
      trendingMap[tag] = trendingMap[tag] || { tag, Et: 0, Et_1: 0 };
      trendingMap[tag].E_total = Number(total);
      trendingMap[tag].T = Math.max(0.1, Number(avgAge)); // avoid divide by zero
    }

    const trendingArray = Object.values(trendingMap).map(({ tag, Et, Et_1, E_total, T }) => {
      const trendingScore =
        ALPHA * (Et - Et_1) + BETA * E_total * (1 / Math.pow(T + 2, GAMMA));

      return {
        id: tag,
        name: tag,
        count: E_total,           // this is used in frontend as "mentions"
        growth: Math.round(Et - Et_1), // change over time
        score: Number(trendingScore.toFixed(2)),
        category: "tag",
      };
    });

    trendingArray.sort((a, b) => b.score - a.score);
    return NextResponse.json(trendingArray.slice(0, 20));
  } catch (err) {
    console.error("Error computing trending tags:", err);
    return new NextResponse("Error", { status: 500 });
  }
}
