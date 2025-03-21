import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';

const twitterBearerToken = process.env.TWITTER_BEARER_TOKEN;
if (!twitterBearerToken) {
  throw new Error('Missing Twitter Bearer Token');
}

/**
 * Fetches recent tweets that mention technology.
 * Adjust the query string if needed.
 */
export async function fetchTwitterBuzz(limit = 10): Promise<any[]> {
  const url = 'https://api.twitter.com/2/tweets/search/recent';
  const query = 'technology OR tech OR #tech'; // Modify as needed for better results
  const params = {
    query,
    max_results: limit,
    'tweet.fields': 'author_id,created_at,public_metrics,entities',
  };

  const headers = {
    Authorization: `Bearer ${twitterBearerToken}`,
  };

  const response = await axios.get(url, { params, headers });
  return response.data.data.map((tweet: any) => {
    const hashtags =
      tweet.entities && tweet.entities.hashtags
        ? tweet.entities.hashtags.map((tag: any) => tag.tag)
        : [];
    return {
      id: tweet.id,
      platform: 'twitter',
      content: tweet.text,
      author: tweet.author_id, // For a full username lookup, you may need an additional API call
      hashtags,
      url: `https://twitter.com/i/web/status/${tweet.id}`,
      score: tweet.public_metrics ? tweet.public_metrics.like_count : 0,
      createdAt: tweet.created_at,
    };
  });
}

/**
 * Fetches recent public posts from a Mastodon instance.
 */
export async function fetchMastodonBuzz(limit = 10): Promise<any[]> {
  const instanceUrl = process.env.MASTODON_INSTANCE_URL || 'https://mastodon.social';
  const url = `${instanceUrl}/api/v1/timelines/public`;
  const params = { limit };

  const response = await axios.get(url, { params });
  return response.data.map((post: any) => {
    const hashtags = post.tags ? post.tags.map((tag: any) => tag.name) : [];
    return {
      id: post.id,
      platform: 'mastodon',
      content: post.content, // May contain HTML—consider sanitizing if displaying raw content
      author: post.account.acct,
      hashtags,
      url: post.url,
      score: post.favourites_count || 0,
      createdAt: post.created_at,
    };
  });
}
