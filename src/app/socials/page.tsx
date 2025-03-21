"use client";
import DOMPurify from "dompurify";

import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Pie, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

interface SocialMediaPost {
  id: string;
  platform: string;
  content: string;
  author: string;
  hashtags: string[];
  url: string;
  score?: number;
  createdAt: string;
  aggregatedAt: string;
}

export default function SocialDashboardPage() {
  const [posts, setPosts] = useState<SocialMediaPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/socialmedia");
        const data = await res.json();
        setPosts(data.posts);
      } catch (error) {
        console.error("Error fetching social media data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Key metrics
  const totalPosts = posts.length;
  const totalScore = posts.reduce((acc, p) => acc + (p.score || 0), 0);
  const avgScore = totalPosts > 0 ? (totalScore / totalPosts).toFixed(2) : "0";

  // Platform Distribution (Pie)
  const platformDistribution = useMemo(() => {
    const dist: Record<string, number> = {};
    posts.forEach((p) => {
      dist[p.platform] = (dist[p.platform] || 0) + 1;
    });
    return dist;
  }, [posts]);

  const pieData = useMemo(() => {
    const labels = Object.keys(platformDistribution);
    const data = labels.map((key) => platformDistribution[key]);

    // Generate an HSL color per label to mimic dynamic color assignment
    const backgroundColors = labels.map(
      (_, idx) => `hsl(${(idx * 360) / (labels.length || 1)}, 70%, 60%)`
    );
    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors,
        },
      ],
    };
  }, [platformDistribution]);

  // Top Hashtags frequency (Bar)
  const hashtagFrequency = useMemo(() => {
    const freq: Record<string, number> = {};
    posts.forEach((p) => {
      p.hashtags.forEach((tag) => {
        const lower = tag.toLowerCase();
        freq[lower] = (freq[lower] || 0) + 1;
      });
    });
    // Sort and take top 5
    const sorted = Object.entries(freq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
    return sorted;
  }, [posts]);

  const barData = useMemo(() => {
    const labels = hashtagFrequency.map(([tag]) => tag);
    const data = hashtagFrequency.map(([, count]) => count);
    return {
      labels,
      datasets: [
        {
          label: "Hashtag Frequency",
          data,
          backgroundColor: "rgba(255, 159, 64, 0.6)",
        },
      ],
    };
  }, [hashtagFrequency]);

  // Posts Over Time (Line)
  const postsPerDay = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach((p) => {
      const date = new Date(p.createdAt).toISOString().split("T")[0];
      counts[date] = (counts[date] || 0) + 1;
    });
    const sortedDates = Object.keys(counts).sort();
    const data = sortedDates.map((date) => counts[date]);
    return { labels: sortedDates, data };
  }, [posts]);

  const lineData = useMemo(() => {
    return {
      labels: postsPerDay.labels,
      datasets: [
        {
          label: "Posts per Day",
          data: postsPerDay.data,
          borderColor: "rgba(75,192,192,1)",
          backgroundColor: "rgba(75,192,192,0.2)",
          fill: true,
        },
      ],
    };
  }, [postsPerDay]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 space-y-8 max-w-7xl mx-auto"
    >
      {/* Header (similar to Reddit page) */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <motion.h1
          className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Social Media Trends Dashboard
        </motion.h1>

        {/* Search Bar */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              className="pl-8 h-9 w-[200px] md:w-[260px]"
            />
          </div>
        </div>
      </div>

      {/* Loading state => Show Skeletons */}
      {loading ? (
        <>
          {/* Skeleton for Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </div>

          {/* Skeleton for the Tab layout & charts */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full md:w-auto grid-cols-1 md:grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="posts">Posts</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card className="shadow-md border metallic-card">
                <CardHeader>
                  <Skeleton className="h-4 w-1/4 mb-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/3" />
                </CardContent>
              </Card>

              {/* 3 charts skeleton */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartSkeleton />
                <ChartSkeleton />
              </div>
              {/* One more chart skeleton */}
              <ChartSkeleton />
            </TabsContent>

            <TabsContent value="posts" className="space-y-6">
              <Card className="shadow-md border metallic-card">
                <CardHeader>
                  <Skeleton className="h-4 w-1/4 mb-2" />
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {[...Array(5)].map((_, idx) => (
                      <li
                        key={idx}
                        className="p-4 bg-orange-50 dark:bg-gray-800 rounded-lg shadow"
                      >
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <>
          {/* Stats Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatsCard
              title="Total Posts"
              value={totalPosts}
              index={0}
              color="bg-blue-500"
            />
            <StatsCard
              title="Total Score"
              value={totalScore}
              index={1}
              color="bg-green-500"
            />
            <StatsCard
              title="Avg Score"
              value={avgScore}
              index={2}
              color="bg-purple-500"
            />
          </div>

          {/* Use Tabs for “Overview” vs “Posts” */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full md:w-auto grid-cols-1 md:grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="posts">Posts</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Summary Card */}
              <Card className="shadow-md border metallic-card">
                <CardHeader>
                  <CardTitle>Social Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    We’ve aggregated {totalPosts} posts across multiple platforms
                    with a total score of {totalScore}. The average score is{" "}
                    {avgScore}, indicating overall sentiment or engagement for
                    these posts.
                  </p>
                </CardContent>
              </Card>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Platform Distribution (Pie) */}
                <Card className="shadow-md border metallic-card" style={{ height: "320px" }}>
                  <CardHeader>
                    <CardTitle>Platform Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-full">
                      <Pie
                        data={pieData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: { legend: { position: "bottom" } },
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Top Hashtags (Bar) */}
                <Card className="shadow-md border metallic-card" style={{ height: "320px" }}>
                  <CardHeader>
                    <CardTitle>Top Hashtags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-full">
                      <Bar
                        data={barData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: { legend: { position: "bottom" } },
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Posts Over Time (Line) */}
              <Card className="shadow-md border metallic-card" style={{ height: "320px" }}>
                <CardHeader>
                  <CardTitle>Posts Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-full">
                    <Line
                      data={lineData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { position: "bottom" } },
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Posts Tab */}
            <TabsContent value="posts" className="space-y-6">
              <Card className="shadow-md border metallic-card">
                <CardHeader>
                  <CardTitle>Recent Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {posts.map((post) => {
                      // Sanitize the HTML content of the post
                      const sanitizedContent = DOMPurify.sanitize(post.content);
                      return (
                        <motion.li
                          key={post.id}
                          className="p-4 bg-orange-50 dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transform transition duration-200 hover:scale-105"
                          whileHover={{ scale: 1.02 }}
                        >
                          {/* Render the sanitized HTML */}
                          <div
                            className="prose dark:prose-invert"
                            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                          />
                          <div className="text-sm mt-2 text-gray-700 dark:text-gray-300">
                            <span className="mr-4">
                              Platform: {post.platform.toUpperCase()}
                            </span>
                            <span>Hashtags: {post.hashtags.join(", ")}</span>
                          </div>
                        </motion.li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Styles to mimic the "Reddit Dashboard" flair:
         metallic card effect, gradient animations, etc. */}
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

        /* Metallic shine effect (optional) */
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
      `}</style>
    </motion.section>
  );
}

/* 
  Reusable Stats Card + Skeleton 
*/

// StatsCard
function StatsCard({
  title,
  value,
  color,
  index,
}: {
  title: string;
  value: number | string;
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
          <div className={`${color} p-2 rounded-full text-white`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// StatsCardSkeleton
function StatsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-6 w-1/3" />
      </CardContent>
    </Card>
  );
}

// ChartSkeleton – placeholder for charts in loading state
function ChartSkeleton() {
  return (
    <Card
      className="shadow-md border metallic-card"
      style={{ height: "320px" }}
    >
      <CardHeader>
        <Skeleton className="h-4 w-2/5 mb-2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-64 w-full" />
      </CardContent>
    </Card>
  );
}
