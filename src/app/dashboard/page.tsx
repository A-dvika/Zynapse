"use client"

import { useState, useEffect, useMemo } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Newspaper,
  Github,
  Code,
  BookOpen,
  Video,
  Headphones,
  Globe,
  Sparkles,
  ExternalLink,
  MessageSquare,
  Star,
  GitFork,
  Eye,
  Activity,
  TrendingUp,
  BarChart,
  Calendar,
  Filter,
  Settings,
  ChevronRight,
  Zap,
  Lightbulb,
  Compass,
  Award,
  Layers,
  PieChart,
  LineChart,
} from "lucide-react"
import { BackgroundBeams } from "@/components/ui/beams"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart as RechartsBarChart,
  Bar,
  Legend,
} from "recharts"
import SaveChartButton from "@/components/SaveChartButton"

// ------- Types ------
interface UserPreferences {
  id: string
  userId: string
  interests: string[]
  sources: string[]
  contentTypes: string[]
  githubLanguages: string[]
}

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

interface AnalyticsData {
  languageStats: { language: string; repoCount: number }[]
  tagStats: { tag: string; questionCount: number }[]
  activityData: { date: string; count: number }[]
  engagementMetrics: {
    stars: number
    forks: number
    watchers: number
  }
  topContributors: { name: string; contributions: number }[]
  weeklyActivity: { day: string; commits: number; issues: number; prs: number }[]
  popularRepos: { name: string; stars: number }[]
}

interface ContentMetrics {
  totalItems: number
  averageEngagement: number
  topCategories: { name: string; count: number }[]
  growthRate: number
  readingTime: number
  savedItems: number
  sharedItems: number
}

interface TrendingTopic {
  id: string
  name: string
  count: number
  growth: number
  category: string
}

// Optional sample colors for charts
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82ca9d",
  "#ffc658",
]

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // ----- STATE -----
  const [loading, setLoading] = useState(true)

  // 1) Preferences
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)

  // 2) Analytics / Content metrics
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [contentMetrics, setContentMetrics] = useState<ContentMetrics | null>(null)

  // 3) Data from Pinecone / for-you
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]) // "all" 
  const [githubContent, setGithubContent] = useState<Recommendation[]>([])
  const [newsContent, setNewsContent] = useState<Recommendation[]>([])
  const [stackoverflowContent, setStackOverflowContent] = useState<Recommendation[]>([])
  const [hackerNewsContent, setHackerNewsContent] = useState<Recommendation[]>([])
  const [socialsContent, setSocialsContent] = useState<Recommendation[]>([])
  const [productHuntContent, setProductHuntContent] = useState<Recommendation[]>([])

  // 4) Trending
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([])

  // 5) "Discover More" (mid-tier items)
  const [discoverMoreItems, setDiscoverMoreItems] = useState<Recommendation[]>([])

  // UI
  const [activeTab, setActiveTab] = useState("overview")
  const [showAllRecommendations, setShowAllRecommendations] = useState(false)
  const [showAllTrending, setShowAllTrending] = useState(false)
  const [showAllDiscover, setShowAllDiscover] = useState(false)

  // ----- AUTH GUARD -----
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  // ----- DATA FETCHING -----
  useEffect(() => {
    async function fetchData() {
      if (status !== "authenticated") return

      try {
        setLoading(true)

        // 1) Preferences
        const prefRes = await fetch("/api/preferences")
        if (prefRes.ok) {
          setPreferences(await prefRes.json())
        }

        // 2) Main Recommendations (source=all)
        const recRes = await fetch("/api/for-you?source=all")
        if (recRes.ok) {
          const recData = await recRes.json()
          setRecommendations(recData)
        }

        // 3) GitHub content (source=github & type=repo)
        const ghRes = await fetch("/api/for-you?source=github&type=repo")
        if (ghRes.ok) {
          setGithubContent(await ghRes.json())
        }

        // 4) News content (source=news & type=article)
        const newsRes = await fetch("/api/for-you?source=news&type=article")
        if (newsRes.ok) {
          setNewsContent(await newsRes.json())
        }

        // 5) Stack Overflow (source=stackoverflow & type=question)
        const soRes = await fetch("/api/for-you?source=stackoverflow&type=question")
        if (soRes.ok) {
          setStackOverflowContent(await soRes.json())
        }

        // 6) Hacker News (source=hackernews)
        //    If you store them with "type=news" in Pinecone, you can add &type=news. 
        const hnRes = await fetch("/api/for-you?source=hackernews")
        if (hnRes.ok) {
          setHackerNewsContent(await hnRes.json())
        }

        // 7) Socials (source=socials) - e.g. Twitter, Reddit, etc. if you store them under "socials"
        const socialsRes = await fetch("/api/for-you?source=socials")
        if (socialsRes.ok) {
          setSocialsContent(await socialsRes.json())
        }

        // 8) Product Hunt (source=producthunt & type=product) or adjust as needed
        const phRes = await fetch("/api/for-you?source=producthunt&type=product")
        if (phRes.ok) {
          setProductHuntContent(await phRes.json())
        }

        // 9) Analytics data for Overview
        const analyticsRes = await fetch("/api/github")
        if (analyticsRes.ok) {
          const analytics = await analyticsRes.json()
          setAnalyticsData(analytics.analyticsData)
          setContentMetrics(analytics.contentMetrics)
        }

        // 10) Trending
        const trendingRes = await fetch("/api/trending")
        if (trendingRes.ok) {
          setTrendingTopics(await trendingRes.json())
        }

        // 11) "Discover More" -> /api/for-you?source=all&discover=1
        const discoverRes = await fetch("/api/for-you?source=all&discover=1")
        if (discoverRes.ok) {
          setDiscoverMoreItems(await discoverRes.json())
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [status])

  // ----- UTILS -----
  function getContentTypeIcon(type: string) {
    switch (type?.toLowerCase?.()) {
      case "article":
      case "articles":
        return <BookOpen className="h-4 w-4" />
      case "video":
      case "videos":
        return <Video className="h-4 w-4" />
      case "tutorial":
      case "tutorials":
        return <Code className="h-4 w-4" />
      case "podcast":
      case "podcasts":
        return <Headphones className="h-4 w-4" />
      case "news":
        return <Newspaper className="h-4 w-4" />
      case "repo":
      case "repository":
      case "repositories":
        return <Github className="h-4 w-4" />
      case "course":
        return <BookOpen className="h-4 w-4" />
      case "question":
        return <MessageSquare className="h-4 w-4" />
      case "product":
        return <Sparkles className="h-4 w-4" />
      default:
        return <Globe className="h-4 w-4" />
    }
  }

  function getSourceIcon(source: string) {
    switch (source?.toLowerCase?.()) {
      case "github":
        return <Github className="h-4 w-4" />
      case "news":
      case "hackernews":
      case "hacker news":
        return <Newspaper className="h-4 w-4" />
      case "producthunt":
      case "product hunt":
        return <Sparkles className="h-4 w-4" />
      case "medium":
        return <BookOpen className="h-4 w-4" />
      case "devto":
      case "dev.to":
      case "stackoverflow":
      case "stack overflow":
      case "typescript weekly":
      case "css tricks":
        return <Code className="h-4 w-4" />
      case "vercel":
        return <Zap className="h-4 w-4" />
      case "reddit":
      case "twitter":
      case "socials":
        return <Globe className="h-4 w-4" />
      default:
        return <Globe className="h-4 w-4" />
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

  function getGrowthBadgeColor(growth: number) {
    if (growth >= 20) return "bg-green-500/20 text-green-400 hover:bg-green-500/30"
    if (growth >= 15) return "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
    if (growth >= 10) return "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
    if (growth >= 5) return "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
    return "bg-gray-500/20 text-gray-400 hover:bg-gray-500/30"
  }

  // Show 3 recs by default
  const recommendationsToShow = useMemo(() => {
    return showAllRecommendations ? recommendations : recommendations.slice(0, 3)
  }, [recommendations, showAllRecommendations])

  // Show 5 trending
  const trendingTopicsToShow = useMemo(() => {
    return showAllTrending ? trendingTopics : trendingTopics.slice(0, 5)
  }, [trendingTopics, showAllTrending])

  // Show 3 discover items by default
  const discoverItemsToShow = useMemo(() => {
    return showAllDiscover ? discoverMoreItems : discoverMoreItems.slice(0, 3)
  }, [discoverMoreItems, showAllDiscover])

  // ----- LOADING -----
  if (loading) {
    return (
      <div className="min-h-screen bg-neondark-bg text-foreground relative overflow-hidden">
        <BackgroundBeams />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.15),transparent_70%)] dark:opacity-100 opacity-30"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--neondark-bg),transparent_20%,transparent_80%,var(--neondark-bg))]"></div>

        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ----- NO PREFERENCES -----
  if (!preferences) {
    return (
      <div className="min-h-screen bg-neondark-bg text-foreground relative overflow-hidden">
        <BackgroundBeams />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.15),transparent_70%)] dark:opacity-100 opacity-30"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--neondark-bg),transparent_20%,transparent_80%,var(--neondark-bg))]"></div>

        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-transparent bg-clip-text">
              Welcome to Your Dashboard
            </h1>
            <p className="text-neondark-muted text-xl mb-8">
              We couldn't find your preferences. Let's set them up to personalize your experience.
            </p>
            <button
              className="bg-cyan-500 text-black hover:bg-cyan-400 px-8 py-6 text-lg rounded-md"
              onClick={() => router.push("/onboarding")}
            >
              Go to Onboarding
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Safely handle numeric fields in contentMetrics
  const totalItems = contentMetrics?.totalItems ?? 0
  const avgEngagement = contentMetrics?.averageEngagement ?? 0
  const topCat = contentMetrics?.topCategories?.[0]
  const topCatName = topCat?.name || "N/A"
  const topCatCount = topCat?.count || 0
  const growthRate = contentMetrics?.growthRate ?? 0

  // ----- RENDER PAGE -----
  return (
    <div className="min-h-screen bg-neondark-bg text-foreground relative overflow-hidden">
      <BackgroundBeams />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.15),transparent_70%)] dark:opacity-100 opacity-30"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--neondark-bg),transparent_20%,transparent_80%,var(--neondark-bg))]"></div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* TITLE & TAGS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 text-transparent bg-clip-text">
                Your Personalized Dashboard
              </h1>
              <p className="text-neondark-muted mt-2">
                Content tailored to your interests and preferences
              </p>
            </div>

            <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
              {preferences?.interests.map((interest) => (
                <Badge
                  key={interest}
                  className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </motion.div>

          {/* Choices & Recommendations */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 text-transparent bg-clip-text flex items-center">
                <Lightbulb className="h-6 w-6 mr-2 text-cyan-400" />
                Your Choices & Recommendations
              </h2>
              <Button
                variant="outline"
                className="text-sm"
                onClick={() => router.push("/profile")}
              >
                <Settings className="h-4 w-4 mr-2" />
                Adjust Preferences
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Personalized Recommendations */}
              <Card className="col-span-1 lg:col-span-2 bg-neondark-card/80 backdrop-blur-sm border-neondark-border overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center">
                    <Badge className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30">
                      <Zap className="h-3 w-3 mr-1" />
                      Personalized Recommendations
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Based on your interests in {preferences.interests.slice(0, 3).join(", ")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <AnimatePresence>
                      {recommendationsToShow.map((recommendation, index) => (
                        <motion.div
                          key={recommendation.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className="flex flex-col md:flex-row gap-4 p-4 rounded-lg border border-neondark-border bg-neondark-card/50 hover:bg-neondark-card/70 transition-colors"
                        >
                          {recommendation.imageUrl && (
                            <div className="w-full md:w-1/4 h-32 md:h-auto rounded-md overflow-hidden">
                              <img
                                src={recommendation.imageUrl}
                                alt={recommendation.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <Badge
                                className={getRelevanceBadgeColor(
                                  recommendation.relevanceScore
                                )}
                              >
                                {recommendation.relevanceScore}% Match
                              </Badge>
                              <Badge variant="outline" className="flex items-center">
                                {getContentTypeIcon(recommendation.type)}
                                <span className="ml-1 capitalize">
                                  {recommendation.type}
                                </span>
                              </Badge>
                            </div>
                            <h3 className="text-lg font-medium mb-1">
                              {recommendation.title}
                            </h3>
                            <p className="text-neondark-muted text-sm mb-3">
                              {recommendation.description}
                            </p>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center text-sm text-neondark-muted">
                                <div className="flex items-center mr-3">
                                  {getSourceIcon(recommendation.source)}
                                  <span className="ml-1">
                                    {recommendation.source}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  <span>
                                    {formatDate(recommendation.publishedAt)}
                                  </span>
                                </div>
                              </div>
                              <a
                                href={recommendation.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center"
                              >
                                Read more <ExternalLink className="ml-1 h-3 w-3" />
                              </a>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {recommendations.length > 3 && (
                      <Button
                        variant="ghost"
                        className="w-full mt-2"
                        onClick={() => setShowAllRecommendations(!showAllRecommendations)}
                      >
                        {showAllRecommendations
                          ? "Show Less"
                          : `Show ${recommendations.length - 3} More Recommendations`}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Trending Topics */}
              <Card className="bg-neondark-card/80 backdrop-blur-sm border-neondark-border overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center">
                    <Badge className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending Topics
                    </Badge>
                  </CardTitle>
                  <CardDescription>Popular in your interest areas</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-3">
                      {trendingTopicsToShow.map((topic, index) => (
                        <motion.div
                          key={topic.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className="p-3 rounded-lg border border-neondark-border bg-neondark-card/50 hover:bg-neondark-card/70 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-medium">{topic.name}</h3>
                            <Badge className={getGrowthBadgeColor(topic.growth)}>
                              +{topic.growth}%
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center text-sm text-neondark-muted">
                            <span>
                              {topic.count?.toLocaleString?.() || 0} mentions
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {topic.category}
                            </Badge>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {trendingTopics.length > 5 && (
                      <Button
                        variant="ghost"
                        className="w-full mt-3"
                        onClick={() => setShowAllTrending(!showAllTrending)}
                      >
                        {showAllTrending
                          ? "Show Less"
                          : `Show ${trendingTopics.length - 5} More Topics`}
                      </Button>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </motion.section>

          {/* TABS */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 mb-6">
              <TabsTrigger value="overview" className="flex items-center">
                <Newspaper className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>

              <TabsTrigger value="github" className="flex items-center">
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </TabsTrigger>

              <TabsTrigger value="news" className="flex items-center">
                <Newspaper className="h-4 w-4 mr-2" />
                News
              </TabsTrigger>

              <TabsTrigger value="stackoverflow" className="flex items-center">
                <Code className="h-4 w-4 mr-2" />
                StackOverflow
              </TabsTrigger>

              <TabsTrigger value="hackernews" className="flex items-center">
                <Newspaper className="h-4 w-4 mr-2" />
                HackerNews
              </TabsTrigger>

              <TabsTrigger value="socials" className="flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                Socials
              </TabsTrigger>

              <TabsTrigger value="producthunt" className="flex items-center">
                <Sparkles className="h-4 w-4 mr-2" />
                ProductHunt
              </TabsTrigger>

             
            </TabsList>

            {/* OVERVIEW TAB */}
            <TabsContent value="overview" className="space-y-6">
              {/* Show analytics, content metrics, etc. */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-neondark-card/80 backdrop-blur-sm border-neondark-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Layers className="h-4 w-4 mr-2 text-cyan-400" />
                      Total Items
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      {totalItems.toLocaleString()}
                    </p>
                    <p className="text-neondark-muted text-sm mt-1">
                      Across all your sources
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-neondark-card/80 backdrop-blur-sm border-neondark-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Activity className="h-4 w-4 mr-2 text-green-400" />
                      Average Engagement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                      {avgEngagement.toLocaleString()}
                    </p>
                    <p className="text-neondark-muted text-sm mt-1">
                      Interactions per item
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-neondark-card/80 backdrop-blur-sm border-neondark-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Award className="h-4 w-4 mr-2 text-yellow-400" />
                      Top Category
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                      {topCatName}
                    </p>
                    <p className="text-neondark-muted text-sm mt-1">
                      {topCatCount.toLocaleString()} items
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-neondark-card/80 backdrop-blur-sm border-neondark-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2 text-purple-400" />
                      Growth Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {growthRate}%
                    </p>
                    <p className="text-neondark-muted text-sm mt-1">
                      Month over month
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Example Pie Chart */}
                <Card className="bg-neondark-card/80 backdrop-blur-sm border-neondark-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center">
                      <Badge className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30">
                        <PieChart className="h-3 w-3 mr-1" />
                        Language Distribution
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SaveChartButton fileName="language-distribution">
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={analyticsData?.languageStats || []}
                              dataKey="repoCount"
                              nameKey="language"
                              cx="50%"
                              cy="50%"
                              outerRadius={100}
                              label={({ language, repoCount }) =>
                                `${language}: ${repoCount}`
                              }
                            >
                              {(analyticsData?.languageStats || []).map(
                                (entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={
                                      COLORS[index % COLORS.length]
                                    }
                                  />
                                )
                              )}
                            </Pie>
                            <Tooltip
                              formatter={(value, name) => [
                                `${value} repositories`,
                                name,
                              ]}
                            />
                            <Legend />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </div>
                    </SaveChartButton>
                  </CardContent>
                </Card>

                {/* Example Area Chart */}
                <Card className="bg-neondark-card/80 backdrop-blur-sm border-neondark-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center">
                      <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
                        <LineChart className="h-3 w-3 mr-1" />
                        Activity Over Time
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SaveChartButton fileName="activity-over-time">
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={analyticsData?.activityData || []}
                          >
                            <defs>
                              <linearGradient
                                id="colorActivity"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#8884d8"
                                  stopOpacity={0.8}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#8884d8"
                                  stopOpacity={0.1}
                                />
                              </linearGradient>
                            </defs>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              opacity={0.2}
                            />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Area
                              type="monotone"
                              dataKey="count"
                              stroke="#8884d8"
                              fillOpacity={1}
                              fill="url(#colorActivity)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </SaveChartButton>
                  </CardContent>
                </Card>
              </div>

              {/* Example Bar Chart */}
              <Card className="bg-neondark-card/80 backdrop-blur-sm border-neondark-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center">
                    <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30">
                      <BarChart className="h-3 w-3 mr-1" />
                      Weekly Activity
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SaveChartButton fileName="weekly-activity">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart
                          data={analyticsData?.weeklyActivity || []}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            opacity={0.2}
                          />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar
                            dataKey="commits"
                            fill="#8884d8"
                            name="Commits"
                          />
                          <Bar
                            dataKey="issues"
                            fill="#82ca9d"
                            name="Issues"
                          />
                          <Bar
                            dataKey="prs"
                            fill="#ffc658"
                            name="Pull Requests"
                          />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </div>
                  </SaveChartButton>
                </CardContent>
              </Card>
            </TabsContent>

            {/* GITHUB TAB */}
            <TabsContent value="github" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {githubContent.length > 0 ? (
                  githubContent.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card className="h-full bg-neondark-card/80 backdrop-blur-sm border-neondark-border">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <Badge className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 flex items-center">
                              <Github className="h-3 w-3 mr-1" />
                              {item.source}
                            </Badge>
                            <span className="text-xs text-neondark-muted">
                              {formatDate(item.publishedAt)}
                            </span>
                          </div>
                          <CardTitle className="text-xl mt-2">
                            {item.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {item.description && (
                            <p className="text-neondark-muted text-sm mb-4 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                          <div className="flex justify-between items-center mb-4">
                            <Badge
                              className={getRelevanceBadgeColor(
                                item.relevanceScore
                              )}
                            >
                              {item.relevanceScore}% Match
                            </Badge>
                            <Badge variant="outline" className="flex items-center">
                              {getContentTypeIcon(item.type)}
                              <span className="ml-1 capitalize">
                                {item.type}
                              </span>
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <Badge className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30">
                              {item.source}
                            </Badge>
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
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-neondark-muted">
                      No GitHub content found based on your preferences.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* NEWS TAB */}
            <TabsContent value="news" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsContent.length > 0 ? (
                  newsContent.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card className="h-full bg-neondark-card/80 backdrop-blur-sm border-neondark-border">
                        {item.imageUrl && (
                          <div className="w-full h-40 overflow-hidden">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <Badge className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 flex items-center">
                              <Newspaper className="h-3 w-3 mr-1" />
                              {item.source}
                            </Badge>
                            <span className="text-xs text-neondark-muted">
                              {formatDate(item.publishedAt)}
                            </span>
                          </div>
                          <CardTitle className="text-xl mt-2">{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-neondark-muted mb-4 line-clamp-3">
                            {item.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <Badge
                              className={getRelevanceBadgeColor(item.relevanceScore)}
                            >
                              {item.relevanceScore}% Match
                            </Badge>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center"
                            >
                              Read more <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-neondark-muted">
                      No news items found based on your preferences.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* STACK OVERFLOW TAB */}
            <TabsContent value="stackoverflow" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stackoverflowContent.length > 0 ? (
                  stackoverflowContent.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card className="h-full bg-neondark-card/80 backdrop-blur-sm border-neondark-border">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <Badge className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 flex items-center">
                              <Code className="h-3 w-3 mr-1" />
                              {item.source}
                            </Badge>
                            <span className="text-xs text-neondark-muted">
                              {formatDate(item.publishedAt)}
                            </span>
                          </div>
                          <CardTitle className="text-xl mt-2">
                            {item.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {item.description && (
                            <p className="text-neondark-muted text-sm mb-4 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                          <div className="flex justify-between items-center mb-4">
                            <Badge
                              className={getRelevanceBadgeColor(item.relevanceScore)}
                            >
                              {item.relevanceScore}% Match
                            </Badge>
                            <Badge variant="outline" className="flex items-center">
                              {getContentTypeIcon(item.type)}
                              <span className="ml-1 capitalize">{item.type}</span>
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <Badge className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30">
                              {item.source}
                            </Badge>
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
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-neondark-muted">
                      No StackOverflow questions found based on your preferences.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* HACKER NEWS TAB */}
            <TabsContent value="hackernews" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hackerNewsContent.length > 0 ? (
                  hackerNewsContent.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card className="h-full bg-neondark-card/80 backdrop-blur-sm border-neondark-border">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <Badge className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 flex items-center">
                              <Newspaper className="h-3 w-3 mr-1" />
                              {item.source}
                            </Badge>
                            <span className="text-xs text-neondark-muted">
                              {formatDate(item.publishedAt)}
                            </span>
                          </div>
                          <CardTitle className="text-xl mt-2">
                            {item.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {item.description && (
                            <p className="text-neondark-muted text-sm mb-4 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                          <div className="flex justify-between items-center mb-4">
                            <Badge
                              className={getRelevanceBadgeColor(item.relevanceScore)}
                            >
                              {item.relevanceScore}% Match
                            </Badge>
                            <Badge variant="outline" className="flex items-center">
                              {getContentTypeIcon(item.type)}
                              <span className="ml-1 capitalize">{item.type}</span>
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <Badge className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30">
                              {item.source}
                            </Badge>
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
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-neondark-muted">
                      No HackerNews items found based on your preferences.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* SOCIALS TAB */}
            <TabsContent value="socials" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {socialsContent.length > 0 ? (
                  socialsContent.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card className="h-full bg-neondark-card/80 backdrop-blur-sm border-neondark-border">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <Badge className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 flex items-center">
                              <Globe className="h-3 w-3 mr-1" />
                              {item.source}
                            </Badge>
                            <span className="text-xs text-neondark-muted">
                              {formatDate(item.publishedAt)}
                            </span>
                          </div>
                          <CardTitle className="text-xl mt-2">
                            {item.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-neondark-muted text-sm mb-4 line-clamp-2">
                            {item.description}
                          </p>
                          <div className="flex justify-between items-center mb-4">
                            <Badge
                              className={getRelevanceBadgeColor(item.relevanceScore)}
                            >
                              {item.relevanceScore}% Match
                            </Badge>
                            <Badge variant="outline" className="flex items-center">
                              {getContentTypeIcon(item.type)}
                              <span className="ml-1 capitalize">{item.type}</span>
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <Badge className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30">
                              {item.source}
                            </Badge>
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
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-neondark-muted">
                      No Social posts found based on your preferences.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* PRODUCT HUNT TAB */}
            <TabsContent value="producthunt" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {productHuntContent.length > 0 ? (
                  productHuntContent.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card className="h-full bg-neondark-card/80 backdrop-blur-sm border-neondark-border">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <Badge className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 flex items-center">
                              <Sparkles className="h-3 w-3 mr-1" />
                              {item.source}
                            </Badge>
                            <span className="text-xs text-neondark-muted">
                              {formatDate(item.publishedAt)}
                            </span>
                          </div>
                          <CardTitle className="text-xl mt-2">
                            {item.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-neondark-muted text-sm mb-4 line-clamp-2">
                            {item.description}
                          </p>
                          <div className="flex justify-between items-center mb-4">
                            <Badge
                              className={getRelevanceBadgeColor(item.relevanceScore)}
                            >
                              {item.relevanceScore}% Match
                            </Badge>
                            <Badge variant="outline" className="flex items-center">
                              {getContentTypeIcon(item.type)}
                              <span className="ml-1 capitalize">{item.type}</span>
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <Badge className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30">
                              {item.source}
                            </Badge>
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
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-neondark-muted">
                      No Product Hunt items found based on your preferences.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

          </Tabs>

          {/* DISCOVER MORE SECTION */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text flex items-center">
                <Compass className="h-6 w-6 mr-2 text-purple-400" />
                Discover More
              </h2>
              <Button variant="outline" className="text-sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="col-span-1 bg-neondark-card/80 backdrop-blur-sm border-neondark-border overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center">
                    <Badge className="bg-pink-500/20 text-pink-400 hover:bg-pink-500/30">
                      <Zap className="h-3 w-3 mr-1" />
                      Mid-tier Content
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Out-of-the-box items with lower relevance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <AnimatePresence>
                      {discoverItemsToShow.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className="flex flex-col md:flex-row gap-4 p-4 rounded-lg border border-neondark-border bg-neondark-card/50 hover:bg-neondark-card/70 transition-colors"
                        >
                          {item.imageUrl && (
                            <div className="w-full md:w-1/4 h-32 md:h-auto rounded-md overflow-hidden">
                              <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <Badge
                                className={getRelevanceBadgeColor(item.relevanceScore)}
                              >
                                {item.relevanceScore}% Match
                              </Badge>
                              <Badge variant="outline" className="flex items-center">
                                {getContentTypeIcon(item.type)}
                                <span className="ml-1 capitalize">
                                  {item.type}
                                </span>
                              </Badge>
                            </div>
                            <h3 className="text-lg font-medium mb-1">
                              {item.title}
                            </h3>
                            <p className="text-neondark-muted text-sm mb-3">
                              {item.description}
                            </p>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center text-sm text-neondark-muted">
                                <div className="flex items-center mr-3">
                                  {getSourceIcon(item.source)}
                                  <span className="ml-1">{item.source}</span>
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  <span>{formatDate(item.publishedAt)}</span>
                                </div>
                              </div>
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-pink-400 hover:text-pink-300 text-sm flex items-center"
                              >
                                Explore <ExternalLink className="ml-1 h-3 w-3" />
                              </a>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {discoverMoreItems.length > 3 && (
                      <Button
                        variant="ghost"
                        className="w-full mt-2"
                        onClick={() => setShowAllDiscover(!showAllDiscover)}
                      >
                        {showAllDiscover
                          ? "Show Less"
                          : `Show ${discoverMoreItems.length - 3} More Discover Items`}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  )
}
