"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Code,
  Github,
  Hash,
  HelpCircle,
  MessageSquare,
  Newspaper,
  Star,
  ThumbsUp,
  Twitter,
  Zap,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts"
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
    image: "/memes/a.jpg",
  },
  {
    id: 2,
    title: "CSS positioning be like",
    upvotes: 8765,
    source: "r/webdev",
    image: "/memes/b.jpg",
  },
  {
    id: 3,
    title: "AI taking over programming jobs",
    upvotes: 7654,
    source: "r/ProgrammerHumor",
    image: "/memes/c.png",
  },
  {
    id: 4,
    title: "AI taking over programming jobs",
    upvotes: 7654,
    source: "r/ProgrammerHumor",
    image: "/memes/d.jpg",
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
  {
    id: 4,
    title: "GitHub introduces AI-powered code review that catches 90% of bugs",
    source: "GitHub Blog",
    snippet: "The new feature integrates with existing CI/CD pipelines to provide automated code analysis.",
    time: "12 hours ago",
    image: "/placeholder.svg?height=80&width=80",
  },
]

const recentLaunches = [
  {
    id: 1,
    title: "Apple Vision Pro",
    description: "Mixed reality headset with revolutionary spatial computing",
    rating: 4.8,
    image: "/placeholder.svg?height=80&width=80",
    category: "Hardware",
  },
  {
    id: 2,
    title: "Bard Advanced",
    description: "Google's enhanced AI assistant with multimodal capabilities",
    rating: 4.5,
    image: "/placeholder.svg?height=80&width=80",
    category: "AI",
  },
  {
    id: 3,
    title: "Framework Laptop 16",
    description: "Modular, upgradeable gaming laptop with replaceable GPU",
    rating: 4.7,
    image: "/placeholder.svg?height=80&width=80",
    category: "Hardware",
  },
  {
    id: 4,
    title: "Astro 3.0",
    description: "Web framework with enhanced content collections and view transitions",
    rating: 4.6,
    image: "/placeholder.svg?height=80&width=80",
    category: "Software",
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
  Go: [
    { name: "golang/go", stars: 112345 },
    { name: "kubernetes/kubernetes", stars: 98765 },
    { name: "gin-gonic/gin", stars: 67890 },
  ],
  Rust: [
    { name: "rust-lang/rust", stars: 87654 },
    { name: "tauri-apps/tauri", stars: 65432 },
    { name: "deno/deno", stars: 43210 },
  ],
}

const aiSummaries = [
  "Next.js 15 introduces 50% faster builds and improved image optimization, making it the fastest React framework yet",
  "TypeScript 5.3 adds new features for type safety and developer productivity with improved inference",
  "React Server Components are changing how developers think about data fetching and rendering",
  "HTMX is gaining popularity as a lightweight alternative to JavaScript frameworks for interactive UIs",
  "Rust continues to grow in web development with new frameworks like Leptos and Dioxus",
  "WebAssembly is expanding beyond the browser with WASI for server-side applications",
  "AI-assisted coding tools are becoming essential for developer workflows and productivity",
  "GraphQL is evolving with new caching strategies and federation capabilities",
  "Edge computing is transforming web architecture with distributed processing models",
  "Web Components are seeing renewed interest with better framework interoperability",
  "WebGPU is enabling high-performance graphics and computation in the browser",
  "Serverless databases are simplifying data storage for modern applications",
]

export default function TechDashboard() {
  const [showAllReddit, setShowAllReddit] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [selectedChartType, setSelectedChartType] = useState<"pie" | "bar" | "line" | "area">("pie")
  const colors = ["#00FFFF", "#7C3AED", "#10B981", "#F59E0B", "#EF4444", "#0EA5E9"]

  interface StackOverflowQuestion {
    id: number
    title: string
    votes: number
    answers: number
    views: number
    tags: string[]
    link: string
    creationDate: string
  }
  interface TechNewsItem {
    source: {
      id: string | null
      name: string
    }
    author: string
    title: string
    description: string
    url: string
    urlToImage?: string
    publishedAt: string
  }
  interface Insight {
    title: string;
    summary: string;
    url: string;
  }
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    // Call your insight summary API route on component mount.
    const fetchInsights = async () => {
      try {
        const res = await fetch("/api/insightSummary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // You can pass a dynamic or default query here.
          body: JSON.stringify({ query: "top trending tech insights" }),
        });
        const data = await res.json();
        if (data.insights) {
          setInsights(data.insights);
        }
      } catch (err) {
        console.error("Failed to fetch insights:", err);
      }
    };
    fetchInsights();
  }, []);

  const [techNewsItems, setTechNewsItems] = useState<TechNewsItem[]>([])

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/gadgets")
        const data = await res.json()
        setTechNewsItems(data)
      } catch (err) {
        console.error("Failed to fetch gadget news:", err)
      }
    }

    fetchNews()
  }, [])

  const [showAllRepos, setShowAllRepos] = useState(false)
  const [stackOverflowQuestions, setStackOverflowQuestions] = useState<StackOverflowQuestion[]>([])
  useEffect(() => {
    const fetchStackOverflow = async () => {
      try {
        const res = await fetch("/api/stackoverflow") // Update if your endpoint differs
        const json = await res.json()
        const questions = json.questions || []

        const mapped = questions.map((q: any) => ({
          id: q.id,
          title: q.title,
          votes: q.score,
          answers: q.answerCount,
          views: q.viewCount,
          tags: q.tags,
          link: q.link,
          creationDate: q.creationDate,
        }))

        setStackOverflowQuestions(mapped)
      } catch (err) {
        console.error("Error fetching StackOverflow data:", err)
      }
    }

    fetchStackOverflow()
  }, [])

  interface RedditTrend {
    id: number
    title: string
    subreddit: string
    upvotes: number
    comments: number
    trend: string
    url: string
    image: string
  }
  interface HackerNewsStory {
    id: number
    title: string
    url: string
    author: string
    score: number
    comments: number
    createdAt: string
  }

  const [hackerNewsStories, setHackerNewsStories] = useState<HackerNewsStory[]>([])
  useEffect(() => {
    const fetchHackerNews = async () => {
      try {
        const res = await fetch("/api/hackernews")
        const json = await res.json()
        const stories = json.hackerNewsStories || []

        const mapped = stories.map((story: any) => ({
          id: story.id,
          title: story.title,
          url: story.url,
          author: story.author,
          score: story.score,
          comments: story.comments,
          createdAt: story.createdAt,
        }))

        setHackerNewsStories(mapped)
      } catch (err) {
        console.error("Error fetching Hacker News data:", err)
      }
    }

    fetchHackerNews()
  }, [])
  interface SocialPost {
    id: string
    platform: string
    content: string
    author: string
    hashtags: string[]
    url: string
    score: number
    createdAt: string
  }
  const newsSourceData = Object.entries(
    techNewsItems.reduce((acc: Record<string, number>, item) => {
      const source = item.source || "Unknown"
      acc[source.name] = (acc[source.name] || 0) + 1
      return acc
    }, {}),
  ).map(([name, count]) => ({
    name,
    count,
  }))

  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([])
  useEffect(() => {
    const fetchSocialPosts = async () => {
      try {
        const res = await fetch("/api/socialmedia")
        const data = await res.json()
        setSocialPosts(data)
      } catch (err) {
        console.error("Failed to fetch social media posts", err)
      }
    }

    fetchSocialPosts()
  }, [])
  const topSources = newsSourceData.sort((a, b) => b.count - a.count).slice(0, 6)
  const [redditTrends, setRedditTrends] = useState<RedditTrend[]>([])
  useEffect(() => {
    const fetchRedditTrends = async () => {
      try {
        const res = await fetch("/api/reddit") // use your real API route here
        const json = await res.json()
        const posts = json.reddit || json // depending on how your API returns it

        const mapped = posts.map((post: RedditTrend) => ({
          id: post.id,
          title: post.title,
          subreddit: `r/${post.subreddit}`,
          upvotes: post.upvotes,
          comments: post.comments,
          trend: "+0%", // placeholder or compute trend later
          url: post.url,
          image: "/placeholder.svg?height=40&width=40", // optional placeholder
        }))

        setRedditTrends(mapped)
      } catch (error) {
        console.error("Failed to fetch Reddit data:", error)
      }
    }

    fetchRedditTrends()
  }, [])

  interface GitHubRepo {
    id: number
    name: string
    description: string
    stars: number
    forks: number
    language: string
    color: string
  }

  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([])
  const [expandedRepo, setExpandedRepo] = useState<number | null>(null)

  const getLanguageColor = (lang: string) => {
    const colors: Record<string, string> = {
      JavaScript: "#f1e05a",
      TypeScript: "#2b7489",
      Python: "#3572A5",
      Go: "#00ADD8",
      Rust: "#dea584",
      "C#": "#178600",
    }
    return colors[lang] || "#ccc"
  }

  useEffect(() => {
    const fetchGitHubRepos = async () => {
      try {
        const res = await fetch("/api/github")
        const json = await res.json()
        const repos = json.repos || []

        const mapped = repos.map((repo: any) => ({
          id: repo.id,
          name: repo.fullName,
          description: repo.name,
          stars: repo.stars,
          forks: repo.forks,
          language: repo.language,
          color: getLanguageColor(repo.language),
        }))

        setGithubRepos(mapped)
      } catch (error) {
        console.error("Failed to fetch GitHub repos:", error)
      }
    }

    fetchGitHubRepos()
  }, [])

  const [name, setName] = useState("")

  const [showInputs, setShowInputs] = useState(false)
  const [chartType, setChartType] = useState<"bar" | "pie">("bar")

  const renderChart = () => {
    if (selectedChartType === "pie") {
      return (
        <PieChart>
          <Pie data={topSources} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="count">
            {topSources.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltipContent />} />
        </PieChart>
      )
    } else if (selectedChartType === "bar") {
      return (
        <BarChart data={topSources} barSize={32}>
          <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 12 }} />
          <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
          <Tooltip content={<ChartTooltipContent />} />
          <Bar dataKey="count" fill="url(#barGradient)">
            {topSources.map((_, index) => (
              <Cell key={`bar-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00FFFF" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#00BFBF" stopOpacity={1} />
            </linearGradient>
          </defs>
        </BarChart>
      )
    } else if (selectedChartType === "line") {
      return (
        <LineChart data={topSources}>
          <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 12 }} />
          <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
          <Tooltip content={<ChartTooltipContent />} />
          <Line type="monotone" dataKey="count" stroke="#00FFFF" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      )
    } else if (selectedChartType === "area") {
      return (
        <AreaChart data={topSources}>
          <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 12 }} />
          <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
          <Tooltip content={<ChartTooltipContent />} />
          <Area type="monotone" dataKey="count" stroke="#00FFFF" fill="#00FFFF" fillOpacity={0.3} />
        </AreaChart>
      )
    }
    return null
  }

  const [dynamicMessage, setDynamicMessage] = useState("Join 12,000+ devs for weekly insights.")
  const messages = [
    "Join 12,000+ devs for weekly insights.",
    "Stay ahead of the curve. Get updates!",
    "Only the best tech. No spam, ever.",
    "Dev trends delivered to your inbox.",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      const next = messages[Math.floor(Math.random() * messages.length)]
      setDynamicMessage(next)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const [currentMeme, setCurrentMeme] = useState(0)
  const [searchValue, setSearchValue] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [expandedStory, setExpandedStory] = useState<number | null>(null)
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null)
  const [email, setEmail] = useState("")
  const [subscribeStatus, setSubscribeStatus] = useState<string | null>(null)
  interface Gadget {
    id: number
    thumbnailUrl?: string
    urlToImage?: string
    name?: string
    title?: string
    url?: string
    source?: { name: string }
    tagline?: string
    description?: string
    votesCount?: number
  }

  const [gadgets, setGadgets] = useState<Gadget[]>([])
  const [productHunt, setProductHunt] = useState<Gadget[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const [gadgetsRes, productHuntRes] = await Promise.all([
        fetch("/api/gadgets").then((res) => res.json()),
        fetch("/api/producthunt").then((res) => res.json()),
      ])
      setGadgets(gadgetsRes)
      setProductHunt(productHuntRes)
    }
    fetchData()
  }, [])

  // Animation for the weekly digest cards
  const containerRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMeme((prev) => (prev + 1) % memes.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-neondark-bg text-neondark-text">
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
          <motion.h1
            className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500 bg-clip-text text-transparent"
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
                  <Card className="bg-neondark-card border-neondark-border shadow-lg shadow-cyan-400/10">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-neondark-muted mb-1">{stat.title}</p>
                          <p className="text-2xl font-bold text-cyan-400">{stat.value}</p>
                        </div>
                        <div
                          className={`p-2 rounded-full ${
                            stat.isPositive ? "bg-cyan-950 text-cyan-400" : "bg-red-950 text-red-400"
                          }`}
                        >
                          {stat.icon}
                        </div>
                      </div>
                      <div className={`text-sm mt-2 ${stat.isPositive ? "text-cyan-400" : "text-red-400"}`}>
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
              <Card className="bg-neondark-card border-neondark-border shadow-lg shadow-cyan-400/10">
                <CardHeader>
                  <CardTitle className="text-neondark-text">Platform Engagement</CardTitle>
                  <CardDescription className="text-neondark-muted">
                    Weekly activity across tech platforms
                  </CardDescription>
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
              <Card className="bg-neondark-card border-neondark-border shadow-lg shadow-cyan-400/10">
                <CardHeader>
                  <CardTitle className="flex items-center text-neondark-text">
                    <Badge className="mr-2 bg-cyan-950 text-cyan-400 hover:bg-cyan-900 hover:text-cyan-300">
                      <Code className="h-3 w-3 mr-1" />
                      Languages
                    </Badge>
                    Languages & Top Repositories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium mb-4 text-sm text-neondark-text">Popular Languages</h3>
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
                      <h3 className="font-medium mb-4 text-sm text-neondark-text">Top Repositories by Language</h3>
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
                                <span className="font-medium text-sm text-neondark-text">{language}</span>
                              </div>
                              {repos.slice(0, 1).map((repo) => (
                                <div key={repo.name} className="flex justify-between items-center pl-5">
                                  <span className="text-xs text-neondark-muted">{repo.name}</span>
                                  <div className="flex items-center text-xs text-neondark-muted">
                                    <Star className="h-3 w-3 mr-1 text-cyan-400" />
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
            <Card className="bg-neondark-card border-neondark-border shadow-lg shadow-cyan-400/10">
            <CardHeader>
        <CardTitle className="flex items-center text-neondark-text">
          <Badge className="mr-2 bg-cyan-950 text-cyan-400 hover:bg-cyan-900 hover:text-cyan-300">
            <Zap className="h-3 w-3 mr-1" />
            AI
          </Badge>
          AI-Generated Tech Insights
        </CardTitle>
        <CardDescription className="text-neondark-muted">
          Continuously updated insights from across the tech ecosystem
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-0">
        <div className="relative h-32 overflow-hidden">
          <div className="absolute inset-0 flex items-center">
            <motion.div
              className="flex gap-2 px-2"
              // Slow down the scrolling to 60s
              animate={{ x: [0, -3000] }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 60,
                ease: "linear",
              }}
            >
              {insights && insights.length > 0 ? (
                [...insights, ...insights].map((insight, i) => (
                  <motion.div
                    key={i}
                    className="flex-shrink-0 w-64 max-w-xs h-24 rounded-lg bg-gradient-to-r 
                               from-cyan-950/50 to-cyan-900/30 border border-cyan-400/30 p-4 
                               text-neondark-text mx-2"
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <h3 className="font-semibold text-sm line-clamp-1 overflow-hidden text-ellipsis">
                      {insight.title}
                    </h3>
                    <p className="text-xs line-clamp-2 overflow-hidden text-ellipsis">
                      {insight.summary}
                    </p>
                    {insight.url && (
                      <a
                        href={insight.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-cyan-400 hover:underline mt-1 block"
                      >
                        Read more
                      </a>
                    )}
                  </motion.div>
                ))
              ) : (
                <p className="text-neondark-text">Loading insights...</p>
              )}
            </motion.div>
          </div>
        </div>
      </CardContent>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {redditTrends.length > 0 ? (
                    <motion.div
                      className="bg-neondark-bg rounded-xl p-4 border border-neondark-border"
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-red-950 text-red-400 hover:bg-red-900 hover:text-red-300">Reddit</Badge>
                        <span className="text-xs text-neondark-muted">Top Post</span>
                      </div>
                      <h3 className="font-medium mb-2 text-neondark-text">{redditTrends[0].title}</h3>
                      <div className="flex justify-between text-sm text-neondark-muted">
                        <span>{redditTrends[0].subreddit}</span>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3 text-cyan-400" />
                          <span>{redditTrends[0].upvotes.toLocaleString()}</span>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="bg-neondark-bg rounded-xl p-4 border border-neondark-border text-sm text-neondark-muted">
                      Loading Reddit post...
                    </div>
                  )}
                  {githubRepos.length > 0 ? (
                    <motion.div
                      className="bg-neondark-bg rounded-xl p-4 border border-neondark-border"
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-blue-950 text-blue-400 hover:bg-blue-900 hover:text-blue-300">
                          GitHub
                        </Badge>
                        <span className="text-xs text-neondark-muted">Trending Repo</span>
                      </div>
                      <h3 className="font-medium mb-2 text-neondark-text">{githubRepos[0].name}</h3>
                      <div className="flex justify-between text-sm text-neondark-muted">
                        <span>{githubRepos[0].language}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-cyan-400" />
                          <span>{githubRepos[0].stars.toLocaleString()}</span>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="bg-neondark-bg rounded-xl p-4 border border-neondark-border text-sm text-neondark-muted">
                      Loading GitHub repo...
                    </div>
                  )}

                  <motion.div
                    className="bg-neondark-bg rounded-xl p-4 border border-neondark-border"
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-yellow-950 text-yellow-400 hover:bg-yellow-900 hover:text-yellow-300">
                        Meme
                      </Badge>
                      <span className="text-xs text-neondark-muted">Most Viral</span>
                    </div>
                    <h3 className="font-medium mb-2 text-neondark-text">{memes[0].title}</h3>
                    <div className="flex justify-between text-sm text-neondark-muted">
                      <span>{memes[0].source}</span>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3 text-cyan-400" />
                        <span>{memes[0].upvotes.toLocaleString()}</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* News Sources Distribution Chart Card */}
              <Card className="bg-neondark-card border-neondark-border shadow-lg shadow-cyan-400/10">
                <CardHeader className="flex justify-between items-center px-4 pt-4 pb-2">
                  <CardTitle className="flex items-center text-lg text-neondark-text">
                    <Badge className="mr-2 bg-cyan-950 text-cyan-400 hover:bg-cyan-900 hover:text-cyan-300">
                      <Newspaper className="h-3 w-3 mr-1" />
                      News Sources
                    </Badge>
                    News Sources Distribution
                  </CardTitle>
                  <Select onValueChange={(value) => setSelectedChartType(value as any)} defaultValue="pie">
                    <SelectTrigger className="w-32 text-sm h-8 bg-neondark-bg border-neondark-border text-neondark-text">
                      <SelectValue placeholder="Chart Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-neondark-bg border-neondark-border">
                      <SelectItem value="pie" className="text-neondark-text hover:bg-cyan-950">
                        Pie Chart
                      </SelectItem>
                      <SelectItem value="bar" className="text-neondark-text hover:bg-cyan-950">
                        Bar Chart
                      </SelectItem>
                      <SelectItem value="line" className="text-neondark-text hover:bg-cyan-950">
                        Line Chart
                      </SelectItem>
                      <SelectItem value="area" className="text-neondark-text hover:bg-cyan-950">
                        Area Chart
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </CardHeader>

                <CardContent className="pb-6 px-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                    {/* Left Side Labels */}
                    <div className="hidden md:block space-y-2">
                      {topSources.slice(0, 3).map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: colors[i % colors.length] }}
                          />
                          <span className="text-neondark-text">{item.name}</span>
                          <span className="text-xs text-neondark-muted ml-auto">{item.count}</span>
                        </div>
                      ))}
                    </div>

                    {/* Center Chart */}
                    <div className="h-[240px] w-full">
                      {(() => {
                        if (selectedChartType === "pie") {
                          return (
                            <PieChart width={400} height={240}>
                              <Pie
                                data={topSources}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="count"
                              >
                                {topSources.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                ))}
                              </Pie>
                              <Tooltip content={<ChartTooltipContent />} />
                            </PieChart>
                          )
                        } else if (selectedChartType === "bar") {
                          return (
                            <BarChart width={400} height={240} data={topSources} barSize={32}>
                              <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                              <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                              <Tooltip content={<ChartTooltipContent />} />
                              <Bar dataKey="count" fill="url(#barGradient)">
                                {topSources.map((_, index) => (
                                  <Cell key={`bar-${index}`} fill={colors[index % colors.length]} />
                                ))}
                              </Bar>
                              <defs>
                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#00FFFF" stopOpacity={0.8} />
                                  <stop offset="100%" stopColor="#00BFBF" stopOpacity={1} />
                                </linearGradient>
                              </defs>
                            </BarChart>
                          )
                        } else if (selectedChartType === "line") {
                          return (
                            <LineChart width={400} height={240} data={topSources}>
                              <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                              <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                              <Tooltip content={<ChartTooltipContent />} />
                              <Line
                                type="monotone"
                                dataKey="count"
                                stroke="#00FFFF"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                              />
                            </LineChart>
                          )
                        } else if (selectedChartType === "area") {
                          return (
                            <AreaChart width={400} height={240} data={topSources}>
                              <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                              <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                              <Tooltip content={<ChartTooltipContent />} />
                              <Area type="monotone" dataKey="count" stroke="#00FFFF" fill="#00FFFF" fillOpacity={0.3} />
                            </AreaChart>
                          )
                        }
                        return null
                      })()}
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Tech News Feed */}
              <Card className="md:col-span-1 bg-neondark-card border-neondark-border shadow-lg shadow-cyan-400/10">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg text-neondark-text">
                    <Badge className="mr-2 bg-cyan-950 text-cyan-400 hover:bg-cyan-900 hover:text-cyan-300">
                      <Newspaper className="h-3 w-3 mr-1" />
                      Tech News
                    </Badge>
                    Latest Headlines
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {techNewsItems.slice(0, 4).map((news, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="flex gap-3 pb-3 border-b border-neondark-border last:border-0"
                      >
                        <div className="shrink-0">
                          <div className="w-10 h-10 rounded-md bg-neondark-bg overflow-hidden flex items-center justify-center">
                            {news.urlToImage ? (
                              <img
                                src={news.urlToImage || "/placeholder.svg"}
                                alt={news.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  ;(e.target as HTMLImageElement).style.display = "none"
                                }}
                              />
                            ) : (
                              <Newspaper className="h-6 w-6 text-neondark-muted" />
                            )}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm mb-1 line-clamp-2 text-neondark-text">{news.title}</h3>
                          <div className="flex justify-between text-xs text-neondark-muted">
                            <span>{news.source?.name || "Unknown Source"}</span>
                            <span>{new Date(news.publishedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-neondark-muted hover:text-cyan-400 hover:bg-cyan-950/30"
                  >
                    View All <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2 bg-neondark-card border-neondark-border shadow-lg shadow-cyan-400/10">
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="flex items-center text-base text-neondark-text">
                    <Badge className="mr-2 bg-cyan-950 text-cyan-400 hover:bg-cyan-900 hover:text-cyan-300">
                      <Zap className="h-3 w-3 mr-1" />
                      New
                    </Badge>
                    Recent Launches & Gadgets
                  </CardTitle>
                </CardHeader>

                <CardContent className="px-4 pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[...productHunt, ...gadgets].slice(0, 8).map((item, index) => (
                      <motion.div
                        key={item.id || index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05, duration: 0.2 }}
                        className="flex gap-3 p-3 bg-neondark-bg rounded-lg border border-neondark-border"
                      >
                        <div className="shrink-0">
                          <div className="w-12 h-12 rounded bg-cyan-950 overflow-hidden">
                            <img
                              src={item.thumbnailUrl || item.urlToImage || "/placeholder.svg"}
                              alt={item.name || item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="text-sm font-medium leading-snug text-neondark-text">
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-cyan-400"
                              >
                                {item.name || item.title}
                              </a>
                            </h3>
                            <Badge
                              variant="outline"
                              className="bg-cyan-950/50 text-xs border-cyan-400/30 text-cyan-400"
                            >
                              {item.source?.name || "ProductHunt"}
                            </Badge>
                          </div>
                          <p className="text-xs text-neondark-muted mt-1 line-clamp-2">
                            {item.tagline || item.description}
                          </p>
                          {item.votesCount && (
                            <div className="flex items-center text-cyan-400 text-xs mt-1">
                              <Star className="h-3 w-3 mr-1" />
                              <span>{item.votesCount} votes</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-neondark-card border-neondark-border shadow-lg shadow-cyan-400/10">
                <CardContent className="p-4 space-y-3">
                  {(showAllRepos ? githubRepos : githubRepos.slice(0, 6)).map((repo, index) => (
                    <motion.div
                      key={repo.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.2 }}
                      className="border-b border-neondark-border pb-2 last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <Github className="h-4 w-4 text-cyan-400" />
                        <h3 className="text-sm font-medium text-neondark-text">{repo.name}</h3>
                      </div>
                      <p className="text-xs text-neondark-muted mb-1 line-clamp-2">{repo.description}</p>
                      <div className="flex justify-between text-xs text-neondark-muted">
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: repo.color }} />
                          {repo.language}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-cyan-400" />
                          {repo.stars.toLocaleString()}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>

                <CardFooter className="p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-neondark-muted hover:text-cyan-400 hover:bg-cyan-950/30"
                    onClick={() => setShowAllRepos((prev) => !prev)}
                  >
                    {showAllRepos ? "Show Less" : "View All"} <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Reddit Trends */}
              <Card className="md:col-span-1 bg-neondark-card border-neondark-border shadow-lg shadow-cyan-400/10">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg text-neondark-text">
                    <Badge className="mr-2 bg-red-950 text-red-400 hover:bg-red-900 hover:text-red-300">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Reddit
                    </Badge>
                    Trending Discussions
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-4">
                    {(showAllReddit ? redditTrends : redditTrends.slice(0, 5)).map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="flex gap-3 pb-3 border-b border-neondark-border last:border-0"
                      >
                        <div className="shrink-0">
                          <div className="w-8 h-8 rounded-full bg-cyan-950 flex items-center justify-center text-cyan-400">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm mb-1 truncate text-neondark-text">{post.title}</h3>
                          <div className="flex justify-between text-xs text-neondark-muted">
                            <span>{post.subreddit}</span>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                <ThumbsUp className="h-3 w-3 mr-1 text-cyan-400" />
                                <span>{post.upvotes.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center">
                                <MessageSquare className="h-3 w-3 mr-1 text-cyan-400" />
                                <span>{post.comments}</span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-1 text-xs text-cyan-400">{post.trend}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-neondark-muted hover:text-cyan-400 hover:bg-cyan-950/30"
                  >
                    View All <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>

              {/* Stack Overflow Questions */}
              <Card className="md:col-span-1 bg-neondark-card border-neondark-border shadow-lg shadow-cyan-400/10">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg text-neondark-text">
                    <Badge className="mr-2 bg-orange-950 text-orange-400 hover:bg-orange-900 hover:text-orange-300">
                      <HelpCircle className="h-3 w-3 mr-1" />
                      Stack Overflow
                    </Badge>
                    Top Questions
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-4">
                    {stackOverflowQuestions.slice(0, 4).map((question, index) => (
                      <motion.div
                        key={question.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="pb-3 border-b border-neondark-border last:border-0"
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-sm mb-2 text-neondark-text">{question.title}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 rounded-full text-cyan-400 hover:bg-cyan-950/50"
                            onClick={() => setExpandedQuestion(expandedQuestion === question.id ? null : question.id)}
                          >
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${
                                expandedQuestion === question.id ? "rotate-180" : ""
                              }`}
                            />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {question.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="bg-cyan-950/30 text-xs border-cyan-400/30 text-cyan-400"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex justify-between text-xs text-neondark-muted">
                          <div className="flex items-center">
                            <ThumbsUp className="h-3 w-3 mr-1 text-cyan-400" />
                            <span>{question.votes} votes</span>
                          </div>
                          <div className="flex items-center">
                            <MessageSquare className="h-3 w-3 mr-1 text-cyan-400" />
                            <span>{question.answers} answers</span>
                          </div>
                          <div className="flex items-center">
                            <Eye className="h-3 w-3 mr-1 text-cyan-400" />
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
                              className="mt-3 text-sm bg-cyan-950/30 p-3 rounded-md"
                            >
                              <p className="text-neondark-text mb-2">
                                This question discusses best practices and optimization techniques related to{" "}
                                {question.tags.join(", ")}.
                              </p>
                              <Button variant="link" className="h-auto p-0 text-cyan-400">
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
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-neondark-muted hover:text-cyan-400 hover:bg-cyan-950/30"
                  >
                    View All Questions <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>
              {/* Top Stories Section */}
              <Card className="bg-neondark-card border-neondark-border shadow-lg shadow-cyan-400/10">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg text-neondark-text">
                    <Badge className="mr-2 bg-green-950 text-green-400 hover:bg-green-900 hover:text-green-300">
                      <Newspaper className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                    Top Stories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {hackerNewsStories.slice(0, 4).map((story, index) => (
                      <motion.div
                        key={story.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="flex gap-4 pb-4 border-b border-neondark-border last:border-0"
                      >
                        <div className="shrink-0">
                          <div className="w-16 h-16 rounded-md bg-cyan-950 overflow-hidden flex items-center justify-center text-xs text-cyan-400">
                            <Newspaper className="h-6 w-6" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <a
                              href={story.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-cyan-400 hover:underline"
                            >
                              {story.title}
                            </a>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 rounded-full text-cyan-400 hover:bg-cyan-950/50"
                              onClick={() => setExpandedStory(expandedStory === story.id ? null : story.id)}
                            >
                              <ChevronDown
                                className={`h-4 w-4 transition-transform ${
                                  expandedStory === story.id ? "rotate-180" : ""
                                }`}
                              />
                            </Button>
                          </div>
                          <div className="flex justify-between text-xs text-neondark-muted mb-1">
                            <span>by {story.author}</span>
                            <span>
                              {story.score} points • {story.comments} comments
                            </span>
                          </div>
                          <AnimatePresence>
                            {expandedStory === story.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="text-sm text-neondark-text mt-2 overflow-hidden"
                              >
                                <p>
                                  This story was posted on Hacker News by <strong>{story.author}</strong>.
                                </p>
                                <div className="mt-2">
                                  <Button variant="link" className="h-auto p-0 text-cyan-400" asChild>
                                    <a href={story.url} target="_blank" rel="noopener noreferrer">
                                      Read full story <ArrowRight className="h-3 w-3 ml-1" />
                                    </a>
                                  </Button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-neondark-muted hover:text-cyan-400 hover:bg-cyan-950/30"
                  >
                    View All Stories <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>

              {/* Social Media Buzz */}
              <Card className="md:col-span-1 bg-neondark-card border-neondark-border shadow-lg shadow-cyan-400/10">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg text-neondark-text">
                    <Badge className="mr-2 bg-cyan-950 text-cyan-400 hover:bg-cyan-900 hover:text-cyan-300">
                      <Twitter className="h-3 w-3 mr-1" />
                      Social Media
                    </Badge>
                    Trending Posts
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {socialPosts.slice(0, 4).map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="bg-neondark-bg rounded-xl p-4 border border-neondark-border"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-neondark-muted">@{post.author}</span>
                          <Badge variant="outline" className="bg-cyan-950/30 text-xs border-cyan-400/30 text-cyan-400">
                            {post.platform}
                          </Badge>
                        </div>
                        <p className="text-sm text-neondark-text mb-2 line-clamp-3">{post.content}</p>
                        <a
                          href={post.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-cyan-400 hover:underline"
                        >
                          View on {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
                        </a>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-neondark-muted hover:text-cyan-400 hover:bg-cyan-950/30"
                  >
                    View All <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>

              {/* Meme Trends */}
              <Card className="md:col-span-2 bg-neondark-card border-neondark-border shadow-lg shadow-cyan-400/10">
                <CardHeader>
                  <CardTitle className="flex items-center text-neondark-text">
                    <Badge className="mr-2 bg-yellow-950 text-yellow-400 hover:bg-yellow-900 hover:text-yellow-300">
                      <Hash className="h-3 w-3 mr-1" />
                      Memes
                    </Badge>
                    Top Tech Memes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative h-[590px] overflow-hidden rounded-lg">
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
                                  className="w-full h-full object-contain"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-neondark-bg/80 p-3 border-t border-cyan-400/30">
                                  <h3 className="font-medium text-neondark-text">{meme.title}</h3>
                                  <div className="flex justify-between text-xs text-neondark-muted mt-1">
                                    <span>{meme.source}</span>
                                    <div className="flex items-center">
                                      <ThumbsUp className="h-3 w-3 mr-1 text-cyan-400" />
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
                          index === currentMeme ? "bg-cyan-400" : "bg-neondark-muted"
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

// Missing components
const LogOut = (props: any) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

const GitFork = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <circle cx="18" cy="6" r="3" />
      <path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9" />
      <path d="M12 12v3" />
    </svg>
  )
}

const Eye = (props: any) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
