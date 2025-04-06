"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThumbsUp, ThumbsDown, ArrowRight, Newspaper, ExternalLink, Github, Code, BookOpen, Video, Headphones, Globe, Sparkles } from "lucide-react";
import { BackgroundBeams } from "@/components/ui/beams";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

// Sample data for different content types
const sampleNews = [
  {
    id: "news1",
    title: "OpenAI announces GPT-5 with revolutionary capabilities",
    source: "TechCrunch",
    description: "The latest language model shows unprecedented understanding of context and reasoning.",
    category: "AI",
    url: "https://example.com/news1",
    publishedAt: new Date().toISOString(),
  },
  {
    id: "news2",
    title: "New quantum computing breakthrough achieved",
    source: "Nature",
    description: "Scientists have achieved quantum supremacy with a new approach to qubit stability.",
    category: "Quantum Computing",
    url: "https://example.com/news2",
    publishedAt: new Date().toISOString(),
  },
];

// More detailed interests with icons and descriptions
const interests = [
  { id: "tech", title: "Technology", description: "Latest in tech and innovation", category: "interests", icon: <Code className="h-5 w-5" /> },
  { id: "ai", title: "Artificial Intelligence", description: "AI and machine learning", category: "interests", icon: <Sparkles className="h-5 w-5" /> },
  { id: "web", title: "Web Development", description: "Web technologies and frameworks", category: "interests", icon: <Globe className="h-5 w-5" /> },
  { id: "mobile", title: "Mobile Development", description: "iOS and Android development", category: "interests", icon: <Code className="h-5 w-5" /> },
  { id: "data", title: "Data Science", description: "Data analysis and visualization", category: "interests", icon: <Sparkles className="h-5 w-5" /> },
  { id: "security", title: "Cybersecurity", description: "Security and privacy", category: "interests", icon: <Code className="h-5 w-5" /> },
  { id: "blockchain", title: "Blockchain", description: "Cryptocurrency and blockchain technology", category: "interests", icon: <Code className="h-5 w-5" /> },
  { id: "cloud", title: "Cloud Computing", description: "Cloud platforms and services", category: "interests", icon: <Globe className="h-5 w-5" /> },
  { id: "devops", title: "DevOps", description: "Development operations and CI/CD", category: "interests", icon: <Code className="h-5 w-5" /> },
  { id: "uiux", title: "UI/UX Design", description: "User interface and experience design", category: "interests", icon: <Sparkles className="h-5 w-5" /> },
];

// More detailed sources with icons
const sources = [
  { id: "github", title: "GitHub", description: "Code repositories and projects", category: "sources", icon: <Github className="h-5 w-5" /> },
  { id: "reddit", title: "Reddit", description: "Tech communities and discussions", category: "sources", icon: <Globe className="h-5 w-5" /> },
  { id: "twitter", title: "Twitter", description: "Tech news and updates", category: "sources", icon: <Globe className="h-5 w-5" /> },
  { id: "medium", title: "Medium", description: "Tech articles and tutorials", category: "sources", icon: <BookOpen className="h-5 w-5" /> },
  { id: "devto", title: "Dev.to", description: "Developer stories and experiences", category: "sources", icon: <Code className="h-5 w-5" /> },
  { id: "stackoverflow", title: "Stack Overflow", description: "Programming Q&A and knowledge", category: "sources", icon: <Code className="h-5 w-5" /> },
  { id: "hackernews", title: "Hacker News", description: "Tech news and discussions", category: "sources", icon: <Newspaper className="h-5 w-5" /> },
  { id: "producthunt", title: "Product Hunt", description: "New tech products and startups", category: "sources", icon: <Sparkles className="h-5 w-5" /> },
];

// More detailed content types with icons
const contentTypes = [
  { id: "articles", title: "Articles", description: "In-depth written content", category: "contentTypes", icon: <BookOpen className="h-5 w-5" /> },
  { id: "videos", title: "Videos", description: "Video tutorials and lectures", category: "contentTypes", icon: <Video className="h-5 w-5" /> },
  { id: "tutorials", title: "Tutorials", description: "Step-by-step guides", category: "contentTypes", icon: <Code className="h-5 w-5" /> },
  { id: "podcasts", title: "Podcasts", description: "Audio content and discussions", category: "contentTypes", icon: <Headphones className="h-5 w-5" /> },
  { id: "news", title: "News", description: "Latest tech news and updates", category: "contentTypes", icon: <Newspaper className="h-5 w-5" /> },
  { id: "repositories", title: "Repositories", description: "Code repositories and projects", category: "contentTypes", icon: <Github className="h-5 w-5" /> },
];

export default function OnboardingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [step, setStep] = useState<"welcome" | "news" | "github" | "interests" | "sources" | "contentTypes" | "complete">("welcome");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([]);
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [likedNews, setLikedNews] = useState<string[]>([]);
  const [githubUsername, setGithubUsername] = useState("");
  const [githubData, setGithubData] = useState<any>(null);
  const [githubLoading, setGithubLoading] = useState(false);
  const [githubError, setGithubError] = useState("");
  const [githubLanguages, setGithubLanguages] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  // Update progress based on current step
  useEffect(() => {
    const steps = ["welcome", "news", "github", "interests", "sources", "contentTypes", "complete"];
    const currentIndex = steps.indexOf(step);
    setProgress((currentIndex / (steps.length - 1)) * 100);
  }, [step]);

  // Fetch news from API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const [gadgetsRes, hackernewsRes] = await Promise.all([
          // Gracefully handle failures with .catch
          fetch("/api/gadgets").catch(() => ({ ok: false })) as Promise<Response | { ok: boolean }>,
          fetch("/api/hackernews").catch(() => ({ ok: false })) as Promise<Response | { ok: boolean }>,
        ]);

        let newsData: any[] = [];

        if (gadgetsRes.ok && "json" in gadgetsRes) {
          const gadgetsData = await gadgetsRes.json();
          newsData = [...newsData, ...gadgetsData.slice(0, 2)];
        }

        if (hackernewsRes.ok && "json" in hackernewsRes) {
          const hackernewsData = await hackernewsRes.json();
          if (hackernewsData.hackerNewsStories) {
            newsData = [...newsData, ...hackernewsData.hackerNewsStories.slice(0, 2)];
          }
        }

        // If API calls failed or returned nothing, use sample data
        if (newsData.length === 0) {
          newsData = sampleNews;
        }

        setNewsItems(newsData);
      } catch (error) {
        console.error("Error fetching news:", error);
        setNewsItems(sampleNews);
      }
    };

    fetchNews();
  }, []);

  const handleNewsLike = (newsId: string) => {
    setLikedNews((prev) => [...prev, newsId]);
    if (currentNewsIndex < newsItems.length - 1) {
      setCurrentNewsIndex((prev) => prev + 1);
    } else {
      setStep("github");
    }
  };

  const handleNewsSkip = () => {
    if (currentNewsIndex < newsItems.length - 1) {
      setCurrentNewsIndex((prev) => prev + 1);
    } else {
      setStep("github");
    }
  };

  const handleGithubSubmit = async () => {
    if (!githubUsername) {
      setGithubError("Please enter a GitHub username");
      return;
    }

    setGithubLoading(true);
    setGithubError("");

    try {
      const response = await fetch(`/api/github/user?username=${githubUsername}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch GitHub data");
      }

      const data = await response.json();
      setGithubData(data);
      setGithubLanguages(data.languagePreferences || []);
    } catch (error: any) {
      console.error("Error fetching GitHub data:", error);
      setGithubError(error.message || "Failed to fetch GitHub data");
    } finally {
      setGithubLoading(false);
    }
  };

  const handleComplete = async (selectedItems: string[]) => {
    switch (step) {
      case "interests":
        setSelectedInterests(selectedItems);
        setStep("sources");
        break;
      case "sources":
        setSelectedSources(selectedItems);
        setStep("contentTypes");
        break;
      case "contentTypes":
        setSelectedContentTypes(selectedItems);
        await savePreferences();
        break;
    }
  };

  const savePreferences = async () => {
    try {
      const response = await fetch("/api/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          interests: selectedInterests,
          sources: selectedSources,
          contentTypes: selectedContentTypes,
          githubLanguages: githubLanguages,
        }),
      });

      if (response.ok) {
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };

  const getCurrentItems = () => {
    switch (step) {
      case "interests":
        return interests;
      case "sources":
        return sources;
      case "contentTypes":
        return contentTypes;
      default:
        return [];
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case "welcome":
        return "Welcome to WiseF";
      case "news":
        return "What news interests you?";
      case "github":
        return "Connect your GitHub";
      case "interests":
        return "What topics interest you?";
      case "sources":
        return "Which platforms do you prefer?";
      case "contentTypes":
        return "What type of content do you enjoy?";
      case "complete":
        return "All set!";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case "welcome":
        return "Let's personalize your experience to show you the most relevant content.";
      case "news":
        return "Like the news you're interested in to personalize your feed";
      case "github":
        return "Connect your GitHub to automatically discover your programming interests";
      case "interests":
        return "Select your interests to get a tailored experience";
      case "sources":
        return "Choose which platforms you'd like to see content from";
      case "contentTypes":
        return "Select the types of content you enjoy consuming";
      case "complete":
        return "Your preferences have been saved. Redirecting to dashboard...";
    }
  };

  // Welcome screen
  if (step === "welcome") {
    return (
      <div className="min-h-screen bg-neondark-bg text-foreground relative overflow-hidden">
        <BackgroundBeams />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.15),transparent_70%)] dark:opacity-100 opacity-30"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--neondark-bg),transparent_20%,transparent_80%,var(--neondark-bg))]"></div>

        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-transparent bg-clip-text">
                Welcome to WiseF
              </h1>
              <p className="text-neondark-muted text-xl mb-8">
                Your personalized tech news and content aggregator
              </p>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex space-x-4">
                  <Badge className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 px-4 py-2">
                    <Newspaper className="h-4 w-4 mr-2" />
                    Tech News
                  </Badge>
                  <Badge className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 px-4 py-2">
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                  </Badge>
                  <Badge className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 px-4 py-2">
                    <Code className="h-4 w-4 mr-2" />
                    Dev Content
                  </Badge>
                </div>
                <Button
                  className="bg-cyan-500 text-black hover:bg-cyan-400 px-8 py-6 text-lg"
                  onClick={() => setStep("news")}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // GitHub connection screen
  if (step === "github") {
    return (
      <div className="min-h-screen bg-neondark-bg text-foreground relative overflow-hidden">
        <BackgroundBeams />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.15),transparent_70%)] dark:opacity-100 opacity-30"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--neondark-bg),transparent_20%,transparent_80%,var(--neondark-bg))]"></div>

        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-transparent bg-clip-text">
              {getStepTitle()}
            </h1>
            <p className="text-neondark-muted text-lg">
              {getStepDescription()}
            </p>
          </div>

          <div className="mb-8">
            <div className="flex justify-center space-x-2">
              <div className={`h-2 w-16 rounded ${step === "github" ? "bg-cyan-500" : "bg-neondark-muted"}`} />
            </div>
            <div className="mt-2">
              <Progress value={progress} className="h-1" />
            </div>
          </div>

          <div className="max-w-md mx-auto">
            <Card className="bg-neondark-card/80 backdrop-blur-sm border-neondark-border">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Github className="h-6 w-6 mr-2" />
                  Connect Your GitHub
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="github-username">GitHub Username</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="github-username"
                        placeholder="Enter your GitHub username"
                        value={githubUsername}
                        onChange={(e) => setGithubUsername(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleGithubSubmit}
                        disabled={githubLoading}
                        className="bg-cyan-500 text-black hover:bg-cyan-400"
                      >
                        {githubLoading ? "Loading..." : "Connect"}
                      </Button>
                    </div>
                    {githubError && (
                      <p className="text-red-500 text-sm">{githubError}</p>
                    )}
                  </div>

                  {githubData && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={githubData.user.avatar_url} alt={githubData.user.login} />
                          <AvatarFallback>{githubData.user.login.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{githubData.user.name || githubData.user.login}</h3>
                          <p className="text-sm text-neondark-muted">{githubData.user.bio || "No bio provided"}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Your Top Languages</h4>
                        <div className="flex flex-wrap gap-2">
                          {githubLanguages.map((lang, index) => (
                            <Badge key={index} className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="pt-4 flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setStep("news")}
                    >
                      Back
                    </Button>
                    <Button
                      className="bg-cyan-500 text-black hover:bg-cyan-400"
                      onClick={() => setStep("interests")}
                      disabled={!githubData && !githubUsername}
                    >
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Complete screen
  if (step === "complete") {
    return (
      <div className="min-h-screen bg-neondark-bg text-foreground relative overflow-hidden">
        <BackgroundBeams />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.15),transparent_70%)] dark:opacity-100 opacity-30"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--neondark-bg),transparent_20%,transparent_80%,var(--neondark-bg))]"></div>

        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="flex justify-center">
                <div className="h-24 w-24 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <Sparkles className="h-12 w-12 text-cyan-400" />
                </div>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 text-transparent bg-clip-text">
                All Set!
              </h1>
              <p className="text-neondark-muted text-xl">
                Your preferences have been saved. Redirecting to dashboard...
              </p>
              <div className="flex justify-center">
                <Progress value={100} className="h-1 w-64" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neondark-bg text-foreground relative overflow-hidden">
      {/* Background with cyan grid and gradients */}
      <BackgroundBeams />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.15),transparent_70%)] dark:opacity-100 opacity-30"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--neondark-bg),transparent_20%,transparent_80%,var(--neondark-bg))]"></div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-transparent bg-clip-text">
            {getStepTitle()}
          </h1>
          <p className="text-neondark-muted text-lg">
            {getStepDescription()}
          </p>
        </div>

        <div className="mb-8">
          <div className="flex justify-center space-x-2">
            <div className={`h-2 w-16 rounded ${step === "news" ? "bg-cyan-500" : "bg-neondark-muted"}`} />
            <div className={`h-2 w-16 rounded ${step === "news" ? "bg-neondark-muted" : "bg-cyan-500"}`} />
            <div className={`h-2 w-16 rounded ${step === "interests" ? "bg-cyan-500" : "bg-neondark-muted"}`} />
            <div className={`h-2 w-16 rounded ${step === "sources" ? "bg-cyan-500" : "bg-neondark-muted"}`} />
            <div className={`h-2 w-16 rounded ${step === "contentTypes" ? "bg-cyan-500" : "bg-neondark-muted"}`} />
          </div>
          <div className="mt-2">
            <Progress value={progress} className="h-1" />
          </div>
        </div>

        {step === "news" ? (
          <div className="max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              {newsItems.length > 0 && currentNewsIndex < newsItems.length && (
                <motion.div
                  key={newsItems[currentNewsIndex].id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-neondark-card/80 backdrop-blur-sm border-neondark-border">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <Badge className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30">
                          <Newspaper className="h-3 w-3 mr-1" />
                          {/* If `source` might be an object with { id, name }, render name */}
                          {typeof newsItems[currentNewsIndex].source === "object"
                            ? newsItems[currentNewsIndex].source.name
                            : newsItems[currentNewsIndex].source || "Tech News"}
                        </Badge>
                        <span className="text-xs text-neondark-muted">
                          {new Date(newsItems[currentNewsIndex].publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <CardTitle className="text-xl mt-2">
                        {/* Similarly, if title might be an object, render something like `.name` */}
                        {typeof newsItems[currentNewsIndex].title === "object"
                          ? newsItems[currentNewsIndex].title.name
                          : newsItems[currentNewsIndex].title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-neondark-muted mb-4">
                        {newsItems[currentNewsIndex].description}
                      </p>
                      <div className="flex justify-between items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-12 w-12 rounded-full border-red-500/50 text-red-500 hover:bg-red-500/10"
                          onClick={handleNewsSkip}
                        >
                          <ThumbsDown className="h-6 w-6" />
                        </Button>
                        <a
                          href={newsItems[currentNewsIndex].url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center"
                        >
                          Read more <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-12 w-12 rounded-full border-green-500/50 text-green-500 hover:bg-green-500/10"
                          onClick={() => handleNewsLike(newsItems[currentNewsIndex].id)}
                        >
                          <ThumbsUp className="h-6 w-6" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {currentNewsIndex >= newsItems.length && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <h3 className="text-2xl font-bold mb-4 text-neondark-text">Ready to continue!</h3>
                <p className="text-neondark-muted mb-6">
                  Let's connect your GitHub to discover your programming interests.
                </p>
                <Button
                  className="bg-cyan-500 text-black hover:bg-cyan-400"
                  onClick={() => setStep("github")}
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <Tabs defaultValue="grid" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="grid">Grid View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>
              <TabsContent value="grid">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getCurrentItems().map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      className="relative"
                    >
                      <Card
                        className={`h-full bg-neondark-card/80 backdrop-blur-sm border-neondark-border cursor-pointer transition-all ${
                          (step === "interests" && selectedInterests.includes(item.id)) ||
                          (step === "sources" && selectedSources.includes(item.id)) ||
                          (step === "contentTypes" && selectedContentTypes.includes(item.id))
                            ? "border-cyan-500/50 shadow-[0_0_15px_rgba(0,255,255,0.3)]"
                            : ""
                        }`}
                        onClick={() => {
                          if (step === "interests") {
                            setSelectedInterests((prev) =>
                              prev.includes(item.id)
                                ? prev.filter((id) => id !== item.id)
                                : [...prev, item.id]
                            );
                          } else if (step === "sources") {
                            setSelectedSources((prev) =>
                              prev.includes(item.id)
                                ? prev.filter((id) => id !== item.id)
                                : [...prev, item.id]
                            );
                          } else if (step === "contentTypes") {
                            setSelectedContentTypes((prev) =>
                              prev.includes(item.id)
                                ? prev.filter((id) => id !== item.id)
                                : [...prev, item.id]
                            );
                          }
                        }}
                      >
                        <CardHeader>
                          <div className="flex items-center">
                            <div className="mr-3 p-2 rounded-full bg-cyan-500/20 text-cyan-400">
                              {item.icon}
                            </div>
                            <div>
                              <Badge className="w-fit bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30">
                                {item.category}
                              </Badge>
                              <CardTitle className="text-xl mt-2">{item.title}</CardTitle>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-neondark-muted">{item.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="list">
                <div className="space-y-4">
                  {getCurrentItems().map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <Card
                        className={`bg-neondark-card/80 backdrop-blur-sm border-neondark-border cursor-pointer transition-all ${
                          (step === "interests" && selectedInterests.includes(item.id)) ||
                          (step === "sources" && selectedSources.includes(item.id)) ||
                          (step === "contentTypes" && selectedContentTypes.includes(item.id))
                            ? "border-cyan-500/50 shadow-[0_0_15px_rgba(0,255,255,0.3)]"
                            : ""
                        }`}
                        onClick={() => {
                          if (step === "interests") {
                            setSelectedInterests((prev) =>
                              prev.includes(item.id)
                                ? prev.filter((id) => id !== item.id)
                                : [...prev, item.id]
                            );
                          } else if (step === "sources") {
                            setSelectedSources((prev) =>
                              prev.includes(item.id)
                                ? prev.filter((id) => id !== item.id)
                                : [...prev, item.id]
                            );
                          } else if (step === "contentTypes") {
                            setSelectedContentTypes((prev) =>
                              prev.includes(item.id)
                                ? prev.filter((id) => id !== item.id)
                                : [...prev, item.id]
                            );
                          }
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center">
                            <div className="mr-3 p-2 rounded-full bg-cyan-500/20 text-cyan-400">
                              {item.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <Badge className="w-fit bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30">
                                    {item.category}
                                  </Badge>
                                  <h3 className="text-lg font-semibold mt-1">{item.title}</h3>
                                </div>
                                <div className={`h-6 w-6 rounded-full ${
                                  (step === "interests" && selectedInterests.includes(item.id)) ||
                                  (step === "sources" && selectedSources.includes(item.id)) ||
                                  (step === "contentTypes" && selectedContentTypes.includes(item.id))
                                    ? "bg-cyan-500"
                                    : "bg-neondark-muted"
                                }`} />
                              </div>
                              <p className="text-neondark-muted mt-1">{item.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-8 flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  if (step === "interests") {
                    setStep("github");
                  } else if (step === "sources") {
                    setStep("interests");
                  } else if (step === "contentTypes") {
                    setStep("sources");
                  }
                }}
              >
                Back
              </Button>
              <Button
                className="bg-cyan-500 text-black hover:bg-cyan-400"
                onClick={() => {
                  if (step === "interests") {
                    setStep("sources");
                  } else if (step === "sources") {
                    setStep("contentTypes");
                  } else if (step === "contentTypes") {
                    savePreferences();
                  }
                }}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
