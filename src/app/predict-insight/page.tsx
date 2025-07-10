"use client";

import React, { useCallback, useEffect, useMemo } from "react";

import Image from "next/image";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useLayout } from "@/app/components/LayoutContext";
import ChatInput from "@/app/components/chat/ChatInput";
import PredictInsightMessage from "@/app/components/predict-insight/PredictInsightMessage";
import { usePredictInsight } from "@/app/hooks/usePredictInsight";
import ChatModals from "@/app/predict-insight/ChatModals";

// Create a client
const queryClient = new QueryClient();

// Main Predict Insight Page component
function PredictInsightPage() {
  const { setPageTitle, setPageIcon, setPageFooterContent } = useLayout();

  // Use our custom hook for Predict Insight functionality
  const {
    messages,
    isProcessing,
    sendMessage,
    getFollowUpPrompts,
    handlePositiveFeedback,
    handleNegativeFeedback,
    handleFeedbackSubmit,
    isFeedbackModalOpen,
    isAboutModalOpen,
    closeFeedbackModal,
    closeAboutModal,
  } = usePredictInsight();

  // Memoize the input component for the footer to prevent infinite renders
  // Using function reference instead of inline function to prevent recreating the function on each render
  const handleSubmit = useCallback(
    (content: string) => sendMessage(content),
    [sendMessage]
  );

  const predictInsightInputComponent = useMemo(
    () => (
      <div className="flex-1">
        <ChatInput
          onSubmit={handleSubmit}
          disabled={isProcessing}
          placeholder="Predict Insight..."
        />
      </div>
    ),
    [isProcessing, handleSubmit]
  );

  // Separate effects to prevent render loops - title and icon rarely change
  useEffect(() => {
    setPageTitle("Predict Insight");
    setPageIcon("predictinsight");

    // Clean up when component unmounts
    return () => {
      setPageTitle("");
      setPageIcon("");
    };
  }, [setPageTitle, setPageIcon]);

  // Handle footer content with useCallback to avoid render loops
  const updateFooterContent = useCallback(() => {
    setPageFooterContent(predictInsightInputComponent);
  }, [setPageFooterContent, predictInsightInputComponent]);

  // Set footer content on mount and clean up on unmount - no dependencies
  useEffect(() => {
    updateFooterContent();

    return () => {
      setPageFooterContent(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Create stable handlers for example queries
  const handleExampleQuery1 = useCallback(() => {
    sendMessage(
      "Show me all disbursements over $50,000 that are weakly linked or flagged as Potential NFR."
    );
  }, [sendMessage]);

  const handleExampleQuery2 = useCallback(() => {
    sendMessage(
      "Are there similar issues in the $50K–$100K range that also show these audit risk signals?"
    );
  }, [sendMessage]);

  // Welcome message for empty state - memoized to prevent rerenders
  const welcomeMessage = useMemo(
    () => (
      <div className="flex min-h-[50vh] flex-col items-center justify-center py-12 text-center">
        <div
          className="mb-6 flex items-center justify-center text-sky-600"
          title="Albert Logo"
        >
          <Image
            src="/albertFace.svg"
            alt="Albert Logo"
            height={100}
            width={100}
            className=""
            title="Albert Logo"
          />
        </div>
        <h2 className="mb-2 text-2xl font-semibold text-gray-800">
          Welcome to Predict Insight
        </h2>
        <p className="mb-8 max-w-md text-gray-600">
          Ask a question to get started. Your conversation will appear here.
        </p>

        {/* Example Query Buttons */}
        <div className="w-full max-w-4xl">
          <p className="mb-4 text-sm font-medium text-gray-700">
            Try one of these example queries:
          </p>
          <div className="flex flex-row gap-4">
            <button
              onClick={handleExampleQuery1}
              className="flex-1 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-left text-sm font-medium text-sky-700 transition-colors duration-200 hover:bg-sky-100 hover:text-sky-800 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none"
            >
              Show me all disbursements over $50,000 that are weakly linked or
              flagged as Potential NFR.
            </button>
            <button
              onClick={handleExampleQuery2}
              className="flex-1 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-left text-sm font-medium text-sky-700 transition-colors duration-200 hover:bg-sky-100 hover:text-sky-800 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none"
            >
              Are there similar issues in the $50K–$100K range that also show
              these audit risk signals?
            </button>
          </div>
        </div>
      </div>
    ),
    [handleExampleQuery1, handleExampleQuery2]
  );

  return (
    <div className="relative flex h-full flex-col">
      {/* Modals */}
      <ChatModals
        isFeedbackModalOpen={isFeedbackModalOpen}
        isAboutModalOpen={isAboutModalOpen}
        onCloseFeedbackModal={closeFeedbackModal}
        onCloseAboutModal={closeAboutModal}
        onFeedbackSubmit={handleFeedbackSubmit}
      />

      {/* Messages Section */}
      <div className="scrollbar-hide flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-4xl px-4">
          {/* Welcome message when empty */}
          {messages.length === 0 && !isProcessing && welcomeMessage}

          {/* Message bubbles */}
          {messages.map(message => (
            <PredictInsightMessage
              key={message.id}
              message={message}
              onSendMessage={sendMessage}
              onFeedbackPositive={() => handlePositiveFeedback(message.id)}
              onFeedbackNegative={() => handleNegativeFeedback(message.id)}
              showFeedback={
                message.type === "assistant" && !message.isStreaming
              }
              showFollowUps={
                message.type === "assistant" && !message.isStreaming
              }
              followUpPrompts={
                message.type === "assistant" ? getFollowUpPrompts() : []
              }
            />
          ))}

          {/* Processing indicator */}
          {isProcessing && (
            <div className="flex items-center justify-center py-4">
              <div className="flex animate-pulse space-x-2">
                <div className="h-2 w-2 rounded-full bg-sky-600"></div>
                <div className="h-2 w-2 rounded-full bg-sky-600"></div>
                <div className="h-2 w-2 rounded-full bg-sky-600"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Wrap the component with QueryClientProvider
export default function PredictInsightPageWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <PredictInsightPage />
    </QueryClientProvider>
  );
}
