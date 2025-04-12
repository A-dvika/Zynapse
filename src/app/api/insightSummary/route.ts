import { NextRequest, NextResponse } from "next/server";
import { generateEmbedding } from "../../../../lib/embedding";
import { generateSummary } from "../../../../lib/ai";
import { index2 } from "../../../../lib/pinecone";
import { redisClient } from "../../../../lib/cache";

// ----------------------------------------------------------------------
// Interfaces & Helper Types
// ----------------------------------------------------------------------

interface PineconeMatch {
  metadata?: {
    text?: string;
    title?: string;
    summary?: string;
    tags?: any; // To handle arrays or other types.
    url?: string;
    link?: string;
    [key: string]: any;
  };
  score?: number;
}

interface Insight {
  title: string;
  summary: string;
  url: string;
}

// ----------------------------------------------------------------------
// Helper Function: Try to generate a summary for external items.
// Fallback to a truncated content string on failure.
async function tryGenerateSummary(prompt: string, content: string): Promise<string> {
  try {
    const res = await generateSummary(prompt);
    return res.trim();
  } catch (error: any) {
    console.error("Error in external summarization:", error);
    return content.substring(0, 120) + (content.length > 120 ? "..." : "");
  }
}

// ----------------------------------------------------------------------
// External Sources: Product Hunt Insights
// ----------------------------------------------------------------------

async function getProductHuntInsights(): Promise<Insight[]> {
  try {
    // Fetch Product Hunt data – adjust this URL as needed.
    const res = await fetch("http://localhost:3000/api/producthunt");
    const data = await res.json();
    const items = Array.isArray(data) ? data : data.items || [];
    // Process at most 3 items.
    const limitedItems = items.slice(0, 3);
    const insights: Insight[] = await Promise.all(
      limitedItems.map(async (item: any) => {
        const title = item.name || item.title || "Untitled";
        const url = item.url || "";
        const content = item.tagline || item.description || "";
        const prompt = `
You are a tech analyst. Summarize the following product description into a single concise sentence (max 120 characters) that highlights its most innovative aspect.

Content:
${content}

Summary:
        `;
        const summary = await tryGenerateSummary(prompt, content);
        return { title, summary, url };
      })
    );
    return insights;
  } catch (error) {
    console.error("Error fetching Product Hunt insights:", error);
    return [];
  }
}

// ----------------------------------------------------------------------
// External Sources: Hacker News Insights
// ----------------------------------------------------------------------

async function getHackerNewsInsights(): Promise<Insight[]> {
  try {
    // Fetch Hacker News data – adjust URL as needed.
    const res = await fetch("http://localhost:3000/api/hackernews");
    const data = await res.json();
    const stories = data.hackerNewsStories || data;
    const limitedStories = Array.isArray(stories) ? stories.slice(0, 3) : [];
    
    const insights: Insight[] = await Promise.all(
      limitedStories.map(async (story: any) => {
        const title = story.title || "Untitled";
        const url = story.url || "";
        const content = story.snippet || story.description || title;
        const prompt = `
You are a tech analyst. Summarize the following news excerpt into a single concise sentence (max 120 characters) that captures the key point.

Content:
${content}

Summary:
        `;
        const summary = await tryGenerateSummary(prompt, content);
        return { title, summary, url };
      })
    );
    return insights;
  } catch (error) {
    console.error("Error fetching Hacker News insights:", error);
    return [];
  }
}

// ----------------------------------------------------------------------
// Main API Route with Caching
// ----------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    // Parse incoming request and check for a query.
    const { query } = await request.json();
    if (!query) {
      return NextResponse.json({ error: "Query not provided." }, { status: 400 });
    }

    // Use the query as the cache key.
    const cacheKey = `insights:${query}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return NextResponse.json({ insights: JSON.parse(cached) });
    }

    // Generate an embedding from the query.
    const queryEmbedding = await generateEmbedding(query);

    // Query Pinecone for the top 5 matches.
    const pineconeResponse = await index2.query({
      vector: queryEmbedding,
      topK: 5,
      includeMetadata: true,
    });
    const matches = (pineconeResponse.matches as PineconeMatch[]) || [];
    let pineconeInsights: Insight[] = [];
    if (matches.length > 0) {
      // Optionally filter by score threshold.
      const filteredMatches = matches.filter(match => match.score && match.score > 0.2);
      pineconeInsights = await Promise.all(
        filteredMatches.map(async (match) => {
          const meta = match.metadata || {};
          let sourceContent = "";
          if (meta.text && typeof meta.text === "string" && meta.text.trim().length > 0) {
            sourceContent = meta.text.trim();
          } else {
            const titleContent = meta.title ? meta.title.trim() : "";
            const summaryContent = meta.summary ? meta.summary.trim() : "";
            const tagsContent =
              meta.tags
                ? Array.isArray(meta.tags)
                  ? meta.tags.join(", ").trim()
                  : meta.tags.toString().trim()
                : "";
            sourceContent = [titleContent, summaryContent, tagsContent].filter(Boolean).join("\n");
          }
          const title = meta.title ? meta.title.trim() : "Untitled";
          const url = meta.url || meta.link || "";
          const prompt = `
You are a skilled tech analyst. Please create a single-sentence summary (max 120 characters) that captures the most critical insight from the following content:

Content:
${sourceContent}

Summary:
          `;
          const summaryResult = await generateSummary(prompt);
          const summary = summaryResult.trim();
          return { title, summary, url };
        })
      );
    }

    // Get insights from external sources.
    const [productHuntInsights, hackerNewsInsights] = await Promise.all([
      getProductHuntInsights(),
      getHackerNewsInsights(),
    ]);

    // Merge all insights.
    const allInsights: Insight[] = [
      ...pineconeInsights,
      ...productHuntInsights,
      ...hackerNewsInsights,
    ];

    // Optionally, sort or de-duplicate insights here.

    // Cache the result for 1 hour (3600 seconds).
    await redisClient.set(cacheKey, JSON.stringify(allInsights), { EX: 3600 });

    return NextResponse.json({ insights: allInsights });
  } catch (error: any) {
    console.error("Error generating insights:", error);
    return NextResponse.json({ error: "Failed to generate insights." }, { status: 500 });
  }
}
