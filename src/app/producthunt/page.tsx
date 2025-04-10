"use client"

import React, { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
  Legend,
  ScatterChart,
  Scatter,
  ReferenceLine,
} from "recharts"
import { motion } from "framer-motion"
import {
  ArrowUpCircle,
  Calendar,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Filter,
  Flame,
  Globe,
  MessageSquare,
  Newspaper,
  Search,
  TrendingUp,
  BrainCircuit, // <-- Lucide icon for "Analyze"
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { BackgroundBeams } from "@/components/ui/beams"
import html2canvas from "html2canvas"

// SHADCN/UI Dialog components for the AI insight modal
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

/* ---------------------------------------------------------------------
   Insight Modal State + analyzeProduct() Function
------------------------------------------------------------------------*/
export default function ProductHuntPage() {
  // NEW: insightModal stores whether we show the modal, loading state, and the AI text
  const [insightModal, setInsightModal] = useState<{
    open: boolean
    loading: boolean
    content: string
    product: any
  }>({
    open: false,
    loading: false,
    content: "",
    product: null,
  })

  async function analyzeProduct(product: any) {
    setInsightModal({ open: true, loading: true, content: "", product })
    try {
      const res = await fetch("/api/producthunt/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: product.name, tagline: product.tagline }),
      })

      const json = await res.json()
      setInsightModal({ open: true, loading: false, content: json.insight, product })
    } catch (err) {
      setInsightModal({ open: true, loading: false, content: "Error fetching analysis.", product })
    }
  }

  // ----------------------------------------
  // Inline GadgetNews component
  // ----------------------------------------
  function GadgetNews() {
    const [news, setNews] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
      async function fetchGadgetNews() {
        try {
          setLoading(true)
          const res = await fetch("/api/gadgets")
          if (!res.ok) throw new Error("Failed to fetch gadget news")
          const articles = await res.json()
          setNews(articles.slice(0, 5)) // Take only the first 5 articles
        } catch (err) {
          setError(err instanceof Error ? err.message : "An error occurred")
          console.error("Error fetching gadget news:", err)
        } finally {
          setLoading(false)
        }
      }
      fetchGadgetNews()
    }, [])

    if (loading) {
      return (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 items-start">
              <Skeleton className="h-16 w-16 rounded-md" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      )
    }

    if (error) {
      return (
        <div className="text-center py-4 text-neondark-muted">
          <p>Failed to load gadget news</p>
          <p className="text-sm">{error}</p>
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {news.map((article, index) => (
          <motion.div
            key={index}
            className="p-3 rounded-lg border border-neondark-border bg-neondark-card/50 hover:bg-neondark-card/70 shadow-sm hover:shadow-md transition-all"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex gap-3">
              {article.urlToImage && (
                <div className="flex-shrink-0">
                  <img
                    src={article.urlToImage || "/placeholder.svg"}
                    alt={article.title}
                    className="h-16 w-16 object-cover rounded-md"
                    onError={(e) => {
                      // Replace broken images with a placeholder
                      ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=64&width=64"
                    }}
                  />
                </div>
              )}
              <div>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-cyan-400 hover:text-cyan-300 hover:underline flex items-center"
                >
                  {article.title}
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
                <p className="text-sm text-neondark-muted mt-0.5 line-clamp-2">{article.description}</p>
                <div className="flex items-center mt-1 text-xs text-neondark-muted">
                  <span>{article.source?.name || "Unknown source"}</span>
                  <span className="mx-1">•</span>
                  <span>{formatNewsDate(article.publishedAt)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  function formatNewsDate(dateString: string) {
    if (!dateString) return "Unknown date"
    try {
      const date = new Date(dateString)
      return format(date, "MMM d, yyyy")
    } catch (e) {
      return "Invalid date"
    }
  }

  // ----------------------------------------
  // Main State for Product Hunt
  // ----------------------------------------
  const [data, setData] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [expandedCards, setExpandedCards] = useState<{ [key: string]: boolean }>({
    trending: false,
    recent: false,
  })

  // 1. Ref for "Upvote Distribution" chart container
  const upvoteChartRef = useRef<HTMLDivElement>(null)

  // Fetch data
  useEffect(() => {
    async function fetchProductHuntData() {
      const res = await fetch("/api/producthunt")
      const json = await res.json()
      setData(json)
    }
    fetchProductHuntData()
  }, [])

  const toggleExpand = (card: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [card]: !prev[card],
    }))
  }

  // 2. AUTOMATE chart capture when data is loaded
    // Filter logic
  const processedData = data || []

  // Filter products based on search term and category filter
  const filteredProducts = processedData.filter((product: any) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tagline?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter ? product.topics && product.topics.includes(categoryFilter) : true
    return matchesSearch && matchesCategory
  })

  // Sort by votes (trending)
  const trendingProducts = [...filteredProducts].sort((a, b) => b.votesCount - a.votesCount)
  // Sort by date (recent)
  const recentProducts = [...filteredProducts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  // Extract categories/topics
  const allTopics: string[] = []
  processedData.forEach((product: any) => {
    if (product.topics && Array.isArray(product.topics)) {
      allTopics.push(...product.topics)
    }
  })

  // Count occurrences of each topic
  const topicCounts: { [key: string]: number } = {}
  allTopics.forEach((topic) => {
    topicCounts[topic] = (topicCounts[topic] || 0) + 1
  })

  const topicData = Object.entries(topicCounts)
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // Stats
  const totalProducts = processedData.length
  const totalVotes = processedData.reduce((acc: number, product: any) => acc + (product.votesCount || 0), 0)
  const totalComments = processedData.reduce((acc: number, product: any) => acc + (product.commentsCount || 0), 0)
  const uniqueTopics = [...new Set(allTopics)].length

  // Colors for charts
  const colors = [
    "#00FFFF", // Cyan
    "#00DFDF",
    "#00BFBF",
    "#009F9F",
    "#007F7F",
    "#8884d8", // Purple
    "#82ca9d", // Green
    "#ffc658", // Yellow
    "#ff8042", // Orange
    "#ff5252", // Red
  ]

  return (
    <div className="min-h-screen bg-neondark-bg text-foreground relative overflow-hidden">
      {/* Background gradients */}
      <BackgroundBeams />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.15),transparent_70%)] dark:opacity-100 opacity-30"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--neondark-bg),transparent_20%,transparent_80%,var(--neondark-bg))]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)] dark:opacity-100 opacity-30"></div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="p-6 space-y-8 max-w-7xl mx-auto relative z-10"
      >
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-500 bg-clip-text text-transparent">
              Product Hunt Dashboard
            </h1>
            <p className="text-neondark-muted mt-1">Track trending products, launches, and upvotes</p>
          </motion.div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neondark-muted" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-9 w-[200px] md:w-[260px] bg-neondark-card/50 border-neondark-border"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9 border-neondark-border bg-neondark-card/50">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-neondark-card border-neondark-border">
                <DropdownMenuItem onClick={() => setCategoryFilter(null)}>All Categories</DropdownMenuItem>
                {topicData.map((topic) => (
                  <DropdownMenuItem key={topic.topic} onClick={() => setCategoryFilter(topic.topic)}>
                    {topic.topic} ({topic.count})
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Products"
            value={totalProducts}
            icon={<Globe className="h-4 w-4" />}
            color="bg-cyan-500"
            index={0}
          />
          <StatsCard
            title="Total Upvotes"
            value={totalVotes}
            icon={<ArrowUpCircle className="h-4 w-4" />}
            color="bg-cyan-600"
            index={1}
          />
          <StatsCard
            title="Total Comments"
            value={totalComments}
            icon={<MessageSquare className="h-4 w-4" />}
            color="bg-cyan-700"
            index={2}
          />
          <StatsCard
            title="Categories"
            value={uniqueTopics}
            icon={<TrendingUp className="h-4 w-4" />}
            color="bg-cyan-800"
            index={3}
          />
        </div>

        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-3 bg-neondark-card/50 border border-neondark-border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          {/* ----------------------------------
              OVERVIEW TAB
          ---------------------------------- */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Trending Products */}
              <Card className="bg-neondark-card/80 backdrop-blur-sm border-neondark-border hover:shadow-lg hover:shadow-cyan-900/10 transition-all">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Flame className="h-5 w-5 text-cyan-400" /> Trending Products
                    </CardTitle>
                    {categoryFilter && (
                      <CardDescription className="flex items-center mt-1">
                        Filtered by:
                        <Badge variant="outline" className="ml-2 border-neondark-border">
                          {categoryFilter}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setCategoryFilter(null)}
                            className="h-4 w-4 ml-1 p-0"
                          >
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                        </Badge>
                      </CardDescription>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => toggleExpand("trending")} className="h-8 w-8 p-0">
                    {expandedCards.trending ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CardHeader>
                <CardContent>
                  {trendingProducts.length === 0 ? (
                    <div className="text-center py-8 text-neondark-muted">No products match your search criteria</div>
                  ) : (
                    <ul className="space-y-3">
                      {(expandedCards.trending ? trendingProducts : trendingProducts.slice(0, 5)).map(
                        (product: any, index: number) => (
                          <motion.li
                            key={product.id}
                            className="p-3 rounded-lg border border-neondark-border bg-neondark-card/50 hover:bg-neondark-card/70 shadow-sm hover:shadow-md transition-all"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            whileHover={{ scale: 1.01 }}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-start gap-3">
                                <Avatar className="h-10 w-10 rounded-md">
                                  <AvatarImage src={product.thumbnail || ""} alt={product.name} />
                                  <AvatarFallback className="rounded-md bg-cyan-900/50 text-cyan-300">
                                    {product.name?.charAt(0) || "P"}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <a
                                    href={product.url || `https://www.producthunt.com/posts/${product.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-cyan-400 hover:text-cyan-300 hover:underline flex items-center"
                                  >
                                    {product.name}
                                    <ExternalLink className="ml-1 h-3 w-3" />
                                  </a>
                                  <p className="text-sm text-neondark-muted mt-0.5 line-clamp-2">{product.tagline}</p>
                                </div>
                              </div>
                              <div className="flex flex-col gap-1 items-end">
                                <Badge
                                  variant="secondary"
                                  className="ml-2 flex items-center gap-1 bg-cyan-900/30 text-cyan-300"
                                >
                                  <ArrowUpCircle className="h-3 w-3 text-cyan-400" />
                                  {product.votesCount}
                                </Badge>
                                {/* The new Analyze button */}
                                <Button variant="ghost" size="sm" onClick={() => analyzeProduct(product)}>
                                  <BrainCircuit className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            {product.topics && product.topics.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2 ml-[52px]">
                                {product.topics.map((topic: string) => (
                                  <Badge
                                    key={topic}
                                    variant="outline"
                                    className="text-xs bg-cyan-900/20 text-cyan-400 hover:bg-cyan-900/40 cursor-pointer border-cyan-800/50"
                                    onClick={() => setCategoryFilter(topic)}
                                  >
                                    {topic}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </motion.li>
                        ),
                      )}
                    </ul>
                  )}
                  {!expandedCards.trending && trendingProducts.length > 5 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpand("trending")}
                      className="w-full mt-3 hover:bg-cyan-900/20 hover:text-cyan-400"
                    >
                      View all {trendingProducts.length} products
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Recent Products */}
              <Card className="bg-neondark-card/80 backdrop-blur-sm border-neondark-border hover:shadow-lg hover:shadow-cyan-900/10 transition-all">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-cyan-400" /> Recent Launches
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => toggleExpand("recent")} className="h-8 w-8 p-0">
                    {expandedCards.recent ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CardHeader>
                <CardContent>
                  {recentProducts.length === 0 ? (
                    <div className="text-center py-8 text-neondark-muted">No products match your search criteria</div>
                  ) : (
                    <ul className="space-y-3">
                      {(expandedCards.recent ? recentProducts : recentProducts.slice(0, 5)).map(
                        (product: any, index: number) => (
                          <motion.li
                            key={product.id}
                            className="p-3 rounded-lg border border-neondark-border bg-neondark-card/50 hover:bg-neondark-card/70 shadow-sm hover:shadow-md transition-all"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            whileHover={{ scale: 1.01 }}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-start gap-3">
                                <Avatar className="h-10 w-10 rounded-md">
                                  <AvatarImage src={product.thumbnail || ""} alt={product.name} />
                                  <AvatarFallback className="rounded-md bg-cyan-900/50 text-cyan-300">
                                    {product.name?.charAt(0) || "P"}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <a
                                    href={product.url || `https://www.producthunt.com/posts/${product.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-cyan-400 hover:text-cyan-300 hover:underline flex items-center"
                                  >
                                    {product.name}
                                    <ExternalLink className="ml-1 h-3 w-3" />
                                  </a>
                                  <p className="text-sm text-neondark-muted mt-0.5 line-clamp-2">{product.tagline}</p>
                                </div>
                              </div>
                              <div className="flex flex-col items-end">
                                <Badge
                                  variant="secondary"
                                  className="flex items-center gap-1 bg-cyan-900/30 text-cyan-300"
                                >
                                  <ArrowUpCircle className="h-3 w-3 text-cyan-400" />
                                  {product.votesCount}
                                </Badge>
                                <span className="text-xs text-neondark-muted mt-1">
                                  {formatDate(product.createdAt)}
                                </span>
                                {/* The Analyze button */}
                                <Button variant="ghost" size="sm" onClick={() => analyzeProduct(product)} className="mt-1">
                                  <BrainCircuit className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </motion.li>
                        ),
                      )}
                    </ul>
                  )}
                  {!expandedCards.recent && recentProducts.length > 5 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpand("recent")}
                      className="w-full mt-3 hover:bg-cyan-900/20 hover:text-cyan-400"
                    >
                      View all {recentProducts.length} products
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Gadget News */}
            <Card className="bg-neondark-card/80 backdrop-blur-sm border-neondark-border hover:shadow-lg hover:shadow-cyan-900/10 transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Newspaper className="h-5 w-5 text-cyan-400" /> Latest Gadget News
                </CardTitle>
              </CardHeader>
              <CardContent>
                <GadgetNews />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ----------------------------------
              ALL PRODUCTS TAB
          ---------------------------------- */}
          <TabsContent value="products" className="space-y-6">
            <Card className="bg-neondark-card/80 backdrop-blur-sm border-neondark-border hover:shadow-lg hover:shadow-cyan-900/10 transition-all">
              <CardHeader>
                <CardTitle>All Products</CardTitle>
                {categoryFilter && (
                  <CardDescription className="flex items-center mt-1">
                    Filtered by:
                    <Badge variant="outline" className="ml-2 border-neondark-border">
                      {categoryFilter}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCategoryFilter(null)}
                        className="h-4 w-4 ml-1 p-0"
                      >
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </Badge>
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-8 text-neondark-muted">No products match your search criteria</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredProducts.map((product: any, index: number) => (
                      <motion.div
                        key={product.id}
                        className="p-4 rounded-lg border border-neondark-border bg-neondark-card/50 hover:bg-neondark-card/70 shadow-sm hover:shadow-md transition-all"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-12 w-12 rounded-md">
                            <AvatarImage src={product.thumbnail || ""} alt={product.name} />
                            <AvatarFallback className="rounded-md bg-cyan-900/50 text-cyan-300">
                              {product.name?.charAt(0) || "P"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <a
                                href={product.url || `https://www.producthunt.com/posts/${product.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-cyan-400 hover:text-cyan-300 hover:underline flex items-center"
                              >
                                {product.name}
                                <ExternalLink className="ml-1 h-3 w-3" />
                              </a>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="secondary"
                                  className="flex items-center gap-1 bg-cyan-900/30 text-cyan-300"
                                >
                                  <ArrowUpCircle className="h-3 w-3 text-cyan-400" />
                                  {product.votesCount}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="flex items-center gap-1 border-neondark-border"
                                >
                                  <MessageSquare className="h-3 w-3" />
                                  {product.commentsCount || 0}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-neondark-muted mt-1">{product.tagline}</p>
                            {product.topics && product.topics.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {product.topics.map((topic: string) => (
                                  <Badge
                                    key={topic}
                                    variant="outline"
                                    className="text-xs bg-cyan-900/20 text-cyan-400 hover:bg-cyan-900/40 cursor-pointer border-cyan-800/50"
                                    onClick={() => setCategoryFilter(topic)}
                                  >
                                    {topic}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            <div className="flex justify-between items-center mt-2">
                              {product.maker && (
                                <div className="flex items-center">
                                  <Avatar className="h-5 w-5 mr-1">
                                    <AvatarImage src={product.maker.imageUrl || ""} />
                                    <AvatarFallback className="bg-cyan-900/50 text-cyan-300">
                                      {product.maker.name?.charAt(0) || "M"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs text-neondark-muted">
                                    {product.maker.name || "Maker"}
                                  </span>
                                </div>
                              )}
                              <span className="text-xs text-neondark-muted">{formatDate(product.createdAt)}</span>
                            </div>
                            {/* The Analyze with AI button for each product */}
                            <div className="mt-2 flex items-center justify-between">
                              <Button variant="ghost" size="sm" onClick={() => analyzeProduct(product)}>
                                <BrainCircuit className="h-4 w-4 mr-1" />
                                Analyze
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ----------------------------------
              TRENDS TAB (DEFAULT)
          ---------------------------------- */}
          <div
            id="chart-screenshot-clone"
            style={{
              width: 600,
              height: 300,
              position: "absolute",
              top: -9999,
              left: -9999,
              backgroundColor: "var(--neondark-bg)",
              color: "#fff",
              padding: "16px",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={generateUpvoteDistributionData(processedData)}>
                <CartesianGrid stroke="#444" />
                <XAxis dataKey="range" stroke="#fff" />
                <YAxis stroke="#fff" />
                <RechartsTooltip />
                <Bar dataKey="count" fill="#00FFFF" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* UPVOTE DISTRIBUTION CHART */}
              <Card className="bg-neondark-card/80 backdrop-blur-sm border-neondark-border hover:shadow-lg hover:shadow-cyan-900/10 transition-all">
                <CardHeader>
                  <CardTitle>Upvote Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div ref={upvoteChartRef} className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={generateUpvoteDistributionData(processedData)}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                        <XAxis dataKey="range" />
                        <YAxis />
                        <RechartsTooltip formatter={(value) => [`${value} products`]} />
                        <Bar dataKey="count" fill="#00FFFF" radius={[4, 4, 0, 0]}>
                          {generateUpvoteDistributionData(processedData).map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-neondark-card/80 backdrop-blur-sm border-neondark-border hover:shadow-lg hover:shadow-cyan-900/10 transition-all">
                <CardHeader>
                  <CardTitle>Most Upvoted Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[300px] overflow-auto pr-2">
                    {trendingProducts.slice(0, 10).map((product: any, index: number) => (
                      <motion.div
                        key={product.id}
                        className="p-3 rounded-lg border border-neondark-border bg-neondark-card/50 hover:bg-neondark-card/70 shadow-sm hover:shadow-md transition-all"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-3">
                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-cyan-900/50 text-cyan-300 font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <a
                                href={product.url || `https://www.producthunt.com/posts/${product.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-cyan-400 hover:text-cyan-300 hover:underline flex items-center"
                              >
                                {product.name}
                                <ExternalLink className="ml-1 h-3 w-3" />
                              </a>
                              <p className="text-sm text-neondark-muted mt-0.5 line-clamp-1">{product.tagline}</p>
                            </div>
                          </div>
                          <Badge
                            variant="secondary"
                            className="ml-2 flex items-center gap-1 bg-cyan-900/30 text-cyan-300"
                          >
                            <ArrowUpCircle className="h-3 w-3 text-cyan-400" />
                            {product.votesCount}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upvote to Comment Ratio */}
            <Card className="bg-neondark-card/80 backdrop-blur-sm border-neondark-border hover:shadow-lg hover:shadow-cyan-900/10 transition-all">
              <CardHeader>
                <CardTitle>Upvote to Comment Ratio</CardTitle>
                <CardDescription>Higher ratio indicates more passive engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        type="number"
                        dataKey="commentsCount"
                        name="Comments"
                        label={{ value: "Comments", position: "insideBottomRight", offset: -5 }}
                      />
                      <YAxis
                        type="number"
                        dataKey="votesCount"
                        name="Upvotes"
                        label={{ value: "Upvotes", angle: -90, position: "insideLeft" }}
                      />
                      <RechartsTooltip
                        cursor={{ strokeDasharray: "3 3" }}
                        formatter={(value, name, props) => {
                          if (name === "Upvotes" || name === "Comments") return [value, name]
                          return [props.payload.name, "Product"]
                        }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="bg-neondark-card p-2 border border-neondark-border rounded shadow-sm">
                                <p className="font-medium text-cyan-400">{data.name}</p>
                                <p className="text-sm text-neondark-muted">{data.tagline}</p>
                                <div className="flex justify-between gap-4 mt-1">
                                  <p>Upvotes: {data.votesCount}</p>
                                  <p>Comments: {data.commentsCount}</p>
                                </div>
                                <p className="text-xs mt-1">
                                  Ratio: {(data.votesCount / (data.commentsCount || 1)).toFixed(2)}
                                </p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Scatter
                        name="Products"
                        data={processedData.filter((p: any) => p.votesCount > 0)}
                        fill="#00FFFF"
                        shape={(props: any) => {
                          const { cx, cy } = props
                          const size = Math.min(Math.max(props.payload.votesCount / 50, 4), 15)
                          return <circle cx={cx} cy={cy} r={size} fill="#00FFFF" fillOpacity={0.7} />
                        }}
                      />
                      <ReferenceLine y={0} stroke="#666" />
                      <ReferenceLine x={0} stroke="#666" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Launch Day Performance */}
            <Card className="bg-neondark-card/80 backdrop-blur-sm border-neondark-border hover:shadow-lg hover:shadow-cyan-900/10 transition-all">
              <CardHeader>
                <CardTitle>Launch Day Performance</CardTitle>
                <CardDescription>Comparing upvotes by day of week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={generateLaunchDayData(processedData)}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                      <XAxis dataKey="day" />
                      <YAxis yAxisId="left" orientation="left" stroke="#00FFFF" />
                      <YAxis yAxisId="right" orientation="right" stroke="#8884d8" />
                      <RechartsTooltip />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="avgUpvotes"
                        name="Avg Upvotes"
                        fill="#00FFFF"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="productCount"
                        name="Product Count"
                        fill="#8884d8"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.section>

      {/* ----------------------------------------
          AI Insight Modal
      ---------------------------------------- */}
    

    <Dialog
      open={insightModal.open}
      onOpenChange={(open) => setInsightModal((prev) => ({ ...prev, open }))}
    >
      <DialogContent className="bg-black p-4 rounded-lg border border-cyan-400 max-w-xl shadow-lg shadow-cyan-400/20">
        <DialogHeader>
          <DialogTitle className="text-cyan-400 font-bold">AI Insight</DialogTitle>
          <DialogDescription className="text-xs text-cyan-600">
            A concise analysis generated by our AI
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 min-h-[80px] text-sm text-cyan-50">
          {insightModal.loading ? (
            <div className="text-cyan-300">Loading AI analysis...</div>
          ) : (
            insightModal.content
          )}
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            className="text-cyan-400 border-cyan-700 hover:bg-cyan-950 hover:border-cyan-400 transition-all duration-300"
            onClick={() => setInsightModal({ ...insightModal, open: false })}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </div>
  )
}

/* ----------------------------------------
   Stats Card Component
---------------------------------------- */
function StatsCard({
  title,
  value,
  icon,
  color,
  index,
}: {
  title: string
  value: number
  icon: React.ReactNode
  color: string
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="bg-neondark-card/80 backdrop-blur-sm border-neondark-border hover:shadow-lg hover:shadow-cyan-900/10 transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className={`${color} p-2 rounded-full text-white`}>{icon}</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

/* ----------------------------------------
   Helper: formatDate
---------------------------------------- */
function formatDate(dateString: string) {
  if (!dateString) return "Unknown date"
  try {
    const date = new Date(dateString)
    return format(date, "MMM d, yyyy")
  } catch (e) {
    return "Invalid date"
  }
}

/* ----------------------------------------
   Helper: Upvote distribution
---------------------------------------- */
function generateUpvoteDistributionData(products: any[]) {
  const ranges = [
    { min: 0, max: 10, label: "0-10" },
    { min: 11, max: 50, label: "11-50" },
    { min: 51, max: 100, label: "51-100" },
    { min: 101, max: 500, label: "101-500" },
    { min: 501, max: 1000, label: "501-1000" },
    { min: 1001, max: Number.POSITIVE_INFINITY, label: "1000+" },
  ]

  const distribution = ranges.map((range) => ({
    range: range.label,
    count: products.filter((p) => p.votesCount >= range.min && p.votesCount <= range.max).length,
  }))

  return distribution
}

/* ----------------------------------------
   Helper: Launch Day Data
---------------------------------------- */
function generateLaunchDayData(products: any[]) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const dayStats = days.map((day) => ({
    day,
    totalUpvotes: 0,
    productCount: 0,
    avgUpvotes: 0,
  }))

  products.forEach((product) => {
    if (product.createdAt) {
      const createdDate = new Date(product.createdAt)
      const dayOfWeek = createdDate.getDay()
      dayStats[dayOfWeek].totalUpvotes += product.votesCount || 0
      dayStats[dayOfWeek].productCount += 1
    }
  })

  dayStats.forEach((day) => {
    day.avgUpvotes = day.productCount > 0 ? Math.round(day.totalUpvotes / day.productCount) : 0
  })

  return dayStats
}
