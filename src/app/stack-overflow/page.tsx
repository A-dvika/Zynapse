"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";

export default function StackOverflowPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchSOData = async () => {
      const res = await fetch("/api/stackoverflow");
      const json = await res.json();
      setData(json);
    };
    fetchSOData();
  }, []);

  if (!data) return <div className="text-center mt-10">Loading Stack Overflow Stats...</div>;

  const colors = ["#f97316", "#10b981", "#3b82f6", "#8b5cf6", "#facc15"];

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="p-6 space-y-6 max-w-6xl mx-auto"
    >
      <motion.h1
        className="text-4xl font-bold text-center text-orange-600"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        💻 Stack Overflow Dashboard
      </motion.h1>

      {/* Top Questions */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="shadow-lg border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle>❓ Top Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {data.questions.map((q: any) => (
                <motion.li
                  key={q.id}
                  className="p-3 bg-orange-50 dark:bg-gray-800 rounded-lg shadow"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="font-semibold">{q.title}</span>
                  <p className="text-sm mt-1">⭐ Score: {q.score} | 🏷 {q.tags.join(", ")}</p>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Top Answers */}
        <Card className="shadow-lg border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle>✅ Top Answers</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {data.answers.map((ans: any) => (
                <motion.li
                  key={ans.id}
                  className="p-3 bg-green-50 dark:bg-gray-800 rounded-lg shadow"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="font-semibold">Answer to: {ans.questionTitle}</span>
                  <p className="text-sm mt-1">⭐ Score: {ans.score}</p>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tag Distribution Pie Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="shadow-lg border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle>🏷 Popular Tags Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={data.tagStats}
                  dataKey="questionCount"
                  nameKey="tag"
                  outerRadius={140}
                  label
                >
                  {data.tagStats.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bonus Animated Quote */}
      <motion.div
        className="text-center mt-10 text-lg italic text-gray-700 dark:text-gray-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        "Knowledge shared is knowledge squared."
      </motion.div>
    </motion.section>
  );
}
