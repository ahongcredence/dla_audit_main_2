"use client";

import React, { useEffect, useRef, useState, useTransition } from "react";

import { usePathname, useRouter } from "next/navigation";

import clsx from "clsx";

import NavIcon from "../icons/NavIcon";

type AppItemProps = {
  label: string;
  icon: string;
  url?: string;
  onClick?: () => void;
  isActive?: boolean;
  isPanelOpen?: boolean;
};

const AppItem: React.FC<AppItemProps> = ({
  label,
  url,
  onClick,
  icon,
  isActive: isActiveProp,
  isPanelOpen,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Use React's useTransition for navigation state
  const [isPending, startTransition] = useTransition();
  const [navigationTimeout, setNavigationTimeout] =
    useState<NodeJS.Timeout | null>(null);

  // Check if current route matches this item's URL
  const isUrlActive =
    url && (pathname === url || (url !== "/" && pathname.startsWith(url)));

  // Combine URL-based active state with prop-based active state
  const isActive = isActiveProp || isUrlActive;

  // Determine visual state: panel items should show active background when panel is open
  // Navigation pending state should also keep item expanded and show loading
  const showActiveBackground = isActive || isPanelOpen || isPending;

  // Handle navigation completion
  useEffect(() => {
    if (!isPending && navigationTimeout) {
      // Navigation completed, clear timeout and blur button
      clearTimeout(navigationTimeout);
      setNavigationTimeout(null);
      if (buttonRef.current) {
        buttonRef.current.blur();
      }
    }
  }, [isPending, navigationTimeout]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (navigationTimeout) {
        clearTimeout(navigationTimeout);
      }
    };
  }, [navigationTimeout]);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (url) {
      // Start transition for navigation
      startTransition(() => {
        router.push(url);
      });

      // Set timeout for slow page loads (10 seconds)
      const timeout = setTimeout(() => {
        if (buttonRef.current) {
          buttonRef.current.blur();
        }
      }, 10000);
      setNavigationTimeout(timeout);
    }
  };

  return (
    <div>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        className={clsx(
          "relative flex items-center",
          "text-auditinsight-primary px-2 py-2",
          "border-2 border-white bg-gray-50",
          "rounded-full shadow-lg transition-all",
          "duration-300 focus:ring-blue-500",
          "focus:ring-2",
          "focus:outline-none",
          "group overflow-hidden",
          isPending ? "animate-pulse" : ""
        )}
      >
        {/* Gradient overlay that fades in/out */}
        <div
          className={clsx(
            "from-auditinsight-secondary-100 to-auditinsight-secondary-30 absolute",
            "rounded-full bg-gradient-to-br transition-opacity",
            "inset-0 duration-300",
            showActiveBackground ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Hover/Focus gradient overlay */}
        <div className="from-auditinsight-secondary-100 to-auditinsight-secondary-30 absolute inset-0 rounded-full bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus:opacity-100" />

        {/* Icon */}
        <NavIcon
          name={icon}
          className={clsx(
            "relative z-10 h-5",
            "w-5 flex-shrink-0 transition-colors",
            "duration-300",
            showActiveBackground
              ? "text-white"
              : "text-auditinsight-primary group-hover:text-white group-focus:text-white"
          )}
        />

        {/* Label */}
        <span
          className={clsx(
            "relative ml-0 max-w-0",
            "text-sm font-bold whitespace-nowrap",
            "opacity-0 transition-all duration-300",
            "group-hover:ml-2",
            "group-hover:max-w-xs",
            "group-hover:opacity-100",
            "group-focus:ml-2",
            "group-focus:max-w-xs",
            "group-focus:opacity-100",
            "z-10",
            showActiveBackground
              ? "text-white"
              : "text-auditinsight-primary group-hover:text-white group-focus:text-white"
          )}
        >
          {label}
        </span>
      </button>
    </div>
  );
};

export default AppItem;
