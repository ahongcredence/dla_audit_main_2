"use client";

import React, { useState } from "react";

import { X } from "lucide-react";

// Types
export interface FeedbackData {
  category: string;
  description: string;
  email?: string;
}

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FeedbackData) => void;
}

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatModalsProps {
  isFeedbackModalOpen: boolean;
  isAboutModalOpen: boolean;
  onCloseFeedbackModal: () => void;
  onCloseAboutModal: () => void;
  onFeedbackSubmit: (data: FeedbackData) => void;
}

// Feedback Modal Component
const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (category && description) {
      onSubmit({ category, description, email });
      // Reset form
      setCategory("");
      setDescription("");
      setEmail("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content feedback-modal"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Provide Feedback</h2>
          <button
            className="modal-close-button"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="form-group">
            <label htmlFor="feedback-category">Category *</label>
            <select
              id="feedback-category"
              value={category}
              onChange={e => setCategory(e.target.value)}
              required
              className="form-select"
            >
              <option value="">Select a category</option>
              <option value="accuracy">Accuracy Issue</option>
              <option value="relevance">Not Relevant</option>
              <option value="completeness">Incomplete Answer</option>
              <option value="clarity">Unclear Response</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="feedback-description">Description *</label>
            <textarea
              id="feedback-description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Please describe the issue in detail..."
              required
              className="form-textarea"
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="feedback-email">Email (optional)</label>
            <input
              id="feedback-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="form-input"
            />
            <small className="form-help">
              We may contact you for follow-up questions
            </small>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={!category || !description}
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// About Modal Component
const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content about-modal"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>About Albert</h2>
          <button
            className="modal-close-button"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <div className="about-section">
            <h3>What is Albert?</h3>
            <p>
              Albert is an AI-powered assistant designed to help you navigate
              and understand complex data and documentation. Albert can answer
              questions, provide insights, and help you find relevant
              information quickly and efficiently.
            </p>
          </div>

          <div className="about-section">
            <h3>How to Use Albert</h3>
            <ul>
              <li>Type your questions in natural language</li>
              <li>Ask for specific information or general guidance</li>
              <li>Request explanations or clarifications</li>
              <li>Use follow-up questions to dive deeper into topics</li>
            </ul>
          </div>

          <div className="about-section">
            <h3>Tips for Better Results</h3>
            <ul>
              <li>Be specific about what you&apos;re looking for</li>
              <li>Provide context when asking complex questions</li>
              <li>Break down complex requests into smaller parts</li>
              <li>Use the feedback buttons to help improve responses</li>
            </ul>
          </div>

          <div className="about-section">
            <h3>Important Notes</h3>
            <p className="disclaimer">
              Albert is an AI assistant and may not always provide completely
              accurate information. Always verify important information through
              official sources and use your judgment when making decisions based
              on Albert&apos;s responses.
            </p>
          </div>

          <div className="about-section">
            <h3>Privacy & Data</h3>
            <p>
              Your conversations with Albert are processed to provide responses
              and improve the service. Please avoid sharing sensitive personal
              information in your queries.
            </p>
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose} className="btn-primary">
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

// Main ChatModals Component
export const ChatModals: React.FC<ChatModalsProps> = ({
  isFeedbackModalOpen,
  isAboutModalOpen,
  onCloseFeedbackModal,
  onCloseAboutModal,
  onFeedbackSubmit,
}) => {
  return (
    <>
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={onCloseFeedbackModal}
        onSubmit={onFeedbackSubmit}
      />
      <AboutModal isOpen={isAboutModalOpen} onClose={onCloseAboutModal} />
    </>
  );
};

export default ChatModals;
