"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { Globe, Activity } from "lucide-react"
import { FaReddit } from "react-icons/fa"

import {
  ArrowUpRight,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Facebook,
  Filter,
  Heart,
  Instagram,
  LineChartIcon,
  MessageCircle,
  Moon,
  PieChartIcon,
  Search,
  Sun,
  TrendingUp,
  Twitter,
  Users,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
} from "recharts"

export default function UnifiedDashboard() {
  // State for data
  const [socialMediaData, setSocialMediaData] = useState<any>(null)
  const [redditData, setRedditData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // UI state
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [platformFilter, setPlatformFilter] = useState<string | null>(null)
  const [subredditFilter, setSubredditFilter] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState("week")
  const [chartType, setChartType] = useState<"pie" | "bar">("pie")
  const [expandedCards, setExpandedCards] = useState<{ [key: string]: boolean }>({
    socialTrending: false,
    redditTrending: false,
    platforms: false,
    subreddits: false,
  })

  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch both data sources in parallel
        const [socialMediaRes, redditRes] = await Promise.all([fetch("/api/socialmedia"), fetch("/api/reddit")])

        const socialMediaJson = await socialMediaRes.json()
        const redditJson = await redditRes.json()

        // Process Social Media Data
        const stripHtml = (html: string) => {
          const doc = new DOMParser().parseFromString(html, "text/html")
          return doc.body.textContent || ""
        }

        const processedSocialMedia = socialMediaJson.map((post: any) => ({
          ...post,
          platform: post.platform || "unknown",
          content: stripHtml(post.content),
        }))

        // Process Reddit Data
        const processedReddit = redditJson.map((post: any) => ({
          ...post,
          score: post.score || post.upvotes || 0,
          num_comments: post.num_comments || post.comments || 0,
          subreddit: post.subreddit || "unknown",
          created: post.created || new Date().toISOString(),
          isRising: post.isRising || Math.random() > 0.7, // For demo purposes
        }))

        // Set Social Media Data
        setSocialMediaData({
          posts: processedSocialMedia,
          platformStats: generatePlatformStats(processedSocialMedia),
          engagementStats: generateEngagementStats(processedSocialMedia),
        })

        // Set Reddit Data
        setRedditData({
          trending: processedReddit,
          subredditStats: generateSubredditStats(processedReddit),
        })
      } catch (error) {
        console.error("Error fetching data:", error)
        // Handle error state if needed
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const toggleExpand = (card: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [card]: !prev[card],
    }))
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Filter social media posts
  const filteredSocialPosts =
    socialMediaData?.posts?.filter((post: any) => {
      const matchesSearch = post.content?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesPlatform = platformFilter ? post.platform === platformFilter : true
      return matchesSearch && matchesPlatform
    }) || []

  // Filter Reddit posts
  const filteredRedditPosts =
    redditData?.trending?.filter((post: any) => {
      const matchesSearch = post.title?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSubreddit = subredditFilter ? post.subreddit === subredditFilter : true
      return matchesSearch && matchesSubreddit
    }) || []

  // Calculate combined stats
  const totalSocialPosts = socialMediaData?.posts?.length || 0
  const totalRedditPosts = redditData?.trending?.length || 0
  const totalPosts = totalSocialPosts + totalRedditPosts

  const totalSocialEngagement =
    socialMediaData?.posts?.reduce((acc: number, post: any) => acc + (post.score || 0), 0) || 0

  const totalRedditEngagement =
    redditData?.trending?.reduce((acc: number, post: any) => acc + (post.score || 0) + (post.num_comments || 0), 0) || 0

  const totalEngagement = totalSocialEngagement + totalRedditEngagement

  // Colors for charts
  const socialColors = {
    twitter: "#1DA1F2",
    facebook: "#4267B2",
    instagram: "#C13584",
    linkedin: "#0077B5",
    tiktok: "#000000",
    youtube: "#FF0000",
    pinterest: "#E60023",
    reddit: "#FF4500",
    other: "#6c757d",
  }

  const redditColors = [
    "#ff4500", // Reddit orange
    "#00FFFF", // Neon Cyan
    "#1a1a1b", // Reddit black
    "#7193ff", // Periwinkle
    "#ff8717", // Orangered
    "#46d160", // Green
    "#ff66ac", // Pink
    "#ffb000", // Gold
    "#24a0ed", // Light blue
    "#ff585b", // Red
  ]

  // Helper functions for styling
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "twitter":
        return <Twitter className="h-4 w-4 text-blue-500" />
      case "facebook":
        return <Facebook className="h-4 w-4 text-blue-700" />
      case "instagram":
        return <Instagram className="h-4 w-4 text-pink-500" />
      case "reddit":
        return <FaReddit className="h-4 w-4 text-orange-500" />
      case "mastodon":
        return <Globe className="h-4 w-4 text-purple-500" />
      case "linkedin":
        return <Activity className="h-4 w-4 text-blue-600" />
      default:
        return <ExternalLink className="h-4 w-4 text-gray-400" />
    }
  }

  const getPlatformColor = (platform: string) => {
    const key = platform.toLowerCase() as keyof typeof socialColors
    return socialColors[key] || socialColors.other
  }

  const getPlatformBadgeClass = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "twitter":
        return "bg-blue-950 text-blue-300 border-blue-800"
      case "facebook":
        return "bg-indigo-950 text-indigo-300 border-indigo-800"
      case "instagram":
        return "bg-pink-950 text-pink-300 border-pink-800"
      case "linkedin":
        return "bg-blue-950 text-blue-300 border-blue-800"
      case "tiktok":
        return "bg-gray-950 text-gray-300 border-gray-800"
      case "youtube":
        return "bg-red-950 text-red-300 border-red-800"
      default:
        return "bg-gray-950 text-gray-300 border-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto bg-neondark-bg">
        {/* Header */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 bg-gray-800/50" />
          <Skeleton className="h-4 w-48 bg-gray-800/50" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-md bg-gray-800/50" />
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-md bg-gray-800/50" />
          ))}
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-6 w-40 bg-gray-800/50" />
              {[...Array(3)].map((_, j) => (
                <Skeleton key={j} className="h-20 w-full rounded-md bg-gray-800/50" />
              ))}
            </div>
          ))}
        </div>

        {/* Chart Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-6 w-60 bg-gray-800/50" />
          <Skeleton className="h-[300px] w-full rounded-md bg-gray-800/50" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neondark-bg text-foreground relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.15),transparent_70%)] dark:opacity-100 opacity-30"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--neondark-bg),transparent_20%,transparent_80%,var(--neondark-bg))]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)] dark:opacity-100 opacity-30"></div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="p-6 space-y-8 max-w-7xl mx-auto relative z-10"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-orange-500 bg-clip-text text-transparent">
              Unified Social Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Track engagement and trends across platforms</p>
          </motion.div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-9 w-[200px] md:w-[260px] bg-gray-800/50 border-gray-700"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9 border-cyan-800 hover:border-cyan-400">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-800/90 border-gray-700">
                <DropdownMenuItem
                  onClick={() => {
                    setPlatformFilter(null)
                    setSubredditFilter(null)
                  }}
                  className="hover:bg-cyan-950"
                >
                  All Platforms
                </DropdownMenuItem>
                <DropdownMenuItem className="font-semibold text-cyan-400" disabled>
                  Social Media
                </DropdownMenuItem>
                {socialMediaData?.platformStats?.map((platform: any) => (
                  <DropdownMenuItem
                    key={platform.name}
                    onClick={() => setPlatformFilter(platform.name)}
                    className="hover:bg-cyan-950"
                  >
                    {platform.name} ({platform.count})
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem className="font-semibold text-orange-400" disabled>
                  Reddit
                </DropdownMenuItem>
                {redditData?.subredditStats?.map((subreddit: any) => (
                  <DropdownMenuItem
                    key={subreddit.name}
                    onClick={() => setSubredditFilter(subreddit.name)}
                    className="hover:bg-cyan-950"
                  >
                    r/{subreddit.name} ({subreddit.count})
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 border-cyan-800 hover:border-cyan-400"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Posts"
            value={totalPosts}
            icon={<MessageCircle className="h-4 w-4" />}
            color="bg-blue-500"
            index={0}
          />
          <StatsCard
            title="Social Media Posts"
            value={totalSocialPosts}
            icon={<Heart className="h-4 w-4" />}
            color="bg-purple-500"
            index={1}
          />
          <StatsCard
            title="Reddit Posts"
            value={totalRedditPosts}
            icon={<TrendingUp className="h-4 w-4" />}
            color="bg-orange-500"
            index={2}
          />
          <StatsCard
            title="Total Engagement"
            value={totalEngagement}
            icon={<Users className="h-4 w-4" />}
            color="bg-cyan-400"
            index={3}
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid w-full md:w-auto grid-cols-3 bg-gray-800/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black">
              Overview
            </TabsTrigger>
            <TabsTrigger value="social" className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black">
              Social Media
            </TabsTrigger>
            <TabsTrigger value="reddit" className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black">
              Reddit
            </TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Social Media Overview */}
              <Card className="bg-gray-800/30 border-gray-800 hover:shadow-[0_0_15px_rgba(0,255,255,0.15)] transition-shadow">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Heart className="h-5 w-5 text-purple-500" /> Social Media Highlights
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpand("socialTrending")}
                    className="h-8 w-8 p-0 hover:bg-cyan-950"
                  >
                    {expandedCards.socialTrending ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CardHeader>
                <CardContent>
                  {filteredSocialPosts.length > 0 ? (
                    <div className="space-y-3">
                      {(expandedCards.socialTrending ? filteredSocialPosts : filteredSocialPosts.slice(0, 3))
                        .sort((a: any, b: any) => b.likes + b.shares + b.comments - (a.likes + a.shares + a.comments))
                        .map((post: any, index: number) => (
                          <motion.div
                            key={post.id || index}
                            className="p-3 rounded-lg border border-gray-700 bg-gray-800/50 shadow-sm hover:shadow-md hover:border-cyan-800 transition-all"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            whileHover={{ scale: 1.01 }}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="font-medium text-primary flex items-start gap-2">
                                  <div>
                                    <div className="flex items-center">
                                      <a
                                        href={post.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-semibold text-cyan-400 hover:underline"
                                      >
                                        {post.author || "Anonymous"}
                                      </a>
                                      <Badge
                                        variant="outline"
                                        className={`ml-2 ${getPlatformBadgeClass(post.platform)}`}
                                      >
                                        {getPlatformIcon(post.platform)}
                                        <span className="ml-1">{post.platform}</span>
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{post.content}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-between items-center mt-3">
                              <div className="flex items-center gap-4 text-sm text-muted-foreground"></div>
                            </div>
                          </motion.div>
                        ))}
                      {!expandedCards.socialTrending && filteredSocialPosts.length > 3 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpand("socialTrending")}
                          className="w-full mt-2 hover:bg-cyan-950 hover:text-cyan-400"
                        >
                          View All Social Media Posts
                        </Button>
                      )}
                      {expandedCards.socialTrending && filteredSocialPosts.length > 3 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpand("socialTrending")}
                          className="w-full mt-2 hover:bg-cyan-950 hover:text-cyan-400"
                        >
                          View Less
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">No social media data available</div>
                  )}
                </CardContent>
              </Card>

              {/* Reddit Overview */}
              <Card className="bg-gray-800/30 border-gray-800 hover:shadow-[0_0_15px_rgba(0,255,255,0.15)] transition-shadow">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-orange-500" /> Reddit Highlights
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpand("redditTrending")}
                    className="h-8 w-8 p-0 hover:bg-cyan-950"
                  >
                    {expandedCards.redditTrending ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CardHeader>
                <CardContent>
                  {filteredRedditPosts.length > 0 ? (
                    <div className="space-y-3">
                      {(expandedCards.redditTrending ? filteredRedditPosts : filteredRedditPosts.slice(0, 3))
                        .sort((a: any, b: any) => b.score - a.score)
                        .map((post: any, index: number) => (
                          <motion.div
                            key={post.id || index}
                            className="p-3 rounded-lg border border-gray-700 bg-gray-800/50 shadow-sm hover:shadow-md hover:border-cyan-800 transition-all"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            whileHover={{ scale: 1.01 }}
                          >
                            <div className="flex justify-between items-start">
                              <div className="font-medium text-primary">
                                <div className="flex items-center">
                                  <a
                                    href={post.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-semibold truncate max-w-[250px] hover:underline hover:text-cyan-400"
                                  >
                                    {post.title}
                                  </a>
                                  <Badge
                                    variant="outline"
                                    className="ml-2 bg-orange-950 text-orange-300 border-orange-800"
                                  >
                                    r/{post.subreddit}
                                  </Badge>
                                </div>
                              </div>
                              <Badge variant="secondary" className="ml-2 bg-gray-800 border-orange-800">
                                <ArrowUpRight className="h-3 w-3 mr-1 text-orange-500" />
                                {post.score}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center mt-3">
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <MessageCircle className="h-4 w-4 text-cyan-400" />
                                  <span>{post.num_comments} comments</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      {!expandedCards.redditTrending && filteredRedditPosts.length > 3 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpand("redditTrending")}
                          className="w-full mt-2 hover:bg-cyan-950 hover:text-cyan-400"
                        >
                          View All Reddit Posts
                        </Button>
                      )}
                      {expandedCards.redditTrending && filteredRedditPosts.length > 3 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpand("redditTrending")}
                          className="w-full mt-2 hover:bg-cyan-950 hover:text-cyan-400"
                        >
                          View Less
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">No Reddit data available</div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Platform Comparison */}
            <Card className="bg-gray-800/30 border-gray-800 hover:shadow-[0_0_15px_rgba(0,255,255,0.15)] transition-shadow">
              <CardHeader>
                <CardTitle>Platform Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-purple-400">Social Media</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Posts</span>
                        <span>{totalSocialPosts}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${(totalSocialPosts / totalPosts) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Engagement</span>
                        <span>{totalSocialEngagement}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${(totalSocialEngagement / totalEngagement) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-orange-400">Reddit</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Posts</span>
                        <span>{totalRedditPosts}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full"
                          style={{ width: `${(totalRedditPosts / totalPosts) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Engagement</span>
                        <span>{totalRedditEngagement}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full"
                          style={{ width: `${(totalRedditEngagement / totalEngagement) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Combined Engagement Chart */}
                <div className="mt-8">
                  <h3 className="font-semibold text-lg mb-4 text-cyan-400">Combined Engagement Timeline</h3>
                  <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={generateCombinedEngagementData()}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="social"
                          stackId="1"
                          stroke="#9333ea"
                          fill="#9333ea"
                          name="Social Media"
                          fillOpacity={0.6}
                        />
                        <Area
                          type="monotone"
                          dataKey="reddit"
                          stackId="1"
                          stroke="#f97316"
                          fill="#f97316"
                          name="Reddit"
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SOCIAL MEDIA TAB */}
          <TabsContent value="social" className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Social Media Dashboard
              </h2>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 h-9 w-[200px] md:w-[260px] bg-gray-800/50 border-gray-700"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-9 w-9 border-cyan-800 hover:border-cyan-400">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-gray-800/90 border-gray-700">
                    <DropdownMenuItem onClick={() => setPlatformFilter(null)} className="hover:bg-cyan-950">
                      All Platforms
                    </DropdownMenuItem>
                    {socialMediaData?.platformStats?.map((platform: any) => (
                      <DropdownMenuItem
                        key={platform.name}
                        onClick={() => setPlatformFilter(platform.name)}
                        className="hover:bg-cyan-950"
                      >
                        {platform.name} ({platform.count})
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Posts Card */}
              <Card className="bg-gray-800/30 border-gray-800 hover:shadow-[0_0_15px_rgba(0,255,255,0.15)] transition-shadow">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <ArrowUpRight className="h-5 w-5 text-blue-500" /> Top Performing Posts
                    </CardTitle>
                    {platformFilter && (
                      <CardDescription className="flex items-center mt-1">
                        Filtered by:
                        <Badge variant="outline" className="ml-2 border-cyan-800">
                          {platformFilter}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setPlatformFilter(null)}
                            className="h-4 w-4 ml-1 p-0"
                          >
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                        </Badge>
                      </CardDescription>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpand("socialTrending")}
                    className="h-8 w-8 p-0 hover:bg-cyan-950"
                  >
                    {expandedCards.socialTrending ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CardHeader>
                <CardContent>
                  {filteredSocialPosts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No posts match your search criteria</div>
                  ) : (
                    <ul className="space-y-3">
                      {(expandedCards.socialTrending ? filteredSocialPosts : filteredSocialPosts.slice(0, 5))
                        .sort((a: any, b: any) => b.likes + b.shares + b.comments - (a.likes + a.shares + a.comments))
                        .map((post: any, index: number) => (
                          <motion.li
                            key={post.id || index}
                            className="p-3 rounded-lg border border-gray-700 bg-gray-800/50 shadow-sm hover:shadow-md hover:border-cyan-800 transition-all"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            whileHover={{ scale: 1.01 }}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="font-medium text-primary flex items-start gap-2">
                                  <div>
                                    <div className="flex items-center">
                                      <a
                                        href={post.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-semibold text-cyan-400 hover:underline"
                                      >
                                        {post.author || "Anonymous"}
                                      </a>
                                      <Badge
                                        variant="outline"
                                        className={`ml-2 ${getPlatformBadgeClass(post.platform)}`}
                                      >
                                        {getPlatformIcon(post.platform)}
                                        <span className="ml-1">{post.platform}</span>
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{post.content}</p>
                                  </div>
                                </div>
                              </div>
                              {post.image && (
                                <div className="ml-4 h-16 w-16 rounded overflow-hidden flex-shrink-0">
                                  <img
                                    src={post.image || "/placeholder.svg?height=64&width=64"}
                                    alt="Post image"
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              )}
                            </div>
                            <div className="flex justify-between items-center mt-3">
                              <span className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</span>
                            </div>
                          </motion.li>
                        ))}
                    </ul>
                  )}
                  {!expandedCards.socialTrending && filteredSocialPosts.length > 5 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpand("socialTrending")}
                      className="w-full mt-3 hover:bg-cyan-950 hover:text-cyan-400"
                    >
                      View all {filteredSocialPosts.length} posts
                    </Button>
                  )}
                  {expandedCards.socialTrending && filteredSocialPosts.length > 5 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpand("socialTrending")}
                      className="w-full mt-3 hover:bg-cyan-950 hover:text-cyan-400"
                    >
                      View less
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Platform Distribution Chart */}
              <Card className="bg-gray-800/30 border-gray-800 hover:shadow-[0_0_15px_rgba(0,255,255,0.15)] transition-shadow">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-blue-500" /> Platform Distribution
                  </CardTitle>
                  <div className="flex space-x-1">
                    <Button
                      variant={chartType === "pie" ? "default" : "outline"}
                      size="icon"
                      className={`h-8 w-8 ${chartType === "pie" ? "bg-cyan-400 text-black" : "border-cyan-800 hover:border-cyan-400"}`}
                      onClick={() => setChartType("pie")}
                    >
                      <PieChartIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={chartType === "bar" ? "default" : "outline"}
                      size="icon"
                      className={`h-8 w-8 ${chartType === "bar" ? "bg-cyan-400 text-black" : "border-cyan-800 hover:border-cyan-400"}`}
                      onClick={() => setChartType("bar")}
                    >
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <motion.div
                    key={chartType}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === "pie" ? (
                        <PieChart>
                          <Pie
                            data={socialMediaData.platformStats}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="count"
                            nameKey="name"
                            label={({ name, count }) => `${name}: ${count}`}
                          >
                            {socialMediaData.platformStats.map((entry: any, index: number) => {
                              const key = entry.name.toLowerCase() as keyof typeof socialColors
                              return <Cell key={`cell-${index}`} fill={socialColors[key] || socialColors.other} />
                            })}
                          </Pie>
                          <RechartsTooltip formatter={(value, name, props) => [`${value} posts`, props.payload.name]} />
                        </PieChart>
                      ) : (
                        <BarChart
                          data={socialMediaData.platformStats}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                          <XAxis type="number" />
                          <YAxis type="category" dataKey="name" width={80} />
                          <RechartsTooltip formatter={(value) => [`${value} posts`, "Count"]} />
                          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                            {socialMediaData.platformStats.map((entry: any, index: number) => {
                              const key = entry.name.toLowerCase() as keyof typeof socialColors
                              return <Cell key={`cell-${index}`} fill={socialColors[key] || socialColors.other} />
                            })}
                          </Bar>
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </motion.div>

                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {socialMediaData.platformStats.map((platform: any, index: number) => {
                      const key = platform.name.toLowerCase() as keyof typeof socialColors
                      return (
                        <div
                          key={platform.name}
                          className="flex items-center gap-2 p-2 rounded-md hover:bg-cyan-950 cursor-pointer"
                          onClick={() => setPlatformFilter(platform.name)}
                        >
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: socialColors[key] || socialColors.other }}
                          ></div>
                          <span className="text-sm">
                            {platform.name}: {platform.count}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Engagement Timeline */}
            <Card className="bg-gray-800/30 border-gray-800 hover:shadow-[0_0_15px_rgba(0,255,255,0.15)] transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <LineChartIcon className="h-5 w-5 text-green-500" /> Engagement Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={socialMediaData.engagementStats}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="likes"
                        stackId="1"
                        stroke={socialColors.facebook}
                        fill={socialColors.facebook}
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="shares"
                        stackId="1"
                        stroke={socialColors.twitter}
                        fill={socialColors.twitter}
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="comments"
                        stackId="1"
                        stroke={socialColors.instagram}
                        fill={socialColors.instagram}
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* REDDIT TAB */}
          <TabsContent value="reddit" className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Reddit Trends Dashboard
              </h2>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 h-9 w-[200px] md:w-[260px] bg-gray-800/50 border-gray-700"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-9 w-9 border-cyan-800 hover:border-cyan-400">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-gray-800/90 border-gray-700">
                    <DropdownMenuItem onClick={() => setSubredditFilter(null)} className="hover:bg-cyan-950">
                      All Subreddits
                    </DropdownMenuItem>
                    {redditData.subredditStats.map((subreddit: any) => (
                      <DropdownMenuItem
                        key={subreddit.name}
                        onClick={() => setSubredditFilter(subreddit.name)}
                        className="hover:bg-cyan-950"
                      >
                        r/{subreddit.name} ({subreddit.count})
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Trending Posts Card */}
              <Card className="bg-gray-800/30 border-gray-800 hover:shadow-[0_0_15px_rgba(0,255,255,0.15)] transition-shadow">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-orange-500" /> Trending Posts
                    </CardTitle>
                    {subredditFilter && (
                      <CardDescription className="flex items-center mt-1">
                        Filtered by:
                        <Badge variant="outline" className="ml-2 border-orange-800">
                          r/{subredditFilter}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSubredditFilter(null)}
                            className="h-4 w-4 ml-1 p-0"
                          >
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                        </Badge>
                      </CardDescription>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpand("redditTrending")}
                    className="h-8 w-8 p-0 hover:bg-cyan-950"
                  >
                    {expandedCards.redditTrending ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CardHeader>
                <CardContent>
                  {filteredRedditPosts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No posts match your search criteria</div>
                  ) : (
                    <ul className="space-y-3">
                      {(expandedCards.redditTrending ? filteredRedditPosts : filteredRedditPosts.slice(0, 5)).map(
                        (post: any, index: number) => (
                          <motion.li
                            key={post.id || index}
                            className="p-3 rounded-lg border border-gray-700 bg-gray-800/50 shadow-sm hover:shadow-md hover:border-cyan-800 transition-all"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            whileHover={{ scale: 1.01 }}
                          >
                            <div className="flex justify-between items-start">
                              <a
                                href={post.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-primary hover:underline hover:text-cyan-400 flex items-center"
                              >
                                {post.title}
                                <ExternalLink className="ml-1 h-3 w-3" />
                              </a>
                              <Badge variant="secondary" className="ml-2 bg-gray-800 border-orange-800">
                                <ArrowUpRight className="h-3 w-3 mr-1 text-orange-500" />
                                {post.score}
                              </Badge>
                            </div>
                            <div className="flex items-center mt-2">
                              <Badge
                                variant="outline"
                                className="text-xs bg-orange-950 text-orange-300 border-orange-800 hover:bg-orange-900 cursor-pointer"
                                onClick={() => setSubredditFilter(post.subreddit)}
                              >
                                r/{post.subreddit}
                              </Badge>
                              {post.isRising && (
                                <Badge variant="outline" className="ml-2 bg-cyan-950 text-cyan-300 border-cyan-800">
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                  Rising
                                </Badge>
                              )}
                            </div>
                          </motion.li>
                        ),
                      )}
                    </ul>
                  )}
                  {!expandedCards.redditTrending && filteredRedditPosts.length > 5 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpand("redditTrending")}
                      className="w-full mt-3 hover:bg-cyan-950 hover:text-cyan-400"
                    >
                      View all {filteredRedditPosts.length} posts
                    </Button>
                  )}
                  {expandedCards.redditTrending && filteredRedditPosts.length > 5 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpand("redditTrending")}
                      className="w-full mt-3 hover:bg-cyan-950 hover:text-cyan-400"
                    >
                      View less
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Subreddit Distribution Chart */}
              <Card className="bg-gray-800/30 border-gray-800 hover:shadow-[0_0_15px_rgba(0,255,255,0.15)] transition-shadow">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-purple-500" /> Subreddit Distribution
                  </CardTitle>
                  <div className="flex space-x-1">
                    <Button
                      variant={chartType === "pie" ? "default" : "outline"}
                      size="icon"
                      className={`h-8 w-8 ${chartType === "pie" ? "bg-cyan-400 text-black" : "border-cyan-800 hover:border-cyan-400"}`}
                      onClick={() => setChartType("pie")}
                    >
                      <PieChartIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={chartType === "bar" ? "default" : "outline"}
                      size="icon"
                      className={`h-8 w-8 ${chartType === "bar" ? "bg-cyan-400 text-black" : "border-cyan-800 hover:border-cyan-400"}`}
                      onClick={() => setChartType("bar")}
                    >
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <motion.div
                    key={chartType}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === "pie" ? (
                        <PieChart>
                          <Pie
                            data={redditData.subredditStats}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="count"
                            nameKey="name"
                            label={({ name, count }) => `r/${name}: ${count}`}
                          >
                            {redditData.subredditStats.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={redditColors[index % redditColors.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip
                            formatter={(value, name, props) => [`${value} posts`, `r/${props.payload.name}`]}
                          />
                        </PieChart>
                      ) : (
                        <BarChart
                          data={redditData.subredditStats}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                          <XAxis type="number" />
                          <YAxis type="category" dataKey="name" width={80} />
                          <RechartsTooltip formatter={(value) => [`${value} posts`, "Count"]} />
                          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                            {redditData.subredditStats.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={redditColors[index % redditColors.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </motion.div>

                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {redditData.subredditStats.slice(0, 8).map((subreddit: any, index: number) => (
                      <div
                        key={subreddit.name}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-cyan-950 cursor-pointer"
                        onClick={() => setSubredditFilter(subreddit.name)}
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: redditColors[index % redditColors.length] }}
                        ></div>
                        <span className="text-sm">
                          r/{subreddit.name}: {subreddit.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Engagement Timeline */}
            <Card className="bg-gray-800/30 border-gray-800 hover:shadow-[0_0_15px_rgba(0,255,255,0.15)] transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-500" /> Engagement Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={generateEngagementData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="upvotes"
                        stroke="#ff4500"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5, strokeWidth: 0 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="comments"
                        stroke="#00FFFF"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.section>
    </div>
  )
}

// Stats Card Component
function StatsCard({
  title,
  value,
  icon,
  color,
  index,
}: { title: string; value: number; icon: React.ReactNode; color: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="border border-gray-800 bg-gray-800/30 hover:shadow-[0_0_15px_rgba(0,255,255,0.15)] transition-shadow">
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

// Helper function to format date
function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

// Helper function to generate platform stats
function generatePlatformStats(posts: any[]) {
  const platformMap = new Map()

  posts.forEach((post) => {
    const platform = platformMap.get(post.platform) || {
      name: post.platform,
      count: 0,
      likes: 0,
      shares: 0,
      comments: 0,
    }

    platform.count += 1
    platform.likes += post.likes || 0
    platform.shares += post.shares || 0
    platform.comments += post.comments || 0

    platformMap.set(post.platform, platform)
  })

  return Array.from(platformMap.values()).sort((a, b) => b.count - a.count)
}

// Helper function to generate subreddit stats
function generateSubredditStats(posts: any[]) {
  const subredditMap = new Map()

  posts.forEach((post) => {
    const count = subredditMap.get(post.subreddit) || 0
    subredditMap.set(post.subreddit, count + 1)
  })

  return Array.from(subredditMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

// Helper function to generate engagement stats
function generateEngagementStats(posts: any[]) {
  const dateMap = new Map()
  const now = new Date()

  // Initialize dates for the last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(now.getDate() - i)
    const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })

    dateMap.set(dateStr, { date: dateStr, likes: 0, shares: 0, comments: 0, score: 0 })
  }

  // Aggregate post data by date
  posts.forEach((post) => {
    const postDate = new Date(post.createdAt)
    const dateStr = postDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })

    if (dateMap.has(dateStr)) {
      const data = dateMap.get(dateStr)
      data.likes += post.likes || 0
      data.shares += post.shares || 0
      data.comments += post.comments || 0
      data.score += post.score || 0
    }
  })

  return Array.from(dateMap.values())
}

// Helper function to generate engagement data for Reddit
function generateEngagementData() {
  const data = []
  const hours = 24

  for (let i = 0; i < hours; i++) {
    const hour = i % 12 === 0 ? 12 : i % 12
    const ampm = i < 12 ? "AM" : "PM"

    data.push({
      time: `${hour}${ampm}`,
      upvotes: Math.floor(Math.random() * 500) + 100,
      comments: Math.floor(Math.random() * 200) + 50,
    })
  }

  return data
}

// Helper function to generate combined engagement data
function generateCombinedEngagementData() {
  const data = []
  const now = new Date()

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(now.getDate() - i)
    const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })

    data.push({
      date: dateStr,
      social: Math.floor(Math.random() * 1000) + 200,
      reddit: Math.floor(Math.random() * 800) + 100,
    })
  }

  return data
}
