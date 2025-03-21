"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import Sentiment from "sentiment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, ExternalLink } from "lucide-react";
import { useTheme } from "next-themes";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

interface RedditPost {
  id: string;
  title: string;
  subreddit: string;
  url: string;
  upvotes: number;
  comments: number;
  createdAt: string;
  author: string;
}

export default function RedditDashboardPage() {
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [loading, setLoading] = useState(true);
  // Active tab for recent posts (by subreddit)
  const [activeSubreddit, setActiveSubreddit] = useState("programming");
  const { theme, setTheme } = useTheme();
  const sentiment = useMemo(() => new Sentiment(), []);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/reddit");
        const data: RedditPost[] = await res.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching Reddit trends:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Group posts by subreddit
  const postsBySubreddit = useMemo(() => {
    return posts.reduce((acc, post) => {
      if (!acc[post.subreddit]) {
        acc[post.subreddit] = [];
      }
      acc[post.subreddit].push(post);
      return acc;
    }, {} as Record<string, RedditPost[]>);
  }, [posts]);

  // Compute aggregated metrics per subreddit
  const subredditMetrics = useMemo(() => {
    const metrics: Record<
      string,
      { upvotes: number; comments: number; sentimentSum: number; count: number }
    > = {};
    posts.forEach((post) => {
      if (!metrics[post.subreddit]) {
        metrics[post.subreddit] = { upvotes: 0, comments: 0, sentimentSum: 0, count: 0 };
      }
      const analysis = sentiment.analyze(post.title);
      metrics[post.subreddit].upvotes += post.upvotes;
      metrics[post.subreddit].comments += post.comments;
      metrics[post.subreddit].sentimentSum += analysis.score;
      metrics[post.subreddit].count += 1;
    });
    return metrics;
  }, [posts, sentiment]);

  // Chart: Upvotes & Comments by Subreddit (Bar Chart)
  const barChartData = useMemo(() => {
    const labels = Object.keys(subredditMetrics);
    const upvotesData = labels.map((sub) => subredditMetrics[sub].upvotes);
    const commentsData = labels.map((sub) => subredditMetrics[sub].comments);
    return {
      labels,
      datasets: [
        {
          label: "Upvotes",
          data: upvotesData,
          backgroundColor: "#3b82f6",
        },
        {
          label: "Comments",
          data: commentsData,
          backgroundColor: "#f97316",
        },
      ],
    };
  }, [subredditMetrics]);

  // Chart: Average Sentiment by Subreddit (Bar Chart)
  const sentimentBarData = useMemo(() => {
    const labels = Object.keys(subredditMetrics);
    const avgSentiment = labels.map((sub) => {
      const { sentimentSum, count } = subredditMetrics[sub];
      return count ? sentimentSum / count : 0;
    });
    return {
      labels,
      datasets: [
        {
          label: "Average Sentiment",
          data: avgSentiment,
          backgroundColor: "#14b8a6",
        },
      ],
    };
  }, [subredditMetrics]);

// 1) Define your set of known tech keywords
const techKeywords = new Set([
    "javascript",
    "python",
    "cybersecurity",
    "ai",
    "machine",
    "learning",
    "blockchain",
    "docker",
    "kubernetes",
    "cloud",
    "aws",
    "gcp",
    "azure",
    "react",
    "vue",
    "angular",
    "linux",
    // add as many as you like
  ]);
  
  // Removed duplicate export default function RedditDashboardPage
  // Overall Stats
  const totalUpvotes = useMemo(() => posts.reduce((sum, post) => sum + post.upvotes, 0), [posts]);
  const totalComments = useMemo(() => posts.reduce((sum, post) => sum + post.comments, 0), [posts]);
  const totalPosts = posts.length;
  const overallSentiment = useMemo(() => {
    if (!posts.length) return 0;
    const total = posts.reduce((sum, post) => sum + sentiment.analyze(post.title).score, 0);
    return total / posts.length;
  }, [posts, sentiment]);

  // Define subreddits for the Posts tab
  const subredditTabs = ["cybersecurity", "startups", "technology",'programming',
  'gadgets',
  'technews',
  'apple',
  'android'];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 space-y-8 max-w-7xl mx-auto"
    >
      {/* Header & Theme Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <motion.h1
          className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Reddit Tech Trends Dashboard
        </motion.h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search posts..." className="pl-8 h-9 w-[200px] md:w-[260px]" />
          </div>
        
        </div>
      </div>

      {loading ? (
        <div className="text-center text-lg font-semibold">Loading data...</div>
      ) : (
        <>
          {/* Stats Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard title="Total Posts" value={totalPosts} icon={<ExternalLink className="h-4 w-4" />} color="bg-blue-500" index={0} />
            <StatsCard title="Total Upvotes" value={totalUpvotes} icon={<ExternalLink className="h-4 w-4" />} color="bg-green-500" index={1} />
            <StatsCard title="Total Comments" value={totalComments} icon={<ExternalLink className="h-4 w-4" />} color="bg-purple-500" index={2} />
            <StatsCard title="Overall Sentiment" value={parseFloat(overallSentiment.toFixed(2))} icon={<ExternalLink className="h-4 w-4" />} color="bg-red-500" index={3} />
          </div>

          {/* Tabs: Overview & Posts */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full md:w-auto grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="posts">Posts</TabsTrigger>
            </TabsList>

            {/* Overview Tab: AI Summary + Charts */}
            <TabsContent value="overview" className="space-y-6">
              {/* AI Summary Card */}
              <Card className="shadow-md border border-border metallic-card">
                <CardHeader>
                  <CardTitle>AI Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Based on the data analyzed, there are a total of {totalPosts} posts with {totalUpvotes} upvotes and {totalComments} comments. The overall sentiment across posts is {overallSentiment.toFixed(2)}. These trends indicate vibrant discussions across various tech subreddits.
                  </p>
                </CardContent>
              </Card>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upvotes & Comments Chart */}
                <Card className="shadow-md border border-border metallic-card" style={{ height: "320px" }}>
                  <CardHeader>
                    <CardTitle>Upvotes & Comments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-full">
                      <Bar
                        data={barChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          layout: { padding: { bottom: 20 } },
                          plugins: { legend: { position: "bottom", labels: { color: "#fff" } } },
                          scales: { x: { ticks: { color: "#fff" } }, y: { ticks: { color: "#fff" } } },
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Average Sentiment Chart */}
                <Card className="shadow-md border border-border metallic-card" style={{ height: "320px" }}>
                  <CardHeader>
                    <CardTitle>Average Sentiment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-full">
                      <Bar
                        data={sentimentBarData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          layout: { padding: { bottom: 20 } },
                          plugins: { legend: { position: "bottom", labels: { color: "#fff" } } },
                          scales: { x: { ticks: { color: "#fff" } }, y: { ticks: { color: "#fff" }, min: -5 } },
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Top 10 Common Words Chart */}
                <Card className="shadow-md border border-border metallic-card" style={{ height: "320px" }}>
                  <CardHeader>
                    <CardTitle>Top 10 Common Words</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-full">
                      <Bar
                        data={{
                          labels: Array.from(techKeywords),
                          datasets: [
                            {
                              label: "Keywords",
                              data: Array.from(techKeywords).map(() => Math.random() * 100), // Replace with actual data if available
                              backgroundColor: "#ff6384",
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          indexAxis: "y",
                          layout: { padding: { bottom: 20 } },
                          plugins: { legend: { display: false } },
                          scales: { x: { ticks: { color: "#fff" } }, y: { ticks: { color: "#fff" } } },
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="posts" className="space-y-6">
  <Card className="shadow-md border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
   

    <CardContent>
      <div className="flex space-x-4 mb-4">
        {subredditTabs.map((sub) => (
          <Button
            key={sub}
            variant={activeSubreddit === sub ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveSubreddit(sub)}
          >
            r/{sub}
          </Button>
        ))}
      </div>

      <ul className="space-y-4">
        {(postsBySubreddit[activeSubreddit] || []).map((post) => (
          <motion.li
            key={post.id}
            className="p-4 bg-orange-50 dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transform transition duration-200 hover:scale-105"
            whileHover={{ scale: 1.02 }}
          >
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-orange-700 dark:text-orange-300 hover:underline"
            >
              {post.title}
            </a>
            <div className="text-sm mt-2 text-gray-700 dark:text-gray-300">
              <span className="mr-4">👍 {post.upvotes} upvotes</span>
              <span>💬 {post.comments} comments</span>
            </div>
          </motion.li>
        ))}
      </ul>
    </CardContent>
  </Card>
</TabsContent>

          </Tabs>
        </>
      )}

      <style jsx>{`
        /* Animated gradient for card header */
        .gradient-header {
          background: linear-gradient(45deg, #8b5cf6, #3b82f6, #10b981, #f59e0b);
          background-size: 400% 400%;
          animation: headerGradientAnimation 6s ease infinite;
        }
        @keyframes headerGradientAnimation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        /* Animated gradient for each post card */
        .gradient-card {
          background: linear-gradient(45deg, #ff80bf, #ff0080, #8000ff, #0080ff);
          background-size: 400% 400%;
          animation: cardGradientAnimation 8s ease infinite;
        }
        @keyframes cardGradientAnimation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        /* Metallic shine effect */
        .metallic-card {
          position: relative;
          overflow: hidden;
        }
        .metallic-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: -75%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transform: skewX(-25deg);
          animation: shine 2s infinite;
        }
        @keyframes shine {
          0% {
            left: -75%;
          }
          50% {
            left: 125%;
          }
          100% {
            left: 125%;
          }
        }
        /* Slow pulse animation for header */
        .animate-pulseSlow {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.9;
          }
        }
      `}</style>
    </motion.section>
  );
}

// Reusable Stats Card Component
function StatsCard({
  title,
  value,
  icon,
  color,
  index,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className={`${color} p-2 rounded-full text-white`}>{icon}</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
