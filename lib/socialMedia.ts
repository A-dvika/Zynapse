import dotenv from "dotenv";
dotenv.config();

import axios from "axios";

const twitterBearerToken = process.env.TWITTER_BEARER_TOKEN;
const mastodonInstanceUrl = process.env.MASTODON_INSTANCE_URL || "https://mastodon.social";

if (!twitterBearerToken) {
  throw new Error("Missing Twitter Bearer Token");
}

// Twitter Interfaces
interface TwitterPublicMetrics {
  like_count: number;
  retweet_count: number;
  reply_count: number;
}

interface TwitterEntityHashtag {
  tag: string;
}

interface TwitterEntities {
  hashtags?: TwitterEntityHashtag[];
}

interface TwitterTweet {
  id: string;
  text: string;
  author_id: string;
  created_at: string;
  public_metrics?: TwitterPublicMetrics;
  entities?: TwitterEntities;
}

// Fetch trending tweets filtered for technology-related content
export async function fetchTwitterBuzz(limit = 10): Promise<{
  id: string;
  platform: string;
  content: string;
  author: string;
  hashtags: string[];
  url: string;
  score: number;
  createdAt: string;
}[]> {
  try {
    const url = "https://api.twitter.com/2/tweets/search/recent";
    // Refine the query to include technology-related keywords,
    // exclude retweets, and restrict results to English tweets.
    const query = "(technology OR tech OR #tech) -is:retweet lang:en";
    const params = {
      query,
      max_results: limit,
      "tweet.fields": "author_id,created_at,public_metrics,entities",
    };

    const headers = {
      Authorization: `Bearer ${twitterBearerToken}`,
    };

    const response = await axios.get(url, { params, headers });
    // Log raw response for debugging
    console.log("Twitter raw response:", response.data);

    // Map tweets to the desired shape
    const mappedTweets = response.data.data.map((tweet: TwitterTweet) => {
      const hashtags = tweet.entities?.hashtags
        ? tweet.entities.hashtags.map((tag) => tag.tag.toLowerCase())
        : [];
      const likes = tweet.public_metrics?.like_count || 0;
      const retweets = tweet.public_metrics?.retweet_count || 0;
      const replies = tweet.public_metrics?.reply_count || 0;

      return {
        id: tweet.id,
        platform: "twitter",
        content: tweet.text,
        author: tweet.author_id,
        hashtags,
        url: `https://twitter.com/i/web/status/${tweet.id}`,
        score: likes + retweets + replies,
        createdAt: tweet.created_at,
      };
    });

    // Filter tweets that contain either "tech" or "technology" in content or hashtags
    const techKeywords = ["tech", "technology"];
    return mappedTweets.filter((tweet: any) => {
      const contentLower = tweet.content.toLowerCase();
      return techKeywords.some(
        (keyword) =>
          contentLower.includes(keyword) || tweet.hashtags.includes(keyword)
      );
    });
  } catch (error) {
    console.error("Error fetching Twitter data:", error);
    return [];
  }
}

// Mastodon Interfaces
interface MastodonTag {
  name: string;
}

interface MastodonAccount {
  acct: string;
}

interface MastodonPost {
  id: string;
  content: string;
  account: MastodonAccount;
  tags?: MastodonTag[];
  url: string;
  favourites_count?: number;
  reblogs_count?: number;
  created_at: string;
}

// Fetch trending Mastodon posts and filter for technology-related content
export async function fetchMastodonBuzz(limit = 10): Promise<{
  id: string;
  platform: string;
  content: string;
  author: string;
  hashtags: string[];
  url: string;
  score: number;
  createdAt: string;
}[]> {
  try {
    const url = `${mastodonInstanceUrl}/api/v1/timelines/public`;
    const params = { limit };

    const response = await axios.get(url, { params });

    // Map Mastodon posts to our desired shape
    const mappedPosts = response.data.map((post: MastodonPost) => {
      const hashtags = post.tags ? post.tags.map((tag) => tag.name.toLowerCase()) : [];
      const favorites = post.favourites_count || 0;
      const boosts = post.reblogs_count || 0;

      return {
        id: post.id,
        platform: "mastodon",
        content: post.content,
        author: post.account.acct,
        hashtags,
        url: post.url,
        score: favorites + boosts,
        createdAt: post.created_at,
      };
    });

    // Filter posts to return only those related to technology
    const techKeywords = ["tech", "technology"];
    return mappedPosts.filter((post: any) => {
      const contentLower = post.content.toLowerCase();
      return techKeywords.some(
        (keyword) =>
          contentLower.includes(keyword) || post.hashtags.includes(keyword)
      );
    });
  } catch (error) {
    console.error("Error fetching Mastodon data:", error);
    return [];
  }
}
