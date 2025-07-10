"use client";

// Common chat message interface that covers both Knowledge Hub and Predict Insight needs
export interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date | string;
  isStreaming?: boolean;
  sources?: {
    [filename: string]: string;
  };
}

// Props for chat input component
export interface ChatInputProps {
  onSubmit: (message: string, type?: "conversation" | "thread") => void;
  disabled?: boolean;
  placeholder?: string;
  inputClassName?: string;
  buttonClassName?: string;
}

// Props for base message bubble component
export interface ChatMessageBubbleProps {
  message: ChatMessage;
  onFeedbackPositive?: () => void;
  onFeedbackNegative?: () => void;
  onSendMessage?: (message: string) => void;
  showFeedback?: boolean;
  showFollowUps?: boolean;
}

// Props for chat container
export interface ChatContainerProps {
  messages: ChatMessage[];
  isProcessing: boolean;
  children?: React.ReactNode;
  welcomeMessage?: React.ReactNode;
  onScrollToBottom?: () => void;
}

// Common feedback data structure
export interface FeedbackData {
  category: string;
  description: string;
  email?: string;
}

// Knowledge Hub specific types
export interface KnowledgeBase {
  label: string;
  id: string;
}

export type KnowledgeHubMessageProps = ChatMessageBubbleProps;

// Predict Insight specific types
export interface PredictInsightMessageProps extends ChatMessageBubbleProps {
  followUpPrompts?: string[];
}

// Service interfaces
export interface ChatService {
  getMessages: () => Promise<ChatMessage[]>;
  sendMessage: (content: string) => Promise<void>;
  addAssistantMessage: (
    content: string,
    isStreaming?: boolean
  ) => Promise<void>;
  updateLastMessage: (
    content: string,
    isStreaming?: boolean,
    sources?: { [filename: string]: string }
  ) => Promise<void>;
  resetConversation: () => Promise<void>;
}
