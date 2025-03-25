"use client"

import type React from "react"
import { BackgroundBeams } from "@/components/ui/beams"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight,
  Bell,
  ChevronDown,
  ChevronRight,
  Code,
  Github,
  Hash,
  HelpCircle,
  MessageSquare,
  Newspaper,
  Search,
  Send,
  Settings,
  Share2,
  Star,
  ThumbsUp,
  Twitter,
  User,
  Zap,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
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

    const [stackOverflowQuestions, setStackOverflowQuestions] = useState<StackOverflowQuestion[]>([])
    useEffect(() => {
        const fetchStackOverflow = async () => {
          try {
            const res = await fetch("/api/stackoverflow") // Update if your endpoint differs
            const json = await res.json()
            const questions = json.questions || []
      
            const mapped = questions.map((q) => ({
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
            
    const [redditTrends, setRedditTrends] = useState<RedditTrend[]>([])
    useEffect(() => {
        const fetchRedditTrends = async () => {
          try {
            const res = await fetch("/api/reddit") // use your real API route here
            const json = await res.json()
            const posts = json.reddit || json // depending on how your API returns it
      
            const mapped = posts.map((post) => ({
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
    
          const mapped = repos.map((repo) => ({
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
    

  const [currentMeme, setCurrentMeme] = useState(0)
  const [searchValue, setSearchValue] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [expandedStory, setExpandedStory] = useState<number | null>(null)
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null)
  const [email, setEmail] = useState("")
  const [subscribeStatus, setSubscribeStatus] = useState<string | null>(null)

  // Animation for the weekly digest cards
  const containerRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMeme((prev) => (prev + 1) % memes.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribeStatus("success")
      setTimeout(() => setSubscribeStatus(null), 3000)
      setEmail("")
    }
  }

  return (
    <div className="relative">
    <BackgroundBeams className="absolute inset-0 -z-10 pointer-events-none" />
    <motion.section
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="p-6 space-y-8 max-w-7xl mx-auto"
>
<div className="min-h-screen bg-background text-foreground">

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
      

          
           <Card className="shadow-md border border-border bg-card">

             
                {/* AI-Generated Summary */}
               
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
                {redditTrends.length > 0 ? (
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
                  ) : (
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 text-sm text-gray-400">
                      Loading Reddit post...
                    </div>
                  )}
                  {githubRepos.length > 0 ? (
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
) : (
  <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 text-sm text-gray-400">
    Loading GitHub repo...
  </div>
)}


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

            {/* Quick Stats */}
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

            {/* Top Stories Section */}
            <Card className="bg-gray-800/30 border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Badge className="mr-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 hover:text-green-300">
                    <Newspaper className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                  Top Stories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                {hackerNewsStories.slice(0, 6).map((story, index) => (
  <motion.div
    key={story.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.3 }}
    className="flex gap-4 pb-4 border-b border-gray-700 last:border-0"
  >
    <div className="shrink-0">
      <div className="w-16 h-16 rounded-md bg-gray-700 overflow-hidden flex items-center justify-center text-xs text-gray-400">
        <Newspaper className="h-6 w-6" />
      </div>
    </div>
    <div className="flex-1">
      <div className="flex justify-between items-start mb-1">
        <a
          href={story.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-blue-300 hover:underline"
        >
          {story.title}
        </a>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 rounded-full"
          onClick={() => setExpandedStory(expandedStory === story.id ? null : story.id)}
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${expandedStory === story.id ? "rotate-180" : ""}`}
          />
        </Button>
      </div>
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>by {story.author}</span>
        <span>{story.score} points • {story.comments} comments</span>
      </div>
      <AnimatePresence>
        {expandedStory === story.id && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-gray-300 mt-2 overflow-hidden"
          >
            <p>This story was posted on Hacker News by <strong>{story.author}</strong>.</p>
            <div className="mt-2">
              <Button
                variant="link"
                className="h-auto p-0 text-blue-400"
                asChild
              >
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
                <Button variant="ghost" size="sm" className="w-full text-gray-400 hover:text-gray-100">
                  View All Stories <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Reddit Trends */}
              <Card className="md:col-span-1 bg-gray-800/30 border-gray-800">
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
                  <Button variant="ghost" size="sm" className="w-full text-gray-400 hover:text-gray-100">
                    View All <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>

              {/* Stack Overflow Questions */}
              <Card className="md:col-span-1 bg-gray-800/30 border-gray-800">
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
                    {stackOverflowQuestions.slice(0, 3).map((question, index) => (
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

              {/* Subscribe Card */}
              <Card className="md:col-span-1 bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-gray-800">
                <CardHeader>
                  <CardTitle>Stay Updated</CardTitle>
                  <CardDescription className="text-gray-300">
                    Get the latest tech trends delivered to your inbox
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubscribe} className="space-y-4">
                    <div className="space-y-2">
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        className="bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Subscribe Now
                      </Button>
                    </motion.div>
                    <AnimatePresence>
                      {subscribeStatus === "success" && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-sm text-green-400 text-center"
                        >
                          Thanks for subscribing! Check your inbox soon.
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <p className="text-xs text-gray-400 text-center">
                      We'll send you a weekly digest of the most important tech trends. No spam, unsubscribe anytime.
                    </p>
                  </form>
                </CardContent>
              </Card>

              {/* Recent Launches & Gadgets */}
              <Card className="md:col-span-2 bg-gray-800/30 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Badge className="mr-2 bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 hover:text-cyan-300">
                      <Zap className="h-3 w-3 mr-1" />
                      New
                    </Badge>
                    Recent Launches & Gadgets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recentLaunches.map((launch, index) => (
                      <motion.div
                        key={launch.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="flex gap-4 p-3 bg-gray-800/50 rounded-xl border border-gray-700"
                        whileHover={{
                          y: -5,
                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                          transition: { duration: 0.2 },
                        }}
                      >
                        <div className="shrink-0">
                          <div className="w-16 h-16 rounded-md bg-gray-700 overflow-hidden">
                            <img
                              src={launch.image || "/placeholder.svg"}
                              alt={launch.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium">{launch.title}</h3>
                            <Badge variant="outline" className="bg-gray-700/50 text-xs">
                              {launch.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400 mt-1 mb-2">{launch.description}</p>
                          <div className="flex items-center text-yellow-400 text-sm">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < Math.floor(launch.rating) ? "fill-current" : "text-gray-600"}`}
                              />
                            ))}
                            <span className="ml-1 text-gray-300">{launch.rating}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full text-gray-400 hover:text-gray-100">
                    View All Launches <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>

              {/* GitHub Insights */}
              <Card className="md:col-span-1 bg-gray-800/30 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Badge className="mr-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 hover:text-blue-300">
                      <Github className="h-3 w-3 mr-1" />
                      GitHub
                    </Badge>
                    Trending Repositories
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-4">
                    {githubRepos.map((repo, index) => (
                      <motion.div
                        key={repo.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="pb-3 border-b border-gray-700 last:border-0"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Github className="h-4 w-4 text-gray-400" />
                          <h3 className="font-medium text-sm">{repo.name}</h3>
                        </div>
                        <p className="text-xs text-gray-400 mb-2 line-clamp-2">{repo.description}</p>
                        <div className="flex justify-between text-xs">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: repo.color }}></div>
                            <span>{repo.language}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              <Star className="h-3 w-3 mr-1 text-yellow-400" />
                              <span>{repo.stars.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center text-gray-400">
                              <GitFork className="h-3 w-3 mr-1" />
                              <span>{repo.forks.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full text-gray-400 hover:text-gray-100">
                    View All <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>

              {/* Languages & Top Repos */}
              <Card className="md:col-span-2 bg-gray-800/30 border-gray-800">
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

            
              {/* Engagement Chart */}
              <Card className="md:col-span-2 bg-gray-800/30 border-gray-800">
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

              {/* Tech News Feed */}
              <Card className="md:col-span-1 bg-gray-800/30 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Badge className="mr-2 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 hover:text-purple-300">
                      <Newspaper className="h-3 w-3 mr-1" />
                      Tech News
                    </Badge>
                    Latest Headlines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {techNews.map((news, index) => (
                      <motion.div
                        key={news.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="flex gap-3 pb-3 border-b border-gray-700 last:border-0"
                      >
                        <div className="shrink-0">
                          <div className="w-10 h-10 rounded-md bg-gray-700 overflow-hidden">
                            <img
                              src={news.image || "/placeholder.svg"}
                              alt={news.source}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium text-sm mb-1">{news.title}</h3>
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>{news.source}</span>
                            <span>{news.time}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full text-gray-400 hover:text-gray-100">
                    View All <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>

              {/* Social Media Buzz */}
              <Card className="md:col-span-1 bg-gray-800/30 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Badge className="mr-2 bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 hover:text-cyan-300">
                      <Twitter className="h-3 w-3 mr-1" />
                      Social Media
                    </Badge>
                    Trending Posts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {socialMediaPosts.map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="bg-gray-800/50 rounded-xl p-4 border border-gray-700"
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={post.avatar} alt={post.username} />
                            <AvatarFallback>{post.username[1]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">{post.username}</div>
                            <div className="text-xs text-gray-400">{post.platform}</div>
                          </div>
                        </div>
                        <p className="text-sm mb-3">{post.content}</p>
                        <div className="flex justify-between text-xs text-gray-400">
                          <div className="flex items-center">
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            <span>{post.likes.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center">
                            <Share2 className="h-3 w-3 mr-1" />
                            <span>{post.shares.toLocaleString()}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full text-gray-400 hover:text-gray-100">
                    View All <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>

              {/* Meme Trends */}
              <Card className="md:col-span-2 bg-gray-800/30 border-gray-800">
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
    </div>
    
    </motion.section>
    </div>
    
  )
}

// Missing components
const LogOut = (props) => {
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

const GitFork = (props) => {
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

const Eye = (props) => {
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

