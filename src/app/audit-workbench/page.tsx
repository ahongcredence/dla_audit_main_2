import AuditDataTable from "../components/audit-workbench/AuditDataTable";
import AuditSummaryCards from "../components/audit-workbench/AuditSummaryCards";
import CapStatusPieChart from "../components/audit-workbench/CapStatusPieChart";
import IssueAgeBarChart from "../components/audit-workbench/IssueAgeBarChart";
import RemediationPriorityDonutChart from "../components/audit-workbench/RemediationPriorityDonutChart";
import RootCauseBarChart from "../components/audit-workbench/RootCauseBarChart";
import auditData from "../data/auditTable.json";

export default function AuditWorkbench() {
  // Format the audit data for display
  const formattedAuditData = auditData.map((item, index) => ({
    ...item,
    "Total $ Impact": `$${item["Total $ Impact"].toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    "Confidence Score": `${(item["Confidence Score"] * 100).toFixed(0)}%`,
    "Anomaly Risk Score": `${(item["Anomaly Risk Score"] * 100).toFixed(0)}%`,
    "Age (Days)": `${item["Age (Days)"]} days`,
    "NFR Reference": item["NFR Reference"] || "N/A",
    id: index, // Add an id for the table
  }));

  return (
    <div className="mx-auto">
      {/* Summary Cards Section */}
      <AuditSummaryCards />

      {/* Charts Section */}
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <CapStatusPieChart />
        <RootCauseBarChart />
        <RemediationPriorityDonutChart />
        <IssueAgeBarChart />
      </div>

      {/* Audit Data Table */}
      <AuditDataTable data={formattedAuditData} />
    </div>
  );
}
