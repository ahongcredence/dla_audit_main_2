"use client";

import { Cell, Pie, PieChart } from "recharts";

interface EnhancedAuditScoreChartProps {
  score: number;
  size?: number;
}

export default function EnhancedAuditScoreChart({
  score,
  size = 45,
}: EnhancedAuditScoreChartProps) {
  const chartData = [
    { name: "completed", value: score },
    { name: "remaining", value: 100 - score },
  ];

  // Determine color based on score ranges
  const getScoreColor = (score: number) => {
    if (score >= 70) return "green"; // High confidence/low risk
    if (score >= 40) return "yellow"; // Medium confidence/moderate risk
    return "red"; // Low confidence/high risk
  };

  const scoreColor = getScoreColor(score);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <PieChart width={size} height={size}>
        <defs>
          {/* Green gradient for high scores */}
          <radialGradient id="greenGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="50%" stopColor="#059669" />
            <stop offset="100%" stopColor="#047857" />
          </radialGradient>

          {/* Yellow gradient for medium scores */}
          <radialGradient id="yellowGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#B45309" />
          </radialGradient>

          {/* Red gradient for low scores */}
          <radialGradient id="redGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="50%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#B91C1C" />
          </radialGradient>
        </defs>
        <Pie
          data={chartData}
          cx={size * 0.365}
          cy={size * 0.365}
          innerRadius={size * 0.3}
          outerRadius={size * 0.45}
          startAngle={90}
          endAngle={450}
          dataKey="value"
          animationBegin={0}
          animationDuration={800}
          animationEasing="ease-out"
        >
          <Cell key="completed" fill={`url(#${scoreColor}Gradient)`} />
          <Cell key="remaining" fill="#E5E7EB" />
        </Pie>
      </PieChart>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`${size >= 40 ? "text-sm" : "text-xs"} font-bold ${
            scoreColor === "green"
              ? "text-green-700"
              : scoreColor === "yellow"
                ? "text-yellow-700"
                : "text-red-700"
          }`}
        >
          {score}
        </span>
      </div>
    </div>
  );
}
