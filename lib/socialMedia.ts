import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';

const twitterBearerToken = process.env.TWITTER_BEARER_TOKEN;
if (!twitterBearerToken) {
  throw new Error('Missing Twitter Bearer Token');
}


interface TwitterPublicMetrics {
  like_count: number;
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
  const url = 'https://api.twitter.com/2/tweets/search/recent';
  const query = 'technology OR tech OR #tech'; 
  const params = {
    query,
    max_results: limit,
    'tweet.fields': 'author_id,created_at,public_metrics,entities',
  };

  const headers = {
    Authorization: `Bearer ${twitterBearerToken}`,
  };

  const response = await axios.get(url, { params, headers });
  return response.data.data.map((tweet: TwitterTweet) => {
    const hashtags =
      tweet.entities && tweet.entities.hashtags
        ? tweet.entities.hashtags.map((tag) => tag.tag)
        : [];
    return {
      id: tweet.id,
      platform: 'twitter',
      content: tweet.text,
      author: tweet.author_id, 
      hashtags,
      url: `https://twitter.com/i/web/status/${tweet.id}`,
      score: tweet.public_metrics ? tweet.public_metrics.like_count : 0,
      createdAt: tweet.created_at,
    };
  });
}


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
  created_at: string;
}


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
  const instanceUrl = process.env.MASTODON_INSTANCE_URL || 'https://mastodon.social';
  const url = `${instanceUrl}/api/v1/timelines/public`;
  const params = { limit };

  const response = await axios.get(url, { params });
  return response.data.map((post: MastodonPost) => {
    const hashtags = post.tags ? post.tags.map((tag) => tag.name) : [];
    return {
      id: post.id,
      platform: 'mastodon',
      content: post.content, 
      author: post.account.acct,
      hashtags,
      url: post.url,
      score: post.favourites_count || 0,
      createdAt: post.created_at,
    };
  });
}
