"use client";

import React, { useState } from "react";
import { X, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  question: string;
  answer: string;
}

export default function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const question = input.trim();
    setChatHistory((prev) => [...prev, { question, answer: "..." }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: question }),
      });
      const data = await response.json();
      const answer = data.answer || "Sorry, I couldn’t find an answer.";
      
      // Update the last message with the bot's answer
      setChatHistory((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { ...updated[updated.length - 1], answer };
        return updated;
      });
    } catch (error) {
      console.error("Error querying chatbot:", error);
      setChatHistory((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          answer: "Error: Unable to get a response.",
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating Icon */}
      <div
        className="fixed z-50 bottom-6 right-6"
        onClick={() => setOpen(!open)}
      >
        <div
          className="relative cursor-pointer h-14 w-14 flex items-center justify-center bg-indigo-600 rounded-full shadow-lg
                      hover:scale-110 transition-transform"
        >
          <MessageCircle className="text-white h-6 w-6" />
        </div>
      </div>

      {/* Chatbot Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-y-0 right-0 w-full sm:w-80 bg-white text-black shadow-lg z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-indigo-600 text-white shadow">
              <h2 className="font-bold">Sparkly Chatbot</h2>
              <button onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-auto text-sm">
              {chatHistory.map((chat, index) => (
                <div key={index} className="mb-4">
                  <p className="font-bold">You: {chat.question}</p>
                  <p className="ml-2">Bot: {chat.answer}</p>
                </div>
              ))}
              {loading && <p>Loading...</p>}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  disabled={loading}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-indigo-500"
                />
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
