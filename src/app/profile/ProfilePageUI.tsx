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

  if (!user) {
    return <div>No user data found.</div>
  }

  const { name, email, image, preferences, history } = user

  // 1) We'll separate the "saved" items from general activity
  const savedItems = (history || []).filter((item) => item.action === "save")
  const otherActivity = (history || []).filter((item) => item.action !== "save")

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
              <div className="text-neondark-muted text-sm">No preferences set yet.</div>
            )}

            {/* Interests */}
            {preferences?.interests?.length ? (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-neondark-text mb-2">Interests</h3>
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
                <h3 className="text-sm font-medium text-neondark-text mb-2">Preferred Sources</h3>
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
                <h3 className="text-sm font-medium text-neondark-text mb-2">Preferred Content Types</h3>
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
          <Tabs defaultValue="activity" className="w-full">
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

            {/* 1) ACTIVITY TAB */}
            <TabsContent value="activity">
              <Card className="border-neondark-border bg-neondark-card shadow-lg">
                <CardHeader>
                  <CardTitle className="text-neondark-text">Recent Activity</CardTitle>
                  <CardDescription>Your latest actions on this platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[350px] pr-4">
                    {!otherActivity?.length ? (
                      <div className="text-sm text-neondark-muted">
                        No recent actions.
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {otherActivity.map((item) => (
                          <div key={item.id} className="flex items-start space-x-4">
                            <div className="mt-1 bg-cyan-950 p-2 rounded-full">
                              {/* Adjust icon if you want different icons for each action */}
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

            {/* 2) SAVED ITEMS TAB */}
            <TabsContent value="saved">
              <Card className="border-neondark-border bg-neondark-card shadow-lg">
                <CardHeader>
                  <CardTitle className="text-neondark-text">Saved Items</CardTitle>
                  <CardDescription>Bookmarks you want to revisit</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[350px] pr-4">
                    {!savedItems?.length ? (
                      <div className="text-sm text-neondark-muted">
                        No saved items found.
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {savedItems.map((item) => (
                          <div key={item.id} className="flex items-start space-x-4">
                            <div className="mt-1 bg-cyan-950 p-2 rounded-full">
                              <PlusCircle className="h-5 w-5 text-cyan-400" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-neondark-text">
                                Saved {item.content?.title && (
                                  <>
                                    &nbsp; - &nbsp;
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
          </Tabs>
        </div>
      </div>

      {/* Edit Preferences Modal */}
      <PreferencesModal open={isOpen} onClose={() => setIsOpen(false)} user={user} />
    </div>
  )
}

// -------------------------------------------------------------------
//  Edit Preferences Modal
// -------------------------------------------------------------------
function PreferencesModal({
  open,
  onClose,
  user,
}: {
  open: boolean
  onClose: () => void
  user: UserData
}) {
  const [interests, setInterests] = useState<string[]>(user.preferences?.interests || [])
  const [sources, setSources] = useState<string[]>(user.preferences?.sources || [])
  const [contentTypes, setContentTypes] = useState<string[]>(
    user.preferences?.contentTypes || []
  )

  // If you want to handle saving to DB, you'd do it here
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Example. Replace with your actual update endpoint:
      await fetch("/api/user/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interests, sources, contentTypes }),
      })

      // You might want to refetch user data or pass the new prefs back up
      // For simplicity, just close the modal
      onClose()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="bg-neondark-card border-neondark-border border-2 shadow-lg shadow-cyan-400/20 max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-neondark-text flex items-center">
            <Edit2 className="mr-2 h-5 w-5 text-cyan-400" />
            Edit Preferences
          </DialogTitle>
        </DialogHeader>

        <Separator className="bg-neondark-border" />

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Interests */}
          <div>
            <Label className="text-neondark-text mb-1 block">Interests</Label>
            <TagInput tags={interests} setTags={setInterests} placeholder="Type and press Enter" />
          </div>

          {/* Sources */}
          <div>
            <Label className="text-neondark-text mb-1 block">Preferred Sources</Label>
            <TagInput tags={sources} setTags={setSources} placeholder="Reddit, GitHub..." />
          </div>

          {/* Content Types */}
          <div>
            <Label className="text-neondark-text mb-1 block">Content Types</Label>
            <TagInput tags={contentTypes} setTags={setContentTypes} placeholder="Articles, Videos..." />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-neondark-border text-neondark-muted hover:bg-neondark-bg"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-cyan-400 text-black hover:bg-cyan-500">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// -------------------------------------------------------------------
//  Generic TagInput component to handle array of tags
// -------------------------------------------------------------------
function TagInput({
  tags,
  setTags,
  placeholder,
}: {
  tags: string[]
  setTags: React.Dispatch<React.SetStateAction<string[]>>
  placeholder?: string
}) {
  const [value, setValue] = useState("")

  const addTag = (tag: string) => {
    const trimmed = tag.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            className="border-cyan-400 text-cyan-400 flex items-center gap-1"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 h-3 w-3 rounded-full bg-cyan-950 flex items-center justify-center hover:bg-cyan-900"
            >
              <X className="h-2 w-2" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            addTag(value)
            setValue("")
          }
        }}
        placeholder={placeholder || "Type something..."}
        className="bg-neondark-bg border-neondark-border focus:border-cyan-400 focus:ring-cyan-400 text-neondark-text"
      />
      {value.length > 0 && (
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            addTag(value)
            setValue("")
          }}
          className="border-cyan-400 text-cyan-400 hover:bg-cyan-950 flex items-center"
        >
          <PlusCircle className="mr-1 h-4 w-4" />
          Add Tag
        </Button>
      )}
    </div>
  )
}
