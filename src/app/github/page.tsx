"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
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
} from "recharts"
import {
  BarChart3,
  ChevronDown,
  ChevronUp,
  Code,
  ExternalLink,
  GitFork,
  GitPullRequest,
  Moon,
  PieChartIcon,
  Search,
  Star,
  Sun,
  Github,
} from "lucide-react"

export default function GithubPage() {
  const [data, setData] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [chartType, setChartType] = useState<"pie" | "bar">("pie")
  const { theme, setTheme } = useTheme()
  const [expandedCards, setExpandedCards] = useState<{ [key: string]: boolean }>({
    repos: false,
    languages: false,
    issues: false,
  })
  const [isDarkMode, setIsDarkMode] = useState(theme === "dark")

  // Fetch data from your API route instead of using mock data
  useEffect(() => {
    const fetchGithubData = async () => {
      try {
        const res = await fetch("/api/github")
        if (!res.ok) {
          throw new Error("Failed to fetch GitHub analytics")
        }
        const json = await res.json()
        setData(json)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchGithubData()
  }, [])

  useEffect(() => {
    setIsDarkMode(theme === "dark")
  }, [theme])

  const toggleExpand = (card: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [card]: !prev[card],
    }))
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Destructure data from the API response
  const repos = data?.repos || []
  const languageStats = data?.analyticsData?.languageStats || []
  const issues = data?.issues || []

  // Filter repos based on search term
  const filteredRepos = repos.filter(
    (repo: any) =>
      repo.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repo.language?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Colors for charts
  const colors = [
    "#3b82f6",
    "#10b981",
    "#8b5cf6",
    "#f59e0b",
    "#ef4444",
    "#06b6d4",
    "#ec4899",
    "#6366f1",
    "#84cc16",
    "#14b8a6",
  ]

  // If available, use activity data from the API; if not, use mock-generated data
  const activityData =
    data?.analyticsData?.activityData?.map((item: any) => ({
      date: item.date,
      contributions: item.count,
    })) || generateActivityData()

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
          <motion.h1
            className="text-3xl font-bold bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            GitHub Analytics Dashboard
          </motion.h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neondark-muted" />
              <Input
                placeholder="Search repositories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-9 w-[200px] md:w-[260px] bg-neondark-card/80 border-neondark-border text-foreground backdrop-blur-sm"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full h-9 w-9 border-neondark-border text-neondark-text hover:bg-neondark-accent/10"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        {data ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Repositories"
              value={repos.length}
              icon={<Code className="h-4 w-4" />}
              color="bg-cyan-500"
              index={0}
              isDarkMode={isDarkMode}
            />
            <StatsCard
              title="Total Stars"
              value={repos.reduce((acc: number, repo: any) => acc + repo.stars, 0)}
              icon={<Star className="h-4 w-4" />}
              color="bg-yellow-500"
              index={1}
              isDarkMode={isDarkMode}
            />
            <StatsCard
              title="Total Forks"
              value={repos.reduce((acc: number, repo: any) => acc + repo.forks, 0)}
              icon={<GitFork className="h-4 w-4" />}
              color="bg-green-500"
              index={2}
              isDarkMode={isDarkMode}
            />
            <StatsCard
              title="Open Issues"
              value={issues.length}
              icon={<GitPullRequest className="h-4 w-4" />}
              color="bg-purple-500"
              index={3}
              isDarkMode={isDarkMode}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full bg-neondark-card/50" />
            ))}
          </div>
        )}

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3 lg:grid-cols-4 bg-neondark-card/80 border border-neondark-border backdrop-blur-sm">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-neondark-text"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="repositories"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-neondark-text"
            >
              Repositories
            </TabsTrigger>
            <TabsTrigger
              value="languages"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-neondark-text"
            >
              Languages
            </TabsTrigger>
            <TabsTrigger
              value="issues"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-neondark-text"
            >
              Issues
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {data ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Repos Card */}
                <Card className="bg-neondark-card/80 border-neondark-border backdrop-blur-sm overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Badge className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 hover:text-yellow-300">
                        <Star className="h-3 w-3 mr-1" />
                        Top Repositories
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {(expandedCards.repos ? filteredRepos : filteredRepos.slice(0, 5)).map(
                        (repo: any, index: number) => (
                          <motion.li
                            key={repo.id}
                            className="p-3 rounded-lg border border-neondark-border bg-neondark-card/50 shadow-sm hover:shadow-md transition-all duration-300 hover:border-cyan-500/30"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            whileHover={{ scale: 1.01, y: -2 }}
                          >
                            <div className="flex justify-between items-start">
                              <a
                                href={repo.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-cyan-400 hover:text-cyan-300 hover:underline flex items-center"
                              >
                                {repo.fullName}
                                <ExternalLink className="ml-1 h-3 w-3" />
                              </a>
                              <Badge variant="outline" className="border-neondark-border">
                                {repo.language}
                              </Badge>
                            </div>
                            <div className="flex items-center mt-2 text-sm text-neondark-muted">
                              <div className="flex items-center mr-4">
                                <Star className="h-3.5 w-3.5 mr-1 text-yellow-500" />
                                {repo.stars.toLocaleString()}
                              </div>
                              <div className="flex items-center">
                                <GitFork className="h-3.5 w-3.5 mr-1 text-green-500" />
                                {repo.forks.toLocaleString()}
                              </div>
                            </div>
                          </motion.li>
                        )
                      )}
                    </ul>
                    {!expandedCards.repos && filteredRepos.length > 5 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpand("repos")}
                        className="w-full mt-3 text-foreground hover:text-cyan-400 hover:bg-cyan-500/10"
                      >
                        View all {filteredRepos.length} repositories
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Language Distribution */}
                <Card className="bg-neondark-card/80 border-neondark-border backdrop-blur-sm overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Badge className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 hover:text-cyan-300">
                        <Code className="h-3 w-3 mr-1" />
                        Language Distribution
                      </Badge>
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
                      className="w-full h-[400px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        {chartType === "pie" ? (
                          <PieChart>
                            <Pie
                              data={languageStats}
                              cx="50%"
                              cy="50%"
                              labelLine={true}
                              outerRadius={150}
                              fill="#8884d8"
                              dataKey="repoCount"
                              nameKey="language"
                              label={({ language, repoCount }) =>
                                `${language}: ${repoCount}`
                              }
                            >
                              {languageStats.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                              ))}
                            </Pie>
                            <RechartsTooltip
                              formatter={(value, name) => [`${value} repositories`, name]}
                            />
                          </PieChart>
                        ) : (
                          <BarChart
                            data={languageStats}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.2} />
                            <XAxis
                              type="number"
                              stroke={isDarkMode ? "#9ca3af" : "#6b7280"}
                            />
                            <YAxis
                              type="category"
                              dataKey="language"
                              width={100}
                              stroke={isDarkMode ? "#9ca3af" : "#6b7280"}
                            />
                            <RechartsTooltip formatter={(value) => [`${value} repositories`, "Count"]} />
                            <Bar dataKey="repoCount" radius={[0, 4, 4, 0]}>
                              {languageStats.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        )}
                      </ResponsiveContainer>
                    </motion.div>
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {languageStats.map((lang: any, index: number) => (
                        <motion.div
                          key={lang.language}
                          className="flex items-center gap-2 p-1 rounded-md hover:bg-neondark-card/50 transition-colors"
                          whileHover={{ scale: 1.05 }}
                        >
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: colors[index % colors.length] }}
                          ></div>
                          <span className="text-sm">
                            {lang.language}: {lang.repoCount}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Skeleton className="h-96 w-full" />
            )}

            {/* Issues Chart */}
            {data ? (
              <Card className="bg-neondark-card/80 border-neondark-border backdrop-blur-sm overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Badge className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 hover:text-purple-300">
                      <GitPullRequest className="h-3 w-3 mr-1" />
                      Most Discussed Issues
                    </Badge>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpand("issues")}
                    className="h-8 w-8 p-0"
                  >
                    {expandedCards.issues ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={issues}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                        <XAxis
                          dataKey="title"
                          angle={-45}
                          textAnchor="end"
                          height={70}
                          interval={0}
                          tick={{ fontSize: 12 }}
                          stroke={isDarkMode ? "#9ca3af" : "#6b7280"}
                        />
                        <YAxis stroke={isDarkMode ? "#9ca3af" : "#6b7280"} />
                        <RechartsTooltip
                          formatter={(value, name, props) => [
                            `${value} comments`,
                            props.payload.repository || "Comments",
                          ]}
                          labelFormatter={(label) => `Issue: ${label}`}
                        />
                        <Bar dataKey="comments" radius={[8, 8, 0, 0]} animationDuration={1500}>
                          {issues.map((entry: any, index: number) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                entry.comments > 15
                                  ? "#ef4444"
                                  : entry.comments > 10
                                  ? "#f59e0b"
                                  : "#3b82f6"
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Skeleton className="h-[350px] w-full" />
            )}

            {/* Activity Timeline */}
            {data ? (
              <Card className="bg-neondark-card/80 border-neondark-border backdrop-blur-sm overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30 hover:text-green-300">
                      <GitPullRequest className="h-3 w-3 mr-1" />
                      Contribution Activity
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={activityData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                        <XAxis dataKey="date" stroke={isDarkMode ? "#9ca3af" : "#6b7280"} />
                        <YAxis stroke={isDarkMode ? "#9ca3af" : "#6b7280"} />
                        <RechartsTooltip formatter={(value) => [`${value} contributions`]} />
                        <Line
                          type="monotone"
                          dataKey="contributions"
                          stroke="url(#lineGradient)"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5, strokeWidth: 0 }}
                        />
                        <defs>
                          <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#06b6d4" stopOpacity={1} />
                            <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.5} />
                          </linearGradient>
                        </defs>
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Skeleton className="h-[200px] w-full" />
            )}
          </TabsContent>

          <TabsContent value="repositories" className="space-y-6">
            {data ? (
              <Card className="bg-neondark-card/80 border-neondark-border backdrop-blur-sm overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge className="bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 hover:text-indigo-300">
                      <Github className="h-3 w-3 mr-1" />
                      All Repositories
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredRepos.map((repo: any, index: number) => (
                      <motion.div
                        key={repo.id}
                        className="p-4 rounded-lg border border-neondark-border bg-neondark-card/50 shadow-sm hover:shadow-md transition-all duration-300 hover:border-cyan-500/30"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        whileHover={{ scale: 1.01, y: -2 }}
                      >
                        <div className="flex justify-between items-start">
                          <a
                            href={repo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-cyan-400 hover:text-cyan-300 hover:underline flex items-center"
                          >
                            {repo.fullName}
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                          <Badge variant="outline" className="border-neondark-border">
                            {repo.language}
                          </Badge>
                        </div>
                        <div className="flex items-center mt-2 text-sm text-neondark-muted">
                          <div className="flex items-center mr-4">
                            <Star className="h-3.5 w-3.5 mr-1 text-yellow-500" />
                            {repo.stars.toLocaleString()}
                          </div>
                          <div className="flex items-center">
                            <GitFork className="h-3.5 w-3.5 mr-1 text-green-500" />
                            {repo.forks.toLocaleString()}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Skeleton className="h-96 w-full" />
            )}
          </TabsContent>

          <TabsContent value="languages" className="space-y-6">
            {data ? (
              <Card className="bg-neondark-card/80 border-neondark-border backdrop-blur-sm overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Badge className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 hover:text-cyan-300">
                      <Code className="h-3 w-3 mr-1" />
                      Language Distribution
                    </Badge>
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
                    className="w-full h-[400px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === "pie" ? (
                        <PieChart>
                          <Pie
                            data={languageStats}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={150}
                            fill="#8884d8"
                            dataKey="repoCount"
                            nameKey="language"
                            label={({ language, repoCount }) =>
                              `${language}: ${repoCount}`
                            }
                          >
                            {languageStats.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip
                            formatter={(value, name) => [`${value} repositories`, name]}
                          />
                        </PieChart>
                      ) : (
                        <BarChart
                          data={languageStats}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.2} />
                          <XAxis type="number" stroke={isDarkMode ? "#9ca3af" : "#6b7280"} />
                          <YAxis
                            type="category"
                            dataKey="language"
                            width={100}
                            stroke={isDarkMode ? "#9ca3af" : "#6b7280"}
                          />
                          <RechartsTooltip formatter={(value) => [`${value} repositories`, "Count"]} />
                          <Bar dataKey="repoCount" radius={[0, 4, 4, 0]}>
                            {languageStats.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </motion.div>
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {languageStats.map((lang: any, index: number) => (
                      <motion.div
                        key={lang.language}
                        className="flex items-center gap-2 p-1 rounded-md hover:bg-neondark-card/50 transition-colors"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: colors[index % colors.length] }}
                        ></div>
                        <span className="text-sm">
                          {lang.language}: {lang.repoCount}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Skeleton className="h-96 w-full" />
            )}
          </TabsContent>

          <TabsContent value="issues" className="space-y-6">
            {data ? (
              <Card className="bg-neondark-card/80 border-neondark-border backdrop-blur-sm overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 hover:text-purple-300">
                      <GitPullRequest className="h-3 w-3 mr-1" />
                      All Issues
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {issues.map((issue: any, index: number) => (
                      <motion.div
                        key={issue.id}
                        className="p-4 rounded-lg border border-neondark-border bg-neondark-card/50 shadow-sm hover:shadow-md transition-all duration-300 hover:border-purple-500/30"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        whileHover={{ scale: 1.01, y: -2 }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{issue.title}</h3>
                            {issue.repository && (
                              <p className="text-sm text-neondark-muted">
                                Repository: {issue.repository}
                              </p>
                            )}
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              issue.comments > 5
                                ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                                : issue.comments > 10
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                            }
                          >
                            {issue.comments} comments
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Skeleton className="h-96 w-full" />
            )}
          </TabsContent>
        </Tabs>

        {/* Tech Quote */}
        <motion.div
          className="text-center mt-10 text-lg italic text-neondark-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          "Code is like humor. When you have to explain it, it's bad."
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
  isDarkMode,
}: {
  title: string
  value: number
  icon: React.ReactNode
  color: string
  index: number
  isDarkMode: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="relative overflow-hidden rounded-lg border border-neondark-border bg-neondark-card/80 backdrop-blur-sm p-6 group"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-cyan-500/0 rounded-lg opacity-0 group-hover:opacity-100 blur transition duration-500"></div>
      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-full ${color}/10 flex items-center justify-center mb-4 text-foreground`}>
          {icon}
        </div>
        <h3 className="text-lg font-medium text-foreground">{title}</h3>
        <p className="text-2xl font-bold mt-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          {value.toLocaleString()}
        </p>
      </div>
    </motion.div>
  )
}

// Helper function to generate mock activity data as a fallback
function generateActivityData() {
  const data = []
  const now = new Date()
  for (let i = 30; i >= 0; i--) {
    const date = new Date()
    date.setDate(now.getDate() - i)
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      contributions: Math.floor(Math.random() * 15) + 1,
    })
  }
  return data
}
