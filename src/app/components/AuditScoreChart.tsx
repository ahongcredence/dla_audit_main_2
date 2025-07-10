"use client";

import { Cell, Pie, PieChart } from "recharts";

interface AuditScoreChartProps {
  score: number;
  size?: number;
}

export default function AuditScoreChart({
  score,
  size = 45,
}: AuditScoreChartProps) {
  const chartData = [
    { name: "completed", value: score },
    { name: "remaining", value: 100 - score },
  ];

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <PieChart width={size} height={size}>
        <defs>
          <linearGradient
            id="auditGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#4A3AFF" />
            <stop offset="50%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        <Pie
          data={chartData}
          cx={size * 0.4}
          cy={size * 0.4}
          innerRadius={size * 0.27}
          outerRadius={size * 0.4}
          startAngle={90}
          endAngle={450}
          dataKey="value"
          animationBegin={0}
          animationDuration={500}
        >
          <Cell key="completed" fill="url(#auditGradient)" />
          <Cell key="remaining" fill="#E5E5EF" />
        </Pie>
      </PieChart>
      <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
        {score}
      </div>
    </div>
  );
}
