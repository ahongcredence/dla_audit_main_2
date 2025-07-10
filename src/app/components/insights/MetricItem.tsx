import React from "react";

import clsx from "clsx";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

interface MetricItemProps {
  label: string;
  value: string | number;
  valueColor?: "primary" | "green" | "yellow" | "red" | "blue" | "default";
  className?: string;
  showIcon?: boolean;
}

const MetricItem: React.FC<MetricItemProps> = ({
  label,
  value,
  valueColor = "default",
  className = "",
  showIcon = true,
}) => {
  // Determine which icon to show based on the value
  const renderIcon = () => {
    if (!showIcon || typeof value !== "string") return null;

    const lowerValue = value.toLowerCase();

    // Special case for "Manual Overrides" which should be blue
    if (label === "Manual Overrides" && lowerValue === "none") {
      return <CheckCircle size={16} className="ml-1 text-blue-900" />;
    }

    // Special case for "CAP Recommended" where "No" is positive
    if (label === "CAP Recommended" && lowerValue === "no") {
      return <CheckCircle size={16} className="ml-1 text-green-900" />;
    }

    // Special case for "Anomaly Flag" where "None" is positive
    if (label === "Anomaly Flag" && lowerValue === "none") {
      return <CheckCircle size={16} className="ml-1 text-green-900" />;
    }

    // General cases
    if (
      lowerValue === "clean" ||
      lowerValue === "complete" ||
      lowerValue === "none" ||
      lowerValue === "no"
    ) {
      return <CheckCircle size={16} className="ml-1 text-green-900" />;
    } else if (lowerValue === "incomplete" || lowerValue === "partial") {
      return <AlertCircle size={16} className="ml-1 text-amber-800" />;
    } else if (
      lowerValue === "fail" ||
      lowerValue === "failed" ||
      lowerValue === "yes"
    ) {
      return <XCircle size={16} className="ml-1 text-red-900" />;
    }

    return null;
  };
  const getValueColorClass = () => {
    // Check if value is a percentage
    const isPercentage = typeof value === "string" && value.includes("%");

    // Special cases for specific fields
    if (typeof value === "string") {
      const lowerValue = value.toLowerCase();

      // Special case for "Manual Overrides"
      if (label === "Manual Overrides" && lowerValue === "none") {
        return "text-blue-900 font-bold";
      }

      // Special case for "CAP Recommended" where "No" is positive
      if (label === "CAP Recommended" && lowerValue === "no") {
        return "text-green-900 font-bold";
      }

      // Special case for "Anomaly Flag" where "None" is positive
      if (label === "Anomaly Flag" && lowerValue === "none") {
        return "text-green-900 font-bold";
      }
    }

    // Handle percentages
    if (isPercentage) {
      const numValue = parseInt(value.replace("%", ""));
      if (numValue >= 80) return "text-green-900 font-bold";
      if (numValue >= 50) return "text-amber-800 font-bold";
      return "text-red-900 font-bold";
    }

    // Check if value contains negative indicators
    const hasNegativeIndicator =
      typeof value === "string" &&
      (value.toLowerCase().includes("incomplete") ||
        value.toLowerCase().includes("fail"));

    // Handle negative indicators
    if (hasNegativeIndicator) {
      return "text-red-900 font-bold";
    }

    // Check for positive indicators
    const hasPositiveIndicator =
      typeof value === "string" &&
      (value.toLowerCase().includes("clean") ||
        value.toLowerCase().includes("complete"));

    // Handle positive indicators
    if (hasPositiveIndicator) {
      return "text-green-900 font-bold";
    }

    // Handle explicit color settings
    switch (valueColor) {
      case "primary":
        return "text-slate-900 font-bold";
      case "green":
        return "text-green-900 font-bold";
      case "yellow":
        return "text-amber-800 font-bold";
      case "red":
        return "text-red-900 font-bold";
      case "blue":
        return "text-blue-900 font-bold";
      default:
        return "text-slate-900 font-bold";
    }
  };

  return (
    <div
      className={clsx(
        "hover:bg-gray-100",
        "flex items-center justify-between",
        "rounded-sm px-1 py-0.5",
        "transition-colors duration-200",
        className
      )}
    >
      <div className="text-sm text-gray-700">{label}</div>
      <div className={`text-base ${getValueColorClass()} flex items-center`}>
        {value}
        {renderIcon()}
      </div>
    </div>
  );
};

export default MetricItem;
