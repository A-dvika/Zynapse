// lib/googleSearch.ts
import axios from "axios";

interface GoogleSearchItem {
  title: string;
  snippet: string;
  link: string;
}

interface GoogleSearchResponse {
  items?: GoogleSearchItem[];
}

export async function fetchGoogleSearchResults(query: string, limit = 3): Promise<GoogleSearchItem[]> {
  const apiKey = process.env.GOOGLE_API_KEY;
  const cseId = process.env.GOOGLE_CSE_ID;

  if (!apiKey || !cseId) {
    throw new Error("Missing GOOGLE_API_KEY or GOOGLE_CSE_ID environment vars.");
  }

  const url = "https://www.googleapis.com/customsearch/v1";
  const params = {
    key: apiKey,
    cx: cseId,
    q: query,
  };

  // Log the parameters to verify what is being sent
  console.log("Google Search Params:", params);

  try {
    const response = await axios.get<GoogleSearchResponse>(url, { params });
    const items = response.data.items || [];
    return items.slice(0, limit).map((item: GoogleSearchItem) => ({
      title: item.title,
      snippet: item.snippet,
      link: item.link,
    }));
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error in Google Custom Search:", error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error("Error in Google Custom Search:", error.message);
    } else {
      console.error("Error in Google Custom Search:", error);
    }
    return [];
  }
}
