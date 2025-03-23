// lib/hackernews.ts
import axios from 'axios';

const HN_API_BASE = 'https://hacker-news.firebaseio.com/v0';

interface HackerNewsItem {
  id: number;
  title: string;
  url?: string;
  by?: string;
  score?: number;
  descendants?: number;
  time: number;
}

export interface HackerNewsStory {
  id: number;
  title: string;
  url: string | null;
  author: string | null;
  score: number;
  comments: number;
  createdAt: string;
}


export async function fetchHackerNewsStories(limit = 10): Promise<HackerNewsStory[]> {
 
  const topStoriesUrl = `${HN_API_BASE}/topstories.json`;
  const { data: storyIds } = await axios.get<number[]>(topStoriesUrl);

  
  const stories: HackerNewsStory[] = [];
  for (let i = 0; i < Math.min(limit, storyIds.length); i++) {
    const storyId = storyIds[i];
    const itemUrl = `${HN_API_BASE}/item/${storyId}.json`;
    const { data: storyData } = await axios.get<HackerNewsItem | null>(itemUrl);

    
    if (storyData) {
      stories.push({
        id: storyData.id,
        title: storyData.title,
        url: storyData.url || null,
        author: storyData.by || null,
        score: storyData.score || 0,
        comments: storyData.descendants || 0,
        createdAt: new Date(storyData.time * 1000).toISOString(),
      });
    }
  }
  return stories;
}

export interface TechNewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  summary: string;
}



export async function fetchTechNewsFeed(): Promise<TechNewsItem[]> {
  const API_KEY = "defa7a0ec55f4880af8e64cb51e5ffde"; // Replace with your actual API key
  const url = `https://newsapi.org/v2/top-headlines?category=technology&apiKey=${API_KEY}`;
  
  const { data } = await axios.get(url);

 
  const articles = data.articles;
  const techNews: TechNewsItem[] = articles.map((article: { title: string; url: string; source: { name: string }; description?: string; publishedAt: string }, index: number) => ({
    id: `technews-${index}-${new Date(article.publishedAt).getTime()}`, // create a unique id
    title: article.title,
    url: article.url,
    source: article.source.name,
    summary: article.description || '',
  }));

  return techNews;
}


  