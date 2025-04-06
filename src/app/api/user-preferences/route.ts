// app/api/user-preferences/route.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({}, { status: 401 });
  }

  const prefs = await prisma.userPreferences.findUnique({
    where: { userId: session.user.id },
  });

  return NextResponse.json(prefs || {});
}
