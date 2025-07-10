"use client";

import React from "react";

import { useLayout } from "./LayoutContext";

interface PageFooterAreaProps {
  children?: React.ReactNode;
  content?: React.ReactNode; // Direct content prop
}

export default function PageFooterArea({
  children,
  content,
}: PageFooterAreaProps) {
  // We can use either direct props or get values from context
  const { pageFooterContent: contextContent } = useLayout();

  // Use direct props if provided, otherwise fall back to context
  const displayContent = content || contextContent;

  return (
    <div className="sticky bottom-0 z-10 w-full border-t border-gray-200 bg-white px-6 py-4 shadow-md">
      <div className="mx-auto w-full max-w-4xl">
        {displayContent && (
          <div className="flex items-center">{displayContent}</div>
        )}
        {children}
      </div>
    </div>
  );
}
