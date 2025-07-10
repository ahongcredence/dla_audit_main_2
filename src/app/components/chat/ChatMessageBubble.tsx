"use client";

import React, { memo, useCallback } from "react";

import Image from "next/image";

import { ThumbsDown, ThumbsUp, User2 } from "lucide-react";

import { ChatMessageBubbleProps } from "@/app/types/chat";

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
  message,
  onFeedbackPositive,
  onFeedbackNegative,
  showFeedback = false,
}) => {
  const [feedbackType, setFeedbackType] = React.useState<
    "positive" | "negative" | null
  >(null);

  // Format timestamp for display - memoized to prevent recreation on every render
  const formatTime = useCallback((timestamp: Date | string): string => {
    if (timestamp instanceof Date) {
      return timestamp.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return typeof timestamp === "string" ? timestamp : "";
  }, []);

  // Memoize feedback handlers to prevent unnecessary re-renders
  const handlePositiveFeedback = useCallback(() => {
    setFeedbackType("positive");
    if (onFeedbackPositive) onFeedbackPositive();
  }, [onFeedbackPositive]);

  const handleNegativeFeedback = useCallback(() => {
    setFeedbackType("negative");
    if (onFeedbackNegative) onFeedbackNegative();
  }, [onFeedbackNegative]);

  return (
    <div className="mb-6">
      <div
        className={`flex ${
          message.type === "user" ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`w-full rounded-sm px-4 py-4 shadow-lg ${
            message.type === "user"
              ? "bg-gradient-to-br from-sky-900 to-sky-700 text-white"
              : "bg-white text-gray-800"
          }`}
          role="listitem"
          aria-label={`${message.type === "assistant" ? "Assistant" : "User"} message`}
          aria-live={message.isStreaming ? "polite" : "off"}
        >
          {/* Message Header */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  message.type === "user" ? "bg-sky-800" : ""
                }`}
              >
                {message.type === "assistant" ? (
                  <Image
                    src="/albertFace.svg"
                    alt="Albert Logo"
                    height={100}
                    width={100}
                    className=""
                    title="Albert Logo"
                  />
                ) : (
                  <User2 size={16} className="text-white" />
                )}
              </div>
              <div className="flex flex-col">
                <span
                  className={`text-sm font-medium ${
                    message.type === "user" ? "text-sky-100" : "text-gray-600"
                  }`}
                >
                  {message.type === "assistant" ? "Albert" : "Jane Doe"}
                </span>
                {message.timestamp && (
                  <span
                    className={`text-xs ${
                      message.type === "user" ? "text-sky-200" : "text-gray-400"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </span>
                )}
              </div>
            </div>

            {/* Feedback buttons for assistant messages */}
            {message.type === "assistant" && showFeedback && (
              <div className="flex gap-1">
                <button
                  className="rounded p-1 transition-colors hover:bg-gray-100"
                  aria-label="Positive feedback"
                  onClick={handlePositiveFeedback}
                >
                  <ThumbsUp
                    size={16}
                    color="#33698A"
                    fill={feedbackType === "positive" ? "#33698A" : "none"}
                  />
                </button>
                <button
                  className="rounded p-1 transition-colors hover:bg-gray-100"
                  aria-label="Negative feedback"
                  onClick={handleNegativeFeedback}
                >
                  <ThumbsDown
                    size={16}
                    color="#33698A"
                    fill={feedbackType === "negative" ? "#33698A" : "none"}
                  />
                </button>
              </div>
            )}
          </div>

          {/* Message Content */}
          <div
            className={`leading-relaxed ${
              message.type === "user" ? "text-white" : "text-gray-800"
            }`}
          >
            {message.isStreaming &&
            message.type === "assistant" &&
            message.content.trim().length === 0 ? (
              <span className="text-gray-500 italic">
                Assistant is thinking...
              </span>
            ) : message.type === "assistant" ? (
              <div
                className="whitespace-pre-wrap"
                dangerouslySetInnerHTML={{
                  __html: message.content,
                }}
              />
            ) : (
              <div className="whitespace-pre-wrap">{message.content}</div>
            )}
            {message.isStreaming && message.type === "assistant" && (
              <span className="sr-only">Message is being typed</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Apply memo to prevent unnecessary re-renders
export default memo(ChatMessageBubble);
