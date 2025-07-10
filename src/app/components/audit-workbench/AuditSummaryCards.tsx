import {
  AlertTriangle,
  BarChart3,
  ClipboardCheck,
  DollarSign,
} from "lucide-react";

import Card from "../Card";
import { calculateAuditSummaryMetrics } from "./chartUtils";

export default function AuditSummaryCards() {
  const metrics = calculateAuditSummaryMetrics();

  const summaryCards = [
    {
      title: "Total Audit Issues",
      value: metrics.totalIssues.toString(),
      icon: AlertTriangle,
      gradient: "bg-gradient-to-r from-purple-700 to-purple-500",
    },
    {
      title: "Total Impact",
      value: `$${metrics.totalImpact.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: DollarSign,
      gradient: "bg-gradient-to-r from-sky-700 to-sky-500",
    },
    {
      title: "Average Confidence Score",
      value: `${metrics.averageConfidence.toFixed(1)}%`,
      icon: BarChart3,
      gradient: "bg-gradient-to-r from-emerald-700 to-emerald-500",
    },
    {
      title: "NFR Coverage Score",
      value: `${metrics.nfrCoverage.toFixed(1)}%`,
      icon: ClipboardCheck,
      gradient: "bg-gradient-to-r from-amber-600 to-amber-400",
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {summaryCards.map((card, index) => (
        <Card
          key={index}
          className="relative overflow-hidden"
          header={{
            title: card.title,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-foreground text-2xl font-bold">
                {card.value}
              </span>
            </div>
            <div className="opacity-60">
              <card.icon size={24} />
            </div>
          </div>

          {/* Subtle gradient background accent */}
          <div
            className={`absolute bottom-0 left-0 h-1 w-full ${card.gradient}`}
          />
        </Card>
      ))}
    </div>
  );
}
