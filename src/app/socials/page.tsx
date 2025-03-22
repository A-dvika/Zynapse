"use client"

import type React from "react"

import { useEffect, useState } from "react"
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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
} from "recharts"
import { motion } from "framer-motion"
import {
  ArrowUpRight,
  BarChart3,
  ChevronDown,
  ChevronUp,
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
  Twitter,
  Users,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SocialMediaDashboard() {
  const [data, setData] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [platformFilter, setPlatformFilter] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState("week")
  const [chartType, setChartType] = useState<"pie" | "bar">("pie")
  const [expandedCards, setExpandedCards] = useState<{ [key: string]: boolean }>({
    trending: false,
    engagement: false,
    platforms: false,
  })
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const fetchSocialData = async () => {
      try {
        const res = await fetch("/api/socialmedia")
        const json = await res.json()

        // Process the data
        const processedData = {
          posts: json.posts.map((post: any) => ({
            ...post,
            // Ensure all posts have these properties
            likes: post.likes || 0,
            shares: post.shares || 0,
            comments: post.comments || 0,
            platform: post.platform || "unknown",
          })),
        }

        // Add platform stats
        processedData.platformStats = generatePlatformStats(processedData.posts)

        // Add engagement stats
        processedData.engagementStats = generateEngagementStats(processedData.posts)

        setData(processedData)
      } catch (error) {
        console.error("Error fetching social media data:", error)
        // Set fallback data for demo purposes
        setData({
          posts: generateMockSocialData(),
          platformStats: generateMockPlatformStats(),
          engagementStats: generateMockEngagementStats(),
        })
      }
    }

    fetchSocialData()
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

  if (!data)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-16 w-16">
            <Skeleton className="h-16 w-16 rounded-full absolute" />
            <div className="h-16 w-16 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin absolute"></div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    )

  // Filter posts based on search term and platform filter
  const filteredPosts = data.posts.filter((post: any) => {
    const matchesSearch = post.content?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlatform = platformFilter ? post.platform === platformFilter : true
    return matchesSearch && matchesPlatform
  })

  // Colors for charts
  const colors = {
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

  const platformColors = Object.values(colors)

  // Calculate stats
  const totalPosts = data.posts.length
  const totalLikes = data.posts.reduce((acc: number, post: any) => acc + post.likes, 0)
  const totalShares = data.posts.reduce((acc: number, post: any) => acc + post.shares, 0)
  const totalComments = data.posts.reduce((acc: number, post: any) => acc + post.comments, 0)
  const totalEngagement = totalLikes + totalShares + totalComments

  // Get platform icon
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

  // Get platform color
  const getPlatformColor = (platform: string) => {
    const key = platform.toLowerCase() as keyof typeof colors
    return colors[key] || colors.other
  }

  // Get platform badge class
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

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 space-y-8 max-w-7xl mx-auto"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Social Media Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Track engagement and performance across platforms</p>
        </motion.div>

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
              {data.platformStats.map((platform: any) => (
                <DropdownMenuItem key={platform.name} onClick={() => setPlatformFilter(platform.name)}>
                  {platform.name} ({platform.count})
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="icon" onClick={toggleTheme} className="h-9 w-9">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Posts"
          value={totalPosts}
          icon={<MessageCircle className="h-4 w-4" />}
          color="bg-blue-500"
          index={0}
        />
        <StatsCard
          title="Total Likes"
          value={totalLikes}
          icon={<Heart className="h-4 w-4" />}
          color="bg-red-500"
          index={1}
        />
        <StatsCard
          title="Total Shares"
          value={totalShares}
          icon={<Share2 className="h-4 w-4" />}
          color="bg-green-500"
          index={2}
        />
        <StatsCard
          title="Total Comments"
          value={totalComments}
          icon={<MessageCircle className="h-4 w-4" />}
          color="bg-purple-500"
          index={3}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
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
                <Button variant="ghost" size="sm" onClick={() => toggleExpand("trending")} className="h-8 w-8 p-0">
                  {expandedCards.trending ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CardHeader>
              <CardContent>
                {filteredPosts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No posts match your search criteria</div>
                ) : (
                  <ul className="space-y-3">
                    {(expandedCards.trending ? filteredPosts : filteredPosts.slice(0, 5))
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
                {!expandedCards.trending && filteredPosts.length > 5 && (
                  <Button variant="ghost" size="sm" onClick={() => toggleExpand("trending")} className="w-full mt-3">
                    View all {filteredPosts.length} posts
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Engagement by Platform Card */}
            <Card className="shadow-md border border-border">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" /> Engagement by Platform
                </CardTitle>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[120px] h-8">
                    <SelectValue placeholder="Select Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Last Day</SelectItem>
                    <SelectItem value="week">Last Week</SelectItem>
                    <SelectItem value="month">Last Month</SelectItem>
                    <SelectItem value="year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.platformStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="likes" name="Likes" stackId="a" fill={colors.facebook} />
                      <Bar dataKey="shares" name="Shares" stackId="a" fill={colors.twitter} />
                      <Bar dataKey="comments" name="Comments" stackId="a" fill={colors.instagram} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Platform Distribution Chart */}
          <Card className="shadow-md border border-border">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-blue-500" /> Platform Distribution
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
                        data={data.platformStats}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="name"
                        label={({ name, count }) => `${name}: ${count}`}
                      >
                        {data.platformStats.map((entry: any, index: number) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={getPlatformColor(entry.name) || platformColors[index % platformColors.length]}
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(value, name, props) => [`${value} posts`, props.payload.name]} />
                    </PieChart>
                  ) : (
                    <BarChart
                      data={data.platformStats}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" width={80} />
                      <RechartsTooltip formatter={(value) => [`${value} posts`, "Count"]} />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {data.platformStats.map((entry: any, index: number) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={getPlatformColor(entry.name) || platformColors[index % platformColors.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </motion.div>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {data.platformStats.map((platform: any, index: number) => (
                  <div
                    key={platform.name}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer"
                    onClick={() => setPlatformFilter(platform.name)}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          getPlatformColor(platform.name) || platformColors[index % platformColors.length],
                      }}
                    ></div>
                    <span className="text-sm">
                      {platform.name}: {platform.count}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

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
                  <AreaChart data={data.engagementStats} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="likes"
                      stackId="1"
                      stroke={colors.facebook}
                      fill={colors.facebook}
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="shares"
                      stackId="1"
                      stroke={colors.twitter}
                      fill={colors.twitter}
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="comments"
                      stackId="1"
                      stroke={colors.instagram}
                      fill={colors.instagram}
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="posts" className="space-y-6">
          <Card className="shadow-md border border-border">
            <CardHeader>
              <CardTitle>All Posts</CardTitle>
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
            </CardHeader>
            <CardContent>
              {filteredPosts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No posts match your search criteria</div>
              ) : (
                <div className="space-y-4">
                  {filteredPosts.map((post: any, index: number) => (
                    <motion.div
                      key={post.id || index}
                      className="p-4 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage
                                src={post.authorImage || "/placeholder.svg?height=40&width=40"}
                                alt={post.author}
                              />
                              <AvatarFallback>{post.author?.charAt(0) || "U"}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold">{post.author || "Anonymous"}</div>
                              <div className="text-xs text-muted-foreground flex items-center">
                                <Badge variant="outline" className={`mr-2 ${getPlatformBadgeClass(post.platform)}`}>
                                  {getPlatformIcon(post.platform)}
                                  <span className="ml-1">{post.platform}</span>
                                </Badge>
                                {formatDate(post.createdAt)}
                              </div>
                            </div>
                          </div>
                          <p className="mt-3">{post.content}</p>
                          {post.image && (
                            <div className="mt-3 rounded-md overflow-hidden">
                              <img
                                src={post.image || "/placeholder.svg"}
                                alt="Post image"
                                className="w-full max-h-[300px] object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-4 pt-3 border-t">
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4 text-red-500" />
                            <span>{post.likes} likes</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Share2 className="h-4 w-4 text-green-500" />
                            <span>{post.shares} shares</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4 text-blue-500" />
                            <span>{post.comments} comments</span>
                          </div>
                        </div>
                        {post.url && (
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={post.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1"
                            >
                              <span>View Original</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-6">
          <Card className="shadow-md border border-border">
            <CardHeader>
              <CardTitle>Platform Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.platformStats.map((platform: any, index: number) => (
                  <motion.div
                    key={platform.name}
                    className="p-4 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="h-10 w-10 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: getPlatformColor(platform.name) }}
                      >
                        {getPlatformIcon(platform.name)}
                      </div>
                      <div>
                        <h3 className="font-medium">{platform.name}</h3>
                        <p className="text-xs text-muted-foreground">{platform.count} posts</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Engagement Rate</span>
                        <span className="font-medium">
                          {platform.engagementRate || Math.floor(Math.random() * 30) + 70}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${platform.engagementRate || Math.floor(Math.random() * 30) + 70}%`,
                            backgroundColor: getPlatformColor(platform.name),
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-lg font-semibold">
                          {platform.likes || Math.floor(Math.random() * 1000)}
                        </div>
                        <div className="text-xs text-muted-foreground">Likes</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold">
                          {platform.shares || Math.floor(Math.random() * 500)}
                        </div>
                        <div className="text-xs text-muted-foreground">Shares</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold">
                          {platform.comments || Math.floor(Math.random() * 300)}
                        </div>
                        <div className="text-xs text-muted-foreground">Comments</div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-4"
                      onClick={() => setPlatformFilter(platform.name)}
                    >
                      View Platform Posts
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-md border border-border">
              <CardHeader>
                <CardTitle>Engagement Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Likes", value: totalLikes },
                          { name: "Shares", value: totalShares },
                          { name: "Comments", value: totalComments },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        <Cell fill={colors.facebook} />
                        <Cell fill={colors.twitter} />
                        <Cell fill={colors.instagram} />
                      </Pie>
                      <RechartsTooltip
                        formatter={(value) => [`${value} (${((value / totalEngagement) * 100).toFixed(1)}%)`, "Count"]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md border border-border">
              <CardHeader>
                <CardTitle>Post Activity by Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={generateHourlyData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Line type="monotone" dataKey="posts" stroke={colors.facebook} name="Posts" />
                      <Line type="monotone" dataKey="engagement" stroke={colors.twitter} name="Engagement" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-md border border-border">
            <CardHeader>
              <CardTitle>Content Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={generateContentTypeData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="engagement" fill={colors.facebook} name="Avg. Engagement" />
                    <Bar dataKey="reach" fill={colors.twitter} name="Avg. Reach" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Inspirational Quote */}
      <motion.div
        className="text-center mt-10 text-lg italic text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        "Connect, engage, and analyze across all your social platforms."
      </motion.div>
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

// Helper function to generate mock social media data
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

// Helper function to generate mock platform stats
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

// Helper function to generate mock engagement stats
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

// Helper function to generate hourly data
function generateHourlyData() {
  const data = []

  for (let i = 0; i < 24; i++) {
    data.push({
      hour: `${i}:00`,
      posts: Math.floor(Math.random() * 30) + 5,
      engagement: Math.floor(Math.random() * 500) + 100,
    })
  }

  return data
}

// Helper function to generate content type data
function generateContentTypeData() {
  return [
    {
      type: "Images",
      engagement: Math.floor(Math.random() * 500) + 300,
      reach: Math.floor(Math.random() * 2000) + 1000,
    },
    {
      type: "Videos",
      engagement: Math.floor(Math.random() * 500) + 400,
      reach: Math.floor(Math.random() * 2000) + 1500,
    },
    { type: "Text", engagement: Math.floor(Math.random() * 500) + 200, reach: Math.floor(Math.random() * 2000) + 800 },
    { type: "Links", engagement: Math.floor(Math.random() * 500) + 250, reach: Math.floor(Math.random() * 2000) + 900 },
    {
      type: "Polls",
      engagement: Math.floor(Math.random() * 500) + 350,
      reach: Math.floor(Math.random() * 2000) + 1200,
    },
  ]
}

