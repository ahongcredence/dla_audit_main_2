import React from "react";

interface RiskIndicatorProps {
  label: string;
  level: "LOW" | "MEDIUM" | "HIGH";
  className?: string;
}

const RiskIndicator: React.FC<RiskIndicatorProps> = ({
  label,
  level,
  className = "",
}) => {
  const getRiskStyles = () => {
    switch (level) {
      case "LOW":
        return {
          background: "bg-green-200",
          text: "text-green-900",
        };
      case "MEDIUM":
        return {
          background: "bg-amber-200",
          text: "text-amber-900",
        };
      case "HIGH":
        return {
          background: "bg-red-200",
          text: "text-red-900",
        };
      default:
        return {
          background: "bg-gray-200",
          text: "text-gray-800",
        };
    }
  };

  const styles = getRiskStyles();

  return (
    <div
      className={`flex items-center justify-between px-2 py-1 ${styles.background} rounded-sm ${className}`}
    >
      <span className="text-sm text-gray-700">{label}</span>
      <span
        className={`text-sm font-bold ${styles.text} rounded-full bg-white px-2 py-0.5`}
      >
        {level}
      </span>
    </div>
  );
};

export default RiskIndicator;
