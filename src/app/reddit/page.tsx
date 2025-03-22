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
} from "recharts"
import { motion } from "framer-motion"
import {
  ArrowUpRight,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Filter,
  MessageSquare,
  Moon,
  PieChartIcon,
  Search,
  Sun,
  TrendingUp,
  Users,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"

export default function RedditPage() {
  const [data, setData] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [subredditFilter, setSubredditFilter] = useState<string | null>(null)
  const [chartType, setChartType] = useState<"pie" | "bar">("pie")
  const [expandedCards, setExpandedCards] = useState<{ [key: string]: boolean }>({
    trending: false,
    popular: false,
    subreddits: false,
  })
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const fetchRedditData = async () => {
      try {
        const res = await fetch("/api/reddit")
        const json = await res.json()

        // Process the data to ensure it has all the properties we need
        const processedData = {
          trending: json.map((post: any) => ({
            ...post,
            score: post.score || post.upvotes || 0,
            num_comments: post.num_comments || post.comments || 0,
            subreddit: post.subreddit || "unknown",
            created: post.created || new Date().toISOString(),
            isRising: post.isRising || Math.random() > 0.7, // Random for demo if not provided
          })),
        }

        // Add subreddit stats
        processedData.subredditStats = generateSubredditStats(processedData.trending)

        setData(processedData)
      } catch (error) {
        console.error("Error fetching Reddit data:", error)
        // Set fallback data for demo purposes
        setData({
          trending: generateMockRedditData(),
          subredditStats: generateMockSubredditStats(),
        })
      }
    }

    fetchRedditData()
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
            <div className="h-16 w-16 rounded-full border-4 border-t-orange-500 border-r-transparent border-b-transparent border-l-transparent animate-spin absolute"></div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    )

  // Filter posts based on search term and subreddit filter
  const filteredPosts = data.trending.filter((post: any) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubreddit = subredditFilter ? post.subreddit === subredditFilter : true
    return matchesSearch && matchesSubreddit
  })

  // Colors for charts
  const colors = [
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

  // Calculate stats
  const totalPosts = data.trending.length
  const totalComments = data.trending.reduce((acc: number, post: any) => acc + post.num_comments, 0)
  const totalUpvotes = data.trending.reduce((acc: number, post: any) => acc + post.score, 0)
  const totalSubreddits = [...new Set(data.trending.map((post: any) => post.subreddit))].length

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 space-y-8 max-w-7xl mx-auto"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            Reddit Trends Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Track trending posts, subreddits, and engagement</p>
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
              <DropdownMenuItem onClick={() => setSubredditFilter(null)}>All Subreddits</DropdownMenuItem>
              {data.subredditStats.map((subreddit: any) => (
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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Trending Posts"
          value={totalPosts}
          icon={<TrendingUp className="h-4 w-4" />}
          color="bg-orange-500"
          index={0}
        />
        <StatsCard
          title="Total Comments"
          value={totalComments}
          icon={<MessageSquare className="h-4 w-4" />}
          color="bg-blue-500"
          index={1}
        />
        <StatsCard
          title="Total Upvotes"
          value={totalUpvotes}
          icon={<ArrowUpRight className="h-4 w-4" />}
          color="bg-green-500"
          index={2}
        />
        <StatsCard
          title="Active Subreddits"
          value={totalSubreddits}
          icon={<Users className="h-4 w-4" />}
          color="bg-purple-500"
          index={3}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="subreddits">Subreddits</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
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
                <Button variant="ghost" size="sm" onClick={() => toggleExpand("trending")} className="h-8 w-8 p-0">
                  {expandedCards.trending ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CardHeader>
              <CardContent>
                {filteredPosts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No posts match your search criteria</div>
                ) : (
                  <ul className="space-y-3">
                    {(expandedCards.trending ? filteredPosts : filteredPosts.slice(0, 5)).map(
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
                {!expandedCards.trending && filteredPosts.length > 5 && (
                  <Button variant="ghost" size="sm" onClick={() => toggleExpand("trending")} className="w-full mt-3">
                    View all {filteredPosts.length} posts
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Popular Subreddits Card */}
            <Card className="shadow-md border border-border">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" /> Popular Subreddits
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => toggleExpand("subreddits")} className="h-8 w-8 p-0">
                  {expandedCards.subreddits ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CardHeader>
              <CardContent>
                {data.subredditStats.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No subreddit data available</div>
                ) : (
                  <ul className="space-y-3">
                    {(expandedCards.subreddits ? data.subredditStats : data.subredditStats.slice(0, 5)).map(
                      (subreddit: any, index: number) => (
                        <motion.li
                          key={subreddit.name}
                          className="p-3 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white">
                                  {subreddit.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">r/{subreddit.name}</div>
                                <div className="text-xs text-muted-foreground">{subreddit.count} trending posts</div>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8"
                              onClick={() => setSubredditFilter(subreddit.name)}
                            >
                              View
                            </Button>
                          </div>
                        </motion.li>
                      ),
                    )}
                  </ul>
                )}
                {!expandedCards.subreddits && data.subredditStats.length > 5 && (
                  <Button variant="ghost" size="sm" onClick={() => toggleExpand("subreddits")} className="w-full mt-3">
                    View all {data.subredditStats.length} subreddits
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Subreddit Distribution Chart */}
          <Card className="shadow-md border border-border">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-purple-500" /> Subreddit Distribution
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
                        data={data.subredditStats}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="name"
                        label={({ name, count }) => `r/${name}: ${count}`}
                      >
                        {data.subredditStats.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        formatter={(value, name, props) => [`${value} posts`, `r/${props.payload.name}`]}
                      />
                    </PieChart>
                  ) : (
                    <BarChart
                      data={data.subredditStats}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" width={80} />
                      <RechartsTooltip formatter={(value) => [`${value} posts`, "Count"]} />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {data.subredditStats.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </motion.div>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {data.subredditStats.slice(0, 8).map((subreddit: any, index: number) => (
                  <div
                    key={subreddit.name}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer"
                    onClick={() => setSubredditFilter(subreddit.name)}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    ></div>
                    <span className="text-sm">
                      r/{subreddit.name}: {subreddit.count}
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

        <TabsContent value="trending" className="space-y-6">
          <Card className="shadow-md border border-border">
            <CardHeader>
              <CardTitle>All Trending Posts</CardTitle>
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
                          <a
                            href={post.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-primary hover:underline flex items-center"
                          >
                            {post.title}
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                          <div className="flex items-center gap-2 mt-2">
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
                                className="bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                              >
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Rising
                              </Badge>
                            )}
                          </div>
                          {post.selftext && (
                            <p className="text-sm mt-3 text-muted-foreground line-clamp-2">{post.selftext}</p>
                          )}
                        </div>
                        {post.thumbnail && post.thumbnail !== "self" && post.thumbnail !== "default" && (
                          <div className="ml-4 h-16 w-16 rounded overflow-hidden flex-shrink-0">
                            <img
                              src={post.thumbnail || "/placeholder.svg"}
                              alt={post.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <ArrowUpRight className="h-4 w-4 text-orange-500" />
                            <span>{post.score}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{post.num_comments}</span>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{formatDate(post.created)}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subreddits" className="space-y-6">
          <Card className="shadow-md border border-border">
            <CardHeader>
              <CardTitle>Subreddit Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.subredditStats.map((subreddit: any, index: number) => (
                  <motion.div
                    key={subreddit.name}
                    className="p-4 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white">
                          {subreddit.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">r/{subreddit.name}</h3>
                        <p className="text-xs text-muted-foreground">{subreddit.count} trending posts</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Engagement Rate</span>
                        <span className="font-medium">{Math.floor(Math.random() * 30) + 70}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full"
                          style={{ width: `${Math.floor(Math.random() * 30) + 70}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Top Posts</h4>
                      <ul className="space-y-1">
                        {data.trending
                          .filter((post: any) => post.subreddit === subreddit.name)
                          .slice(0, 3)
                          .map((post: any, idx: number) => (
                            <li key={idx} className="text-sm truncate">
                              <a
                                href={post.url}
                                className="hover:underline text-muted-foreground hover:text-foreground"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {post.title}
                              </a>
                            </li>
                          ))}
                      </ul>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-4"
                      onClick={() => setSubredditFilter(subreddit.name)}
                    >
                      View All Posts
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
                <CardTitle>Upvotes vs Comments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={generateComparisonData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="upvotes" fill="#ff4500" name="Upvotes" />
                      <Bar dataKey="comments" fill="#0079d3" name="Comments" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md border border-border">
              <CardHeader>
                <CardTitle>Post Activity by Hour</CardTitle>
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
                      <Line type="monotone" dataKey="posts" stroke="#ff4500" name="New Posts" />
                      <Line type="monotone" dataKey="activity" stroke="#0079d3" name="Activity" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-md border border-border">
            <CardHeader>
              <CardTitle>Content Type Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={generateContentTypeData()}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {generateContentTypeData().map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                    <Legend />
                  </PieChart>
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
        "The front page of the internet, visualized."
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

// Helper function to generate mock Reddit data
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

// Helper function to generate mock subreddit stats
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

// Helper function to generate engagement data
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

// Helper function to generate comparison data
function generateComparisonData() {
  const subreddits = ["programming", "webdev", "reactjs", "nextjs", "javascript"]

  return subreddits.map((name) => ({
    name: `r/${name}`,
    upvotes: Math.floor(Math.random() * 5000) + 1000,
    comments: Math.floor(Math.random() * 1000) + 200,
  }))
}

// Helper function to generate hourly data
function generateHourlyData() {
  const data = []

  for (let i = 0; i < 24; i++) {
    data.push({
      hour: `${i}:00`,
      posts: Math.floor(Math.random() * 50) + 10,
      activity: Math.floor(Math.random() * 100) + 20,
    })
  }

  return data
}

// Helper function to generate content type data
function generateContentTypeData() {
  return [
    { name: "Text Posts", value: 45 },
    { name: "Images", value: 30 },
    { name: "Links", value: 15 },
    { name: "Videos", value: 10 },
  ]
}

