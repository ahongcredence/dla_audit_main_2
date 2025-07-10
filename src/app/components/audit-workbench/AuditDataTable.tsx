"use client";

import React from "react";

import { TableColumn } from "../../types";
import DataTable from "../DataTable";
import IssueIdLink from "../IssueIdLink";

interface AuditDataTableProps {
  data: Record<string, unknown>[];
  title?: string;
  maxHeight?: string;
  searchPlaceholder?: string;
}

export default function AuditDataTable({
  data,
  title = "Audit Issues",
  maxHeight = "600px",
  searchPlaceholder = "Search by Issue ID, Organization, Root Cause, or Priority",
}: AuditDataTableProps) {
  // Define columns for the audit data table
  const auditColumns: TableColumn[] = [
    {
      key: "Issue Cluster ID",
      label: "Issue ID",
      width: "120px",
      sortable: true,
      render: value => <IssueIdLink value={String(value)} />,
    },
    {
      key: "DLA Organization",
      label: "Organization",
      width: "150px",
      sortable: true,
    },
    {
      key: "Trading Partner ALC",
      label: "Trading Partner",
      width: "130px",
      sortable: true,
    },
    {
      key: "Total $ Impact",
      label: "$ Impact",
      width: "120px",
      sortable: true,
    },
    {
      key: "Age (Days)",
      label: "Age",
      width: "80px",
      sortable: true,
    },
    {
      key: "Root Cause Category",
      label: "Root Cause",
      width: "130px",
      sortable: true,
    },
    {
      key: "Confidence Score",
      label: "Confidence",
      width: "100px",
      sortable: true,
    },
    {
      key: "Anomaly Risk Score",
      label: "Risk Score",
      width: "100px",
      sortable: true,
    },
    {
      key: "Recurrence Count",
      label: "Recurrence",
      width: "100px",
      sortable: true,
    },
    {
      key: "CAP Status",
      label: "CAP Status",
      width: "120px",
      sortable: true,
    },
    {
      key: "Evidence Packet",
      label: "Evidence",
      width: "100px",
      sortable: true,
    },
    {
      key: "NFR Reference",
      label: "NFR Ref",
      width: "100px",
      sortable: true,
    },
    {
      key: "Remediation Priority",
      label: "Priority",
      width: "100px",
      sortable: true,
    },
  ];

  return (
    <DataTable
      columns={auditColumns}
      data={data}
      title={title}
      searchPlaceholder={searchPlaceholder}
      maxHeight={maxHeight}
      searchable={true}
      filterable={true}
      exportable={true}
    />
  );
}
