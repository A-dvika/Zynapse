// lib/memes.ts
import axios from "axios";

export type MemePlatform = "reddit" | "twitter" | "instagram";

export interface Meme {
  id: string;
  platform: MemePlatform;
  title: string;
  caption: string | null;
  imageUrl: string;
  upvotes: number;
  link: string;
  createdAt: string;
}


interface RedditResponse {
  data: {
    children: RedditChild[];
  };
}

interface RedditChild {
  data: RedditPost;
}

interface RedditPost {
  id: string;
  title: string;
  selftext?: string;
  url_overridden_by_dest: string;
  ups: number;
  permalink: string;
  created_utc: number;
  post_hint?: string;
}

export async function fetchRedditMemes(): Promise<Meme[]> {
  const subreddits = ["memes", "dankmemes", "wholesomememes"];
  let memes: Meme[] = [];

  for (const subreddit of subreddits) {
    try {
      const response = await axios.get<RedditResponse>(
        `https://www.reddit.com/r/${subreddit}/hot.json?limit=10`
      );
      const posts = response.data.data.children
        .map((child: RedditChild) => child.data)
        .filter((post: RedditPost) => post.post_hint === "image"); // Only posts with images

      const mappedMemes = posts.map((post: RedditPost): Meme => ({
        id: post.id,
        platform: "reddit",
        title: post.title,
        caption: post.selftext ? post.selftext : null,
        imageUrl: post.url_overridden_by_dest,
        upvotes: post.ups,
        link: `https://reddit.com${post.permalink}`,
        createdAt: new Date(post.created_utc * 1000).toISOString(),
      }));
      memes = memes.concat(mappedMemes);
    } catch (error) {
      console.error(`Error fetching memes from subreddit ${subreddit}:`, error);
    }
  }

  return memes;
}


interface TwitterTweet {
  id: string;
  text: string;
  created_at: string;
  public_metrics: {
    like_count: number;
  };
  attachments?: {
    media_keys: string[];
  };
}

interface TwitterMedia {
  media_key: string;
  url: string;
}

interface TwitterResponse {
  data: TwitterTweet[];
  includes?: {
    media: TwitterMedia[];
  };
}


export async function fetchTwitterMemes(): Promise<Meme[]> {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;
  if (!bearerToken) throw new Error("TWITTER_BEARER_TOKEN not set");

  const url = "https://api.twitter.com/2/tweets/search/recent";
  const params = {
    query: "meme has:images -is:retweet", // Only tweets with images and not retweets
    max_results: 10,
    "tweet.fields": "created_at,public_metrics,entities,attachments",
    expansions: "attachments.media_keys",
    "media.fields": "url",
  };

  try {
    const response = await axios.get<TwitterResponse>(url, {
      headers: { Authorization: `Bearer ${bearerToken}` },
      params,
    });
    const tweets = response.data.data || [];
    const mediaMap: Record<string, TwitterMedia> = {};
    if (response.data.includes && response.data.includes.media) {
      for (const media of response.data.includes.media) {
        mediaMap[media.media_key] = media;
      }
    }

    const memes = tweets
      .map((tweet: TwitterTweet): Meme | null => {
        const mediaKey = tweet.attachments?.media_keys?.[0];
        const media = mediaKey ? mediaMap[mediaKey] : null;
        if (!media || !media.url) return null;
        return {
          id: tweet.id,
          platform: "twitter",
          title: tweet.text.slice(0, 100), // Use the first 100 characters as title
          caption: null,
          imageUrl: media.url,
          upvotes: tweet.public_metrics ? tweet.public_metrics.like_count : 0,
          link: `https://twitter.com/i/web/status/${tweet.id}`,
          createdAt: new Date(tweet.created_at).toISOString(),
        };
      })
      .filter((meme: Meme | null): meme is Meme => meme !== null);

    return memes;
  } catch (error) {
    console.error("Error fetching Twitter memes:", error);
    return [];
  }
}


export async function fetchInstagramMemes(): Promise<Meme[]> {
  return [
    {
      id: "insta1",
      platform: "instagram",
      title: "Funny Meme on Instagram",
      caption: "A hilarious meme from Instagram.",
      imageUrl: "https://example.com/insta-meme1.jpg",
      upvotes: 150,
      link: "https://instagram.com/p/abc123",
      createdAt: new Date().toISOString(),
    },
    {
      id: "insta2",
      platform: "instagram",
      title: "Another Meme on Instagram",
      caption: "Another funny meme.",
      imageUrl: "https://example.com/insta-meme2.jpg",
      upvotes: 200,
      link: "https://instagram.com/p/def456",
      createdAt: new Date().toISOString(),
    },
  ];
}

export async function fetchAllMemes(): Promise<Meme[]> {
  const [redditMemes, twitterMemes] = await Promise.all([
    fetchRedditMemes(),
    fetchTwitterMemes(),
   
  ]);

  return [...redditMemes, ...twitterMemes];
}
