"use client";

import React from "react";

import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useLayout } from "../LayoutContext";
import AppSwitcher from "./AppSwitcher";

export default function LeftNavBar() {
  const { isSidebarExpanded, toggleSidebar, sidebarWidth } = useLayout();

  return (
    <nav
      className={clsx(
        "bg-auditinsight-primary-100 relative sticky top-30 left-0 z-50",
        "flex flex-shrink-0 flex-col overflow-visible",
        "h-[calc(100vh-80px)] transition-all duration-300 ease-in-out"
      )}
      style={{ width: `${sidebarWidth}px` }}
    >
      {/* Background SVG layer */}
      <div
        className="absolute inset-0 z-0 bg-[url('/00_DLA_ZerosOnes100percent_White-cropped.svg')] bg-cover bg-center bg-no-repeat"
        style={{
          maskImage: `
                        radial-gradient(circle at 20% 30%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.06) 1%, rgba(0,0,0,0.03) 5%, rgba(0,0,0,0.01) 0%, rgba(0,0,0,0.01) 100%),
                        radial-gradient(circle at 70% 20%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.07) 2%, rgba(0,0,0,0.04) 3%, rgba(0,0,0,0.01) 4%, rgba(0,0,0,0.01) 100%),
                        radial-gradient(circle at 15% 80%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.06) 1%, rgba(0,0,0,0.03) 2%, rgba(0,0,0,0.01) 2%, rgba(0,0,0,0.01) 100%),
                        radial-gradient(circle at 85% 70%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.07) 5%, rgba(0,0,0,0.04) 5%, rgba(0,0,0,0.01) 5%, rgba(0,0,0,0.01) 100%),
                        radial-gradient(circle at 50% 60%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.05) 1%, rgba(0,0,0,0.01) 3%, rgba(0,0,0,0.01) 100%)
                    `,
          WebkitMaskImage: `
                        radial-gradient(circle at 20% 30%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.06) 1%, rgba(0,0,0,0.03) 5%, rgba(0,0,0,0.01) 0%, rgba(0,0,0,0.01) 100%),
                        radial-gradient(circle at 70% 20%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.07) 2%, rgba(0,0,0,0.04) 3%, rgba(0,0,0,0.01) 4%, rgba(0,0,0,0.01) 100%),
                        radial-gradient(circle at 15% 80%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.06) 1%, rgba(0,0,0,0.03) 2%, rgba(0,0,0,0.01) 2%, rgba(0,0,0,0.01) 100%),
                        radial-gradient(circle at 85% 70%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.07) 5%, rgba(0,0,0,0.04) 5%, rgba(0,0,0,0.01) 5%, rgba(0,0,0,0.01) 100%),
                        radial-gradient(circle at 50% 60%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.05) 1%, rgba(0,0,0,0.01) 3%, rgba(0,0,0,0.01) 100%)
                    `,
          maskComposite: "add",
          WebkitMaskComposite: "source-over",
        }}
      ></div>

      <AppSwitcher />

      {/* Expand/Collapse Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-120 -right-8 z-[100] flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white text-gray-600 shadow-lg hover:bg-gray-100"
        aria-label={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
      >
        {isSidebarExpanded ? (
          <ChevronLeft className="h-5 w-5" />
        ) : (
          <ChevronRight className="h-5 w-5" />
        )}
      </button>
    </nav>
  );
}
