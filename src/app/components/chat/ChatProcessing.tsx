"use client";

import React from "react";

interface ChatProcessingProps {
  message?: string;
}

const ChatProcessing: React.FC<ChatProcessingProps> = ({
  message = "Processing your request...",
}) => {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="flex flex-col items-center gap-2">
        <div className="flex animate-pulse space-x-2">
          <div className="h-2 w-2 rounded-full bg-sky-600"></div>
          <div className="h-2 w-2 rounded-full bg-sky-600"></div>
          <div className="h-2 w-2 rounded-full bg-sky-600"></div>
        </div>
        {message && (
          <p className="text-sm text-gray-500" aria-live="polite">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatProcessing;
