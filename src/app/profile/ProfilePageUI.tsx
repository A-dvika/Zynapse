"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Edit2, PlusCircle } from "lucide-react"

// Example shape. Adjust to your actual DB model.
interface PreferenceData {
  interests?: string[]
  sources?: string[]
  contentTypes?: string[]
}

interface HistoryItem {
  id: string
  action: string
  createdAt: Date
  content?: {
    title?: string
  }
}

interface UserData {
  id: string
  name: string
  email: string
  image?: string
  preferences?: PreferenceData
  history?: HistoryItem[]
}

export default function ProfilePageUI({ user }: { user: UserData }) {
  // For the edit preferences modal
  const [isOpen, setIsOpen] = useState(false)
  // Use explicit state for the Tabs so the saved tab works properly
  const [activeTab, setActiveTab] = useState("activity")

  if (!user) {
    return <div>No user data found.</div>
  }

  const { name, email, image, preferences, history } = user

  // Separate "save" actions from other user actions
  const savedItems = (history || []).filter(item => item.action === "save")
  const otherActivity = (history || []).filter(item => item.action !== "save")

  return (
    <div className="max-w-screen-lg mx-auto py-8 px-4">
      {/* Profile Header */}
      <div className="flex flex-col items-center justify-center">
        <Avatar className="h-28 w-28 border-4 border-cyan-400">
          <AvatarImage src={image || "/placeholder.svg"} alt={name} />
          <AvatarFallback className="text-2xl bg-cyan-950 text-cyan-400">
            {name?.[0] ?? "U"}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="mt-4 text-2xl font-bold text-neondark-text">
          {name}
        </CardTitle>
        <CardDescription className="text-neondark-muted">{email}</CardDescription>
      </div>

      {/* Main Content */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Preferences Side */}
        <Card className="border-neondark-border bg-neondark-card shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-neondark-text">Preferences</CardTitle>
            <CardDescription>Edit what you’re interested in</CardDescription>
          </CardHeader>
          <CardContent>
            <Separator className="bg-neondark-border mb-4" />

            {!preferences && (
              <div className="text-neondark-muted text-sm">
                No preferences set yet.
              </div>
            )}

            {/* Interests */}
            {preferences?.interests?.length ? (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-neondark-text mb-2">
                  Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {preferences.interests.map((interest) => (
                    <Badge
                      key={interest}
                      variant="outline"
                      className="border-cyan-400 text-cyan-400"
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Sources */}
            {preferences?.sources?.length ? (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-neondark-text mb-2">
                  Preferred Sources
                </h3>
                <div className="flex flex-wrap gap-2">
                  {preferences.sources.map((source) => (
                    <Badge
                      key={source}
                      variant="outline"
                      className="border-cyan-400 text-cyan-400"
                    >
                      {source}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Content Types */}
            {preferences?.contentTypes?.length ? (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-neondark-text mb-2">
                  Preferred Content Types
                </h3>
                <div className="flex flex-wrap gap-2">
                  {preferences.contentTypes.map((type) => (
                    <Badge
                      key={type}
                      variant="outline"
                      className="border-cyan-400 text-cyan-400"
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}

            <Button
              variant="outline"
              onClick={() => setIsOpen(true)}
              className="border-cyan-400 text-cyan-400 hover:bg-cyan-950 w-full"
            >
              <Edit2 className="mr-2 h-4 w-4" />
              Edit Preferences
            </Button>
          </CardContent>
        </Card>

        {/* Activity Tab */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-neondark-bg">
              <TabsTrigger
                value="activity"
                className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black"
              >
                Recent Activity
              </TabsTrigger>
              <TabsTrigger
                value="saved"
                className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black"
              >
                Saved Items
              </TabsTrigger>
            </TabsList>

            {/* 1) Activity Tab */}
            <TabsContent value="activity">
              <Card className="border-neondark-border bg-neondark-card shadow-lg">
                <CardHeader>
                  <CardTitle className="text-neondark-text">Recent Activity</CardTitle>
                  <CardDescription>Your latest actions on this platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[350px] pr-4">
                    {!otherActivity?.length ? (
                      <div className="text-sm text-neondark-muted">No recent actions.</div>
                    ) : (
                      <div className="space-y-6">
                        {otherActivity.map((item) => (
                          <div key={item.id} className="flex items-start space-x-4">
                            <div className="mt-1 bg-cyan-950 p-2 rounded-full">
                              <PlusCircle className="h-5 w-5 text-cyan-400" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-neondark-text">
                                {item.action}
                                {item.content?.title && (
                                  <>
                                    &nbsp;on&nbsp;
                                    <span className="text-cyan-400">{item.content.title}</span>
                                  </>
                                )}
                              </p>
                              <p className="text-xs text-neondark-muted">
                                {new Date(item.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 2) Saved Items Tab */}
            <TabsContent value="saved">
              <Card className="border-neondark-border bg-neondark-card shadow-lg">
                <CardHeader>
                  <CardTitle className="text-neondark-text">Saved Items</CardTitle>
                  <CardDescription>Bookmarks you want to revisit</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[350px] pr-4">
                    {!savedItems?.length ? (
                      <div className="text-sm text-neondark-muted">No saved items found.</div>
                    ) : (
                      <div className="space-y-6">
                        {savedItems.map((item) => (
                          <div key={item.id} className="flex items-start space-x-4">
                            <div className="mt-1 bg-cyan-950 p-2 rounded-full">
                              <PlusCircle className="h-5 w-5 text-cyan-400" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-neondark-text">
                                Saved{" "}
                                {item.content?.title && (
                                  <>
                                    - <span className="text-cyan-400">{item.content.title}</span>
                                  </>
                                )}
                              </p>
                              <p className="text-xs text-neondark-muted">
                                {new Date(item.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Edit Preferences Modal */}
      <PreferencesModal open={isOpen} onClose={() => setIsOpen(false)} user={user} />
    </div>
  )
}

// -------------------------------------------------------------------
// Edit Preferences Modal
// (Designed similar to your subscribe modal UI)
// -------------------------------------------------------------------
import { Tag, Database, Film } from "lucide-react"

function PreferencesModal({
  open,
  onClose,
  user,
}: {
  open: boolean
  onClose: () => void
  user: UserData
}) {
  // We'll hold comma-separated string inputs for each field
  const [interestsInput, setInterestsInput] = useState(
    user.preferences?.interests ? user.preferences.interests.join(", ") : ""
  )
  const [sourcesInput, setSourcesInput] = useState(
    user.preferences?.sources ? user.preferences.sources.join(", ") : ""
  )
  const [contentTypesInput, setContentTypesInput] = useState(
    user.preferences?.contentTypes ? user.preferences.contentTypes.join(", ") : ""
  )
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Helper function: parse a comma separated string into an array of values.
  const parseInput = (input: string) =>
    input.split(",").map(s => s.trim()).filter(s => s.length > 0)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    const interests = parseInput(interestsInput)
    const sources = parseInput(sourcesInput)
    const contentTypes = parseInput(contentTypesInput)

    try {
      // Call your API route to update preferences.
      const res = await fetch("/api/user/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interests, sources, contentTypes }),
      })

      const data = await res.json()
      if (res.ok) {
        setSuccess(true)
      } else {
        setError(data.error || "Failed to update preferences.")
      }
    } catch (err) {
      console.error(err)
      setError("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-neondark-card border-neondark-border border-2 shadow-lg shadow-cyan-400/20 max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-neondark-text flex items-center">
            <Edit2 className="mr-2 h-5 w-5 text-cyan-400" />
            Edit Preferences
          </DialogTitle>
        </DialogHeader>

        <Separator className="bg-neondark-border" />

        {success ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-cyan-950 rounded-full flex items-center justify-center mx-auto">
              <Edit2 className="h-8 w-8 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-cyan-400">Preferences Updated!</h3>
            <p className="text-neondark-muted">
              Your preferences have been saved successfully.
            </p>
            <Button onClick={onClose} className="bg-cyan-400 text-black hover:bg-cyan-500 mt-2">
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            {/* Interests */}
            <div className="space-y-2">
              <Label htmlFor="interests" className="text-neondark-text">
                Interests
              </Label>
              <div className="relative">
                <Tag className="absolute left-3 top-3 h-4 w-4 text-cyan-400" />
                <Input
                  type="text"
                  id="interests"
                  value={interestsInput}
                  onChange={(e) => setInterestsInput(e.target.value)}
                  placeholder="e.g. JavaScript, Rust, Design"
                  className="pl-10 bg-neondark-bg border-neondark-border focus:border-cyan-400 focus:ring-cyan-400 text-neondark-text"
                />
              </div>
            </div>

            {/* Preferred Sources */}
            <div className="space-y-2">
              <Label htmlFor="sources" className="text-neondark-text">
                Preferred Sources
              </Label>
              <div className="relative">
                <Database className="absolute left-3 top-3 h-4 w-4 text-cyan-400" />
                <Input
                  type="text"
                  id="sources"
                  value={sourcesInput}
                  onChange={(e) => setSourcesInput(e.target.value)}
                  placeholder="e.g. Reddit, GitHub"
                  className="pl-10 bg-neondark-bg border-neondark-border focus:border-cyan-400 focus:ring-cyan-400 text-neondark-text"
                />
              </div>
            </div>

            {/* Content Types */}
            <div className="space-y-2">
              <Label htmlFor="contentTypes" className="text-neondark-text">
                Content Types
              </Label>
              <div className="relative">
                <Film className="absolute left-3 top-3 h-4 w-4 text-cyan-400" />
                <Input
                  type="text"
                  id="contentTypes"
                  value={contentTypesInput}
                  onChange={(e) => setContentTypesInput(e.target.value)}
                  placeholder="e.g. Articles, Videos, Podcasts"
                  className="pl-10 bg-neondark-bg border-neondark-border focus:border-cyan-400 focus:ring-cyan-400 text-neondark-text"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-950 border border-red-500 rounded-md text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-neondark-border text-neondark-muted hover:bg-neondark-bg mr-2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-cyan-400 text-black hover:bg-cyan-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
