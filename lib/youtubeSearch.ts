// src/lib/youtubeSearch.ts
import axios from "axios";

export async function fetchYoutubeResults(query: string, limit = 3) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing YOUTUBE_API_KEY environment variable.");
  }

  const url = "https://www.googleapis.com/youtube/v3/search";
  const params = {
    part: "snippet",
    q: query,
    type: "video",
    maxResults: limit,
    key: apiKey,
  };

  try {
    const response = await axios.get(url, { params });
    const items = response.data.items || [];
    return items.map((item: { snippet: { title: string; description: string }; id: { videoId: string } }) => ({
      title: item.snippet.title,
      description: item.snippet.description,
      videoId: item.id.videoId,
      link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    }));
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching YouTube results:",
        error.response?.data || error.message
      );
    } else {
      console.error("Error fetching YouTube results:", error);
    }
    return [];
  }
}
