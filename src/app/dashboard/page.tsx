// "use client";

// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Skeleton } from "@/components/ui/skeleton";
// import { 
//   Newspaper, 
//   Github, 
//   Code, 
//   BookOpen, 
//   Video, 
//   Headphones, 
//   Globe, 
//   Sparkles, 
//   ExternalLink,
//   ThumbsUp,
//   MessageSquare,
//   Star,
//   GitFork,
//   Eye,
//   Activity,
//   TrendingUp,
//   BarChart
// } from "lucide-react";
// import { BackgroundBeams } from "@/components/ui/beams";
// import { 
//   AreaChart, 
//   Area, 
//   XAxis, 
//   YAxis, 
//   CartesianGrid, 
//   Tooltip, 
//   ResponsiveContainer, 
//   PieChart, 
//   Pie, 
//   Cell, 
//   BarChart as RechartsBarChart, 
//   Bar, 
//   Legend 
// } from 'recharts';

// // Define types for our data
// interface UserPreferences {
//   id: string;
//   userId: string;
//   interests: string[];
//   sources: string[];
//   contentTypes: string[];
// }

// interface NewsItem {
//   id: string;
//   title: string;
//   url: string;
//   source: string;
//   description: string;
//   category: string;
//   publishedAt: string;
// }

// interface GitHubRepo {
//   id: number;
//   name: string;
//   fullName: string;
//   url: string;
//   stars: number;
//   forks: number;
//   watchers: number;
//   language: string;
//   pushedAt: string;
// }

// interface GitHubIssue {
//   id: string;
//   repoName: string;
//   issueUrl: string;
//   title: string;
//   author: string;
//   comments: number;
//   createdAt: string;
// }

// interface StackOverflowQuestion {
//   id: number;
//   title: string;
//   link: string;
//   viewCount: number;
//   answerCount: number;
//   score: number;
//   tags: string[];
//   isAnswered: boolean;
//   creationDate: string;
// }

// interface HackerNewsItem {
//   id: number;
//   title: string;
//   url: string;
//   author: string;
//   score: number;
//   comments: number;
//   createdAt: string;
// }

// interface TechNewsItem {
//   id: string;
//   title: string;
//   url: string;
//   source: string;
//   summary: string;
//   createdAt: string;
// }

// interface ProductHuntPost {
//   id: number;
//   name: string;
//   tagline: string;
//   url: string;
//   votesCount: number;
//   commentsCount: number;
//   createdAt: string;
//   thumbnailUrl: string;
//   description: string;
// }

// // Sample data for charts
// const sampleLanguageData = [
//   { name: 'JavaScript', value: 400 },
//   { name: 'TypeScript', value: 300 },
//   { name: 'Python', value: 200 },
//   { name: 'Java', value: 150 },
//   { name: 'Go', value: 100 },
// ];

// const sampleActivityData = [
//   { date: '2023-01', value: 400 },
//   { date: '2023-02', value: 300 },
//   { date: '2023-03', value: 600 },
//   { date: '2023-04', value: 800 },
//   { date: '2023-05', value: 500 },
//   { date: '2023-06', value: 700 },
// ];

// const sampleEngagementData = [
//   { name: 'Stars', value: 400 },
//   { name: 'Forks', value: 300 },
//   { name: 'Comments', value: 200 },
//   { name: 'Views', value: 500 },
// ];

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// export default function DashboardPage() {
//   const { data: session } = useSession();
//   const router = useRouter();
  
//   const [preferences, setPreferences] = useState<UserPreferences | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("news");
  
//   // Data states
//   const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
//   const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([]);
//   const [githubIssues, setGithubIssues] = useState<GitHubIssue[]>([]);
//   const [stackOverflowQuestions, setStackOverflowQuestions] = useState<StackOverflowQuestion[]>([]);
//   const [hackerNewsItems, setHackerNewsItems] = useState<HackerNewsItem[]>([]);
//   const [techNewsItems, setTechNewsItems] = useState<TechNewsItem[]>([]);
//   const [productHuntPosts, setProductHuntPosts] = useState<ProductHuntPost[]>([]);
  
//   // Fetch user preferences
//   useEffect(() => {
//     const fetchPreferences = async () => {
//       try {
//         const response = await fetch("/api/preferences");
//         if (!response.ok) {
//           if (response.status === 404) {
//             // Redirect to onboarding if preferences don't exist
//             router.push("/onboarding");
//             return;
//           }
//           throw new Error("Failed to fetch preferences");
//         }
        
//         const data = await response.json();
//         setPreferences(data);
//       } catch (error) {
//         console.error("Error fetching preferences:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchPreferences();
//   }, [router]);
  
//   // Fetch data based on user preferences
//   useEffect(() => {
//     if (!preferences) return;
    
//     const fetchData = async () => {
//       setLoading(true);
      
//       try {
//         // Fetch news if user has selected news content type
//         if (preferences.contentTypes.includes("news")) {
//           const [gadgetsRes, hackernewsRes] = await Promise.all([
//             fetch("/api/gadgets").catch(() => ({ ok: false })),
//             fetch("/api/hackernews").catch(() => ({ ok: false })),
//           ]);
          
//           let newsData: NewsItem[] = [];
          
//           if (gadgetsRes.ok) {
//             const gadgetsData = await gadgetsRes.json();
//             newsData = [...newsData, ...gadgetsData];
//           }
          
//           if (hackernewsRes.ok) {
//             const hackernewsData = await hackernewsRes.json();
//             if (hackernewsData.hackerNewsStories) {
//               newsData = [...newsData, ...hackernewsData.hackerNewsStories];
//             }
//           }
          
//           // Filter news by user interests
//           const filteredNews = newsData.filter(item => 
//             preferences.interests.some(interest => 
//               item.category?.toLowerCase().includes(interest.toLowerCase()) ||
//               item.title.toLowerCase().includes(interest.toLowerCase())
//             )
//           );
          
//           setNewsItems(filteredNews);
//         }
        
//         // Fetch GitHub data if user has selected GitHub as a source
//         if (preferences.sources.includes("github")) {
//           const githubRes = await fetch("/api/github").catch(() => ({ ok: false }));
          
//           if (githubRes.ok) {
//             const githubData = await githubRes.json();
            
//             // Filter repos by user interests
//             const filteredRepos = githubData.repos.filter((repo: GitHubRepo) => 
//               preferences.interests.some(interest => 
//                 repo.language?.toLowerCase().includes(interest.toLowerCase()) ||
//                 repo.name.toLowerCase().includes(interest.toLowerCase())
//               )
//             );
            
//             setGithubRepos(filteredRepos);
//             setGithubIssues(githubData.issues || []);
//           }
//         }
        
//         // Fetch Stack Overflow questions if user has selected Stack Overflow as a source
//         if (preferences.sources.includes("stackoverflow")) {
//           const stackoverflowRes = await fetch("/api/stackoverflow").catch(() => ({ ok: false }));
          
//           if (stackoverflowRes.ok) {
//             const stackoverflowData = await stackoverflowRes.json();
            
//             // Filter questions by user interests
//             const filteredQuestions = stackoverflowData.questions.filter((question: StackOverflowQuestion) => 
//               preferences.interests.some(interest => 
//                 question.tags.some(tag => tag.toLowerCase().includes(interest.toLowerCase())) ||
//                 question.title.toLowerCase().includes(interest.toLowerCase())
//               )
//             );
            
//             setStackOverflowQuestions(filteredQuestions);
//           }
//         }
        
//         // Fetch Hacker News items if user has selected Hacker News as a source
//         if (preferences.sources.includes("hackernews")) {
//           const hackernewsRes = await fetch("/api/hackernews").catch(() => ({ ok: false }));
          
//           if (hackernewsRes.ok) {
//             const hackernewsData = await hackernewsRes.json();
            
//             // Filter items by user interests
//             const filteredItems = hackernewsData.hackerNewsStories.filter((item: HackerNewsItem) => 
//               preferences.interests.some(interest => 
//                 item.title.toLowerCase().includes(interest.toLowerCase())
//               )
//             );
            
//             setHackerNewsItems(filteredItems);
//           }
//         }
        
//         // Fetch Product Hunt posts if user has selected Product Hunt as a source
//         if (preferences.sources.includes("producthunt")) {
//           const producthuntRes = await fetch("/api/producthunt").catch(() => ({ ok: false }));
          
//           if (producthuntRes.ok) {
//             const producthuntData = await producthuntRes.json();
            
//             // Filter posts by user interests
//             const filteredPosts = producthuntData.posts.filter((post: ProductHuntPost) => 
//               preferences.interests.some(interest => 
//                 post.name.toLowerCase().includes(interest.toLowerCase()) ||
//                 post.tagline.toLowerCase().includes(interest.toLowerCase()) ||
//                 post.description?.toLowerCase().includes(interest.toLowerCase())
//               )
//             );
            
//             setProductHuntPosts(filteredPosts);
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchData();
//   }, [preferences]);
  
//   // Get icon for content type
//   const getContentTypeIcon = (type: string) => {
//     switch (type) {
//       case "articles":
//         return <BookOpen className="h-4 w-4" />;
//       case "videos":
//         return <Video className="h-4 w-4" />;
//       case "tutorials":
//         return <Code className="h-4 w-4" />;
//       case "podcasts":
//         return <Headphones className="h-4 w-4" />;
//       case "news":
//         return <Newspaper className="h-4 w-4" />;
//       case "repositories":
//         return <Github className="h-4 w-4" />;
//       default:
//         return <Globe className="h-4 w-4" />;
//     }
//   };
  
//   // Get icon for source
//   const getSourceIcon = (source: string) => {
//     switch (source) {
//       case "github":
//         return <Github className="h-4 w-4" />;
//       case "reddit":
//         return <Globe className="h-4 w-4" />;
//       case "twitter":
//         return <Globe className="h-4 w-4" />;
//       case "medium":
//         return <BookOpen className="h-4 w-4" />;
//       case "devto":
//         return <Code className="h-4 w-4" />;
//       case "stackoverflow":
//         return <Code className="h-4 w-4" />;
//       case "hackernews":
//         return <Newspaper className="h-4 w-4" />;
//       case "producthunt":
//         return <Sparkles className="h-4 w-4" />;
//       default:
//         return <Globe className="h-4 w-4" />;
//     }
//   };
  
//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-neondark-bg text-foreground relative overflow-hidden">
//         <BackgroundBeams />
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.15),transparent_70%)] dark:opacity-100 opacity-30"></div>
//         <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--neondark-bg),transparent_20%,transparent_80%,var(--neondark-bg))]"></div>
        
//         <div className="relative z-10 container mx-auto px-4 py-16">
//           <div className="max-w-6xl mx-auto">
//             <div className="flex justify-between items-center mb-8">
//               <Skeleton className="h-10 w-48" />
//               <Skeleton className="h-10 w-32" />
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {[1, 2, 3, 4, 5, 6].map((i) => (
//                 <Skeleton key={i} className="h-64 w-full" />
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
  
//   // No preferences state
//   if (!preferences) {
//     return (
//       <div className="min-h-screen bg-neondark-bg text-foreground relative overflow-hidden">
//         <BackgroundBeams />
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.15),transparent_70%)] dark:opacity-100 opacity-30"></div>
//         <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--neondark-bg),transparent_20%,transparent_80%,var(--neondark-bg))]"></div>
        
//         <div className="relative z-10 container mx-auto px-4 py-16">
//           <div className="max-w-2xl mx-auto text-center">
//             <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-transparent bg-clip-text">
//               Welcome to Your Dashboard
//             </h1>
//             <p className="text-neondark-muted text-xl mb-8">
//               We couldn't find your preferences. Let's set them up to personalize your experience.
//             </p>
//             <button
//               className="bg-cyan-500 text-black hover:bg-cyan-400 px-8 py-6 text-lg rounded-md"
//               onClick={() => router.push("/onboarding")}
//             >
//               Go to Onboarding
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }
  
//   return (
//     <div className="min-h-screen bg-neondark-bg text-foreground relative overflow-hidden">
//       <BackgroundBeams />
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.15),transparent_70%)] dark:opacity-100 opacity-30"></div>
//       <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--neondark-bg),transparent_20%,transparent_80%,var(--neondark-bg))]"></div>
      
//       <div className="relative z-10 container mx-auto px-4 py-16">
//         <div className="max-w-6xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
//           >
//             <div>
//               <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 text-transparent bg-clip-text">
//                 Your Personalized Dashboard
//               </h1>
//               <p className="text-neondark-muted mt-2">
//                 Content tailored to your interests and preferences
//               </p>
//             </div>
            
//             <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
//               {preferences?.interests.map((interest) => (
//                 <Badge key={interest} className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30">
//                   {interest}
//                 </Badge>
//               ))}
//             </div>
//           </motion.div>

//           {/* Analytics Overview */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
//           >
//             {/* Language Distribution Chart */}
//             <Card className="bg-neondark-card/80 backdrop-blur-sm border-neondark-border">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <PieChart className="h-5 w-5" />
//                   Language Distribution
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="h-[300px]">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie
//                         data={sampleLanguageData}
//                         cx="50%"
//                         cy="50%"
//                         labelLine={false}
//                         outerRadius={80}
//                         fill="#8884d8"
//                         dataKey="value"
//                       >
//                         {sampleLanguageData.map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                         ))}
//                       </Pie>
//                       <Tooltip />
//                       <Legend />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Activity Chart */}
//             <Card className="bg-neondark-card/80 backdrop-blur-sm border-neondark-border">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Activity className="h-5 w-5" />
//                   Activity Over Time
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="h-[300px]">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <AreaChart data={sampleActivityData}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="date" />
//                       <YAxis />
//                       <Tooltip />
//                       <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
//                     </AreaChart>
//                   </ResponsiveContainer>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Engagement Metrics */}
//             <Card className="bg-neondark-card/80 backdrop-blur-sm border-neondark-border">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <BarChart className="h-5 w-5" />
//                   Engagement Metrics
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="h-[300px]">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <RechartsBarChart data={sampleEngagementData}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="name" />
//                       <YAxis />
//                       <Tooltip />
//                       <Bar dataKey="value" fill="#8884d8" />
//                     </RechartsBarChart>
//                   </ResponsiveContainer>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>

//           {/* Content Metrics */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.4 }}
//             className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
//           >
//             <Card className="bg-neondark-card/80 backdrop-blur-sm border-neondark-border">
//               <CardHeader>
//                 <CardTitle className="text-sm font-medium">Total Items</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{newsItems.length + githubRepos.length + stackOverflowQuestions.length + hackerNewsItems.length + productHuntPosts.length}</div>
//               </CardContent>
//             </Card>
//             <Card className="bg-neondark-card/80 backdrop-blur-sm border-neondark-border">
//               <CardHeader>
//                 <CardTitle className="text-sm font-medium">Avg. Engagement</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">245</div>
//               </CardContent>
//             </Card>
//             <Card className="bg-neondark-card/80 backdrop-blur-sm border-neondark-border">
//               <CardHeader>
//                 <CardTitle className="text-sm font-medium">Top Category</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">JavaScript</div>
//               </CardContent>
//             </Card>
//             <Card className="bg-neondark-card/80 backdrop-blur-sm border-neondark-border">
//               <CardHeader>
//                 <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold text-green-500">+12%</div>
//               </CardContent>
//             </Card>
//           </motion.div>

//           <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//             <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-6">
//               <TabsTrigger value="news" className="flex items-center">
//                 <Newspaper className="h-4 w-4 mr-2" />
//                 News
//               </TabsTrigger>
//               <TabsTrigger value="github" className="flex items-center">
//                 <Github className="h-4 w-4 mr-2" />
//                 GitHub
//               </TabsTrigger>
//               <TabsTrigger value="stackoverflow" className="flex items-center">
//                 <Code className="h-4 w-4 mr-2" />
//                 Stack Overflow
//               </TabsTrigger>
//               <TabsTrigger value="hackernews" className="flex items-center">
//                 <Newspaper className="h-4 w-4 mr-2" />
//                 Hacker News
//               </TabsTrigger>
//               <TabsTrigger value="producthunt" className="flex items-center">
//                 <Sparkles className="h-4 w-4 mr-2" />
//                 Product Hunt
//               </TabsTrigger>
//               <TabsTrigger value="all" className="flex items-center">
//                 <Globe className="h-4 w-4 mr-2" />
//                 All
//               </TabsTrigger>
//             </TabsList>
            
//             {/* News Tab */}
//             <TabsContent value="news" className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {newsItems.length > 0 ? (
//                   newsItems.map((item) => (
//                     <motion.div
//                       key={item.id}
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       whileHover={{ scale: 1.02 }}
//                     >
//                       <Card className="h-full bg-neondark-card/80 backdrop-blur-sm border-neondark-border">
//                         <CardHeader>
//                           <div className="flex justify-between items-start">
//                             <Badge className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30">
//                               <Newspaper className="h-3 w-3 mr-1" />
//                               {item.source}
//                             </Badge>
//                             <span className="text-xs text-neondark-muted">
//                               {new Date(item.publishedAt).toLocaleDateString()}
//                             </span>
//                           </div>
//                           <CardTitle className="text-xl mt-2">{item.title}</CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                           <p className="text-neondark-muted mb-4">
//                             {item.description}
//                           </p>
//                           <div className="flex justify-between items-center">
//                             <Badge className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30">
//                               {item.category}
//                             </Badge>
//                             <a
//                               href={item.url}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center"
//                             >
//                               Read more <ExternalLink className="ml-1 h-3 w-3" />
//                             </a>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     </motion.div>
//                   ))
//                 ) : (
//                   <div className="col-span-full text-center py-12">
//                     <p className="text-neondark-muted">No news items found based on your preferences.</p>
//                   </div>
//                 )}
//               </div>
//             </TabsContent>
            
//             {/* GitHub Tab */}
//             <TabsContent value="github" className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {githubRepos.length > 0 ? (
//                   githubRepos.map((repo) => (
//                     <motion.div
//                       key={repo.id}
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       whileHover={{ scale: 1.02 }}
//                     >
//                       <Card className="h-full bg-neondark-card/80 backdrop-blur-sm border-neondark-border">
//                         <CardHeader>
//                           <div className="flex justify-between items-start">
//                             <Badge className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30">
//                               <Github className="h-3 w-3 mr-1" />
//                               {repo.language || "Unknown"}
//                             </Badge>
//                             <span className="text-xs text-neondark-muted">
//                               {new Date(repo.pushedAt).toLocaleDateString()}
//                             </span>
//                           </div>
//                           <CardTitle className="text-xl mt-2">{repo.name}</CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                           <div className="flex justify-between items-center mb-4">
//                             <div className="flex space-x-4">
//                               <div className="flex items-center">
//                                 <Star className="h-4 w-4 mr-1 text-yellow-500" />
//                                 <span className="text-sm">{repo.stars}</span>
//                               </div>
//                               <div className="flex items-center">
//                                 <GitFork className="h-4 w-4 mr-1 text-blue-500" />
//                                 <span className="text-sm">{repo.forks}</span>
//                               </div>
//                               <div className="flex items-center">
//                                 <Eye className="h-4 w-4 mr-1 text-purple-500" />
//                                 <span className="text-sm">{repo.watchers}</span>
//                               </div>
//                             </div>
//                           </div>
//                           <div className="flex justify-between items-center">
//                             <Badge className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30">
//                               {repo.language || "Unknown"}
//                             </Badge>
//                             <a
//                               href={repo.url}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center"
//                             >
//                               View repo <ExternalLink className="ml-1 h-3 w-3" />
//                             </a>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     </motion.div>
//                   ))
//                 ) : (
//                   <div className="col-span-full text-center py-12">
//                     <p className="text-neondark-muted">No GitHub repositories found based on your preferences.</p>
//                   </div>
//                 )}
//               </div>
//             </TabsContent>
            
//             {/* Other tabs would go here */}
//           </Tabs>
//         </div>
//       </div>
//     </div>
//   );
// }
