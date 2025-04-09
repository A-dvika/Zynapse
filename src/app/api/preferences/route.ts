// src/app/api/preferences/route.ts
import { getServerSession } from "next-auth";

import { NextResponse } from "next/server";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/db";

// GET method to fetch user preferences
export async function GET() {
  // Get the session; if not signed in, return a 401 response.
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  try {
    // Fetch user preferences from the database.
    const prefs = await prisma.userPreferences.findUnique({
      where: { userId: session.user.id },
    });
    
    if (!prefs) {
      return NextResponse.json({ error: "Preferences not found" }, { status: 404 });
    }
    
    return NextResponse.json(prefs, { status: 200 });
  } catch (error: any) {
    console.error("Failed to fetch preferences", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  // Get the session; if not signed in, return a 401 response.
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  // Parse the incoming JSON body.
  const body = await request.json();
  const { interests, sources, contentTypes, githubLanguages } = body;

  try {
    // Save user preferences to the database.
    const prefs = await prisma.userPreferences.create({
      data: {
        userId: session.user.id,
        interests: githubLanguages ? [...interests, ...githubLanguages] : interests,
        sources,
        contentTypes,
      },
    });
    return NextResponse.json(prefs, { status: 200 });
  } catch (error: any) {
    console.error("Failed to save preferences", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}