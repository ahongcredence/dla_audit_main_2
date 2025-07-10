"use client";

import React, { memo, useCallback } from "react";

interface FollowUpSuggestionsProps {
  prompts: string[];
  onSendMessage: (message: string) => void;
  className?: string;
}

const FollowUpSuggestions: React.FC<FollowUpSuggestionsProps> = ({
  prompts,
  onSendMessage,
  className = "",
}) => {
  // Create a stable callback factory to handle clicks
  const createClickHandler = useCallback(
    (prompt: string) => () => {
      onSendMessage(prompt);
    },
    [onSendMessage]
  );

  if (!prompts.length) return null;

  return (
    <div
      className={`mt-4 border-t border-gray-200 pt-4 ${className}`}
      role="region"
      aria-label="Follow-up suggestions"
    >
      <p className="mb-3 text-sm font-medium text-gray-700">
        Continue exploring:
      </p>
      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt, index) => {
          // Create a stable handler for each button
          const handleClick = createClickHandler(prompt);
          return (
            <button
              key={index}
              onClick={handleClick}
              className="inline-flex items-center rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-medium text-sky-700 transition-colors duration-200 hover:bg-sky-100 hover:text-sky-800 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none"
              aria-label={`Ask about: ${prompt}`}
            >
              {prompt}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(FollowUpSuggestions);
