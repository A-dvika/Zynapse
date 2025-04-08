"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"

interface Recommendation {
  id: string
  title: string
  description: string
  url: string
  source: string
  type: string
  relevanceScore: number
  publishedAt: string
  imageUrl?: string
}

interface DynamicSourceContentProps {
  source: string
}

export default function DynamicSourceContent({ source }: DynamicSourceContentProps) {
  const [content, setContent] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSourceContent() {
      try {
        setLoading(true)
        const res = await fetch(`/api/for-you?source=${source}`)
        if (res.ok) {
          const data = await res.json()
          setContent(data)
        }
      } catch (error) {
        console.error(`Error fetching ${source} content:`, error)
      } finally {
        setLoading(false)
      }
    }

    fetchSourceContent()
  }, [source])

  function getContentTypeIcon(type: string) {
    // This is a simplified version - you should import and use the same function from your dashboard page
    switch (type?.toLowerCase?.()) {
      case "article":
      case "articles":
        return <span className="i-lucide-book-open h-4 w-4" />
      case "video":
      case "videos":
        return <span className="i-lucide-video h-4 w-4" />
      case "tutorial":
      case "tutorials":
        return <span className="i-lucide-code h-4 w-4" />
      case "podcast":
      case "podcasts":
        return <span className="i-lucide-headphones h-4 w-4" />
      case "news":
        return <span className="i-lucide-newspaper h-4 w-4" />
      case "repo":
      case "repository":
      case "repositories":
        return <span className="i-lucide-github h-4 w-4" />
      case "course":
        return <span className="i-lucide-book-open h-4 w-4" />
      default:
        return <span className="i-lucide-globe h-4 w-4" />
    }
  }

  function formatDate(dateString: string) {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  function getRelevanceBadgeColor(score: number) {
    if (score >= 95) return "bg-green-500/20 text-green-400 hover:bg-green-500/30"
    if (score >= 90) return "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
    if (score >= 85) return "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
    if (score >= 80) return "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
    return "bg-gray-500/20 text-gray-400 hover:bg-gray-500/30"
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-neondark-card/80 backdrop-blur-sm border-neondark-border">
            <CardHeader className="pb-2">
              <div className="h-6 w-24 bg-neondark-muted/20 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 w-full bg-neondark-muted/20 rounded animate-pulse"></div>
                <div className="h-4 w-3/4 bg-neondark-muted/20 rounded animate-pulse"></div>
                <div className="h-4 w-5/6 bg-neondark-muted/20 rounded animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (content.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neondark-muted">No content found for {source}.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {content.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
          className="h-full"
        >
          <Card className="h-full bg-neondark-card/80 backdrop-blur-sm border-neondark-border">
            {item.imageUrl && (
              <div className="w-full h-40 overflow-hidden">
                <img
                  src={item.imageUrl || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <div className="flex justify-between items-start">
                <Badge className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 flex items-center">
                  {getContentTypeIcon(item.type)}
                  <span className="ml-1 capitalize">{item.type}</span>
                </Badge>
                <span className="text-xs text-neondark-muted">{formatDate(item.publishedAt)}</span>
              </div>
              <CardTitle className="text-xl mt-2">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neondark-muted mb-4 line-clamp-3">{item.description}</p>
              <div className="flex justify-between items-center">
                <Badge className={getRelevanceBadgeColor(item.relevanceScore)}>{item.relevanceScore}% Match</Badge>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center"
                >
                  View <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
