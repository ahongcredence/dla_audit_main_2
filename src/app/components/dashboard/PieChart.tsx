"use client";

import React from "react";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import Card from "../Card";

const pieData = [
  { name: "Compliant", value: 4000, color: "#32a89a" },
  { name: "In Review", value: 3500, color: "#f0a732" },
  { name: "Non-Compliant", value: 2500, color: "#9b2743" },
];

export default function PieChartComponent() {
  return (
    <Card header={{ title: "Transaction Distribution" }}>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={pieData} dataKey="value">
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
