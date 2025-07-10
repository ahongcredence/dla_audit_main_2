"use client";

import React, { useEffect, useRef, useState } from "react";

import clsx from "clsx";
import { X } from "lucide-react";

type AppPanelProps = {
  activePanel: string | null;
  onClose: () => void;
};

const AppPanel: React.FC<AppPanelProps> = ({ activePanel, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activePanel) {
      // Panel is opening - mount and fade in
      setIsVisible(true);
      // Use setTimeout to ensure the component is mounted before starting animation
      setTimeout(() => {
        setIsAnimating(true);
      }, 10);
    } else {
      // Panel is closing - fade out then unmount
      setIsAnimating(false);
      // Wait for fade out animation to complete before unmounting
      setTimeout(() => {
        setIsVisible(false);
      }, 300);
    }
  }, [activePanel]);

  // Focus management - focus the panel when it opens and is fully animated
  useEffect(() => {
    if (activePanel && isAnimating && panelRef.current) {
      // Small delay to ensure the panel is fully rendered and visible
      setTimeout(() => {
        panelRef.current?.focus();
      }, 100);
    }
  }, [activePanel, isAnimating]);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      onClose();
    }
  };

  if (!isVisible) return null;

  const renderPanelContent = () => {
    switch (activePanel) {
      case "Settings":
        return (
          <div className="">
            <h2 className="mb-4 text-xl font-bold">Settings</h2>
            <div className="space-y-3">
              <div className="rounded-sm bg-white/10 p-3">
                <h3 className="mb-2 font-semibold">Account Settings</h3>
                <p className="text-sm opacity-90">
                  Manage your account preferences
                </p>
              </div>
              <div className="rounded-sm bg-white/10 p-3">
                <h3 className="mb-2 font-semibold">Display Settings</h3>
                <p className="text-sm opacity-90">
                  Customize your display options
                </p>
              </div>
              <div className="rounded-sm bg-white/10 p-3">
                <h3 className="mb-2 font-semibold">Security Settings</h3>
                <p className="text-sm opacity-90">
                  Configure security preferences
                </p>
              </div>
            </div>
          </div>
        );
      case "Notifications":
        return (
          <div className="">
            <h2 className="mb-4 text-xl font-bold">Notifications</h2>
            <div className="space-y-3">
              <div className="rounded bg-white/10 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">System Updates</span>
                  <span className="bg-dla-red rounded-sm px-2 py-1 text-xs">
                    3 new
                  </span>
                </div>
                <p className="mt-1 text-sm opacity-90">
                  Latest system notifications
                </p>
              </div>
              <div className="rounded-sm bg-white/10 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Audit Alerts</span>
                  <span className="bg-dla-red rounded-sm px-2 py-1 text-xs">
                    1 new
                  </span>
                </div>
                <p className="mt-1 text-sm opacity-90">
                  Important audit notifications
                </p>
              </div>
            </div>
          </div>
        );
      case "Profile":
        return (
          <div className="">
            <h2 className="mb-4 text-xl font-bold">Profile</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                  <span className="text-lg font-bold">U</span>
                </div>
                <div>
                  <h3 className="font-semibold">User Name</h3>
                  <p className="text-sm opacity-90">user@example.com</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="rounded-sm bg-white/10 p-3">
                  <h4 className="font-semibold">Role</h4>
                  <p className="text-sm opacity-90">Audit Analyst</p>
                </div>
                <div className="rounded-sm bg-white/10 p-3">
                  <h4 className="font-semibold">Department</h4>
                  <p className="text-sm opacity-90">Internal Audit</p>
                </div>
              </div>
            </div>
          </div>
        );
      case "Search":
        return (
          <div className="">
            <h2 className="mb-4 text-xl font-bold">Search</h2>
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Search across all applications..."
                  className="w-full rounded-sm border border-white/20 bg-white/10 p-3 placeholder-white/70 focus:border-white/50 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Recent Searches</h3>
                <div className="space-y-1">
                  <div className="rounded-sm bg-white/10 p-2 text-sm">
                    Audit findings 2024
                  </div>
                  <div className="rounded-sm bg-white/10 p-2 text-sm">
                    Risk assessment
                  </div>
                  <div className="rounded-sm bg-white/10 p-2 text-sm">
                    Compliance reports
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "Help":
        return (
          <div className="">
            <h2 className="mb-4 text-xl font-bold">Help & Support</h2>
            <div className="space-y-3">
              <div className="rounded-sm bg-white/10 p-3">
                <h3 className="mb-2 font-semibold">Documentation</h3>
                <p className="text-sm opacity-90">
                  Access user guides and tutorials
                </p>
              </div>
              <div className="rounded-sm bg-white/10 p-3">
                <h3 className="mb-2 font-semibold">Contact Support</h3>
                <p className="text-sm opacity-90">
                  Get help from our support team
                </p>
              </div>
              <div className="rounded-sm bg-white/10 p-3">
                <h3 className="mb-2 font-semibold">FAQ</h3>
                <p className="text-sm opacity-90">
                  Find answers to common questions
                </p>
              </div>
              <div className="rounded-sm bg-white/10 p-3">
                <h3 className="mb-2 font-semibold">System Status</h3>
                <p className="text-sm opacity-90">
                  Check current system status
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="">
            <h2 className="mb-4 text-xl font-bold">{activePanel}</h2>
            <p>Content for {activePanel} panel</p>
          </div>
        );
    }
  };

  return (
    <div
      ref={panelRef}
      className={clsx(
        "border-auditinsight-secondary-5 fixed w-80",
        "to-auditinsight-secondary-5 border bg-gradient-to-br",
        "rounded-xs from-white shadow-lg",
        "transition-opacity duration-300 ease-in-out",
        "top-31 bottom-1 left-16",
        "z-20 overflow-y-auto",
        isAnimating ? "opacity-100" : "opacity-0"
      )}
      role="dialog"
      aria-label={`${activePanel} panel`}
      aria-modal="false"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
    >
      <div className="h-full p-4">
        {/* Close button */}
        <div className="mb-4 flex justify-end">
          <button
            onClick={onClose}
            className="hover:text-dla-red transition-colors duration-200"
            aria-label={`Close ${activePanel} panel`}
            title={`Close ${activePanel} panel`}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Panel content */}
        {renderPanelContent()}
      </div>
    </div>
  );
};

export default AppPanel;
