"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  Edit2,
  Star,
  GitFork,
  MessageSquare,
  Eye,
  BookOpen,
  BarChart3,
} from "lucide-react";

interface ProfilePageProps {
  user: any;
  githubRepos: any[];
  stackOverflowQuestions: any[];
  userActivity: any[];
}

export default function ClientProfilePage({
  user,
  githubRepos,
  stackOverflowQuestions,
  userActivity,
}: ProfilePageProps) {
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1">
          <Card className="border-neondark-border bg-neondark-card shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 border-4 border-cyan-400">
                  <AvatarImage src={user?.image || "/placeholder.svg"} alt={user?.name || "User"} />
                  <AvatarFallback className="text-2xl bg-cyan-950 text-cyan-400">
                    {user?.name ? user.name.charAt(0) : "U"}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="mt-4 text-2xl font-bold text-neondark-text">
                  {user?.name || "Anonymous"}
                </CardTitle>
                <CardDescription className="text-neondark-muted">
                  Full Stack Developer
                </CardDescription>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full border-cyan-400 text-cyan-400 hover:bg-cyan-950"
                  >
                    <Github className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full border-cyan-400 text-cyan-400 hover:bg-cyan-950"
                  >
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full border-cyan-400 text-cyan-400 hover:bg-cyan-950"
                  >
                    <Linkedin className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full border-cyan-400 text-cyan-400 hover:bg-cyan-950"
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="flex flex-col items-center p-3 bg-neondark-bg rounded-lg">
                  <span className="text-2xl font-bold text-cyan-400">
                    {githubRepos?.length || 0}
                  </span>
                  <span className="text-xs text-neondark-muted">Repositories</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-neondark-bg rounded-lg">
                  <span className="text-2xl font-bold text-cyan-400">
                    {userActivity?.length || 0}
                  </span>
                  <span className="text-xs text-neondark-muted">Activities</span>
                </div>
              </div>
              <Separator className="my-4 bg-neondark-border" />
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-neondark-text mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {user?.preferences?.interests?.map((interest: string) => (
                      <Badge key={interest} variant="outline" className="border-cyan-400 text-cyan-400">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neondark-text mb-2">Preferred Sources</h3>
                  <div className="flex flex-wrap gap-2">
                    {user?.preferences?.sources?.map((source: string) => (
                      <Badge key={source} variant="outline" className="border-cyan-400 text-cyan-400">
                        {source}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-cyan-400 text-black hover:bg-cyan-500">
                <Edit2 className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            </CardFooter>
          </Card>
        </div>
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-neondark-bg">
              <TabsTrigger value="activity" className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black">
                Activity
              </TabsTrigger>
              <TabsTrigger value="repositories" className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black">
                Repositories
              </TabsTrigger>
              <TabsTrigger value="stackoverflow" className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black">
                Stack Overflow
              </TabsTrigger>
            </TabsList>
            {/* Activity Tab */}
            <TabsContent value="activity">
              <Card className="border-neondark-border bg-neondark-card shadow-lg">
                <CardHeader>
                  <CardTitle className="text-neondark-text">Recent Activity</CardTitle>
                  <CardDescription>Your latest interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-6">
                      {userActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-4">
                          <div className="mt-1 bg-cyan-950 p-2 rounded-full">
                            {activity.content?.type === "GitHubRepo" && <Github className="h-5 w-5 text-cyan-400" />}
                            {activity.content?.type === "StackOverflowQuestion" && <MessageSquare className="h-5 w-5 text-cyan-400" />}
                            {activity.content?.type === "RedditPost" && <BookOpen className="h-5 w-5 text-cyan-400" />}
                            {activity.content?.type === "HackerNewsItem" && <BarChart3 className="h-5 w-5 text-cyan-400" />}
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-neondark-text">
                              {activity.action} <span className="text-cyan-400">{activity.content?.title}</span>
                            </p>
                            <p className="text-xs text-neondark-muted">
                              {new Date(activity.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            {/* Repositories Tab */}
            <TabsContent value="repositories">
              <Card className="border-neondark-border bg-neondark-card shadow-lg">
                <CardHeader>
                  <CardTitle className="text-neondark-text">GitHub Repositories</CardTitle>
                  <CardDescription>Your public repositories on GitHub</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {githubRepos.map((repo) => (
                      <Card key={repo.id} className="bg-neondark-bg border-neondark-border">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg text-cyan-400">{repo.name}</CardTitle>
                              <CardDescription className="text-neondark-muted">{repo.fullName}</CardDescription>
                            </div>
                            <Badge variant="outline" className="border-cyan-400 text-cyan-400">
                              {repo.language || "N/A"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardFooter className="pt-2">
                          <div className="flex space-x-4 text-xs text-neondark-muted">
                            <div className="flex items-center">
                              <Star className="mr-1 h-3.5 w-3.5 text-cyan-400" />
                              <span>{repo.stars}</span>
                            </div>
                            <div className="flex items-center">
                              <GitFork className="mr-1 h-3.5 w-3.5 text-cyan-400" />
                              <span>{repo.forks}</span>
                            </div>
                            <div className="flex items-center">
                              <Eye className="mr-1 h-3.5 w-3.5 text-cyan-400" />
                              <span>{repo.watchers}</span>
                            </div>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            {/* Stack Overflow Tab */}
            <TabsContent value="stackoverflow">
              <Card className="border-neondark-border bg-neondark-card shadow-lg">
                <CardHeader>
                  <CardTitle className="text-neondark-text">Stack Overflow Activity</CardTitle>
                  <CardDescription>Your recent questions and answers on Stack Overflow</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stackOverflowQuestions.map((question) => (
                      <Card key={question.id} className="bg-neondark-bg border-neondark-border">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg text-cyan-400">{question.title}</CardTitle>
                            <Badge
                              variant={question.isAnswered ? "default" : "outline"}
                              className={question.isAnswered ? "bg-cyan-400 text-black" : "border-cyan-400 text-cyan-400"}
                            >
                              {question.isAnswered ? "Answered" : "Unanswered"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex flex-wrap gap-2">
                            {question.tags.map((tag: string) => (
                              <Badge key={tag} variant="secondary" className="bg-cyan-950 text-cyan-400">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <div className="flex space-x-4 text-xs text-neondark-muted">
                            <div className="flex items-center">
                              <Eye className="mr-1 h-3.5 w-3.5 text-cyan-400" />
                              <span>{question.viewCount} views</span>
                            </div>
                            <div className="flex items-center">
                              <MessageSquare className="mr-1 h-3.5 w-3.5 text-cyan-400" />
                              <span>{question.answerCount} answers</span>
                            </div>
                            <div className="flex items-center">
                              <Star className="mr-1 h-3.5 w-3.5 text-cyan-400" />
                              <span>{question.score} votes</span>
                            </div>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
