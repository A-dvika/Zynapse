"use client"

import { useState, useEffect, useRef } from "react"
import { X, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface ChatMessage {
  question: string
  answer: string
  timestamp: Date
}

export default function FloatingChatbot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Add body class when chatbot is open to shift content
  useEffect(() => {
    if (open) {
      document.body.classList.add("chatbot-open")
    } else {
      document.body.classList.remove("chatbot-open")
    }

    return () => {
      document.body.classList.remove("chatbot-open")
    }
  }, [open])

  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatHistory])

  async function handleSend() {
    if (!input.trim() || loading) return

    const question = input.trim()
    setChatHistory((prev) => [...prev, { question, answer: "...", timestamp: new Date() }])
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("/api/chat/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: question }),
      })
      const data = await response.json()
      const answer = data.answer || "Sorry, I couldn't find an answer."

      // Update the last message with the bot's answer
      setChatHistory((prev) => {
        const updated = [...prev]
        updated[updated.length - 1] = { ...updated[updated.length - 1], answer }
        return updated
      })
    } catch (error) {
      console.error("Error querying chatbot:", error)
      setChatHistory((prev) => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          answer: "Error: Unable to get a response.",
        }
        return updated
      })
    } finally {
      setLoading(false)
    }
  }

  function formatTime(date: Date) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <>
      {/* Floating Icon */}
      <motion.div
        className="fixed z-50 bottom-6 right-6"
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative cursor-pointer h-14 w-14 flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full shadow-lg">
          <Sparkles className="text-white h-6 w-6" />
          {chatHistory.length > 0 && !open && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {chatHistory.length}
            </span>
          )}
        </div>
      </motion.div>

      {/* Chatbot Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col rounded-l-2xl overflow-hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5" />
                <h2 className="font-bold text-lg">Sparkly Assistant</h2>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-full p-1 hover:bg-white/20 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-auto bg-gray-50 dark:bg-gray-800">
              {chatHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500 dark:text-gray-400">
                  <Sparkles className="h-12 w-12 mb-4 text-purple-500" />
                  <h3 className="text-lg font-medium mb-2">Welcome to Sparkly Assistant!</h3>
                  <p>Ask me anything and I'll try to help you out.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatHistory.map((chat, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-end">
                        <div className="bg-indigo-100 dark:bg-indigo-900 dark:text-white p-3 rounded-2xl rounded-tr-none max-w-[80%]">
                          <p>{chat.question}</p>
                          <div className="text-xs text-right mt-1 text-gray-500 dark:text-gray-400">
                            {formatTime(chat.timestamp)}
                          </div>
                        </div>
                      </div>

                      <div className="flex">
                        <div
                          className={cn(
                            "bg-white dark:bg-gray-700 p-3 rounded-2xl rounded-tl-none max-w-[80%] shadow-sm",
                            loading && index === chatHistory.length - 1 ? "animate-pulse" : "",
                          )}
                        >
                          <p className="dark:text-white">{chat.answer}</p>
                          <div className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                            {formatTime(chat.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend()
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  disabled={loading}
                  className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className={cn(
                    "p-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white",
                    !input.trim() || loading ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg transition-shadow",
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m22 2-7 20-4-9-9-4Z" />
                    <path d="M22 2 11 13" />
                  </svg>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

