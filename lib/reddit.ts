// lib/reddit.ts
import axios from 'axios';

const REDDIT_API_URL = 'https://www.reddit.com';

export async function fetchRedditTrends(): Promise<any[]> {
  // List of tech-related subreddits to fetch data from
  const subreddits = ['programming', 'startups', 'cybersecurity'];
  const trends: any[] = [];

  // Loop through each subreddit and fetch the top 10 "hot" posts
  for (const subreddit of subreddits) {
    try {
      const response = await axios.get(`${REDDIT_API_URL}/r/${subreddit}/hot.json?limit=10`);
      const posts = response.data.data.children.map((child: any) => {
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
      trends.push(...posts);
    } catch (error) {
      console.error(`Error fetching data from /r/${subreddit}:`, error);
    }
  }

  // Sort posts by a composite metric (upvotes + comments)
  trends.sort((a, b) => (b.upvotes + b.comments) - (a.upvotes + a.comments));
  return trends;
}
