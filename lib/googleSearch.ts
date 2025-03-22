import axios from "axios";

export async function fetchGoogleSearchResults(query: string, limit = 3) {
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
    const response = await axios.get(url, { params });
    const items = response.data.items || [];
    return items.slice(0, limit).map((item: any) => ({
      title: item.title,
      snippet: item.snippet,
      link: item.link,
    }));
  } catch (error: any) {
    console.error(
      "Error in Google Custom Search:",
      error.response?.data || error.message
    );
    return [];
  }
}
