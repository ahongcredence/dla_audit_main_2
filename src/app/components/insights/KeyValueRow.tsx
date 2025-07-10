import React from "react";

import clsx from "clsx";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

interface KeyValueRowProps {
  label: string;
  value: string | React.ReactNode;
  valueClassName?: string;
  className?: string;
  valueColor?: "primary" | "green" | "yellow" | "red" | "blue" | "default";
  showIcon?: boolean;
}

const KeyValueRow: React.FC<KeyValueRowProps> = ({
  label,
  value,
  valueClassName,
  className = "",
  valueColor = "default",
  showIcon = true,
}) => {
  // Determine which icon to show based on the value
  const renderIcon = () => {
    if (!showIcon || typeof value !== "string") return null;

    const lowerValue = value.toLowerCase();

    // Special case for "Status" where "Complete" is positive
    if (label === "Status:" && lowerValue === "complete") {
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
    // Only process string values
    if (typeof value !== "string") {
      return valueClassName || "font-semibold text-blue-900";
    }

    // Check if value is a percentage
    const isPercentage = value.includes("%");

    // Special cases for specific fields
    if (label === "Status:" && value === "Complete") {
      return "font-semibold text-green-900";
    }

    // Handle percentages
    if (isPercentage) {
      const numValue = parseInt(value.replace("%", ""));
      if (numValue >= 80) return "font-semibold text-green-900";
      if (numValue >= 50) return "font-semibold text-amber-800";
      return "font-semibold text-red-900";
    }

    // Check if value contains negative indicators
    const hasNegativeIndicator =
      value.toLowerCase().includes("incomplete") ||
      value.toLowerCase().includes("fail");

    // Handle negative indicators
    if (hasNegativeIndicator) {
      return "font-semibold text-red-900";
    }

    // Check for positive indicators
    const hasPositiveIndicator =
      value.toLowerCase().includes("clean") ||
      value.toLowerCase().includes("complete") ||
      value.toLowerCase().includes("high");

    // Handle positive indicators
    if (hasPositiveIndicator) {
      return "font-semibold text-green-900";
    }

    // Handle explicit color settings
    if (valueClassName) return valueClassName;

    switch (valueColor) {
      case "primary":
        return "font-semibold text-slate-900";
      case "green":
        return "font-semibold text-green-900";
      case "yellow":
        return "font-semibold text-amber-800";
      case "red":
        return "font-semibold text-red-900";
      case "blue":
        return "font-semibold text-blue-900";
      default:
        return "font-semibold text-slate-900";
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
      <span className="text-gray-700">{label}</span>
      <span className={getValueColorClass()}>
        {typeof value === "string" ? (
          <span className="flex items-center">
            {value}
            {renderIcon()}
          </span>
        ) : (
          value
        )}
      </span>
    </div>
  );
};

export default KeyValueRow;
