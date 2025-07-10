import React from "react";

import SectionHeader from "./SectionHeader";

interface InsightSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const InsightSection: React.FC<InsightSectionProps> = ({
  title,
  icon,
  children,
  className = "",
}) => {
  return (
    <div className={`${className}`}>
      <SectionHeader title={title} icon={icon} className="mb-0.5" />
      <div className="space-y-0.5">{children}</div>
    </div>
  );
};

export default InsightSection;
