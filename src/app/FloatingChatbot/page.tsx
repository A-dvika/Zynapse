"use client"; 
// ^ If you're using Next.js 13+ in /app directory, else remove

import React, { useState } from "react";
import { X, MessageCircle } from "lucide-react"; // or any icon library
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingChatbot() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 1. Floating Sparkly Icon */}
      <div
        className="fixed z-50 bottom-6 right-6"
        onClick={() => setOpen(!open)}
      >
        <div className="relative cursor-pointer h-14 w-14 flex items-center justify-center bg-indigo-600 rounded-full shadow-lg 
                        animate-floatAndGlow sparkle-animation hover:scale-110 transition-transform">
          <MessageCircle className="text-white h-6 w-6" />
        </div>
      </div>

      {/* 2. Chatbot Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-y-0 right-0 w-full sm:w-80 bg-background text-foreground shadow-lg z-50"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex flex-col h-full">
              {/* Panel Header */}
              <div className="flex items-center justify-between p-4 bg-indigo-600 text-white shadow">
                <h2 className="font-bold">Sparkly Chatbot</h2>
                <button onClick={() => setOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Chat content area */}
              <div className="flex-1 p-4 overflow-auto text-sm">
                <p className="mb-2">Hello there! I’m your friendly floating chatbot.</p>
                {/* ... Your chatbot logic or chat messages here ... */}
                <p className="mb-2">
                  Ask me something or type <code>/help</code> for commands.
                </p>
              </div>

              {/* Input area */}
              <div className="p-4 border-t border-gray-200">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-indigo-500"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
