// app/api/checkPreferences/route.ts
import { getServerSession } from "next-auth";

import { NextResponse } from "next/server";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/db";

export async function GET(request: Request) {
  // Get session using app-compatible function. Note that you can directly pass authOptions.
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ exists: false }, { status: 401 });
  }

  if (!session.user || !('id' in session.user)) {
    return NextResponse.json({ exists: false }, { status: 400 });
  }

  const prefs = await prisma.userPreferences.findUnique({
    where: { userId: session.user.id as string },
  });

  return NextResponse.json({ exists: !!prefs });
}
