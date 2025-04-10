import { NextRequest, NextResponse } from "next/server"
import { generateSummary } from "../../../../../lib/ai"
import { fetchGoogleSearchResults } from "../../../../../lib/googleSearch"


export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, author, url, points, comments } = body

    if (!title || !author) {
      console.error("Missing fields:", { title, author })
      return NextResponse.json({ error: "Missing title or author" }, { status: 400 })
    }

    const searchResults = await fetchGoogleSearchResults(title)
    const contextSnippets = searchResults.map((r) => `- ${r.snippet}`).join("\n")

    const prompt = `
You're an expert tech analyst. Analyze the following Hacker News story.

Title: ${title}
Author: ${author}
URL: ${url || "No URL provided"}
Points: ${points}
Comments: ${comments}

Additional Google snippets:
${contextSnippets}

Provide a short, clear 5-line insight including:
- What the story is about
- Why it's getting attention
- Technical or market relevance
- Community sentiment (if inferred)
- Any opportunities or risks
`

    const insight = await generateSummary(prompt)

    return NextResponse.json({ insight: insight.trim() })
  } catch (err) {
    console.error("Error analyzing HN story:", err)
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 })
  }
}
