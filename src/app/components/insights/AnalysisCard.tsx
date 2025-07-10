import React from "react";

interface AnalysisCardProps {
  type: "info" | "warning" | "success" | "error";
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({
  type,
  title,
  description,
  icon,
  className = "",
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case "info":
        return {
          background: "bg-dla-blue-5",
          border: "border-dla-blue-40",
          titleColor: "text-dla-blue-80",
          descriptionColor: "text-dla-blue-70",
        };
      case "warning":
        return {
          background: "bg-dla-yellow-5",
          border: "border-dla-yellow-40",
          titleColor: "text-dla-yellow-80",
          descriptionColor: "text-dla-yellow-70",
        };
      case "success":
        return {
          background: "bg-wds-green-5",
          border: "border-wds-green-40",
          titleColor: "text-wds-green-80",
          descriptionColor: "text-wds-green-70",
        };
      case "error":
        return {
          background: "bg-dla-red-5",
          border: "border-dla-red-40",
          titleColor: "text-dla-red-80",
          descriptionColor: "text-dla-red-70",
        };
      default:
        return {
          background: "bg-wds-gray-5",
          border: "border-wds-gray-40",
          titleColor: "text-auditinsight-primary",
          descriptionColor: "text-wds-gray-70",
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div
      className={`p-2 ${styles.background} rounded border-l-4 ${styles.border} ${className}`}
    >
      <div
        className={`text-sm font-semibold ${styles.titleColor} ${icon ? "flex items-center gap-2" : ""}`}
      >
        {icon}
        {title}
      </div>
      <div className={`text-sm ${styles.descriptionColor} mt-1`}>
        {description}
      </div>
    </div>
  );
};

export default AnalysisCard;
