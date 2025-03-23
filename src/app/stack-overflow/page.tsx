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
} from "recharts"
import { motion } from "framer-motion"
import {
  Award,
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
  Star,
  Sun,
  Tag,
  ThumbsUp,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"

export default function StackOverflowPage() {
  const [data, setData] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [tagFilter, setTagFilter] = useState<string | null>(null)
  const [chartType, setChartType] = useState<"pie" | "bar">("pie")
  const [expandedCards, setExpandedCards] = useState<{ [key: string]: boolean }>({
    questions: false,
    answers: false,
    tags: false,
  })
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const fetchSOData = async () => {
      const res = await fetch("/api/stackoverflow")
      const json = await res.json()
      setData(json)
      console.log(data)
    }
    fetchSOData()
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

  useEffect(() => {
    // Force re-render of charts when tag filter changes
    setChartType(chartType === "pie" ? "pie" : "bar")
  }, [tagFilter])

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

  // Filter questions based on search term and tag filter
  console.log(data)
  const filteredQuestions = data.questions.filter((q: any) => {
    const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag = tagFilter ? q.tags.includes(tagFilter) : true
    return matchesSearch && matchesTag
  })

  // Filter answers based on search term
  const filteredAnswers = data.answers.filter((a: any) =>
    (a.questionTitle ?? "").toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Colors for charts
  const colors = [
    "#f97316", // orange
    "#10b981", // green
    "#3b82f6", // blue
    "#8b5cf6", // purple
    "#facc15", // yellow
    "#ef4444", // red
    "#06b6d4", // cyan
    "#ec4899", // pink
    "#6366f1", // indigo
    "#84cc16", // lime
  ]

  // Calculate stats
  const totalQuestions = data.questions.length
  const totalAnswers = data.answers.length
  const totalScore =
    data.questions.reduce((acc: number, q: any) => acc + q.score, 0) +
    data.answers.reduce((acc: number, a: any) => acc + a.score, 0)
  const totalTags = [...new Set(data.questions.flatMap((q: any) => q.tags))].length
  const generateTagStats = () => {
    const tagMap = new Map()

    // Only process questions that match the current search term
    const questionsToProcess = tagFilter
      ? data.questions.filter((q: { tags: string[] }) => q.tags.includes(tagFilter))
      : data.questions

    questionsToProcess.forEach((question: { tags: string[] }) => {
      question.tags.forEach((tag) => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
      })
    })

    // Convert to array and sort by count (descending)
    const tagArray = Array.from(tagMap.entries())
      .map(([tag, count]) => ({ tag, questionCount: count }))
      .sort((a, b) => b.questionCount - a.questionCount)

    // Take top tags and group the rest as "Others"
    const topTags = tagArray.slice(0, 9)
    const otherTags = tagArray.slice(9)

    if (otherTags.length > 0) {
      const otherCount = otherTags.reduce((sum, item) => sum + item.questionCount, 0)
      if (otherCount > 0) {
        topTags.push({ tag: "Others", questionCount: otherCount })
      }
    }

    return topTags
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            Stack Overflow Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Track your questions, answers, and reputation</p>
        </motion.div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search questions & answers..."
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
              <DropdownMenuItem onClick={() => setTagFilter(null)}>All Tags</DropdownMenuItem>
              {generateTagStats().map((tagStat) => (
                <DropdownMenuItem key={tagStat.tag} onClick={() => setTagFilter(tagStat.tag)}>
                  {tagStat.tag} ({tagStat.questionCount})
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
          title="Total Questions"
          value={totalQuestions}
          icon={<MessageSquare className="h-4 w-4" />}
          color="bg-orange-500"
          index={0}
        />
        <StatsCard
          title="Total Answers"
          value={totalAnswers}
          icon={<ThumbsUp className="h-4 w-4" />}
          color="bg-green-500"
          index={1}
        />
        <StatsCard
          title="Total Score"
          value={totalScore}
          icon={<Star className="h-4 w-4" />}
          color="bg-blue-500"
          index={2}
        />
        <StatsCard
          title="Unique Tags"
          value={totalTags}
          icon={<Tag className="h-4 w-4" />}
          color="bg-purple-500"
          index={3}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="answers">Answers</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Questions Card */}
            <Card className="shadow-md border border-border">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-orange-500" /> Top Questions
                  </CardTitle>
                  {tagFilter && (
                    <CardDescription className="flex items-center mt-1">
                      Filtered by:
                      <Badge variant="outline" className="ml-2">
                        {tagFilter}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setTagFilter(null)}
                          className="h-4 w-4 ml-1 p-0"
                        >
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </Badge>
                    </CardDescription>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={() => toggleExpand("questions")} className="h-8 w-8 p-0">
                  {expandedCards.questions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CardHeader>
              <CardContent>
                {filteredQuestions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No questions match your search criteria</div>
                ) : (
                  <ul className="space-y-3">
                    {(expandedCards.questions ? filteredQuestions : filteredQuestions.slice(0, 5)).map(
                      (q: any, index: number) => (
                        <motion.li
                          key={q.id}
                          className="p-3 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className="flex justify-between items-start">
                            <a
                              href={`https://stackoverflow.com/q/${q.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-primary hover:underline flex items-center"
                            >
                              {q.title}
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                            <Badge variant="secondary" className="ml-2">
                              <Star className="h-3 w-3 mr-1 text-yellow-500" />
                              {q.score}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {q.tags.map((tag: string) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs bg-orange-50 text-orange-800 hover:bg-orange-100 cursor-pointer dark:bg-orange-950 dark:text-orange-300"
                                onClick={() => setTagFilter(tag)}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </motion.li>
                      ),
                    )}
                  </ul>
                )}
                {!expandedCards.questions && filteredQuestions.length > 5 && (
                  <Button variant="ghost" size="sm" onClick={() => toggleExpand("questions")} className="w-full mt-3">
                    View all {filteredQuestions.length} questions
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Top Answers Card */}
            {/* Top Answers Card */}
            <Card className="shadow-md border border-border">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <ThumbsUp className="h-5 w-5 text-green-500" /> Top Answers
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => toggleExpand("answers")} className="h-8 w-8 p-0">
                  {expandedCards.answers ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CardHeader>
              <CardContent>
                {filteredAnswers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No answers match your search criteria</div>
                ) : (
                  <ul className="space-y-3">
                    {(expandedCards.answers ? filteredAnswers : filteredAnswers.slice(0, 5)).map(
                      (ans: any, index: number) => (
                        <motion.li
                          key={ans.id}
                          className="p-3 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="text-sm text-muted-foreground">Answer for question #{ans.questionId}</div>
                              <a
                                href={ans.link} // Link to the answer or question
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-primary hover:underline flex items-center"
                              >
                                View on Stack Overflow
                                <ExternalLink className="ml-1 h-3 w-3" />
                              </a>
                            </div>
                            <Badge
                              variant="secondary"
                              className={`ml-2 ${
                                ans.isAccepted
                                  ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"
                                  : ""
                              }`}
                            >
                              {ans.isAccepted && <Award className="h-3 w-3 mr-1 text-green-500" />}
                              <Star className="h-3 w-3 mr-1 text-yellow-500" />
                              {ans.score}
                            </Badge>
                          </div>
                          {/* If you store answer body and want to show an excerpt, you can do so here.
                  For example, if ans.body is available, you could render a truncated version:
              */}
                          {ans.body && (
                            <div className="text-sm mt-2 text-muted-foreground line-clamp-2">
                              {ans.body.replace(/(<([^>]+)>)/gi, "").slice(0, 150)}...
                            </div>
                          )}
                        </motion.li>
                      ),
                    )}
                  </ul>
                )}
                {!expandedCards.answers && filteredAnswers.length > 5 && (
                  <Button variant="ghost" size="sm" onClick={() => toggleExpand("answers")} className="w-full mt-3">
                    View all {filteredAnswers.length} answers
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Tag Distribution Chart */}
          <Card className="shadow-md border border-border">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Tag className="h-5 w-5 text-purple-500" /> Popular Tags
                </CardTitle>
                {tagFilter && (
                  <CardDescription className="flex items-center mt-1">
                    Filtered by:
                    <Badge variant="outline" className="ml-2">
                      {tagFilter}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTagFilter(null)}
                        className="h-4 w-4 ml-1 p-0"
                      >
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </Badge>
                  </CardDescription>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={() => toggleExpand("tags")} className="h-8 w-8 p-0">
                {expandedCards.tags ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CardHeader>

            <CardContent>
              {/* Extract tags from questions */}
              {data?.questions?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No tags available</div>
              ) : (
                (() => {
                  const tagMap = new Map()
                  data.questions.forEach((q: any) => {
                    q.tags.forEach((tag: string) => {
                      tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
                    })
                  })
                  const tagArray = Array.from(tagMap.entries())

                  return (
                    <ul className="space-y-3">
                      {(expandedCards.tags ? tagArray : tagArray.slice(0, 5)).map(
                        ([tag, count]: any, index: number) => (
                          <motion.li
                            key={tag}
                            className="p-3 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            whileHover={{ scale: 1.01 }}
                          >
                            <div className="flex justify-between items-start">
                              <span className="font-medium text-primary flex items-center">{tag}</span>
                              <Badge variant="secondary" className="ml-2">
                                <Star className="h-3 w-3 mr-1 text-yellow-500" /> {count}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              <Badge
                                variant="outline"
                                className="text-xs bg-orange-50 text-orange-800 hover:bg-orange-100 cursor-pointer dark:bg-orange-950 dark:text-orange-300"
                                onClick={() => setTagFilter(tag)}
                              >
                                {tag}
                              </Badge>
                            </div>
                          </motion.li>
                        ),
                      )}
                    </ul>
                  )
                })()
              )}

              {!expandedCards.tags && data.questions && data.questions.length > 0 && (
                <Button variant="ghost" size="sm" onClick={() => toggleExpand("tags")} className="w-full mt-3">
                  View all tags
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Reputation Timeline */}
          <Card className="shadow-md border border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" /> Reputation Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={generateReputationData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartsTooltip formatter={(value) => [`${value} reputation`]} />
                    <Line
                      type="monotone"
                      dataKey="reputation"
                      stroke="#f97316"
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

        <TabsContent value="questions" className="space-y-6">
          <Card className="shadow-md border border-border">
            <CardHeader>
              <CardTitle>All Questions</CardTitle>
              {tagFilter && (
                <CardDescription className="flex items-center mt-1">
                  Filtered by:
                  <Badge variant="outline" className="ml-2">
                    {tagFilter}
                    <Button variant="ghost" size="icon" onClick={() => setTagFilter(null)} className="h-4 w-4 ml-1 p-0">
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </Badge>
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {filteredQuestions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No questions match your search criteria</div>
              ) : (
                <div className="space-y-4">
                  {filteredQuestions.map((q: any, index: number) => (
                    <motion.div
                      key={q.id}
                      className="p-4 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <a
                            href={`https://stackoverflow.com/q/${q.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-primary hover:underline flex items-center"
                          >
                            {q.title}
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {q.tags.map((tag: string) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs bg-orange-50 text-orange-800 hover:bg-orange-100 cursor-pointer dark:bg-orange-950 dark:text-orange-300"
                                onClick={() => setTagFilter(tag)}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <Badge variant="secondary">
                            <Star className="h-3 w-3 mr-1 text-yellow-500" />
                            {q.score}
                          </Badge>
                          {q.views && (
                            <span className="text-xs text-muted-foreground mt-1">{q.views.toLocaleString()} views</span>
                          )}
                        </div>
                      </div>
                      {q.excerpt && <p className="text-sm mt-3 text-muted-foreground">{q.excerpt}</p>}
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={q.author?.avatar || ""} />
                            <AvatarFallback>{q.author?.name?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">{q.author?.name || "User"}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(q.date || new Date().toISOString())}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="answers" className="space-y-6">
          <Card className="shadow-md border border-border">
            <CardHeader>
              <CardTitle>All Answers</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredAnswers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No answers match your search criteria</div>
              ) : (
                <div className="space-y-4">
                  {filteredAnswers.map((ans: any, index: number) => (
                    <motion.div
                      key={ans.id}
                      className="p-4 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm text-muted-foreground">Answer to:</div>
                          <a
                            href={`https://stackoverflow.com/a/${ans.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-primary hover:underline flex items-center"
                          >
                            {ans.questionTitle}
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        </div>
                        <div className="flex flex-col items-end">
                          <Badge
                            variant="secondary"
                            className={
                              ans.accepted ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300" : ""
                            }
                          >
                            {ans.accepted && <Award className="h-3 w-3 mr-1 text-green-500" />}
                            <Star className="h-3 w-3 mr-1 text-yellow-500" />
                            {ans.score}
                          </Badge>
                        </div>
                      </div>
                      {ans.excerpt && <p className="text-sm mt-3 text-muted-foreground">{ans.excerpt}</p>}
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={ans.author?.avatar || ""} />
                            <AvatarFallback>{ans.author?.name?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">{ans.author?.name || "User"}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(ans.date || new Date().toISOString())}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tags" className="space-y-6">
          <Card className="shadow-md border border-border">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle>Tag Distribution</CardTitle>
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
                        data={generateTagStats()}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="questionCount"
                        nameKey="tag"
                        label={({ tag, questionCount }) => `${tag}: ${questionCount}`}
                      >
                        {generateTagStats().map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(value, name, props) => [`${value} questions`, props.payload.tag]} />
                    </PieChart>
                  ) : (
                    <BarChart
                      data={generateTagStats()}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="tag" width={80} />
                      <RechartsTooltip formatter={(value) => [`${value} questions`, "Count"]} />
                      <Bar dataKey="questionCount" radius={[0, 4, 4, 0]}>
                        {generateTagStats().map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </motion.div>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {generateTagStats().map((tag: any, index: number) => (
                  <div
                    key={tag.tag}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer"
                    onClick={() => setTagFilter(tag.tag)}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    ></div>
                    <span className="text-sm">
                      {tag.tag}: {tag.questionCount}
                    </span>
                  </div>
                ))}
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
        "Knowledge shared is knowledge squared."
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

// Helper function to generate mock reputation data
function generateReputationData() {
  const data = []
  const now = new Date()

  for (let i = 30; i >= 0; i--) {
    const date = new Date()
    date.setDate(now.getDate() - i)

    // Generate a somewhat realistic reputation curve
    let reputation = 0
    if (i === 30) {
      reputation = Math.floor(Math.random() * 100) + 100
    } else {
      const prevRep = data[data.length - 1].reputation
      const change = Math.floor(Math.random() * 30) - 5 // -5 to +25
      reputation = Math.max(prevRep + change, prevRep) // Reputation generally increases
    }

    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      reputation,
    })
  }

  return data
}

// Helper function to generate mock tag timeline data
function generateTagTimelineData() {
  const data = []
  const now = new Date()

  for (let i = 12; i >= 0; i--) {
    const date = new Date()
    date.setMonth(now.getMonth() - i)

    const entry: any = {
      date: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    }

    // Add random values for top 5 tags
    ;["javascript", "python", "react", "node.js", "typescript"].forEach((tag) => {
      entry[tag] = Math.floor(Math.random() * 10) + 1
    })

    data.push(entry)
  }

  return data
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

