// lib/reddit.ts
import axios from 'axios';

const REDDIT_API_URL = 'https://www.reddit.com';

// Define a larger list of subreddits covering different tech topics
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

export async function fetchRedditTrends(): Promise<any[]> {
  // Use Promise.all to fetch data concurrently from all subreddits
  const trendsPromises = subreddits.map(async (subreddit) => {
    try {
      const response = await axios.get(`${REDDIT_API_URL}/r/${subreddit}/hot.json?limit=10`);
      return response.data.data.children.map((child: any) => {
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
      return []; // Return an empty array if there's an error for this subreddit
    }
  });

  // Wait for all requests to finish and flatten the results into one array
  const trendsArrays = await Promise.all(trendsPromises);
  const trends = trendsArrays.flat();

  // Sort posts by a composite metric (upvotes + comments)
  trends.sort((a, b) => (b.upvotes + b.comments) - (a.upvotes + a.comments));
  return trends;
}
