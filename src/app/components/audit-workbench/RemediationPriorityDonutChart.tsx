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
import { processRemediationPriorityData } from "./chartUtils";

export default function RemediationPriorityDonutChart() {
  const data = processRemediationPriorityData();
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card
      header={{
        title: "Remediation Priority Distribution",
      }}
    >
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <defs>
            <radialGradient
              id="gradient-priority-primary-radial"
              cx="50%"
              cy="50%"
              r="50%"
            >
              <stop offset="0%" stopColor="#6b21a8" /* purple-800 */ />
              <stop offset="100%" stopColor="#a855f7" /* purple-500 */ />
            </radialGradient>
            <radialGradient
              id="gradient-priority-secondary-radial"
              cx="50%"
              cy="50%"
              r="50%"
            >
              <stop offset="0%" stopColor="#9a3412" /* orange-800 */ />
              <stop offset="100%" stopColor="#fb923c" /* orange-400 */ />
            </radialGradient>
            <radialGradient
              id="gradient-priority-blue-light-radial"
              cx="50%"
              cy="50%"
              r="50%"
            >
              <stop offset="0%" stopColor="#0c4a6e" /* sky-900 */ />
              <stop offset="100%" stopColor="#38bdf8" /* sky-400 */ />
            </radialGradient>
          </defs>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="45%"
            innerRadius={25}
            outerRadius={55}
            fill="#8884d8"
          >
            {data.map((entry, index) => {
              let gradientId;
              switch (entry.name) {
                case "High":
                  gradientId = "gradient-priority-primary-radial";
                  break;
                case "Medium":
                  gradientId = "gradient-priority-blue-light-radial";
                  break;
                case "Low":
                  gradientId = "gradient-priority-secondary-radial";
                  break;
                default:
                  gradientId = "gradient-priority-primary-radial";
              }

              return (
                <Cell key={`cell-${index}`} fill={`url(#${gradientId})`} />
              );
            })}
          </Pie>
          <Tooltip />
          <Legend />
          <text
            x="50%"
            y="43%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-current text-sm font-semibold"
          >
            {total}
          </text>
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
