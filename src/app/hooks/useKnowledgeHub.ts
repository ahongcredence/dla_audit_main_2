"use client";

import { useCallback, useState } from "react";

import { ChatMessage, KnowledgeBase } from "@/app/types/chat";

import { useChat } from "./useChat";

interface UseKnowledgeHubOptions {
  initialMessages?: ChatMessage[];
  initialKnowledgeBases?: KnowledgeBase[];
  initialSelectedBase?: string;
  apiEndpoint?: string;
}

export function useKnowledgeHub({
  initialMessages = [],
  initialKnowledgeBases = [],
  initialSelectedBase = "",
  apiEndpoint = "/api/knowledge-hub",
}: UseKnowledgeHubOptions = {}) {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>(
    initialKnowledgeBases
  );
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] =
    useState<string>(initialSelectedBase);
  const [validationError, setValidationError] = useState<string>("");

  // Use the base chat hook with knowledge hub specifics
  const chat = useChat({
    initialMessages,
    apiEndpoint,
  });

  // Extract stable functions from chat to avoid dependency cycles
  const {
    sendMessage: chatSendMessage,
    isProcessing,
    messages,
    resetConversation,
    error,
    setMessages,
  } = chat;

  // Handle knowledge base selection
  const handleKnowledgeBaseSelect = useCallback(
    (knowledgeBase: KnowledgeBase) => {
      // Only clear messages if we're changing to a different knowledge base
      if (selectedKnowledgeBase !== knowledgeBase.id) {
        resetConversation(); // Clear chat messages when switching repositories
      }

      setSelectedKnowledgeBase(knowledgeBase.id);
      setValidationError(""); // Clear validation error when knowledge base is selected
      console.log(
        "Selected Knowledge Base:",
        knowledgeBase.label,
        "ID:",
        knowledgeBase.id
      );
    },
    [selectedKnowledgeBase, resetConversation]
  );

  // Override the base sendMessage to include knowledge base ID
  const sendMessage = useCallback(
    async (query: string) => {
      // Clear any previous validation errors
      setValidationError("");

      if (!selectedKnowledgeBase) {
        setValidationError(
          "Please select a knowledge base before submitting your query."
        );
        console.error("No knowledge base selected");
        return;
      }

      console.log("Knowledge Hub search query:", query);
      console.log("Selected Knowledge Base ID:", selectedKnowledgeBase);

      try {
        await chatSendMessage(query, {
          endpoint: apiEndpoint,
          additionalData: {
            // The API expects 'query' instead of 'message'
            query: query,
            knowledge_base_id: selectedKnowledgeBase,
            // Remove the default 'message' parameter
            message: undefined,
          },
        });
      } catch (error) {
        console.error("Error calling Knowledge Hub API:", error);
        setValidationError(
          "Error communicating with the knowledge base. Please try again."
        );
      }
    },
    [selectedKnowledgeBase, chatSendMessage, apiEndpoint]
  );

  return {
    messages,
    isProcessing,
    error,
    setMessages,
    resetConversation,
    knowledgeBases,
    setKnowledgeBases,
    selectedKnowledgeBase,
    setSelectedKnowledgeBase,
    handleKnowledgeBaseSelect,
    sendMessage,
    validationError,
    setValidationError,
  };
}
