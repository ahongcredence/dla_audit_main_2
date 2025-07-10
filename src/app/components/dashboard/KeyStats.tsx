import {
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  PieChart,
  Shield,
  TrendingUp,
} from "lucide-react";

import Card from "../Card";

const auditStatsData = {
  totalFindings: 247,
  riskLevel: "Medium",
  complianceRate: 94.2,
  activeAudits: 12,
  pendingReviews: 8,
  financialImpact: 2400000,
  auditCoverage: 87,
  overallHealth: "Good",
  healthDetails: "All critical controls operational",
};

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}

function StatCard({
  icon,
  title,
  value,
  subtitle,
  color = "text-blue-600",
}: StatCardProps) {
  return (
    <Card className="p-2">
      <div className="flex items-start gap-2">
        <div className={`${color} mt-0.5`}>{icon}</div>
        <div className="min-w-0 flex-1">
          <h4 className="mb-0.5 text-xs">{title}</h4>
          <p className="text-sm font-semibold">{value}</p>
          {subtitle && (
            <p className="mt-0.5 text-xs leading-tight">{subtitle}</p>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function KeyStats() {
  return (
    <div className="grid h-full grid-rows-4 gap-3">
      {/* Row 1: 2 stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<AlertTriangle size={16} />}
          title="Total Audit Findings"
          value={auditStatsData.totalFindings.toLocaleString()}
          subtitle="Identified issues"
          color="text-orange-600"
        />

        <StatCard
          icon={<Shield size={16} />}
          title="Risk Score"
          value={auditStatsData.riskLevel}
          subtitle="Current risk level"
          color="text-yellow-600"
        />
      </div>

      {/* Row 2: 3 stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          icon={<CheckCircle size={16} />}
          title="Compliance"
          value={`${auditStatsData.complianceRate}%`}
          subtitle="Standards met"
          color="text-green-600"
        />

        <StatCard
          icon={<FileText size={16} />}
          title="Active Audits"
          value={auditStatsData.activeAudits}
          subtitle="In progress"
          color="text-blue-600"
        />

        <StatCard
          icon={<Clock size={16} />}
          title="Reviews"
          value={auditStatsData.pendingReviews}
          subtitle="Awaiting action"
          color="text-purple-600"
        />
      </div>

      {/* Row 3: 2 stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<DollarSign size={16} />}
          title="Financial Impact"
          value={`$${(auditStatsData.financialImpact / 1000000).toFixed(1)}M`}
          subtitle="Issues identified"
          color="text-red-600"
        />

        <StatCard
          icon={<PieChart size={16} />}
          title="Audit Coverage"
          value={`${auditStatsData.auditCoverage}%`}
          subtitle="Processes reviewed"
          color="text-indigo-600"
        />
      </div>

      {/* Row 4: 1 large stat */}
      <div className="grid grid-cols-1">
        <StatCard
          icon={<TrendingUp size={16} />}
          title="Overall Audit Health"
          value={auditStatsData.overallHealth}
          subtitle={auditStatsData.healthDetails}
          color="text-green-600"
        />
      </div>
    </div>
  );
}
