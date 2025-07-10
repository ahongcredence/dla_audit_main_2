"use client";

import React, { useCallback } from "react";

import clsx from "clsx";

import { KnowledgeBase } from "@/app/types/chat";

// Define different color schemes for buttons with predefined Tailwind classes
const buttonColors = [
  {
    selected: "bg-gradient-to-br from-sky-900 to-sky-700 text-white",
    unselected: "bg-sky-100 text-sky-900 hover:bg-sky-200",
  },
  {
    selected: "bg-gradient-to-br from-teal-900 to-teal-700 text-white",
    unselected: "bg-teal-100 text-teal-900 hover:bg-teal-200",
  },
  {
    selected: "bg-gradient-to-br from-green-900 to-green-700 text-white",
    unselected: "bg-green-100 text-green-900 hover:bg-green-200",
  },
  {
    selected: "bg-gradient-to-br from-yellow-900 to-yellow-700 text-white",
    unselected: "bg-yellow-100 text-yellow-900 hover:bg-yellow-200",
  },
  {
    selected: "bg-gradient-to-br from-amber-900 to-amber-700 text-white",
    unselected: "bg-amber-100 text-amber-900 hover:bg-amber-200",
  },
  {
    selected: "bg-gradient-to-br from-orange-900 to-orange-700 text-white",
    unselected: "bg-orange-100 text-orange-900 hover:bg-orange-200",
  },
  {
    selected: "bg-gradient-to-br from-indigo-900 to-indigo-700 text-white",
    unselected: "bg-indigo-100 text-indigo-900 hover:bg-indigo-200",
  },
  {
    selected: "bg-gradient-to-br from-cyan-900 to-cyan-700 text-white",
    unselected: "bg-cyan-100 text-cyan-900 hover:bg-cyan-200",
  },
  {
    selected: "bg-gradient-to-br from-fuchsia-900 to-fuchsia-700 text-white",
    unselected: "bg-fuchsia-100 text-fuchsia-900 hover:bg-fuchsia-200",
  },
  {
    selected: "bg-gradient-to-br from-lime-900 to-lime-700 text-white",
    unselected: "bg-lime-100 text-lime-900 hover:bg-lime-200",
  },
];

interface KnowledgeBaseSelectorProps {
  knowledgeBases: KnowledgeBase[];
  selectedKnowledgeBase: string;
  onSelect: (knowledgeBase: KnowledgeBase) => void;
  disabled?: boolean;
  className?: string;
}

const KnowledgeBaseSelector: React.FC<KnowledgeBaseSelectorProps> = ({
  knowledgeBases,
  selectedKnowledgeBase,
  onSelect,
  disabled = false,
  className = "",
}) => {
  const handleSelectKnowledgeBase = useCallback(
    (knowledgeBase: KnowledgeBase) => {
      if (!disabled) {
        onSelect(knowledgeBase);
      }
    },
    [disabled, onSelect]
  );

  if (!knowledgeBases.length) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {knowledgeBases.map((kb, index) => {
        // Get color scheme for this button (cycle through buttonColors array)
        const colorScheme = buttonColors[index % buttonColors.length];
        return (
          <button
            key={kb.id}
            onClick={() => handleSelectKnowledgeBase(kb)}
            className={clsx(
              "text-md rounded-sm px-4",
              "py-2 font-semibold transition-all",
              "duration-200",
              selectedKnowledgeBase === kb.id
                ? `${colorScheme.selected} shadow-md`
                : colorScheme.unselected,
              disabled && "cursor-not-allowed opacity-70"
            )}
            disabled={disabled}
            aria-pressed={selectedKnowledgeBase === kb.id}
            role="radio"
            aria-checked={selectedKnowledgeBase === kb.id}
          >
            {kb.label}
          </button>
        );
      })}
    </div>
  );
};

export default KnowledgeBaseSelector;
