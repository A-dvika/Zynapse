// src/app/api/stackoverflow/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/db';

export async function GET(_req: NextRequest) {
  try {
    const questions = await prisma.stackOverflowQuestion.findMany({
      orderBy: { score: 'desc' },
      take: 10,
    });
    const answers = await prisma.stackOverflowAnswer.findMany({
      orderBy: { score: 'desc' },
      take: 10,
    });
    const tagStats = await prisma.stackOverflowTagStat.findMany({
      orderBy: { questionCount: 'desc' },
    });

    return NextResponse.json({ questions, answers, tagStats });
  } catch (error) {
    console.error('Error in GET /api/stackoverflow:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Stack Overflow data' },
      { status: 500 }
    );
  }
}
