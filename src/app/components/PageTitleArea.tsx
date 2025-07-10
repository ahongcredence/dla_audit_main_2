"use client";

import React from "react";

import { useLayout } from "./LayoutContext";
import NavIcon from "./icons/NavIcon";

interface PageTitleAreaProps {
  children?: React.ReactNode;
  actions?: React.ReactNode; // Action items like buttons
  title?: string; // Optional direct title prop
  icon?: string; // Optional direct icon prop
}

export default function PageTitleArea({
  children,
  actions,
  title,
  icon,
}: PageTitleAreaProps) {
  // We can use either direct props or get values from context
  const {
    pageTitle: contextTitle,
    pageIcon: contextIcon,
    pageTitleActions: contextActions,
  } = useLayout();

  // Use direct props if provided, otherwise fall back to context
  const displayTitle = title || contextTitle;
  const displayIcon = icon || contextIcon;
  const displayActions = actions || contextActions;

  return (
    <div className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center">
        {displayTitle && (
          <div className="flex items-center">
            {displayIcon && (
              <div className="mr-3">
                <NavIcon
                  name={displayIcon}
                  size={36}
                  className="text-auditinsight-primary"
                />
              </div>
            )}
            <h1 className="text-3xl font-semibold">{displayTitle}</h1>
          </div>
        )}
        {children}
      </div>

      {/* Action items area (buttons, etc.) */}
      {displayActions && (
        <div className="flex items-center space-x-3">{displayActions}</div>
      )}
    </div>
  );
}
