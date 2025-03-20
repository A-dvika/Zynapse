// lib/github.ts
import axios from 'axios';

const GITHUB_API_URL = 'https://api.github.com';

// Optional: read token from env
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const headers = GITHUB_TOKEN
  ? { Authorization: `token ${GITHUB_TOKEN}` }
  : undefined;

/**
 * Example: Fetch trending repositories by stars over the last week
 * using GitHub's search endpoint
 */
export async function fetchTrendingRepos(): Promise<any[]> {
  // Adjust query as you like:
  // "created:>2023-03-01" => Repos created after a certain date, 
  // "sort=stars" => sort by stars, "order=desc" => descending.
  const url = `${GITHUB_API_URL}/search/repositories?q=created:>2023-01-01&sort=stars&order=desc&per_page=10`;
  const response = await axios.get(url, { headers });
  return response.data.items.map((repo: any) => ({
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    url: repo.html_url,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    watchers: repo.watchers_count,
    language: repo.language,
    pushedAt: repo.pushed_at,
  }));
}

/**
 * Fetch issues for a given repo that are highly active (e.g. many comments).
 */
export async function fetchActiveIssues(repoFullName: string): Promise<any[]> {
  const url = `${GITHUB_API_URL}/search/issues?q=repo:${repoFullName}+state:open&sort=comments&order=desc&per_page=5`;
  const response = await axios.get(url, { headers });
  return response.data.items.map((issue: any) => ({
    id: issue.id,
    repoName: repoFullName,
    issueUrl: issue.html_url,
    title: issue.title,
    author: issue.user?.login ?? '',
    comments: issue.comments,
    createdAt: issue.created_at,
    updatedAt: issue.updated_at,
  }));
}

/**
 * Simple approach: Summarize the languages used in a list of repos.
 */
export function analyzeLanguages(repos: any[]): any[] {
  const languageCount: Record<string, number> = {};

  for (const repo of repos) {
    if (repo.language) {
      languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
    }
  }

  return Object.entries(languageCount).map(([language, count]) => ({
    language,
    repoCount: count,
  }));
}
