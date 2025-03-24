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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { motion } from "framer-motion"
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
} from "lucide-react"
import { useTheme } from "next-themes"
import { BackgroundBeams } from "@/components/ui/beams"

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

  useEffect(() => {
    const fetchGithubData = async () => {
      const res = await fetch("/api/github")
      const json = await res.json()
      setData(json)
    }
    fetchGithubData()
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
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <p className="text-muted-foreground">Loading GitHub Stats...</p>
        </div>
      </div>
    )

  // Filter repos based on search term
  const filteredRepos = data.repos.filter(
    (repo: any) =>
      repo.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repo.language?.toLowerCase().includes(searchTerm.toLowerCase()),
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

  return (
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
          GitHub Analytics Dashboard
        </motion.h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search repositories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-9 w-[200px] md:w-[260px]"
            />
          </div>
         
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Repositories"
          value={data.repos.length}
          icon={<Code className="h-4 w-4" />}
          color="bg-blue-500"
          index={0}
        />
        <StatsCard
          title="Total Stars"
          value={data.repos.reduce((acc: number, repo: any) => acc + repo.stars, 0)}
          icon={<Star className="h-4 w-4" />}
          color="bg-yellow-500"
          index={1}
        />
        <StatsCard
          title="Total Forks"
          value={data.repos.reduce((acc: number, repo: any) => acc + repo.forks, 0)}
          icon={<GitFork className="h-4 w-4" />}
          color="bg-green-500"
          index={2}
        />
        <StatsCard
          title="Open Issues"
          value={data.issues.length}
          icon={<GitPullRequest className="h-4 w-4" />}
          color="bg-purple-500"
          index={3}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="repositories">Repositories</TabsTrigger>
          <TabsTrigger value="languages">Languages</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Repos Card */}
            <Card className="shadow-md border border-border">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" /> Top Repositories
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => toggleExpand("repos")} className="h-8 w-8 p-0">
                  {expandedCards.repos ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {(expandedCards.repos ? filteredRepos : filteredRepos.slice(0, 5)).map((repo: any, index: number) => (
                    <motion.li
                      key={repo.id}
                      className="p-3 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex justify-between items-start">
                        <a
                          href={repo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-primary hover:underline flex items-center"
                        >
                          {repo.fullName}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                        <Badge variant="outline">{repo.language}</Badge>
                      </div>
                      <div className="flex items-center mt-2 text-sm text-muted-foreground">
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
                  ))}
                </ul>
                {!expandedCards.repos && filteredRepos.length > 5 && (
                  <Button variant="ghost" size="sm" onClick={() => toggleExpand("repos")} className="w-full mt-3">
                    View all {filteredRepos.length} repositories
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Language Distribution */}
            <Card className="shadow-md border border-border">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Code className="h-5 w-5 text-blue-500" /> Language Distribution
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
                          data={data.languageStats}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="repoCount"
                          nameKey="language"
                          label={({ language, repoCount }) => `${language}: ${repoCount}`}
                        >
                          {data.languageStats.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip formatter={(value, name) => [`${value} repositories`, name]} />
                      </PieChart>
                    ) : (
                      <BarChart
                        data={data.languageStats}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="language" width={100} />
                        <RechartsTooltip formatter={(value) => [`${value} repositories`, "Count"]} />
                        <Bar dataKey="repoCount" radius={[0, 4, 4, 0]}>
                          {data.languageStats.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </motion.div>
              </CardContent>
            </Card>
          </div>

          {/* Issues Chart */}
          <Card className="shadow-md border border-border">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                <GitPullRequest className="h-5 w-5 text-purple-500" /> Most Discussed Issues
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => toggleExpand("issues")} className="h-8 w-8 p-0">
                {expandedCards.issues ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.issues} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
                      formatter={(value, name, props) => [`${value} comments`, props.payload.repository || "Comments"]}
                      labelFormatter={(label) => `Issue: ${label}`}
                    />
                    <Bar dataKey="comments" radius={[8, 8, 0, 0]} animationDuration={1500}>
                      {data.issues.map((entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.comments > 15 ? "#ef4444" : entry.comments > 10 ? "#f59e0b" : "#3b82f6"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card className="shadow-md border border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <GitPullRequest className="h-5 w-5 text-green-500" /> Contribution Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={generateActivityData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartsTooltip formatter={(value) => [`${value} contributions`]} />
                    <Line
                      type="monotone"
                      dataKey="contributions"
                      stroke="#3b82f6"
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

        <TabsContent value="repositories" className="space-y-6">
          <Card className="shadow-md border border-border">
            <CardHeader>
              <CardTitle>All Repositories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRepos.map((repo: any, index: number) => (
                  <motion.div
                    key={repo.id}
                    className="p-4 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex justify-between items-start">
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary hover:underline flex items-center"
                      >
                        {repo.fullName}
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                      <Badge variant="outline">{repo.language}</Badge>
                    </div>
                    <div className="flex items-center mt-2 text-sm text-muted-foreground">
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
        </TabsContent>

        <TabsContent value="languages" className="space-y-6">
          <Card className="shadow-md border border-border">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle>Language Distribution</CardTitle>
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
                        data={data.languageStats}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="repoCount"
                        nameKey="language"
                        label={({ language, repoCount }) => `${language}: ${repoCount}`}
                      >
                        {data.languageStats.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(value, name) => [`${value} repositories`, name]} />
                    </PieChart>
                  ) : (
                    <BarChart
                      data={data.languageStats}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="language" width={100} />
                      <RechartsTooltip formatter={(value) => [`${value} repositories`, "Count"]} />
                      <Bar dataKey="repoCount" radius={[0, 4, 4, 0]}>
                        {data.languageStats.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </motion.div>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {data.languageStats.map((lang: any, index: number) => (
                  <div key={lang.language} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    ></div>
                    <span className="text-sm">
                      {lang.language}: {lang.repoCount}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issues" className="space-y-6">
          <Card className="shadow-md border border-border">
            <CardHeader>
              <CardTitle>All Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.issues.map((issue: any, index: number) => (
                  <motion.div
                    key={issue.id}
                    className="p-4 rounded-lg border bg-card shadow-sm "
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{issue.title}</h3>
                        {issue.repository && (
                          <p className="text-sm text-muted-foreground">Repository: {issue.repository}</p>
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
        </TabsContent>
      </Tabs>

      {/* Tech Quote */}
      <motion.div
        className="text-center mt-10 text-lg italic text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        "Code is like humor. When you have to explain it, it's bad."
      </motion.div>
      <BackgroundBeams />
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

// Helper function to generate mock activity data
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

