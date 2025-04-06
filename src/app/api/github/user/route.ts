import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";

export async function GET(request: Request) {
  // Get the session; if not signed in, return a 401 response.
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  // Get the username from the URL
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  try {
    // Fetch user data from GitHub API
    const userResponse = await fetch(`https://api.github.com/users/${username}`);
    if (!userResponse.ok) {
      return NextResponse.json({ error: "GitHub user not found" }, { status: 404 });
    }
    const userData = await userResponse.json();

    // Fetch user's repositories
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
    if (!reposResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch repositories" }, { status: 500 });
    }
    const reposData = await reposResponse.json();

    // Calculate language preferences
    const languageStats: Record<string, number> = {};
    reposData.forEach((repo: any) => {
      if (repo.language) {
        languageStats[repo.language] = (languageStats[repo.language] || 0) + 1;
      }
    });

    // Sort languages by frequency
    const sortedLanguages = Object.entries(languageStats)
      .sort(([, a], [, b]) => b - a)
      .map(([language]) => language);

    return NextResponse.json({
      user: userData,
      repos: reposData,
      languagePreferences: sortedLanguages
    });
  } catch (error) {
    console.error('Error fetching GitHub user data:', error);
    return NextResponse.json({ error: 'Failed to fetch GitHub user data' }, { status: 500 });
  }
} 