import React from "react";

import clsx from "clsx";

interface SectionHeaderProps {
  title: string;
  icon: React.ReactNode;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  icon,
  className = "",
}) => {
  return (
    <h4
      className={clsx(
        "text-auditinsight-primary flex border-gray-300",
        "items-center gap-1.5 border-b",
        "pb-0.5 text-sm font-bold",
        className
      )}
    >
      <span className="rounded-full border border-gray-300 bg-white p-0.5 text-blue-900">
        {icon}
      </span>
      {title}
    </h4>
  );
};

export default SectionHeader;
