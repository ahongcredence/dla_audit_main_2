"use client";

import React, { useCallback, useEffect, useMemo } from "react";

import { useLayout } from "../components/LayoutContext";
import ChatInput from "../components/chat/ChatInput";
import KnowledgeBaseSelector from "../components/knowledge-hub/KnowledgeBaseSelector";
import KnowledgeHubMessage from "../components/knowledge-hub/KnowledgeHubMessage";
import { useKnowledgeHub } from "../hooks/useKnowledgeHub";
import { KnowledgeBase } from "../types/chat";

export default function KnowledgeHubPage() {
  const {
    setPageTitle,
    setPageIcon,
    setPageTitleActions,
    setPageFooterContent,
  } = useLayout();

  // Define the available knowledge bases
  const knowledgeBasesList = [
    { label: "FIAR", id: "YSX8MVXUTA" },
    { label: "FMR", id: "XKNMK7LV20" },
    { label: "AFR", id: "VJ0U8U5MAD" },
    { label: "Yellow Book", id: "PFBYLSRORM" },
  ];

  // Use our custom hook for Knowledge Hub functionality
  const {
    messages,
    isProcessing,
    sendMessage,
    handleKnowledgeBaseSelect,
    selectedKnowledgeBase,
    validationError,
  } = useKnowledgeHub({
    initialKnowledgeBases: knowledgeBasesList,
    initialSelectedBase: knowledgeBasesList[0].id,
  });

  // Create stable callbacks to prevent recreation on every render
  const handleSelect = useCallback(
    (kb: KnowledgeBase) => {
      handleKnowledgeBaseSelect(kb);
    },
    [handleKnowledgeBaseSelect]
  );

  const handleSubmit = useCallback(
    (query: string) => {
      sendMessage(query);
    },
    [sendMessage]
  );

  // Memoize knowledge base buttons for PageTitleArea actions to prevent infinite renders
  const knowledgeBaseButtons = useMemo(
    () => (
      <KnowledgeBaseSelector
        knowledgeBases={knowledgeBasesList}
        selectedKnowledgeBase={selectedKnowledgeBase}
        onSelect={handleSelect}
        disabled={isProcessing}
      />
    ),
    [selectedKnowledgeBase, isProcessing, handleSelect]
  );

  // Memoize the knowledge hub input component for the footer to prevent infinite renders
  const knowledgeHubInputComponent = useMemo(
    () => (
      <div className="flex-1">
        <ChatInput
          onSubmit={handleSubmit}
          disabled={isProcessing || !selectedKnowledgeBase}
          placeholder={
            selectedKnowledgeBase
              ? "Ask about your documents, policies, or any content..."
              : "Please select a knowledge base above to start"
          }
        />
        {/* Validation Error Display */}
        {validationError && (
          <div className="mt-2">
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-2">
              <p className="flex items-center text-sm font-medium text-amber-700">
                <svg
                  className="mr-2 h-4 w-4 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                {validationError}
              </p>
            </div>
          </div>
        )}
      </div>
    ),
    [selectedKnowledgeBase, isProcessing, validationError, handleSubmit]
  );

  // Set page title and icon
  useEffect(() => {
    setPageTitle("Knowledge Hub");
    setPageIcon("knowledgehub");

    // Clean up when component unmounts
    return () => {
      setPageTitle("");
      setPageIcon("");
    };
  }, [setPageTitle, setPageIcon]);

  // Separate effect for title actions
  useEffect(() => {
    setPageTitleActions(knowledgeBaseButtons);

    return () => {
      setPageTitleActions(null);
    };
  }, [setPageTitleActions, knowledgeBaseButtons]);

  // Handle footer content with useCallback to avoid render loops
  const updateFooterContent = useCallback(() => {
    setPageFooterContent(knowledgeHubInputComponent);
  }, [setPageFooterContent, knowledgeHubInputComponent]);

  // Set footer content on mount and clean up on unmount - no dependencies
  useEffect(() => {
    updateFooterContent();

    return () => {
      setPageFooterContent(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative flex flex-col">
      {/* Messages Section - Flexible height area */}
      <div className="scrollbar-hide flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-4xl">
          {/* Welcome message when no messages */}
          {messages.length === 0 && !isProcessing && (
            <div className="flex min-h-[50vh] flex-col items-center justify-center py-12 text-center">
              <div className="mb-6 rounded-full bg-gradient-to-br from-sky-900 to-sky-700 p-4">
                <svg
                  className="h-12 w-12 text-sky-100"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h2 className="mb-2 text-2xl font-semibold text-gray-800">
                Welcome to Knowledge Hub
              </h2>
              <p className="max-w-md text-gray-600">
                Select a knowledge base and ask a question to get started. Your
                conversation will appear here.
              </p>
            </div>
          )}

          {/* Messages display */}
          {messages.map(message => (
            <KnowledgeHubMessage key={message.id} message={message} />
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
      {/* Footer is managed through MainContentWrapper via context */}
    </div>
  );
}
