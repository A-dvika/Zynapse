"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { X, Tag, Database, Film } from "lucide-react"

// Example UserData interface
interface PreferenceData {
  interests?: string[]
  sources?: string[]
  contentTypes?: string[]
}

interface UserData {
  id: string
  name: string
  email: string
  image?: string
  preferences?: PreferenceData
  // ... other fields if needed
}

interface EditPreferencesModalProps {
  open: boolean
  onClose: () => void
  user: UserData
}

export default function EditPreferencesModal({
  open,
  onClose,
  user,
}: EditPreferencesModalProps) {
  // Initialize inputs from the current user preferences (comma-separated)
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

  // Helper function: parse a comma-separated input string into an array of trimmed strings
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
      // Replace with your actual update endpoint.
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
      <DialogContent className="bg-black border-neondark-border border-2 shadow-lg shadow-cyan-400/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-neondark-text flex items-center">
            <Tag className="mr-2 h-5 w-5 text-cyan-400" />
            Edit Preferences
          </DialogTitle>
        </DialogHeader>

        <div className="text-sm text-neondark-muted mb-4">
          Update your interests, preferred sources, and content types.
        </div>

        <Separator className="bg-neondark-border" />

        {success ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-cyan-950 rounded-full flex items-center justify-center mx-auto">
              <Tag className="h-8 w-8 text-cyan-400" />
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
              <Button type="submit" className="bg-cyan-400 text-black hover:bg-cyan-500" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
