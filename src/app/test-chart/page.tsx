// pages/test-chart.tsx
"use client";

import React from "react";
import SaveChartButton from "@/components/SaveChartButton";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
} from "recharts";

const sampleData = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];

const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function TestChartPage() {
  return (
    <div className="min-h-screen p-6 bg-gray-50 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Test Chart Page</h1>
      
      {/* Wrap the chart in SaveChartButton */}
      <SaveChartButton fileName="test-chart">
        <div style={{ width: "400px", height: "400px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sampleData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {sampleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </SaveChartButton>
    </div>
  );
}
