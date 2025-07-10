"use client";

import React from "react";

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Card from "../Card";
import { processIssueAgeData } from "./chartUtils";

export default function IssueAgeBarChart() {
  const data = processIssueAgeData();

  return (
    <Card header={{ title: "Issue Age Distribution" }}>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 15,
            left: 15,
            bottom: 5,
          }}
        >
          <defs>
            <linearGradient
              id="gradient-age-0"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#047857" /* emerald-700 */ />
              <stop offset="100%" stopColor="#34d399" /* emerald-400 */ />
            </linearGradient>
            <linearGradient
              id="gradient-age-1"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#9a3412" /* orange-800 */ />
              <stop offset="100%" stopColor="#fb923c" /* orange-400 */ />
            </linearGradient>
            <linearGradient
              id="gradient-age-2"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#881337" /* rose-900 */ />
              <stop offset="100%" stopColor="#fb7185" /* rose-400 */ />
            </linearGradient>
            <linearGradient
              id="gradient-age-3"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#991b1b" /* red-800 */ />
              <stop offset="100%" stopColor="#f87171" /* red-400 */ />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="name"
            fontSize={10}
            angle={-45}
            textAnchor="end"
            height={45}
          />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8">
            {data.map((entry, index) => {
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#gradient-age-${index})`}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
