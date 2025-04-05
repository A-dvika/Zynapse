"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown, ArrowRight, Newspaper, ExternalLink } from "lucide-react";
import { BackgroundBeams } from "@/components/ui/beams";

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

const interests = [
  { id: "tech", title: "Technology", description: "Latest in tech and innovation", category: "interests" },
  { id: "ai", title: "Artificial Intelligence", description: "AI and machine learning", category: "interests" },
  { id: "web", title: "Web Development", description: "Web technologies and frameworks", category: "interests" },
  { id: "mobile", title: "Mobile Development", description: "iOS and Android development", category: "interests" },
  { id: "data", title: "Data Science", description: "Data analysis and visualization", category: "interests" },
  { id: "security", title: "Cybersecurity", description: "Security and privacy", category: "interests" },
];

const sources = [
  { id: "github", title: "GitHub", description: "Code repositories and projects", category: "sources" },
  { id: "reddit", title: "Reddit", description: "Tech communities and discussions", category: "sources" },
  { id: "twitter", title: "Twitter", description: "Tech news and updates", category: "sources" },
  { id: "medium", title: "Medium", description: "Tech articles and tutorials", category: "sources" },
  { id: "devto", title: "Dev.to", description: "Developer stories and experiences", category: "sources" },
];

const contentTypes = [
  { id: "articles", title: "Articles", description: "In-depth written content", category: "contentTypes" },
  { id: "videos", title: "Videos", description: "Video tutorials and lectures", category: "contentTypes" },
  { id: "tutorials", title: "Tutorials", description: "Step-by-step guides", category: "contentTypes" },
  { id: "podcasts", title: "Podcasts", description: "Audio content and discussions", category: "contentTypes" },
];

export default function OnboardingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [step, setStep] = useState<"news" | "interests" | "sources" | "contentTypes">("news");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([]);
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [likedNews, setLikedNews] = useState<string[]>([]);

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
      setStep("interests");
    }
  };

  const handleNewsSkip = () => {
    if (currentNewsIndex < newsItems.length - 1) {
      setCurrentNewsIndex((prev) => prev + 1);
    } else {
      setStep("interests");
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
          likedNews: likedNews,
        }),
      });

      if (response.ok) {
        router.push("/dashboard");
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
      case "news":
        return "What news interests you?";
      case "interests":
        return "What topics interest you?";
      case "sources":
        return "Which platforms do you prefer?";
      case "contentTypes":
        return "What type of content do you enjoy?";
    }
  };

  return (
    <div className="min-h-screen bg-neondark-bg text-foreground relative overflow-hidden">
      {/* Background with cyan grid and gradients */}
      <BackgroundBeams />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.15),transparent_70%)] dark:opacity-100 opacity-30"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--neondark-bg),transparent_20%,transparent_80%,var(--neondark-bg))]"></div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-transparent bg-clip-text">
            Customize Your Experience
          </h1>
          <p className="text-neondark-muted text-lg">
            {step === "news"
              ? "Like the news you're interested in to personalize your feed"
              : "Select your preferences to get a tailored experience"}
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-center mb-2">{getStepTitle()}</h2>
          <div className="flex justify-center space-x-2">
            <div
              className={`h-2 w-16 rounded ${
                step === "news" ? "bg-cyan-500" : "bg-neondark-muted"
              }`}
            />
            <div
              className={`h-2 w-16 rounded ${
                step === "interests" ? "bg-cyan-500" : "bg-neondark-muted"
              }`}
            />
            <div
              className={`h-2 w-16 rounded ${
                step === "sources" ? "bg-cyan-500" : "bg-neondark-muted"
              }`}
            />
            <div
              className={`h-2 w-16 rounded ${
                step === "contentTypes" ? "bg-cyan-500" : "bg-neondark-muted"
              }`}
            />
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
                  Let's set up your preferences to get a personalized experience.
                </p>
                <Button
                  className="bg-cyan-500 text-black hover:bg-cyan-400"
                  onClick={() => setStep("interests")}
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
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
                      <Badge className="w-fit bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30">
                        {item.category}
                      </Badge>
                      <CardTitle className="text-xl mt-2">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-neondark-muted">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
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
