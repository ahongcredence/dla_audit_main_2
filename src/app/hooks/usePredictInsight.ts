"use client";

import { useCallback, useState } from "react";

import { ChatMessage, FeedbackData } from "@/app/types/chat";

import { useChat } from "./useChat";

interface UsePredictInsightOptions {
  initialMessages?: ChatMessage[];
  apiEndpoint?: string;
}

export function usePredictInsight({
  initialMessages = [],
  apiEndpoint = "/api/predict-insight",
}: UsePredictInsightOptions = {}) {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [feedbackMessageId, setFeedbackMessageId] = useState<string | null>(
    null
  );

  // Use the base chat hook with predict insight specifics
  const chat = useChat({
    initialMessages,
    apiEndpoint,
  });

  // Feedback handlers
  const handlePositiveFeedback = useCallback((messageId: string) => {
    console.log(`Positive feedback for message ${messageId}`);
    // Here we would typically send this feedback to the server
  }, []);

  const handleNegativeFeedback = useCallback((messageId: string) => {
    console.log(`Negative feedback for message ${messageId}`);
    setFeedbackMessageId(messageId);
    setIsFeedbackModalOpen(true);
  }, []);

  const handleFeedbackSubmit = useCallback(
    (data: FeedbackData) => {
      console.log(`Feedback submitted for message ${feedbackMessageId}:`, data);
      // Here we would typically send this feedback to the server
      setIsFeedbackModalOpen(false);
    },
    [feedbackMessageId]
  );

  // Modal handlers
  const openAboutModal = useCallback(() => {
    setIsAboutModalOpen(true);
  }, []);

  const closeAboutModal = useCallback(() => {
    setIsAboutModalOpen(false);
  }, []);

  const closeFeedbackModal = useCallback(() => {
    setIsFeedbackModalOpen(false);
  }, []);

  // Extract stable functions from chat to avoid dependency cycles
  const {
    sendMessage: chatSendMessage,
    isProcessing,
    messages,
    resetConversation,
    error,
    setMessages,
  } = chat;

  // Override the base sendMessage for predict-insight specific processing
  const sendMessage = useCallback(
    async (
      message: string,
      type: "conversation" | "thread" = "conversation"
    ) => {
      if (type === "conversation") {
        try {
          await chatSendMessage(message, {
            endpoint: apiEndpoint,
            // Explicitly set the message parameter in additionalData
            additionalData: {
              message: message, // Ensure the message parameter is included
            },
          });
        } catch (error) {
          console.error("Error calling Predict Insight API:", error);
        }
      }
    },
    [chatSendMessage, apiEndpoint]
  );

  // Get suggested follow-up prompts based on the last assistant message
  const getFollowUpPrompts = useCallback((count = 6): string[] => {
    // Default prompts if we don't have any messages or customization logic
    const defaultPrompts = [
      "Show vendor risk details",
      "Generate compliance timeline",
      "Review control effectiveness",
      "Analyze cost impact",
      "Create remediation plan",
      "Export findings report",
    ];

    // Here you could add logic to generate context-aware prompts based on the
    // conversation history or the most recent assistant message

    return defaultPrompts.slice(0, count);
  }, []);

  return {
    messages,
    isProcessing,
    error,
    setMessages,
    resetConversation,
    sendMessage,
    getFollowUpPrompts,
    isFeedbackModalOpen,
    isAboutModalOpen,
    feedbackMessageId,
    handlePositiveFeedback,
    handleNegativeFeedback,
    handleFeedbackSubmit,
    openAboutModal,
    closeAboutModal,
    closeFeedbackModal,
  };
}
