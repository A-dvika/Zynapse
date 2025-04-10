import { NextRequest, NextResponse } from "next/server"

import { fetchGoogleSearchResults } from "../../../../../lib/googleSearch"
import { generateSummary } from "../../../../../lib/ai"

export async function POST(req: NextRequest) {
  try {
    const { name, tagline } = await req.json()

    if (!name || !tagline) {
      return NextResponse.json({ error: "Missing product name or tagline" }, { status: 400 })
    }

    // 1. Search Google for more context
    const searchResults = await fetchGoogleSearchResults(`${name} product`)
    const contextSnippets = searchResults.map((r) => `- ${r.snippet}`).join("\n")

    // 2. Build Gemini prompt
    const prompt = `
You are an expert product analyst.

Here's the core info:
Name: ${name}
Tagline: ${tagline}

Additional context from Google:
${contextSnippets}

Analyze the product and provide a concise 5–7 line insight including:
- What problem it solves
- Target users
- Differentiation or uniqueness
- Monetization angle (if any)
- Launch potential or challenges

Be insightful, clear, and use engaging tone.
`

    // 3. Call Gemini
    const summary = await generateSummary(prompt)

    return NextResponse.json({ insight: summary.trim() })
  } catch (error) {
    console.error("Error analyzing product:", error)
    return NextResponse.json({ error: "Failed to analyze product" }, { status: 500 })
  }
}
