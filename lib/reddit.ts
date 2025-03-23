// lib/reddit.ts
import axios from 'axios';

const REDDIT_API_URL = 'https://www.reddit.com';


const subreddits = [
  'programming',
  'startups',
  'cybersecurity',
  'technology',
  'gadgets',
  'technews',
  'apple',
  'android'
];


interface RedditPost {
  id: string;
  title: string;
  subreddit: string;
  permalink: string;
  ups: number;
  num_comments: number;
  created_utc: number;
  author: string;
}

interface RedditChild {
  data: RedditPost;
}

export interface RedditTrend {
  id: string;
  title: string;
  subreddit: string;
  url: string;
  upvotes: number;
  comments: number;
  createdAt: string;
  author: string;
}

export async function fetchRedditTrends(): Promise<RedditTrend[]> {
  
  const trendsPromises = subreddits.map(async (subreddit) => {
    try {
      const response = await axios.get(`${REDDIT_API_URL}/r/${subreddit}/hot.json?limit=10`);
      
      return response.data.data.children.map((child: RedditChild): RedditTrend => {
        const post = child.data;
        return {
          id: post.id,
          title: post.title,
          subreddit: post.subreddit,
          url: `https://reddit.com${post.permalink}`,
          upvotes: post.ups,
          comments: post.num_comments,
          createdAt: new Date(post.created_utc * 1000).toISOString(),
          author: post.author,
        };
      });
    } catch (error) {
      console.error(`Error fetching data from /r/${subreddit}:`, error);
      return []; 
    }
  });

  
  const trendsArrays = await Promise.all(trendsPromises);
  const trends = trendsArrays.flat();

  
  trends.sort((a, b) => (b.upvotes + b.comments) - (a.upvotes + a.comments));
  return trends;
}
