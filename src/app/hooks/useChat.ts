"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ChatMessage } from "@/app/types/chat";

interface UseChatOptions {
  initialMessages?: ChatMessage[];
  apiEndpoint?: string;
  onError?: (error: Error) => void;
}

export function useChat({
  initialMessages = [],
  apiEndpoint = "/api/chat",
  onError = error => console.error("Chat error:", error),
}: UseChatOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Clean up any ongoing requests when the component unmounts
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Handle sending a message
  const sendMessage = useCallback(
    async (
      content: string,
      options: {
        endpoint?: string;
        additionalData?: Record<string, unknown>;
      } = {}
    ) => {
      if (!content.trim()) return;

      try {
        // Cancel any ongoing request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // Create a new abort controller for this request
        abortControllerRef.current = new AbortController();
        const { signal } = abortControllerRef.current;

        // Create a unique ID for the message
        const userMessageId = crypto.randomUUID();

        // Add user message to the state
        const userMessage: ChatMessage = {
          id: userMessageId,
          type: "user",
          content,
          timestamp: new Date(),
        };

        // Start an empty assistant message to show the loading state
        const assistantMessageId = crypto.randomUUID();
        const assistantMessage: ChatMessage = {
          id: assistantMessageId,
          type: "assistant",
          content: "",
          timestamp: new Date(),
          isStreaming: true,
        };

        setMessages(prev => [...prev, userMessage, assistantMessage]);
        setIsProcessing(true);
        setError(null);

        // Determine which endpoint to use (default or override)
        const endpoint = options.endpoint || apiEndpoint;

        // Create request body with or without the message parameter
        let requestBody: Record<string, unknown> = {};

        // Handle different cases for request body
        if (options.additionalData) {
          // If additionalData contains a 'message' key set to undefined, omit the message parameter
          if (options.additionalData.message === undefined) {
            // Use only the additionalData, excluding the undefined message
            const { message: _, ...restData } = options.additionalData;
            requestBody = { ...restData };
          } else {
            // Use both the message and additionalData
            requestBody = {
              message: content,
              ...options.additionalData,
            };
          }
        } else {
          // No additionalData, just use message
          requestBody = { message: content };
        }

        // Make the API request
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
          signal,
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();

        // Update the assistant message with the response
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  content:
                    data.response ||
                    data.result?.response ||
                    JSON.stringify(data),
                  isStreaming: false,
                  sources: data.sources,
                }
              : msg
          )
        );
      } catch (err) {
        // Only set error if it's not an abort error
        if (err.name !== "AbortError") {
          const error = err instanceof Error ? err : new Error(String(err));
          setError(error);
          onError(error);

          // Add an error message
          setMessages(prev => [
            ...prev.filter(msg => !msg.isStreaming), // Remove any streaming messages
            {
              id: crypto.randomUUID(),
              type: "assistant",
              content:
                "Sorry, there was an error processing your request. Please try again.",
              timestamp: new Date(),
            },
          ]);
        }
      } finally {
        setIsProcessing(false);
      }
    },
    [apiEndpoint, onError]
  );

  // Reset the conversation
  const resetConversation = useCallback(() => {
    setMessages([]);
    setError(null);
    setIsProcessing(false);
  }, []);

  return {
    messages,
    isProcessing,
    error,
    sendMessage,
    resetConversation,
    setMessages, // Expose this for more advanced usage
  };
}
