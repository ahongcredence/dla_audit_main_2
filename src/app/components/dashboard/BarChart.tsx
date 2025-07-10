"use client";

import React from "react";

import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Card from "../Card";

const barData = [
  { name: "Jan", accepted: 4000, rejected: 240 },
  { name: "Feb", accepted: 3000, rejected: 139 },
  { name: "Mar", accepted: 2000, rejected: 980 },
  { name: "Apr", accepted: 2780, rejected: 390 },
  { name: "May", accepted: 1890, rejected: 480 },
  { name: "Jun", accepted: 2390, rejected: 380 },
];

export default function BarChartComponent() {
  return (
    <Card header={{ title: "Monthly Revision Trends" }}>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={barData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="accepted" fill="#32a89a" />
          <Bar dataKey="rejected" fill="#f0a732" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
