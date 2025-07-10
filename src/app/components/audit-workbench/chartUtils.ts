//import auditData from "../../data/auditTableSmall.json";
import auditData from "../../data/auditTable.json";

// Color schemes using Tailwind colors
export const COLORS = {
  auditinsight: {
    primary: "#182851", // Keep primary
    secondary: "#1d8da7", // Keep secondary
    variants: ["#182851", "#1d8da7", "#46577f", "#6ac8cf"],
  },
  dla: {
    red: "#ef4444", // Tailwind red-500
    blue: "#3b82f6", // Tailwind blue-500
    yellow: "#eab308", // Tailwind yellow-500
    variants: ["#ef4444", "#3b82f6", "#eab308"],
  },
  wds: {
    red: "#ef4444", // Tailwind red-500
    yellow: "#eab308", // Tailwind yellow-500
    green: "#22c55e", // Tailwind green-500
    variants: ["#ef4444", "#eab308", "#22c55e", "#3b82f6"],
  },
};

// Process CAP Status data
export const processCapStatusData = () => {
  const statusCounts: Record<string, number> = {};

  auditData.forEach(item => {
    const status = item["CAP Status"];
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  // Gradient colors for pie chart segments - now using tailwind gradients
  const gradientColors = [
    "var(--gradient-audit-primary-radial)", // Keep primary
    "var(--gradient-audit-secondary-radial)", // Keep secondary
    "var(--gradient-audit-blue-light-radial)", // Keep primary-based
    "var(--gradient-audit-teal-light-radial)", // Keep secondary-based
  ];

  return Object.entries(statusCounts).map(([name, value], index) => ({
    name,
    value,
    color: gradientColors[index % gradientColors.length],
  }));
};

// Process Root Cause Category data
export const processRootCauseData = () => {
  const causeCounts: Record<string, number> = {};

  auditData.forEach(item => {
    const cause = item["Root Cause Category"];
    if (cause && cause.trim()) {
      causeCounts[cause] = (causeCounts[cause] || 0) + 1;
    }
  });

  // Sort by count (descending) for better visualization
  const sortedEntries = Object.entries(causeCounts).sort(
    ([, a], [, b]) => b - a
  );

  // Use more subtle horizontal gradients for bar chart using Tailwind colors
  const barGradients = [
    "linear-gradient(90deg, #1e40af, #3b82f6)", // blue-800 to blue-500
    "linear-gradient(90deg, #0e7490, #06b6d4)", // cyan-800 to cyan-500
    "linear-gradient(90deg, #166534, #22c55e)", // green-800 to green-500
    "linear-gradient(90deg, #9f1239, #f43f5e)", // rose-800 to rose-500
  ];

  return sortedEntries.map(([name, value], index) => ({
    name,
    value,
    color: barGradients[index % barGradients.length],
  }));
};

// Process Remediation Priority data
export const processRemediationPriorityData = () => {
  const priorityCounts: Record<string, number> = {};

  auditData.forEach(item => {
    const priority = item["Remediation Priority"];
    priorityCounts[priority] = (priorityCounts[priority] || 0) + 1;
  });

  // Define priority order based on urgency level (numerical priority)
  const priorityOrder = ["High", "Medium", "Low"];

  // Map priorities to gradient colors (darker gradients for higher priority) - using tailwind-based gradients
  const priorityColorMap: Record<string, string> = {
    High: "var(--gradient-audit-primary-radial)", // Keep primary
    Medium: "var(--gradient-audit-blue-light-radial)", // Keep primary-based
    Low: "var(--gradient-audit-secondary-radial)", // Keep secondary
  };

  // Return data ordered by numerical priority (High=1, Medium=2, Low=3)
  return priorityOrder
    .filter(priority => priorityCounts[priority] > 0)
    .map(priority => ({
      name: priority,
      value: priorityCounts[priority],
      color:
        priorityColorMap[priority] || "var(--gradient-audit-primary-radial)",
    }));
};

// Process Issue Age data
export const processIssueAgeData = () => {
  const ageRanges = {
    "0-30 days": 0,
    "31-90 days": 0,
    "91-180 days": 0,
    "180+ days": 0,
  };

  auditData.forEach(item => {
    const age = item["Age (Days)"];
    if (age <= 30) {
      ageRanges["0-30 days"]++;
    } else if (age <= 90) {
      ageRanges["31-90 days"]++;
    } else if (age <= 180) {
      ageRanges["91-180 days"]++;
    } else {
      ageRanges["180+ days"]++;
    }
  });

  return Object.entries(ageRanges).map(([name, value]) => ({
    name,
    value,
  }));
};

// Calculate summary metrics for audit cards
export const calculateAuditSummaryMetrics = () => {
  const totalIssues = auditData.length;

  const totalImpact = auditData.reduce((sum, item) => {
    return sum + item["Total $ Impact"];
  }, 0);

  const averageConfidence =
    auditData.reduce((sum, item) => {
      return sum + item["Confidence Score"];
    }, 0) / auditData.length;

  const issuesWithNFR = auditData.filter(
    item => item["NFR Reference"] && item["NFR Reference"].trim() !== ""
  ).length;
  const nfrCoverage = (issuesWithNFR / totalIssues) * 100;

  return {
    totalIssues,
    totalImpact,
    averageConfidence: averageConfidence * 100, // Convert to percentage
    nfrCoverage,
  };
};
