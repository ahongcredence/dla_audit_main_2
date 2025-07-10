"use client";

import React, { useEffect, useRef, useState } from "react";

import clsx from "clsx";
import { SendHorizonal } from "lucide-react";

import { ChatInputProps } from "@/app/types/chat";

const ChatInput: React.FC<ChatInputProps> = ({
  onSubmit,
  disabled = false,
  placeholder = "Type a message...",
  inputClassName = "",
  buttonClassName = "",
}) => {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the input when the component mounts
  useEffect(() => {
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [disabled]);

  // Memoize handlers to prevent recreating functions on every input change
  const handleSubmit = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (message.trim() && !disabled) {
        onSubmit(message);
        setMessage("");

        // Refocus the input after sending
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    },
    [message, disabled, onSubmit]
  );

  // Handle keyboard shortcuts - also memoized
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      // Submit on Enter (but not with Shift+Enter for multiline)
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e as unknown as React.FormEvent);
      }
    },
    [handleSubmit]
  );

  // Memoize the change handler
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMessage(e.target.value);
    },
    []
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full"
      aria-label="Chat input form"
    >
      <div
        className={clsx(
          "flex items-center bg-white",
          "border border-gray-200 hover:border-sky-400",
          "focus-within:border-sky-400 focus-within:ring-1 focus-within:ring-sky-400",
          "rounded-sm shadow-sm transition-all duration-200",
          disabled ? "opacity-70" : "",
          inputClassName
        )}
      >
        <label htmlFor="chat-input" className="sr-only">
          Type a message
        </label>
        <input
          id="chat-input"
          ref={inputRef}
          type="text"
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "Please wait..." : placeholder}
          className="flex-grow bg-transparent px-4 py-3 text-lg placeholder-gray-400 outline-none focus:ring-0 focus:outline-none"
          disabled={disabled}
          aria-label="Chat input field"
          aria-describedby={disabled ? "processing-status" : undefined}
        />
        <button
          type="submit"
          title="Send message"
          className={clsx(
            "m-1 rounded-sm p-3 text-white transition-all duration-200",
            message.trim() && !disabled
              ? "cursor-pointer bg-sky-600 hover:bg-sky-700"
              : "cursor-not-allowed bg-gray-300",
            buttonClassName
          )}
          disabled={!message.trim() || disabled}
          aria-label="Submit message"
        >
          <SendHorizonal
            size={22}
            className={message.trim() && !disabled ? "animate-pulse" : ""}
          />
        </button>
      </div>
      {disabled && (
        <div id="processing-status" className="mt-2 text-center text-sm">
          <span className="inline-block animate-pulse" aria-live="polite">
            Processing your request...
          </span>
        </div>
      )}
    </form>
  );
};

export default ChatInput;
