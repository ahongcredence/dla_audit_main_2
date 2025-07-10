"use client";

import React, { useEffect, useRef } from "react";

import ChatProcessing from "@/app/components/chat/ChatProcessing";
import { ChatContainerProps } from "@/app/types/chat";

const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  isProcessing,
  children,
  welcomeMessage,
  onScrollToBottom,
}) => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesContainerRef.current) {
      const scrollContainer = messagesContainerRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
      onScrollToBottom?.();
    }
  }, [messages, onScrollToBottom]);

  return (
    <div className="relative flex h-full flex-col">
      {/* Messages Section - Flexible height area */}
      <div
        ref={messagesContainerRef}
        className="scrollbar-hide flex-1 overflow-y-auto"
        role="region"
        aria-label="Chat messages"
        aria-live="polite"
        aria-atomic="false"
      >
        <div className="mx-auto w-full max-w-4xl">
          {/* Welcome message when no messages */}
          {messages.length === 0 && !isProcessing && welcomeMessage}

          {/* Messages display - this is rendered by the parent component */}
          {messages.map((message, index) => (
            <div
              key={message.id || index}
              data-message-type={message.type}
              data-message-index={index}
            >
              {children}
            </div>
          ))}

          {/* Processing indicator */}
          {isProcessing && <ChatProcessing />}
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
