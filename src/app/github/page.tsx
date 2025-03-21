"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface Repo {
  id: number;
  name: string;
  fullName: string;
  url: string;
  stars: number;
  forks: number;
  watchers: number;
  language?: string;
}

interface LanguageStat {
  id: number;
  language: string;
  repoCount: number;
}

interface Issue {
  id: string;
  repoName: string;
  issueUrl: string;
  title: string;
  author: string;
  comments: number;
}

export default function GithubDashboard() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [languages, setLanguages] = useState<LanguageStat[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/github")
      .then(res => {
        setRepos(res.data.repos);
        setLanguages(res.data.languageStats);
        setIssues(res.data.issues);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-blue-600">GitHub Dashboard</h1>

      {loading ? (
        <div className="text-center text-gray-500">Loading GitHub data...</div>
      ) : (
        <>
          {/* Top Repositories */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">🚀 Top Starred Repositories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {repos.map((repo) => (
                <a key={repo.id} href={repo.url} target="_blank" rel="noopener noreferrer"
                  className="bg-gradient-to-br from-blue-500/10 to-blue-900/10 dark:from-gray-900 dark:to-gray-800 p-6 rounded-xl shadow hover:scale-[1.02] transition-all border border-blue-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400">{repo.fullName}</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">⭐ Stars: {repo.stars}</p>
                  <p className="text-gray-600 dark:text-gray-300">🍴 Forks: {repo.forks}</p>
                  <p className="text-gray-600 dark:text-gray-300">👀 Watchers: {repo.watchers}</p>
                  {repo.language && (
                    <span className="mt-2 inline-block bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-white text-sm px-3 py-1 rounded-full">
                      {repo.language}
                    </span>
                  )}
                </a>
              ))}
            </div>
          </section>

          {/* Language Stats */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">🌐 Top Languages</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {languages.map((lang) => (
                <div key={lang.id} className="bg-blue-100 dark:bg-blue-800 text-blue-900 dark:text-blue-100 p-4 rounded-lg shadow text-center">
                  <h3 className="font-bold text-lg">{lang.language}</h3>
                  <p className="mt-2 text-sm">Repos: {lang.repoCount}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Top Issues */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">🐞 Top Issues by Comments</h2>
            <div className="space-y-4">
              {issues.map((issue) => (
                <a key={issue.id} href={issue.issueUrl} target="_blank" rel="noopener noreferrer"
                  className="block bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-5 rounded-lg shadow hover:scale-[1.02] transition-all border border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-lg text-purple-800 dark:text-purple-300">{issue.title}</h4>
                  <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">Repo: {issue.repoName}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Author: {issue.author}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">💬 Comments: {issue.comments}</p>
                </a>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
