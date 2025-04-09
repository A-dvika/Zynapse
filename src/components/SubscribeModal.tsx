"use client"

import type React from "react"
import { useState } from "react"
import { X, Mail, User, Calendar, Database } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface SubscribeModalProps {
  open: boolean
  onClose: () => void
}

export default function SubscribeModal({ open, onClose }: SubscribeModalProps) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [sourcesInput, setSourcesInput] = useState("")
  const [frequency, setFrequency] = useState("weekly")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Parse sources from input
  const sources = sourcesInput
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)

  // Available source options for suggestions
  const availableSources = [
    "Reddit",
    "GitHub",
    "HackerNews",
    "TechNews",
    "Socials",
    "Memes",
    "ProductHunt",
    "StackOverflow",
  ]

  const handleAddSource = (source: string) => {
    const currentSources = sourcesInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0)

    if (!currentSources.includes(source)) {
      const newSources = [...currentSources, source]
      setSourcesInput(newSources.join(", "))
    }
  }

  const handleRemoveSource = (sourceToRemove: string) => {
    const newSources = sources.filter((source) => source !== sourceToRemove)
    setSourcesInput(newSources.join(", "))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          sources,
          frequency,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess(true)
      } else {
        setError(data.error || "Subscription failed.")
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
            <Mail className="mr-2 h-5 w-5 text-cyan-400" />
            Subscribe to Zynapse
          </DialogTitle>
        </DialogHeader>

        <div className="text-sm text-neondark-muted mb-4">
          Get the latest developer news and updates delivered to your inbox
        </div>

        <Separator className="bg-neondark-border" />

        {success ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-cyan-950 rounded-full flex items-center justify-center mx-auto">
              <Mail className="h-8 w-8 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-cyan-400">Subscription Successful!</h3>
            <p className="text-neondark-muted">
              Thank you for subscribing to our newsletter. You'll receive your first issue soon.
            </p>
            <Button onClick={onClose} className="bg-cyan-400 text-black hover:bg-cyan-500 mt-2">
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-neondark-text">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-cyan-400" />
                <Input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-neondark-bg border-neondark-border focus:border-cyan-400 focus:ring-cyan-400 text-neondark-text"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-neondark-text">
                Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-cyan-400" />
                <Input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 bg-neondark-bg border-neondark-border focus:border-cyan-400 focus:ring-cyan-400 text-neondark-text"
                  placeholder="Your name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sources" className="text-neondark-text">
                Content Sources
              </Label>
              <div className="relative">
                <Database className="absolute left-3 top-3 h-4 w-4 text-cyan-400" />
                <Input
                  type="text"
                  id="sources"
                  value={sourcesInput}
                  onChange={(e) => setSourcesInput(e.target.value)}
                  className="pl-10 bg-neondark-bg border-neondark-border focus:border-cyan-400 focus:ring-cyan-400 text-neondark-text"
                  placeholder="e.g. Reddit, GitHub, HackerNews"
                />
              </div>

              {/* Source badges */}
              {sources.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {sources.map((source) => (
                    <Badge
                      key={source}
                      variant="outline"
                      className="border-cyan-400 text-cyan-400 flex items-center gap-1"
                    >
                      {source}
                      <button
                        type="button"
                        onClick={() => handleRemoveSource(source)}
                        className="ml-1 h-3 w-3 rounded-full bg-cyan-950 flex items-center justify-center hover:bg-cyan-900"
                      >
                        <X className="h-2 w-2" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Source suggestions */}
              <div className="mt-2">
                <p className="text-xs text-neondark-muted mb-1">Suggested sources:</p>
                <div className="flex flex-wrap gap-2">
                  {availableSources
                    .filter((source) => !sources.includes(source))
                    .map((source) => (
                      <button
                        key={source}
                        type="button"
                        onClick={() => handleAddSource(source)}
                        className="text-xs px-2 py-1 rounded-full bg-cyan-950 text-cyan-400 hover:bg-cyan-900"
                      >
                        + {source}
                      </button>
                    ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency" className="text-neondark-text">
                Frequency
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-cyan-400 z-10" />
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger className="pl-10 bg-neondark-bg border-neondark-border focus:border-cyan-400 focus:ring-cyan-400 text-neondark-text">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent className="bg-neondark-bg border-neondark-border">
                    <SelectItem value="daily" className="text-neondark-text hover:bg-cyan-950">
                      Daily
                    </SelectItem>
                    <SelectItem value="weekly" className="text-neondark-text hover:bg-cyan-950">
                      Weekly
                    </SelectItem>
                    <SelectItem value="monthly" className="text-neondark-text hover:bg-cyan-950">
                      Monthly
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-950 border border-red-500 rounded-md text-red-400 text-sm">{error}</div>
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
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

