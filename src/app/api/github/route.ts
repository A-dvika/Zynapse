import { NextResponse } from 'next/server'
import prisma from '../../../../lib/db'

export async function GET() {
  try {
    const repos = await prisma.gitHubRepo.findMany({
      orderBy: { stars: 'desc' },
      take: 10,
    })

    const languageStats = await prisma.gitHubLanguageStat.findMany({
      orderBy: { repoCount: 'desc' },
      take: 5,
    })

    const issues = await prisma.gitHubIssue.findMany({
      orderBy: { comments: 'desc' },
      take: 10,
    })

    // For analyticsData
    const analyticsData = {
      languageStats: languageStats.map(lang => ({
        language: lang.language,
        repoCount: lang.repoCount,
      })),
      activityData: [
        { date: 'Jan', count: 10 },
        { date: 'Feb', count: 15 },
        { date: 'Mar', count: 25 },
        { date: 'Apr', count: 30 },
        { date: 'May', count: 22 },
        { date: 'Jun', count: 28 },
      ],
      engagementMetrics: {
        stars: repos.reduce((acc, r) => acc + r.stars, 0),
        forks: repos.reduce((acc, r) => acc + r.forks, 0),
        watchers: repos.reduce((acc, r) => acc + r.watchers, 0),
      },
      topContributors: [
        { name: 'dev01', contributions: 42 },
        { name: 'dev02', contributions: 37 },
        { name: 'dev03', contributions: 29 },
      ],
      weeklyActivity: [
        { day: 'Mon', commits: 4, issues: 2, prs: 1 },
        { day: 'Tue', commits: 3, issues: 1, prs: 2 },
        { day: 'Wed', commits: 7, issues: 3, prs: 0 },
        { day: 'Thu', commits: 5, issues: 2, prs: 3 },
        { day: 'Fri', commits: 6, issues: 4, prs: 2 },
        { day: 'Sat', commits: 2, issues: 1, prs: 0 },
        { day: 'Sun', commits: 1, issues: 0, prs: 1 },
      ],
      popularRepos: repos.slice(0, 5).map(repo => ({
        name: repo.name,
        stars: repo.stars,
      })),
    }

    // For contentMetrics (example: summarize repo data)
    const contentMetrics = {
      totalItems: repos.length,
      averageEngagement: Math.floor(
        repos.reduce((acc, r) => acc + (r.stars + r.forks + r.watchers) / 3, 0) / repos.length
      ),
      topCategories: languageStats.map(lang => ({
        name: lang.language,
        count: lang.repoCount,
      })),
      growthRate: 12,
      readingTime: repos.length * 2, // Just for fun
      savedItems: 20,
      sharedItems: 15,
    }

    return NextResponse.json({ analyticsData, contentMetrics })
  } catch (error) {
    console.error('Error in GET /api/github:', error)
    return NextResponse.json({ error: 'Failed to fetch GitHub analytics' }, { status: 500 })
  }
}
