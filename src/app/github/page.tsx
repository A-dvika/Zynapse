"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "recharts";
import { motion } from "framer-motion";
import {
  BarChart3,
  ChevronDown,
  ChevronUp,
  Code,
  ExternalLink,
  GitFork,
  GitPullRequest,
  PieChartIcon,
  Search,
  Star,
} from "lucide-react";
import { useTheme } from "next-themes";

interface Repo {
  id: number;
  fullName: string;
  language: string | null;
  stars: number;
  forks: number;
  url: string;
}

interface Issue {
  id: number;
  title: string;
  repository: string;
  comments: number;
}

interface LanguageStat {
  language: string;
  repoCount: number;
}

interface GithubData {
  repos: Repo[];
  issues: Issue[];
  languageStats: LanguageStat[];
}

export default function GithubPage() {
  const [data, setData] = useState<GithubData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");
  const [expandedCards, setExpandedCards] = useState<{ [key: string]: boolean }>({
    repos: false,
    languages: false,
    issues: false,
  });

  useEffect(() => {
    const fetchGithubData = async () => {
      const res = await fetch("/api/github");
      const json: GithubData = await res.json();
      setData(json);
    };
    fetchGithubData();
  }, []);

  const toggleExpand = (card: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [card]: !prev[card],
    }));
  };

  if (!data)
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <p className="text-muted-foreground">Loading GitHub Stats...</p>
        </div>
      </div>
    );

  // Filter repos based on search term
  const filteredRepos = data.repos.filter(
    (repo) =>
      repo.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repo.language?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
  ];

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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-8 h-9 w-[200px] md:w-[260px]"
            />
          </div>
        </div>
      </div>

      {/* Rest of the code remains unchanged */}

      {/* Tech Quote */}
      <motion.div
        className="text-center mt-10 text-lg italic text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        &quot;Code is like humor. When you have to explain it, it&apos;s bad.&quot;
      </motion.div>
    </motion.section>
  );
}

// Stats Card Component
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
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
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

// Helper function to generate mock activity data
function generateActivityData() {
  const data = [];
  const now = new Date();

  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);

    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      contributions: Math.floor(Math.random() * 15) + 1,
    });
  }

  return data;
}
