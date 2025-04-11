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

  const sources = sourcesInput
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)

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
      <DialogContent className="bg-white dark:bg-black border border-gray-200 dark:border-cyan-800 shadow-lg dark:shadow-cyan-400/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-black dark:text-cyan-100 flex items-center">
            <Mail className="mr-2 h-5 w-5 text-cyan-500" />
            Subscribe to Zynapse
          </DialogTitle>
        </DialogHeader>

        <div className="text-sm text-gray-600 dark:text-cyan-300 mb-4">
          Get the latest developer news and updates delivered to your inbox
        </div>

        <Separator className="bg-gray-200 dark:bg-cyan-800" />

        {success ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-950 rounded-full flex items-center justify-center mx-auto">
              <Mail className="h-8 w-8 text-cyan-500" />
            </div>
            <h3 className="text-xl font-bold text-cyan-600 dark:text-cyan-400">Subscription Successful!</h3>
            <p className="text-gray-600 dark:text-cyan-300">
              Thank you for subscribing to our newsletter. You'll receive your first issue soon.
            </p>
            <Button onClick={onClose} className="bg-cyan-500 text-white hover:bg-cyan-600 mt-2">
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-black dark:text-cyan-100">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-cyan-500" />
                <Input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-950 text-black dark:text-cyan-100 border border-gray-300 dark:border-cyan-800 focus:border-cyan-500 focus:ring-cyan-500"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-black dark:text-cyan-100">
                Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-cyan-500" />
                <Input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-950 text-black dark:text-cyan-100 border border-gray-300 dark:border-cyan-800 focus:border-cyan-500 focus:ring-cyan-500"
                  placeholder="Your name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sources" className="text-black dark:text-cyan-100">
                Content Sources
              </Label>
              <div className="relative">
                <Database className="absolute left-3 top-3 h-4 w-4 text-cyan-500" />
                <Input
                  type="text"
                  id="sources"
                  value={sourcesInput}
                  onChange={(e) => setSourcesInput(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-950 text-black dark:text-cyan-100 border border-gray-300 dark:border-cyan-800 focus:border-cyan-500 focus:ring-cyan-500"
                  placeholder="e.g. Reddit, GitHub, HackerNews"
                />
              </div>

              {sources.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {sources.map((source) => (
                    <Badge
                      key={source}
                      variant="outline"
                      className="border-cyan-600 dark:border-cyan-400 text-cyan-600 dark:text-cyan-400 flex items-center gap-1"
                    >
                      {source}
                      <button
                        type="button"
                        onClick={() => handleRemoveSource(source)}
                        className="ml-1 h-3 w-3 rounded-full bg-cyan-200 dark:bg-cyan-900 flex items-center justify-center hover:bg-cyan-300 dark:hover:bg-cyan-800"
                      >
                        <X className="h-2 w-2" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              <div className="mt-2">
                <p className="text-xs text-gray-500 dark:text-cyan-300 mb-1">Suggested sources:</p>
                <div className="flex flex-wrap gap-2">
                  {availableSources
                    .filter((source) => !sources.includes(source))
                    .map((source) => (
                      <button
                        key={source}
                        type="button"
                        onClick={() => handleAddSource(source)}
                        className="text-xs px-2 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-200 dark:hover:bg-cyan-800"
                      >
                        + {source}
                      </button>
                    ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency" className="text-black dark:text-cyan-100">
                Frequency
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-cyan-500 z-10" />
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger className="pl-10 bg-white dark:bg-gray-950 border border-gray-300 dark:border-cyan-800 text-black dark:text-cyan-100 focus:border-cyan-500 focus:ring-cyan-500">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-950 border border-gray-300 dark:border-cyan-800">
                    <SelectItem value="daily" className="text-black dark:text-cyan-100 hover:bg-cyan-100 dark:hover:bg-cyan-900">
                      Daily
                    </SelectItem>
                    <SelectItem value="weekly" className="text-black dark:text-cyan-100 hover:bg-cyan-100 dark:hover:bg-cyan-900">
                      Weekly
                    </SelectItem>
                    <SelectItem value="monthly" className="text-black dark:text-cyan-100 hover:bg-cyan-100 dark:hover:bg-cyan-900">
                      Monthly
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-100 dark:bg-red-950 border border-red-400 dark:border-red-500 rounded-md text-red-700 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border border-gray-300 dark:border-cyan-800 text-gray-600 dark:text-cyan-300 hover:bg-gray-100 dark:hover:bg-cyan-900 mr-2"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-cyan-500 text-white hover:bg-cyan-600" disabled={isSubmitting}>
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
