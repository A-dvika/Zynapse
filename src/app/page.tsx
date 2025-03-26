"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Code,
  Eye,
  Hash,
  HelpCircle,
  MessageSquare,
  Newspaper,
  Star,
  ThumbsUp,
  Zap,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

// Sample data for charts and content
const languageData = [
  { name: "JavaScript", value: 40, color: "#f1e05a" },
  { name: "Python", value: 30, color: "#3572A5" },
  { name: "TypeScript", value: 15, color: "#2b7489" },
  { name: "Go", value: 10, color: "#00ADD8" },
  { name: "Rust", value: 5, color: "#dea584" },
]

const engagementData = [
  { name: "Mon", reddit: 120, github: 150, stackoverflow: 90 },
  { name: "Tue", reddit: 160, github: 130, stackoverflow: 100 },
  { name: "Wed", reddit: 180, github: 200, stackoverflow: 120 },
  { name: "Thu", reddit: 190, github: 180, stackoverflow: 140 },
  { name: "Fri", reddit: 220, github: 250, stackoverflow: 160 },
  { name: "Sat", reddit: 240, github: 190, stackoverflow: 180 },
  { name: "Sun", reddit: 280, github: 220, stackoverflow: 200 },
]

const techNews = [
  {
    id: 1,
    title: "Apple announces new M3 Ultra chip with 32-core GPU",
    source: "The Verge",
    time: "2 hours ago",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 2,
    title: "Microsoft integrates AI assistant across all Office apps",
    source: "TechCrunch",
    time: "5 hours ago",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 3,
    title: "New JavaScript framework claims 10x performance over React",
    source: "Hacker News",
    time: "8 hours ago",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 4,
    title: "GitHub Copilot introduces new features for pair programming",
    source: "GitHub Blog",
    time: "12 hours ago",
    image: "/placeholder.svg?height=60&width=60",
  },
]

const socialMediaPosts = [
  {
    id: 1,
    username: "@vercel",
    content: "Introducing Next.js 15 with 50% faster builds and improved image optimization",
    platform: "Twitter",
    likes: 3421,
    shares: 876,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    username: "@reactjs",
    content: "React 19 is coming with built-in server components and streaming SSR",
    platform: "Mastodon",
    likes: 2987,
    shares: 654,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    username: "@github",
    content: "GitHub Copilot Chat is now available for all developers",
    platform: "Twitter",
    likes: 4532,
    shares: 1243,
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const memes = [
  {
    id: 1,
    title: "When your code works on the first try",
    upvotes: 9876,
    source: "r/ProgrammerHumor",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    title: "CSS positioning be like",
    upvotes: 8765,
    source: "r/webdev",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    title: "AI taking over programming jobs",
    upvotes: 7654,
    source: "r/ProgrammerHumor",
    image: "/placeholder.svg?height=200&width=300",
  },
]

const quickStats = [
  {
    id: 1,
    title: "Reddit Engagement",
    value: "12.4K",
    change: "+15%",
    isPositive: true,
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    id: 2,
    title: "GitHub Stars",
    value: "32.7K",
    change: "+23%",
    isPositive: true,
    icon: <Star className="h-4 w-4" />,
  },
  {
    id: 3,
    title: "Stack Overflow",
    value: "8.9K",
    change: "+8%",
    isPositive: true,
    icon: <HelpCircle className="h-4 w-4" />,
  },
  {
    id: 4,
    title: "Tech News",
    value: "543",
    change: "+12%",
    isPositive: true,
    icon: <Newspaper className="h-4 w-4" />,
  },
]

const topStories = [
  {
    id: 1,
    title: "OpenAI launches GPT-5 with unprecedented reasoning capabilities",
    source: "TechCrunch",
    snippet: "The new model demonstrates human-level problem solving across multiple domains.",
    time: "3 hours ago",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    title: "Google unveils quantum computing breakthrough with 1000-qubit processor",
    source: "Wired",
    snippet: "The new processor achieves quantum supremacy in solving complex optimization problems.",
    time: "5 hours ago",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 3,
    title: "Tesla's new battery technology extends EV range by 70%",
    source: "The Verge",
    snippet: "The solid-state battery design promises to revolutionize electric vehicle adoption.",
    time: "8 hours ago",
    image: "/placeholder.svg?height=80&width=80",
  },
]

const languageRepos = {
  JavaScript: [
    { name: "facebook/react", stars: 203876 },
    { name: "vuejs/vue", stars: 198765 },
    { name: "angular/angular", stars: 87654 },
  ],
  Python: [
    { name: "tensorflow/tensorflow", stars: 176543 },
    { name: "pytorch/pytorch", stars: 65432 },
    { name: "django/django", stars: 54321 },
  ],
  TypeScript: [
    { name: "microsoft/typescript", stars: 93421 },
    { name: "vercel/next.js", stars: 112543 },
    { name: "nestjs/nest", stars: 54321 },
  ],
}

const aiSummaries = [
  "Next.js 15 introduces 50% faster builds and improved image optimization, making it the fastest React framework yet",
  "TypeScript 5.3 adds new features for type safety and developer productivity with improved inference",
  "React Server Components are changing how developers think about data fetching and rendering",
  "HTMX is gaining popularity as a lightweight alternative to JavaScript frameworks for interactive UIs",
  "Rust continues to grow in web development with new frameworks like Leptos and Dioxus",
  "WebAssembly is expanding beyond the browser with WASI for server-side applications",
]

export default function TechDashboard() {
  const [showAllReddit, setShowAllReddit] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [currentMeme, setCurrentMeme] = useState(0)
  const [expandedRepo, setExpandedRepo] = useState<number | null>(null)
  const [expandedStory, setExpandedStory] = useState<number | null>(null)
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null)

  const [gadgets, setGadgets] = useState([])

  useEffect(() => {
    // Fetch gadget data from the API
    const fetchGadgets = async () => {
      try {
        const response = await fetch("/api/gadgets")
        if (!response.ok) {
          throw new Error("Failed to fetch gadget data")
        }
        const data = await response.json()
        // Take only the first 4 gadgets
        setGadgets(data.slice(0, 4))
      } catch (error) {
        console.error("Error fetching gadget data:", error)
        // Use tech news as fallback if API fails
        setGadgets(techNews)
      }
    }

    fetchGadgets()
  }, [])

  // Mock data for GitHub repos
  const githubRepos = [
    {
      id: 1,
      name: "vercel/next.js",
      description: "The React Framework for the Web",
      stars: 112543,
      forks: 24680,
      language: "TypeScript",
      color: "#2b7489",
    },
    {
      id: 2,
      name: "facebook/react",
      description: "A declarative, efficient, and flexible JavaScript library for building user interfaces",
      stars: 203876,
      forks: 42567,
      language: "JavaScript",
      color: "#f1e05a",
    },
    {
      id: 3,
      name: "microsoft/vscode",
      description: "Visual Studio Code",
      stars: 148932,
      forks: 25678,
      language: "TypeScript",
      color: "#2b7489",
    },
    {
      id: 4,
      name: "tensorflow/tensorflow",
      description: "An Open Source Machine Learning Framework for Everyone",
      stars: 176543,
      forks: 89012,
      language: "Python",
      color: "#3572A5",
    },
    {
      id: 5,
      name: "denoland/deno",
      description: "A secure JavaScript and TypeScript runtime",
      stars: 89765,
      forks: 6789,
      language: "Rust",
      color: "#dea584",
    },
    {
      id: 6,
      name: "golang/go",
      description: "The Go programming language",
      stars: 112345,
      forks: 16789,
      language: "Go",
      color: "#00ADD8",
    },
  ]

  // Mock data for Reddit trends
  const redditTrends = [
    {
      id: 1,
      title: "I built a VS Code extension that suggests code based on your comments",
      subreddit: "r/programming",
      upvotes: 4567,
      comments: 342,
      trend: "+15%",
      url: "#",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      title: "The new MacBook Pro M3 Max benchmarks are insane",
      subreddit: "r/apple",
      upvotes: 3982,
      comments: 876,
      trend: "+23%",
      url: "#",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      title: "This AI tool can convert any website to React code in seconds",
      subreddit: "r/webdev",
      upvotes: 2876,
      comments: 543,
      trend: "+8%",
      url: "#",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      title: "GitHub Copilot for CLI is now available for everyone",
      subreddit: "r/github",
      upvotes: 2345,
      comments: 321,
      trend: "+12%",
      url: "#",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 5,
      title: "I analyzed 1000 npm packages and found these security issues",
      subreddit: "r/javascript",
      upvotes: 1987,
      comments: 432,
      trend: "+5%",
      url: "#",
      image: "/placeholder.svg?height=40&width=40",
    },
  ]

  // Mock data for Stack Overflow questions
  const stackOverflowQuestions = [
    {
      id: 1,
      title: "How to properly implement React Server Components with Next.js?",
      votes: 42,
      answers: 5,
      views: 1234,
      tags: ["react", "nextjs", "server-components"],
      link: "#",
      creationDate: "2023-05-15",
    },
    {
      id: 2,
      title: "What's the most efficient way to handle authentication in a Next.js app?",
      votes: 38,
      answers: 7,
      views: 2345,
      tags: ["nextjs", "authentication", "jwt"],
      link: "#",
      creationDate: "2023-05-14",
    },
    {
      id: 3,
      title: "How to optimize Tailwind CSS for production?",
      votes: 29,
      answers: 4,
      views: 1876,
      tags: ["tailwindcss", "optimization", "css"],
      link: "#",
      creationDate: "2023-05-13",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMeme((prev) => (prev + 1) % memes.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark bg-background text-foreground" : "light"}`}>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="p-6 space-y-8 max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <motion.h1
            className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Tech Trends Dashboard
          </motion.h1>
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6">
          <div className="space-y-6">
            {/* Top row - 4 equal charts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {quickStats.map((stat, index) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <Card className="bg-gray-800/50 border-gray-800">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                          <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                        <div className={`p-2 rounded-full ${stat.isPositive ? "bg-green-500/20" : "bg-red-500/20"}`}>
                          {stat.icon}
                        </div>
                      </div>
                      <div className={`text-sm mt-2 ${stat.isPositive ? "text-green-400" : "text-red-400"}`}>
                        {stat.change} from last week
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Second row - 2 charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Platform Engagement Chart */}
              <Card className="bg-gray-800/30 border-gray-800">
                <CardHeader>
                  <CardTitle>Platform Engagement</CardTitle>
                  <CardDescription className="text-gray-400">Weekly activity across tech platforms</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      reddit: {
                        label: "Reddit",
                        color: "hsl(0, 100%, 67%)",
                      },
                      github: {
                        label: "GitHub",
                        color: "hsl(210, 100%, 67%)",
                      },
                      stackoverflow: {
                        label: "Stack Overflow",
                        color: "hsl(30, 100%, 67%)",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={engagementData}>
                        <defs>
                          <linearGradient id="redditGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(0, 100%, 67%)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(0, 100%, 67%)" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="githubGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(210, 100%, 67%)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(210, 100%, 67%)" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="stackoverflowGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(30, 100%, 67%)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(30, 100%, 67%)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Area
                          type="monotone"
                          dataKey="reddit"
                          stroke="var(--color-reddit)"
                          fillOpacity={1}
                          fill="url(#redditGradient)"
                        />
                        <Area
                          type="monotone"
                          dataKey="github"
                          stroke="var(--color-github)"
                          fillOpacity={1}
                          fill="url(#githubGradient)"
                        />
                        <Area
                          type="monotone"
                          dataKey="stackoverflow"
                          stroke="var(--color-stackoverflow)"
                          fillOpacity={1}
                          fill="url(#stackoverflowGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Languages & Top Repos */}
              <Card className="bg-gray-800/30 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Badge className="mr-2 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 hover:text-purple-300">
                      <Code className="h-3 w-3 mr-1" />
                      Languages
                    </Badge>
                    Languages & Top Repositories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium mb-4 text-sm">Popular Languages</h3>
                      <ChartContainer
                        config={{
                          javascript: {
                            label: "JavaScript",
                            color: "#f1e05a",
                          },
                          python: {
                            label: "Python",
                            color: "#3572A5",
                          },
                          typescript: {
                            label: "TypeScript",
                            color: "#2b7489",
                          },
                          go: {
                            label: "Go",
                            color: "#00ADD8",
                          },
                          rust: {
                            label: "Rust",
                            color: "#dea584",
                          },
                        }}
                        className="h-[200px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={languageData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={2}
                              dataKey="value"
                            >
                              {languageData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip content={<ChartTooltipContent />} />
                          </PieChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                    <div>
                      <h3 className="font-medium mb-4 text-sm">Top Repositories by Language</h3>
                      <div className="space-y-4">
                        {Object.entries(languageRepos)
                          .slice(0, 3)
                          .map(([language, repos]) => (
                            <motion.div
                              key={language}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                              className="space-y-2"
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{
                                    backgroundColor: languageData.find((l) => l.name === language)?.color || "#ccc",
                                  }}
                                ></div>
                                <span className="font-medium text-sm">{language}</span>
                              </div>
                              {repos.slice(0, 1).map((repo) => (
                                <div key={repo.name} className="flex justify-between items-center pl-5">
                                  <span className="text-xs text-gray-400">{repo.name}</span>
                                  <div className="flex items-center text-xs">
                                    <Star className="h-3 w-3 mr-1 text-yellow-400" />
                                    <span>{repo.stars.toLocaleString()}</span>
                                  </div>
                                </div>
                              ))}
                              <Progress
                                value={languageData.find((l) => l.name === language)?.value}
                                className="h-1.5"
                                style={
                                  {
                                    backgroundColor: "rgba(255,255,255,0.1)",
                                    "--progress-background": languageData.find((l) => l.name === language)?.color,
                                  } as React.CSSProperties
                                }
                              />
                            </motion.div>
                          ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Middle row - Carousel */}
            <Card className="shadow-md border border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Badge className="mr-2 bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 hover:text-indigo-300">
                    <Zap className="h-3 w-3 mr-1" />
                    AI
                  </Badge>
                  AI-Generated Tech Insights
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Continuously updated insights from across the tech ecosystem
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-0">
                <div className="relative h-32 overflow-hidden">
                  <div className="absolute inset-0 flex items-center">
                    <motion.div
                      className="flex gap-4"
                      animate={{ x: [0, -2000] }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 30,
                        ease: "linear",
                      }}
                    >
                      {[...aiSummaries, ...aiSummaries].map((summary, i) => (
                        <motion.div
                          key={i}
                          className="flex-shrink-0 w-80 h-24 rounded-lg bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 p-4 text-white"
                          whileHover={{ y: -5, scale: 1.02 }}
                        >
                          <p className="text-sm">{summary}</p>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </CardContent>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div
                    className="bg-gray-800/50 rounded-xl p-4 border border-gray-700"
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300">
                        Reddit
                      </Badge>
                      <span className="text-xs text-gray-400">Top Post</span>
                    </div>
                    <h3 className="font-medium mb-2">{redditTrends[0].title}</h3>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>{redditTrends[0].subreddit}</span>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        <span>{redditTrends[0].upvotes.toLocaleString()}</span>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    className="bg-gray-800/50 rounded-xl p-4 border border-gray-700"
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 hover:text-blue-300">
                        GitHub
                      </Badge>
                      <span className="text-xs text-gray-400">Trending Repo</span>
                    </div>
                    <h3 className="font-medium mb-2">{githubRepos[0].name}</h3>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>{githubRepos[0].language}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        <span>{githubRepos[0].stars.toLocaleString()}</span>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    className="bg-gray-800/50 rounded-xl p-4 border border-gray-700"
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 hover:text-yellow-300">
                        Meme
                      </Badge>
                      <span className="text-xs text-gray-400">Most Viral</span>
                    </div>
                    <h3 className="font-medium mb-2">{memes[0].title}</h3>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>{memes[0].source}</span>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        <span>{memes[0].upvotes.toLocaleString()}</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>

            {/* Bottom row - 3 column layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Reddit Trends */}
              <Card className="bg-gray-800/30 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Badge className="mr-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Reddit
                    </Badge>
                    Trending Discussions
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-4">
                    {(showAllReddit ? redditTrends : redditTrends.slice(0, 4)).map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="flex gap-3 pb-3 border-b border-gray-700 last:border-0"
                      >
                        <div className="shrink-0">
                          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm mb-1 truncate">{post.title}</h3>
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>{post.subreddit}</span>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                <ThumbsUp className="h-3 w-3 mr-1" />
                                <span>{post.upvotes.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center">
                                <MessageSquare className="h-3 w-3 mr-1" />
                                <span>{post.comments}</span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-1 text-xs text-green-400">{post.trend}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-gray-400 hover:text-gray-100"
                    onClick={() => setShowAllReddit(!showAllReddit)}
                  >
                    {showAllReddit ? "Show Less" : "View All"} <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>

              {/* Stack Overflow Questions */}
              <Card className="bg-gray-800/30 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Badge className="mr-2 bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 hover:text-orange-300">
                      <HelpCircle className="h-3 w-3 mr-1" />
                      Stack Overflow
                    </Badge>
                    Top Questions
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-4">
                    {stackOverflowQuestions.map((question, index) => (
                      <motion.div
                        key={question.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="pb-3 border-b border-gray-700 last:border-0"
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-sm mb-2">{question.title}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 rounded-full"
                            onClick={() => setExpandedQuestion(expandedQuestion === question.id ? null : question.id)}
                          >
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${expandedQuestion === question.id ? "rotate-180" : ""}`}
                            />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {question.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="bg-gray-700/50 text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                          <div className="flex items-center">
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            <span>{question.votes} votes</span>
                          </div>
                          <div className="flex items-center">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            <span>{question.answers} answers</span>
                          </div>
                          <div className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            <span>{question.views.toLocaleString()} views</span>
                          </div>
                        </div>
                        <AnimatePresence>
                          {expandedQuestion === question.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-3 text-sm bg-gray-700/30 p-3 rounded-md"
                            >
                              <p className="text-gray-300 mb-2">
                                This question discusses best practices and optimization techniques related to{" "}
                                {question.tags.join(", ")}.
                              </p>
                              <Button variant="link" className="h-auto p-0 text-blue-400">
                                View on Stack Overflow <ArrowRight className="h-3 w-3 ml-1" />
                              </Button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full text-gray-400 hover:text-gray-100">
                    View All Questions <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>

              {/* Recent Updates */}
              <Card className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-gray-800">
                <CardHeader>
                  <CardTitle>Recent Updates</CardTitle>
                  <CardDescription className="text-gray-300">Latest changes in the tech world</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topStories.map((story, index) => (
                      <motion.div
                        key={story.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="pb-2 border-b border-gray-700 last:border-0"
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-sm">{story.source}</h3>
                          <span className="text-xs text-gray-400">{story.time}</span>
                        </div>
                        <p className="text-sm line-clamp-2 mt-1">{story.title}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full text-gray-400 hover:text-gray-100">
                    View All Updates <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Gadgets and Memes Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gadgets Section */}
              <Card className="bg-gray-800/30 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Badge className="mr-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 hover:text-blue-300">
                      <Zap className="h-3 w-3 mr-1" />
                      Gadgets
                    </Badge>
                    Latest Tech Gadgets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(gadgets.length > 0 ? gadgets : techNews).map((item, index) => (
                      <motion.div
                        key={item.id || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="flex gap-3 pb-3 border-b border-gray-700 last:border-0"
                      >
                        <div className="shrink-0">
                          <img
                            src={item.urlToImage || item.image || "/placeholder.svg"}
                            alt={item.title}
                            className="w-12 h-12 rounded-md object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm mb-1 line-clamp-2">{item.title}</h3>
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>{item.source?.name || item.source}</span>
                            <span>
                              {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : item.time}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full text-gray-400 hover:text-gray-100">
                    View All Gadgets <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>

              {/* Meme Section */}
              <Card className="bg-gray-800/30 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Badge className="mr-2 bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 hover:text-yellow-300">
                      <Hash className="h-3 w-3 mr-1" />
                      Memes
                    </Badge>
                    Top Tech Memes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative h-[250px] overflow-hidden rounded-lg">
                    <AnimatePresence>
                      {memes.map(
                        (meme, index) =>
                          index === currentMeme && (
                            <motion.div
                              key={meme.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.5 }}
                              className="absolute inset-0"
                            >
                              <div className="relative h-full">
                                <img
                                  src={meme.image || "/placeholder.svg"}
                                  alt={meme.title}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-3">
                                  <h3 className="font-medium">{meme.title}</h3>
                                  <div className="flex justify-between text-xs text-gray-300 mt-1">
                                    <span>{meme.source}</span>
                                    <div className="flex items-center">
                                      <ThumbsUp className="h-3 w-3 mr-1" />
                                      <span>{meme.upvotes.toLocaleString()}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ),
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="flex justify-center mt-4">
                    {memes.map((_, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className={`w-2 h-2 rounded-full p-0 mx-1 ${
                          index === currentMeme ? "bg-primary" : "bg-gray-600"
                        }`}
                        onClick={() => setCurrentMeme(index)}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </motion.section>
    </div>
  )
}

