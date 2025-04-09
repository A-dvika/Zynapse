"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { motion } from "framer-motion"
import {
  BarChart3,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Filter,
  LineChartIcon,
  MessageSquare,
  Search,
  TrendingUp,
  User,
  Calendar,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function HackerNewsPage() {
  const [data, setData] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [chartType, setChartType] = useState<"bar" | "line">("bar")
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month">("week")
  const [expandedCards, setExpandedCards] = useState<{ [key: string]: boolean }>({
    topStories: false,
    techNews: false,
  })

  useEffect(() => {
    const fetchHackerNewsData = async () => {
      const res = await fetch("/api/hackernews")
      const json = await res.json()
      setData(json)
    }
    fetchHackerNewsData()
  }, [])

  const toggleExpand = (card: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [card]: !prev[card],
    }))
  }

  // Filter stories based on search term
  const filteredStories = data
    ? data.hackerNewsStories.filter(
        (story: any) =>
          story.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          story.by?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : []

  const filteredTechNews = data
    ? data.techNewsItems.filter(
        (item: any) =>
          item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.source?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : []

  // Generate engagement data for visualization
  const generateEngagementData = () => {
    return data
      ? data.hackerNewsStories.map((story: any) => ({
          title: story.title?.length > 20 ? story.title.substring(0, 20) + "..." : story.title,
          comments: story.descendants || 0,
          score: story.score || 0,
        }))
      : []
  }

  // Generate time-based data for visualization
  const generateTimeData = () => {
    const days = timeRange === "day" ? 1 : timeRange === "week" ? 7 : 30
    const timeData = []
    const now = new Date()

    for (let i = days; i >= 0; i--) {
      const date = new Date()
      date.setDate(now.getDate() - i)
      const dateStr = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })

      // Simulate activity metrics based on time range
      const storyCount = Math.floor(Math.random() * 15) + 5
      const commentCount = Math.floor(Math.random() * 50) + 20

      timeData.push({
        date: dateStr,
        stories: storyCount,
        comments: commentCount,
      })
    }

    return timeData
  }

  // Calculate metrics
  const totalStories = data ? data.hackerNewsStories.length : 0
  const totalComments = data
    ? data.hackerNewsStories.reduce((acc: number, story: any) => acc + (story.descendants || 0), 0)
    : 0
  const avgScore = data
    ? Math.round(data.hackerNewsStories.reduce((acc: number, story: any) => acc + (story.score || 0), 0) / totalStories)
    : 0
  const totalTechNews = data ? data.techNewsItems.length : 0

  // Colors for charts
  const colors = [
    "#ff6600", // HN orange
    "#00FFFF", // Neon Cyan
    "#10b981", // Green
    "#8b5cf6", // Purple
    "#f59e0b", // Yellow
    "#ef4444", // Red
    "#06b6d4", // Cyan
    "#ec4899", // Pink
  ]

  // Generate source distribution data
  const getSourceDistribution = () => {
    if (!data) return []
    const sources: { [key: string]: number } = {}
    data.techNewsItems.forEach((item: any) => {
      const source = item.source || "Unknown"
      sources[source] = (sources[source] || 0) + 1
    })

    return Object.entries(sources).map(([source, count]) => ({
      source,
      count,
    }))
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
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Hacker News Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Track top stories, tech news, and engagement</p>
          </motion.div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-9 w-[200px] md:w-[260px] bg-gray-800/50 border-gray-700"
              />
            </div>
            <div className="border-l h-6 mx-2 opacity-20"></div>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant={timeRange === "day" ? "default" : "outline"}
                className={`h-9 ${timeRange === "day" ? "bg-cyan-400 text-black hover:bg-cyan-500" : "border-cyan-800 hover:border-cyan-400"}`}
                onClick={() => setTimeRange("day")}
              >
                Day
              </Button>
              <Button
                size="sm"
                variant={timeRange === "week" ? "default" : "outline"}
                className={`h-9 ${timeRange === "week" ? "bg-cyan-400 text-black hover:bg-cyan-500" : "border-cyan-800 hover:border-cyan-400"}`}
                onClick={() => setTimeRange("week")}
              >
                Week
              </Button>
              <Button
                size="sm"
                variant={timeRange === "month" ? "default" : "outline"}
                className={`h-9 ${timeRange === "month" ? "bg-cyan-400 text-black hover:bg-cyan-500" : "border-cyan-800 hover:border-cyan-400"}`}
                onClick={() => setTimeRange("month")}
              >
                Month
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data ? (
            <>
              <StatsCard
                title="Top Stories"
                value={totalStories}
                icon={<TrendingUp className="h-4 w-4" />}
                color="bg-orange-500"
                index={0}
              />
              <StatsCard
                title="Total Comments"
                value={totalComments}
                icon={<MessageSquare className="h-4 w-4" />}
                color="bg-cyan-400"
                index={1}
              />
              <StatsCard
                title="Average Score"
                value={avgScore}
                icon={<BarChart3 className="h-4 w-4" />}
                color="bg-green-500"
                index={2}
              />
              <StatsCard
                title="Tech News Articles"
                value={totalTechNews}
                icon={<Calendar className="h-4 w-4" />}
                color="bg-purple-500"
                index={3}
              />
            </>
          ) : (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full bg-gray-800/50" />)
          )}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3 bg-gray-800/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black">
              Overview
            </TabsTrigger>
            <TabsTrigger value="stories" className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black">
              Top Stories
            </TabsTrigger>
            <TabsTrigger value="technews" className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black">
              Tech News
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {data ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Stories Card */}
                <Card className="bg-gray-800/30 border-gray-800 hover:shadow-[0_0_15px_rgba(0,255,255,0.15)] transition-shadow">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-orange-500" /> Top Stories
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpand("topStories")}
                      className="h-8 w-8 p-0 hover:bg-cyan-950"
                    >
                      {expandedCards.topStories ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {filteredStories
                        .slice(0, expandedCards.topStories ? filteredStories.length : 5)
                        .map((story: any, index: number) => (
                          <motion.li
                            key={story.id}
                            className="p-3 rounded-lg border border-gray-700 bg-gray-800/50 shadow-sm hover:shadow-md hover:border-cyan-800 transition-all"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            whileHover={{ scale: 1.01 }}
                          >
                            <div className="flex justify-between items-start">
                              <a
                                href={story.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-primary hover:underline hover:text-cyan-400 flex items-center"
                              >
                                {story.title}
                                <ExternalLink className="ml-1 h-3 w-3" />
                              </a>
                              <Badge className="bg-orange-950 text-orange-300 border-orange-800">
                                {story.score} points
                              </Badge>
                            </div>
                            <div className="flex items-center mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center mr-4">
                                <User className="h-3.5 w-3.5 mr-1 text-cyan-400" />
                                {story.by}
                              </div>
                              <div className="flex items-center mr-4">
                                <Clock className="h-3.5 w-3.5 mr-1 text-green-500" />
                                {formatTime(story.time)}
                              </div>
                              <div className="flex items-center">
                                <MessageSquare className="h-3.5 w-3.5 mr-1 text-purple-500" />
                                {story.descendants || 0} comments
                              </div>
                            </div>
                          </motion.li>
                        ))}
                    </ul>
                    {filteredStories.length > 5 && !expandedCards.topStories && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpand("topStories")}
                        className="w-full mt-3 hover:bg-cyan-950 hover:text-cyan-400"
                      >
                        View all {filteredStories.length} stories
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Engagement Stats */}
                <Card className="bg-gray-800/30 border-gray-800 hover:shadow-[0_0_15px_rgba(0,255,255,0.15)] transition-shadow">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-cyan-400" /> Engagement Metrics
                    </CardTitle>
                    <div className="flex space-x-1">
                      <Button
                        variant={chartType === "bar" ? "default" : "outline"}
                        size="icon"
                        className={`h-8 w-8 ${chartType === "bar" ? "bg-cyan-400 text-black" : "border-cyan-800 hover:border-cyan-400"}`}
                        onClick={() => setChartType("bar")}
                      >
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={chartType === "line" ? "default" : "outline"}
                        size="icon"
                        className={`h-8 w-8 ${chartType === "line" ? "bg-cyan-400 text-black" : "border-cyan-800 hover:border-cyan-400"}`}
                        onClick={() => setChartType("line")}
                      >
                        <LineChartIcon className="h-4 w-4" />
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
                        {chartType === "bar" ? (
                          <BarChart
                            data={generateEngagementData()}
                            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                            <XAxis
                              dataKey="title"
                              angle={-45}
                              textAnchor="end"
                              height={70}
                              interval={0}
                              tick={{ fontSize: 12 }}
                            />
                            <YAxis />
                            <RechartsTooltip
                              formatter={(value, name) => [value, name === "score" ? "Points" : "Comments"]}
                              labelFormatter={(label) => `Story: ${label}`}
                            />
                            <Bar name="score" dataKey="score" fill="#ff6600" radius={[8, 8, 0, 0]} />
                            <Bar name="comments" dataKey="comments" fill="#00FFFF" radius={[8, 8, 0, 0]} />
                          </BarChart>
                        ) : (
                          <LineChart data={generateTimeData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <RechartsTooltip
                              formatter={(value, name) => [value, name === "stories" ? "Stories" : "Comments"]}
                            />
                            <Line
                              type="monotone"
                              dataKey="stories"
                              stroke="#ff6600"
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
                        )}
                      </ResponsiveContainer>
                    </motion.div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Skeleton className="h-96 w-full bg-gray-800/50" />
            )}

            {/* Tech News Sources Chart */}
            <Card className="bg-gray-800/30 border-gray-800 hover:shadow-[0_0_15px_rgba(0,255,255,0.15)] transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Filter className="h-5 w-5 text-purple-500" /> News Sources Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[500px]">
                  {data ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getSourceDistribution()}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={220}
                          fill="#8884d8"
                          dataKey="count"
                          nameKey="source"
                          label={({ source, count }) => `${source}: ${count}`}
                        >
                          {getSourceDistribution().map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          formatter={(value, name, props) => [`${value} articles`, props.payload.source]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <Skeleton className="h-full w-full bg-gray-800/50" />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Activity Timeline */}
            <Card className="bg-gray-800/30 border-gray-800 hover:shadow-[0_0_15px_rgba(0,255,255,0.15)] transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-500" /> Activity Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[200px]">
                  {data ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={generateTimeData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <RechartsTooltip formatter={(value, name) => [`${value} ${name}`]} />
                        <Line
                          type="monotone"
                          name="stories"
                          dataKey="stories"
                          stroke="#ff6600"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5, strokeWidth: 0 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <Skeleton className="h-full w-full bg-gray-800/50" />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stories" className="space-y-6">
            <Card className="bg-gray-800/30 border-gray-800 hover:shadow-[0_0_15px_rgba(0,255,255,0.15)] transition-shadow">
              <CardHeader>
                <CardTitle>All Hacker News Stories</CardTitle>
              </CardHeader>
              <CardContent>
                {data ? (
                  <div className="space-y-4">
                    {filteredStories.map((story: any, index: number) => (
                      <motion.div
                        key={story.id}
                        className="p-4 rounded-lg border border-gray-700 bg-gray-800/50 shadow-sm hover:shadow-md hover:border-cyan-800 transition-all"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                          <div className="flex-1">
                            <a
                              href={story.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-primary hover:underline hover:text-cyan-400 flex items-center"
                            >
                              {story.title}
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                            <div className="flex flex-wrap items-center mt-2 text-sm text-muted-foreground gap-x-4 gap-y-2">
                              <div className="flex items-center">
                                <User className="h-3.5 w-3.5 mr-1 text-cyan-400" />
                                {story.by}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-3.5 w-3.5 mr-1 text-green-500" />
                                {formatTime(story.time)}
                              </div>
                              <div className="flex items-center">
                                <MessageSquare className="h-3.5 w-3.5 mr-1 text-purple-500" />
                                {story.descendants || 0} comments
                              </div>
                            </div>
                          </div>
                          <Badge className="bg-orange-950 text-orange-300 border-orange-800">
                            {story.score} points
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <Skeleton className="h-96 w-full bg-gray-800/50" />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technews" className="space-y-6">
            <Card className="bg-gray-800/30 border-gray-800 hover:shadow-[0_0_15px_rgba(0,255,255,0.15)] transition-shadow">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">Latest Tech News</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpand("techNews")}
                  className="h-8 w-8 p-0 hover:bg-cyan-950"
                >
                  {expandedCards.techNews ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CardHeader>
              <CardContent>
                {data ? (
                  <div className="space-y-4">
                    {(expandedCards.techNews ? filteredTechNews : filteredTechNews.slice(0, 5)).map(
                      (item: any, index: number) => (
                        <motion.div
                          key={item.id}
                          className="p-4 rounded-lg border border-gray-700 bg-gray-800/50 shadow-sm hover:shadow-md hover:border-cyan-800 transition-all"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <div className="flex-1">
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-primary hover:underline hover:text-cyan-400 flex items-center"
                              >
                                {item.title}
                                <ExternalLink className="ml-1 h-3 w-3" />
                              </a>
                              {item.description && (
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                              )}
                              <div className="flex items-center mt-2 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                  <Calendar className="h-3.5 w-3.5 mr-1 text-cyan-400" />
                                  {formatDate(item.createdAt)}
                                </div>
                              </div>
                            </div>
                            <Badge variant="outline" className="border-cyan-800 text-cyan-400">
                              {item.source}
                            </Badge>
                          </div>
                        </motion.div>
                      ),
                    )}
                    {filteredTechNews.length > 5 && !expandedCards.techNews && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpand("techNews")}
                        className="w-full mt-3 hover:bg-cyan-950 hover:text-cyan-400"
                      >
                        View all {filteredTechNews.length} tech news items
                      </Button>
                    )}
                  </div>
                ) : (
                  <Skeleton className="h-96 w-full bg-gray-800/50" />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Tech Quote */}
        <motion.div
          className="text-center mt-10 textt-lg italic text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          "Talk is cheap. Show me the code." — Linus Torvalds
        </motion.div>
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

// Helper function to format Unix timestamp
function formatTime(unixTimestamp: number) {
  if (!unixTimestamp) return "Unknown"

  const date = new Date(unixTimestamp * 1000)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  return `${Math.floor(diffInSeconds / 86400)}d ago`
}

// Helper function to format ISO date
function formatDate(dateString: string) {
  if (!dateString) return "Unknown"

  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}
