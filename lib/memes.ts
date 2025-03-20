// lib/memes.ts

import axios from "axios";

/**
 * Fetch meme posts from Reddit.
 */
export async function fetchRedditMemes(): Promise<any[]> {
  const subreddits = ["memes", "dankmemes", "wholesomememes"];
  let memes: any[] = [];

  for (const subreddit of subreddits) {
    try {
      const response = await axios.get(
        `https://www.reddit.com/r/${subreddit}/hot.json?limit=10`
      );
      const posts = response.data.data.children
        .map((child: any) => child.data)
        .filter((post: any) => post.post_hint === "image"); // Only posts with images

      memes = memes.concat(
        posts.map((post: any) => ({
          id: post.id,
          platform: "reddit",
          title: post.title,
          caption: post.selftext || null,
          imageUrl: post.url_overridden_by_dest,
          upvotes: post.ups,
          link: `https://reddit.com${post.permalink}`,
          createdAt: new Date(post.created_utc * 1000).toISOString(),
        }))
      );
    } catch (error) {
      console.error(
        `Error fetching memes from subreddit ${subreddit}:`,
        error
      );
    }
  }

  return memes;
}

/**
 * Fetch meme posts from Twitter using Twitter API v2.
 */
export async function fetchTwitterMemes(): Promise<any[]> {
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
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${bearerToken}` },
      params,
    });
    const tweets = response.data.data || [];
    const mediaMap: Record<string, any> = {};
    if (response.data.includes && response.data.includes.media) {
      for (const media of response.data.includes.media) {
        mediaMap[media.media_key] = media;
      }
    }

    const memes = tweets
      .map((tweet: any) => {
        const mediaKey = tweet.attachments?.media_keys?.[0];
        const media = mediaKey ? mediaMap[mediaKey] : null;
        if (!media || !media.url) return null;
        return {
          id: tweet.id,
          platform: "twitter",
          title: tweet.text.slice(0, 100), // Use the first 100 characters as title
          caption: null,
          imageUrl: media.url,
          upvotes: tweet.public_metrics
            ? tweet.public_metrics.like_count
            : 0,
          link: `https://twitter.com/i/web/status/${tweet.id}`,
          createdAt: new Date(tweet.created_at).toISOString(),
        };
      })
      .filter((meme: any) => meme !== null);

    return memes;
  } catch (error) {
    console.error("Error fetching Twitter memes:", error);
    return [];
  }
}

/**
 * Fetch meme posts from Instagram.
 * 
 * Note: This is a stub function. Instagram API access is limited, so replace this
 * with real integration if you have access to the Instagram Graph API or another service.
 */
export async function fetchInstagramMemes(): Promise<any[]> {
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

/**
 * Aggregate memes from all sources.
 */
export async function fetchAllMemes(): Promise<any[]> {
  const [redditMemes, twitterMemes, instagramMemes] = await Promise.all([
    fetchRedditMemes(),
    fetchTwitterMemes(),
    fetchInstagramMemes(),
  ]);

  return [...redditMemes, ...twitterMemes, ...instagramMemes];
}
