// lib/github.ts
import axios from "axios";

const GITHUB_API_URL = "https://api.github.com";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const headers = GITHUB_TOKEN
  ? { Authorization: `token ${GITHUB_TOKEN}` }
  : undefined;



interface GitHubSearchResponse<T> {
  items: T[];
}


interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  language: string | null;
  pushed_at: string;
  description: string | null;
}


export interface TrendingRepo {
  id: number;
  name: string;
  fullName: string;
  url: string;
  stars: number;
  forks: number;
  watchers: number;
  language: string | null;
  pushedAt: string;
  description: string | null;
}


interface GitHubIssue {
  id: number;
  html_url: string;
  title: string;
  user: { login: string };
  comments: number;
  created_at: string;
  updated_at: string;
}


export interface ActiveIssue {
  id: number;
  repoName: string;
  issueUrl: string;
  title: string;
  author: string;
  comments: number;
  createdAt: string;
  updatedAt: string;
}


function getDateDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
}


export async function fetchTrendingRepos(): Promise<TrendingRepo[]> {
  const oneWeekAgo = getDateDaysAgo(7);
  const query = `created:>${oneWeekAgo}+pushed:>${oneWeekAgo}`;
  const url = `${GITHUB_API_URL}/search/repositories?q=${query}&sort=stars&order=desc&per_page=10`;

  try {
    const response = await axios.get<GitHubSearchResponse<GitHubRepo>>(url, { headers });
    return response.data.items.map((repo) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      watchers: repo.watchers_count,
      language: repo.language,
      pushedAt: repo.pushed_at,
      description: repo.description,
    }));
  } catch (error: unknown) {
    console.error("Error fetching trending repositories:", error);
    return [];
  }
}


export async function fetchActiveIssues(repoFullName: string): Promise<ActiveIssue[]> {
  const url = `${GITHUB_API_URL}/search/issues?q=repo:${repoFullName}+state:open&sort=comments&order=desc&per_page=5`;
  try {
    const response = await axios.get<GitHubSearchResponse<GitHubIssue>>(url, { headers });
    return response.data.items.map((issue) => ({
      id: issue.id,
      repoName: repoFullName,
      issueUrl: issue.html_url,
      title: issue.title,
      author: issue.user?.login ?? "",
      comments: issue.comments,
      createdAt: issue.created_at,
      updatedAt: issue.updated_at,
    }));
  } catch (error: unknown) {
    console.error(`Error fetching issues for ${repoFullName}:`, error);
    return [];
  }
}


export function analyzeLanguages(repos: TrendingRepo[]): { language: string; repoCount: number }[] {
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
