"use client";

import React, { memo, useCallback } from "react";

import { PredictInsightMessageProps } from "@/app/types/chat";

import ChatMessageBubble from "../chat/ChatMessageBubble";
import FollowUpSuggestions from "./FollowUpSuggestions";
import FormattedMarkdown from "./FormattedMarkdown";

const PredictInsightMessage: React.FC<PredictInsightMessageProps> = ({
  message,
  onSendMessage,
  followUpPrompts = [],
  ...props
}) => {
  // Create stable callbacks at the component level
  const handleSendMessage = useCallback(
    (prompt: string) => {
      if (onSendMessage) onSendMessage(prompt);
    },
    [onSendMessage]
  );

  const handlePositiveFeedback = useCallback(() => {
    if (props.onFeedbackPositive) props.onFeedbackPositive();
  }, [props.onFeedbackPositive]);

  const handleNegativeFeedback = useCallback(() => {
    if (props.onFeedbackNegative) props.onFeedbackNegative();
  }, [props.onFeedbackNegative]);

  // For assistant messages, we want to render the content using FormattedMarkdown
  // and add follow-up suggestions
  if (message.type === "assistant" && !message.isStreaming) {
    return (
      <div className="mb-6">
        <div className="flex justify-start">
          <div
            className="w-full rounded-sm bg-white px-4 py-4 text-slate-800 shadow-lg"
            role="listitem"
            aria-label="Assistant message"
          >
            {/* Message Header */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                  <div className="text-sm font-bold text-gray-600">A</div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-600">
                    Albert
                  </span>
                  {message.timestamp && (
                    <span className="text-xs text-gray-400">
                      {typeof message.timestamp === "string"
                        ? message.timestamp
                        : message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                    </span>
                  )}
                </div>
              </div>

              {/* Feedback buttons */}
              {props.showFeedback &&
                props.onFeedbackPositive &&
                props.onFeedbackNegative && (
                  <div className="flex gap-1">
                    <button
                      className="rounded p-1 transition-colors hover:bg-gray-100"
                      aria-label="Positive feedback"
                      onClick={handlePositiveFeedback}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#33698A"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7 10v12" />
                        <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                      </svg>
                    </button>
                    <button
                      className="rounded p-1 transition-colors hover:bg-gray-100"
                      aria-label="Negative feedback"
                      onClick={handleNegativeFeedback}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#33698A"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17 14V2" />
                        <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
                      </svg>
                    </button>
                  </div>
                )}
            </div>

            {/* Message Content with FormattedMarkdown */}
            <div className="leading-relaxed text-gray-800">
              <FormattedMarkdown content={message.content} />
            </div>

            {/* Follow-up suggestions */}
            {props.showFollowUps &&
              onSendMessage &&
              followUpPrompts.length > 0 && (
                <FollowUpSuggestions
                  prompts={followUpPrompts}
                  onSendMessage={handleSendMessage}
                />
              )}
          </div>
        </div>
      </div>
    );
  }

  // For user messages or streaming assistant messages, use the base ChatMessageBubble
  return (
    <ChatMessageBubble
      message={message}
      onSendMessage={onSendMessage}
      {...props}
    />
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(PredictInsightMessage);
