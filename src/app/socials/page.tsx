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
  Share2,
  Sun,
  TrendingUp,
  Twitter,
  Users,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch both data sources in parallel
        const [socialMediaResponse, redditResponse] = await Promise.all([
          fetch("/api/socialmedia"),
          fetch("/api/reddit"),
        ])

        const socialMediaJson = await socialMediaResponse.json()
        const redditJson = await redditResponse.json()

        // Process social media data
        const processedSocialData = {
          posts: socialMediaJson.posts.map((post: any) => ({
            ...post,
            likes: post.likes || 0,
            shares: post.shares || 0,
            comments: post.comments || 0,
            platform: post.platform || "unknown",
          })),
        }
        processedSocialData.platformStats = generatePlatformStats(processedSocialData.posts)
        processedSocialData.engagementStats = generateEngagementStats(processedSocialData.posts)

        // Process Reddit data
        const processedRedditData = {
          trending: redditJson.map((post: any) => ({
            ...post,
            score: post.score || post.upvotes || 0,
            num_comments: post.num_comments || post.comments || 0,
            subreddit: post.subreddit || "unknown",
            created: post.created || new Date().toISOString(),
            isRising: post.isRising || Math.random() > 0.7,
          })),
        }
        processedRedditData.subredditStats = generateSubredditStats(processedRedditData.trending)

        setSocialMediaData(processedSocialData)
        setRedditData(processedRedditData)
      } catch (error) {
        console.error("Error fetching data:", error)
        // Set fallback data for demo purposes
        setSocialMediaData({
          posts: generateMockSocialData(),
          platformStats: generateMockPlatformStats(),
          engagementStats: generateMockEngagementStats(),
        })
        setRedditData({
          trending: generateMockRedditData(),
          subredditStats: generateMockSubredditStats(),
        })
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
    socialMediaData?.posts?.reduce(
      (acc: number, post: any) => acc + (post.likes || 0) + (post.shares || 0) + (post.comments || 0),
      0,
    ) || 0

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
    "#0079d3", // Reddit blue
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
        return <Twitter className="h-4 w-4" />
      case "facebook":
        return <Facebook className="h-4 w-4" />
      case "instagram":
        return <Instagram className="h-4 w-4" />
      default:
        return <ExternalLink className="h-4 w-4" />
    }
  }

  const getPlatformColor = (platform: string) => {
    const key = platform.toLowerCase() as keyof typeof socialColors
    return socialColors[key] || socialColors.other
  }

  const getPlatformBadgeClass = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "twitter":
        return "bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
      case "facebook":
        return "bg-indigo-50 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
      case "instagram":
        return "bg-pink-50 text-pink-800 dark:bg-pink-950 dark:text-pink-300"
      case "linkedin":
        return "bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
      case "tiktok":
        return "bg-gray-50 text-gray-800 dark:bg-gray-950 dark:text-gray-300"
      case "youtube":
        return "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300"
      default:
        return "bg-gray-50 text-gray-800 dark:bg-gray-950 dark:text-gray-300"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-16 w-16">
            <Skeleton className="h-16 w-16 rounded-full absolute" />
            <div className="h-16 w-16 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin absolute"></div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 space-y-8 max-w-7xl mx-auto"
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
              className="pl-8 h-9 w-[200px] md:w-[260px]"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setPlatformFilter(null)
                  setSubredditFilter(null)
                }}
              >
                All Platforms
              </DropdownMenuItem>
              <DropdownMenuItem className="font-semibold" disabled>
                Social Media
              </DropdownMenuItem>
              {socialMediaData?.platformStats?.map((platform: any) => (
                <DropdownMenuItem key={platform.name} onClick={() => setPlatformFilter(platform.name)}>
                  {platform.name} ({platform.count})
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem className="font-semibold" disabled>
                Reddit
              </DropdownMenuItem>
              {redditData?.subredditStats?.map((subreddit: any) => (
                <DropdownMenuItem key={subreddit.name} onClick={() => setSubredditFilter(subreddit.name)}>
                  r/{subreddit.name} ({subreddit.count})
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="icon" onClick={toggleTheme} className="h-9 w-9">
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
          color="bg-green-500"
          index={3}
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="reddit">Reddit</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Social Media Overview */}
            <Card className="shadow-md border border-border">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Heart className="h-5 w-5 text-purple-500" /> Social Media Highlights
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpand("socialTrending")}
                  className="h-8 w-8 p-0"
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
                          className="p-3 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-medium text-primary flex items-start gap-2">
                                <Avatar className="h-8 w-8 mt-0.5">
                                  <AvatarImage
                                    src={post.authorImage || "/placeholder.svg?height=32&width=32"}
                                    alt={post.author}
                                  />
                                  <AvatarFallback>{post.author?.charAt(0) || "U"}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="flex items-center">
                                    <span className="font-semibold">{post.author || "Anonymous"}</span>
                                    <Badge variant="outline" className={`ml-2 ${getPlatformBadgeClass(post.platform)}`}>
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
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Heart className="h-4 w-4 text-red-500" />
                                <span>{post.likes}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Share2 className="h-4 w-4 text-green-500" />
                                <span>{post.shares}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageCircle className="h-4 w-4 text-blue-500" />
                                <span>{post.comments}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    {!expandedCards.socialTrending && filteredSocialPosts.length > 3 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpand("socialTrending")}
                        className="w-full mt-2"
                      >
                        View All Social Media Posts
                      </Button>
                    )}
                    {expandedCards.socialTrending && filteredSocialPosts.length > 3 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpand("socialTrending")}
                        className="w-full mt-2"
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
            <Card className="shadow-md border border-border">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-orange-500" /> Reddit Highlights
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpand("redditTrending")}
                  className="h-8 w-8 p-0"
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
                          className="p-3 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow"
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
                                  className="font-semibold truncate max-w-[250px] hover:underline"
                                >
                                  {post.title}
                                </a>
                                <Badge
                                  variant="outline"
                                  className="ml-2 bg-orange-50 text-orange-800 dark:bg-orange-950 dark:text-orange-300"
                                >
                                  r/{post.subreddit}
                                </Badge>
                              </div>
                            </div>
                            <Badge variant="secondary" className="ml-2">
                              <ArrowUpRight className="h-3 w-3 mr-1 text-orange-500" />
                              {post.score}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center mt-3">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MessageCircle className="h-4 w-4 text-blue-500" />
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
                        className="w-full mt-2"
                      >
                        View All Reddit Posts
                      </Button>
                    )}
                    {expandedCards.redditTrending && filteredRedditPosts.length > 3 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpand("redditTrending")}
                        className="w-full mt-2"
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
          <Card className="shadow-md border border-border">
            <CardHeader>
              <CardTitle>Platform Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Social Media</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Posts</span>
                      <span>{totalSocialPosts}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
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
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${(totalSocialEngagement / totalEngagement) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Reddit</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Posts</span>
                      <span>{totalRedditPosts}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
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
                    <div className="w-full bg-muted rounded-full h-2">
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
                <h3 className="font-semibold text-lg mb-4">Combined Engagement Timeline</h3>
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
            <h2 className="text-2xl font-bold">Social Media Dashboard</h2>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 h-9 w-[200px] md:w-[260px]"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setPlatformFilter(null)}>All Platforms</DropdownMenuItem>
                  {socialMediaData?.platformStats?.map((platform: any) => (
                    <DropdownMenuItem key={platform.name} onClick={() => setPlatformFilter(platform.name)}>
                      {platform.name} ({platform.count})
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Posts Card */}
            <Card className="shadow-md border border-border">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <ArrowUpRight className="h-5 w-5 text-blue-500" /> Top Performing Posts
                  </CardTitle>
                  {platformFilter && (
                    <CardDescription className="flex items-center mt-1">
                      Filtered by:
                      <Badge variant="outline" className="ml-2">
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
                  className="h-8 w-8 p-0"
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
                          className="p-3 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-medium text-primary flex items-start gap-2">
                                <Avatar className="h-8 w-8 mt-0.5">
                                  <AvatarImage
                                    src={post.authorImage || "/placeholder.svg?height=32&width=32"}
                                    alt={post.author}
                                  />
                                  <AvatarFallback>{post.author?.charAt(0) || "U"}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="flex items-center">
                                    <span className="font-semibold">{post.author || "Anonymous"}</span>
                                    <Badge variant="outline" className={`ml-2 ${getPlatformBadgeClass(post.platform)}`}>
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
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Heart className="h-4 w-4 text-red-500" />
                                <span>{post.likes}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Share2 className="h-4 w-4 text-green-500" />
                                <span>{post.shares}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageCircle className="h-4 w-4 text-blue-500" />
                                <span>{post.comments}</span>
                              </div>
                            </div>
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
                    className="w-full mt-3"
                  >
                    View all {filteredSocialPosts.length} posts
                  </Button>
                )}
                {expandedCards.socialTrending && filteredSocialPosts.length > 5 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpand("socialTrending")}
                    className="w-full mt-3"
                  >
                    View less
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Platform Distribution Chart */}
            <Card className="shadow-md border border-border">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-blue-500" /> Platform Distribution
                </CardTitle>
                <div className="flex space-x-1">
                  <Button
                    variant={chartType === "pie" ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setChartType("pie")}
                  >
                    <PieChartIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={chartType === "bar" ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
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
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer"
                        onClick={() => setPlatformFilter(platform.name)}
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: socialColors[key] || socialColors.other,
                          }}
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
          <Card className="shadow-md border border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <LineChartIcon className="h-5 w-5 text-green-500" /> Engagement Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={socialMediaData.engagementStats} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
            <h2 className="text-2xl font-bold">Reddit Trends Dashboard</h2>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 h-9 w-[200px] md:w-[260px]"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSubredditFilter(null)}>All Subreddits</DropdownMenuItem>
                  {redditData.subredditStats.map((subreddit: any) => (
                    <DropdownMenuItem key={subreddit.name} onClick={() => setSubredditFilter(subreddit.name)}>
                      r/{subreddit.name} ({subreddit.count})
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trending Posts Card */}
            <Card className="shadow-md border border-border">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-orange-500" /> Trending Posts
                  </CardTitle>
                  {subredditFilter && (
                    <CardDescription className="flex items-center mt-1">
                      Filtered by:
                      <Badge variant="outline" className="ml-2">
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
                  className="h-8 w-8 p-0"
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
                          className="p-3 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow"
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
                              className="font-medium text-primary hover:underline flex items-center"
                            >
                              {post.title}
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                            <Badge variant="secondary" className="ml-2">
                              <ArrowUpRight className="h-3 w-3 mr-1 text-orange-500" />
                              {post.score}
                            </Badge>
                          </div>
                          <div className="flex items-center mt-2">
                            <Badge
                              variant="outline"
                              className="text-xs bg-orange-50 text-orange-800 hover:bg-orange-100 cursor-pointer dark:bg-orange-950 dark:text-orange-300"
                              onClick={() => setSubredditFilter(post.subreddit)}
                            >
                              r/{post.subreddit}
                            </Badge>
                            {post.isRising && (
                              <Badge
                                variant="outline"
                                className="ml-2 bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                              >
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
                    className="w-full mt-3"
                  >
                    View all {filteredRedditPosts.length} posts
                  </Button>
                )}
                {expandedCards.redditTrending && filteredRedditPosts.length > 5 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpand("redditTrending")}
                    className="w-full mt-3"
                  >
                    View less
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Subreddit Distribution Chart */}
            <Card className="shadow-md border border-border">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-purple-500" /> Subreddit Distribution
                </CardTitle>
                <div className="flex space-x-1">
                  <Button
                    variant={chartType === "pie" ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setChartType("pie")}
                  >
                    <PieChartIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={chartType === "bar" ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
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
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer"
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
          <Card className="shadow-md border border-border">
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
                      stroke="#0079d3"
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
  )
}

// Stats Card Component
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
      <Card>
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
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
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

    dateMap.set(dateStr, {
      date: dateStr,
      likes: 0,
      shares: 0,
      comments: 0,
    })
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

// Mock data generation functions
function generateMockSocialData() {
  const platforms = ["Twitter", "Facebook", "Instagram", "LinkedIn", "TikTok"]
  const posts = []

  for (let i = 0; i < 20; i++) {
    const platform = platforms[Math.floor(Math.random() * platforms.length)]
    const likes = Math.floor(Math.random() * 1000)
    const shares = Math.floor(Math.random() * 500)
    const comments = Math.floor(Math.random() * 200)
    const hasImage = Math.random() > 0.3

    posts.push({
      id: `post-${i}`,
      content: `This is a sample ${platform} post #${i + 1} about our latest product launch. Check it out!`,
      author: ["John Doe", "Jane Smith", "Alex Johnson", "Sam Wilson", "Taylor Swift"][Math.floor(Math.random() * 5)],
      authorImage: `/placeholder.svg?height=40&width=40`,
      platform,
      likes,
      shares,
      comments,
      image: hasImage ? `/placeholder.svg?height=300&width=500` : null,
      url: `https://example.com/${platform.toLowerCase()}/post/${i}`,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
    })
  }

  return posts
}

function generateMockPlatformStats() {
  const platforms = ["Twitter", "Facebook", "Instagram", "LinkedIn", "TikTok"]

  return platforms.map((name) => ({
    name,
    count: Math.floor(Math.random() * 10) + 1,
    likes: Math.floor(Math.random() * 5000) + 500,
    shares: Math.floor(Math.random() * 2000) + 200,
    comments: Math.floor(Math.random() * 1000) + 100,
    engagementRate: Math.floor(Math.random() * 30) + 70,
  }))
}

function generateMockEngagementStats() {
  const data = []
  const now = new Date()

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(now.getDate() - i)
    const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })

    data.push({
      date: dateStr,
      likes: Math.floor(Math.random() * 500) + 50,
      shares: Math.floor(Math.random() * 200) + 20,
      comments: Math.floor(Math.random() * 100) + 10,
    })
  }

  return data
}

function generateMockRedditData() {
  const subreddits = [
    "programming",
    "webdev",
    "reactjs",
    "nextjs",
    "javascript",
    "technology",
    "news",
    "askreddit",
    "pics",
    "funny",
  ]
  const posts = []

  for (let i = 0; i < 20; i++) {
    const subreddit = subreddits[Math.floor(Math.random() * subreddits.length)]
    const isRising = Math.random() > 0.7
    const score = Math.floor(Math.random() * 10000)
    const comments = Math.floor(Math.random() * 500)

    posts.push({
      id: `post-${i}`,
      title: `Mock Reddit Post ${i + 1} about ${subreddit}`,
      url: `https://reddit.com/r/${subreddit}/comments/${i}`,
      subreddit,
      isRising,
      score,
      num_comments: comments,
      selftext:
        i % 3 === 0
          ? `This is a sample text post about ${subreddit}. It contains some content that would be displayed in the post.`
          : "",
      thumbnail: i % 4 === 0 ? `https://via.placeholder.com/75` : null,
      created: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
    })
  }

  return posts
}

function generateMockSubredditStats() {
  const subreddits = [
    "programming",
    "webdev",
    "reactjs",
    "nextjs",
    "javascript",
    "technology",
    "news",
    "askreddit",
    "pics",
    "funny",
  ]

  return subreddits.map((name) => ({
    name,
    count: Math.floor(Math.random() * 10) + 1,
  }))
}

