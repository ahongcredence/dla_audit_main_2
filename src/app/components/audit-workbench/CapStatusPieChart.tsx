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
import { processCapStatusData } from "./chartUtils";

export default function CapStatusPieChart() {
  const data = processCapStatusData();

  return (
    <Card header={{ title: "CAP Status Distribution" }}>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <defs>
            <radialGradient
              id="gradient-audit-primary-radial"
              cx="50%"
              cy="50%"
              r="50%"
            >
              <stop offset="0%" stopColor="#047857" /* emerald-700 */ />
              <stop offset="100%" stopColor="#34d399" /* emerald-400 */ />
            </radialGradient>
            <radialGradient
              id="gradient-audit-secondary-radial"
              cx="50%"
              cy="50%"
              r="50%"
            >
              <stop offset="0%" stopColor="#991b1b" /* red-800 */ />
              <stop offset="100%" stopColor="#f87171" /* red-400 */ />
            </radialGradient>
            <radialGradient
              id="gradient-audit-blue-light-radial"
              cx="50%"
              cy="50%"
              r="50%"
            >
              <stop
                offset="0%"
                stopColor="var(--color-auditinsight-primary-40)" /* Keep primary */
              />
              <stop
                offset="100%"
                stopColor="var(--color-auditinsight-primary-70)" /* Keep primary */
              />
            </radialGradient>
            <radialGradient
              id="gradient-audit-teal-light-radial"
              cx="50%"
              cy="50%"
              r="50%"
            >
              <stop
                offset="0%"
                stopColor="var(--color-auditinsight-secondary-40)" /* Keep secondary */
              />
              <stop
                offset="100%"
                stopColor="var(--color-auditinsight-secondary-70)" /* Keep secondary */
              />
            </radialGradient>
          </defs>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="45%"
            outerRadius={55}
            fill="#8884d8"
          >
            {data.map((entry, index) => {
              // Convert CSS var reference to SVG gradient ID
              const gradientId = entry.color.includes("primary-radial")
                ? "gradient-audit-primary-radial"
                : entry.color.includes("secondary-radial")
                  ? "gradient-audit-secondary-radial"
                  : entry.color.includes("blue-light-radial")
                    ? "gradient-audit-blue-light-radial"
                    : "gradient-audit-teal-light-radial";

              return (
                <Cell key={`cell-${index}`} fill={`url(#${gradientId})`} />
              );
            })}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
