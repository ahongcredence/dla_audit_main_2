"use client";

import React, { memo } from "react";

import { KnowledgeHubMessageProps } from "@/app/types/chat";

import ChatMessageBubble from "../chat/ChatMessageBubble";

const KnowledgeHubMessage: React.FC<KnowledgeHubMessageProps> = ({
  message,
  ...props
}) => {
  // We can extend the base ChatMessageBubble with Knowledge Hub specific features here
  // For now, we're just passing the props through, but we can add knowledge-hub specific
  // formatting or additional features as needed

  return (
    <ChatMessageBubble
      message={message}
      showFeedback={false} // No feedback for knowledge hub messages
      showFollowUps={false} // No follow-ups for knowledge hub messages
      {...props}
    />
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(KnowledgeHubMessage);
