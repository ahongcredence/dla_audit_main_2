"use client";

import { useEffect } from "react";

import DataTable from "../components/DataTable";
import { useInsightsPanel } from "../components/InsightsPanelContext";
import { capData } from "../components/cap/capData";

export default function CapManagerPage() {
  const { setPanelContent } = useInsightsPanel();

  // Set the panel content when component mounts
  useEffect(() => {
    setPanelContent({ transactionInsights: false });
  }, [setPanelContent]);

  // Transform CAP data for DataTable
  const columns = [
    { key: "capId", label: "CAP ID", width: "100px" },
    {
      key: "issueClusterId",
      label: "Cluster ID",
      width: "120px",
    },
    {
      key: "rootCauseCategory",
      label: "Root Cause",
      width: "140px",
    },
    {
      key: "capAction",
      label: "CAP Action",
      width: "300px",
    },
    {
      key: "estimatedRecovery",
      label: "Recovery ($)",
      width: "120px",
    },
    { key: "capStatus", label: "Status", width: "120px" },
    {
      key: "remediationPriority",
      label: "Priority",
      width: "100px",
    },
    {
      key: "auditOwnerGroup",
      label: "Team",
      width: "120px",
    },
    {
      key: "targetCompletionDate",
      label: "Target Date",
      width: "120px",
    },
    {
      key: "confidenceScore",
      label: "Confidence",
      width: "100px",
    },
  ];

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Format confidence score as percentage
  const formatConfidence = (score: number) => {
    return `${Math.round(score * 100)}%`;
  };

  // Get status badge styling (WCAG compliant)
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Planned":
        return "bg-gray-800 text-white";
      case "In Progress":
        return "bg-blue-700 text-white";
      case "Implemented":
        return "bg-green-800 text-white";
      case "Pending Review":
        return "bg-yellow-600 text-black";
      default:
        return "bg-gray-800 text-white";
    }
  };

  // Get priority badge styling (WCAG compliant)
  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-700 text-white";
      case "Medium":
        return "bg-orange-600 text-white";
      case "Low":
        return "bg-green-700 text-white";
      default:
        return "bg-gray-800 text-white";
    }
  };

  // Transform data for DataTable with custom rendering
  const transformedData = capData.map(record => ({
    id: record.capId,
    capId: record.capId,
    issueClusterId: record.issueClusterId,
    rootCauseCategory: record.rootCauseCategory,
    capAction:
      record.capAction.length > 50
        ? `${record.capAction.substring(0, 50)}...`
        : record.capAction,
    capActionFull: record.capAction, // For search purposes
    estimatedRecovery: formatCurrency(record.estimatedRecovery),
    capStatus: (
      <span
        className={`rounded-sm px-2 py-1 text-xs font-bold ${getStatusBadgeClass(record.capStatus)}`}
      >
        {record.capStatus}
      </span>
    ),
    capStatusText: record.capStatus, // For search purposes
    remediationPriority: (
      <span
        className={`rounded-sm px-2 py-1 text-xs font-bold ${getPriorityBadgeClass(record.remediationPriority)}`}
      >
        {record.remediationPriority}
      </span>
    ),
    remediationPriorityText: record.remediationPriority, // For search purposes
    auditOwnerGroup: record.auditOwnerGroup,
    targetCompletionDate: record.targetCompletionDate,
    confidenceScore: formatConfidence(record.confidenceScore),
  }));

  return (
    <div className="mx-auto">
      <div className="flex min-h-full gap-6">
        {/* Main Content Area */}
        <div className="w-full flex-shrink-0">
          <div className="text-left">
            {/* CAP Table */}
            <div className="mb-6">
              <DataTable
                columns={columns}
                data={transformedData}
                title="Corrective Action Plans"
                searchable={true}
                filterable={true}
                exportable={true}
                maxHeight="520px"
                searchPlaceholder="Search by CAP ID, Action, Status, or Team"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
