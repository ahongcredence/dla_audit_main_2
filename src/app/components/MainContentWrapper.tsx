"use client";

import React, { ReactNode, useEffect } from "react";

import { usePathname } from "next/navigation";

import clsx from "clsx";

import { useInsightsPanel } from "./InsightsPanelContext";
import { useLayout } from "./LayoutContext";
import PageFooterArea from "./PageFooterArea";
import PageTitleArea from "./PageTitleArea";

// Map routes to their corresponding icons
const routeToIconMap: { [key: string]: string } = {
  "audit-workbench": "auditworkbench",
  "cap-manager": "capmanage",
  "predict-insight": "predictinsight",
  "transaction-chain": "linkchain",
  "data-explorer": "edasearch",
  "knowledge-hub": "knowledgehub",
  "aoi-selection": "domain",
};

interface MainContentWrapperProps {
  children: React.ReactNode;
  pageTitle?: string;
  pageIcon?: string;
  titleContent?: ReactNode;
}

const MainContentWrapper: React.FC<MainContentWrapperProps> = ({
  children,
  pageTitle,
  pageIcon,
  titleContent,
}) => {
  const { showPanel } = useInsightsPanel();
  const { insightsPanelWidth, setPageTitle, setPageIcon, pageFooterContent } =
    useLayout();
  const pathname = usePathname();

  // Set page title and icon if provided as prop or based on route
  useEffect(() => {
    // Handle page title
    if (pageTitle) {
      setPageTitle(pageTitle);
    } else {
      // Default page title based on pathname
      const pathSegments = pathname.split("/").filter(Boolean);
      if (pathSegments.length > 0) {
        const formattedTitle = pathSegments[pathSegments.length - 1]
          .split("-")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        setPageTitle(formattedTitle);
      } else {
        setPageTitle("Dashboard");
      }
    }

    // Handle page icon
    if (pageIcon) {
      setPageIcon(pageIcon);
    } else {
      // Default page icon based on pathname
      const pathSegments = pathname.split("/").filter(Boolean);
      if (pathSegments.length > 0) {
        const routeKey = pathSegments[pathSegments.length - 1];
        setPageIcon(routeToIconMap[routeKey] || "");
      } else {
        setPageIcon("");
      }
    }
  }, [pageTitle, pageIcon, pathname, setPageTitle, setPageIcon]);

  return (
    <main
      className={clsx(
        "relative mt-30 border-l",
        "border-gray-200 transition-all duration-300",
        "flex h-[calc(100vh-120px)] flex-1 flex-col ease-in-out"
      )}
      style={{
        marginRight: showPanel ? `${insightsPanelWidth}px` : "0",
      }}
    >
      {/* Title Area - Fixed at top */}
      <PageTitleArea>{titleContent}</PageTitleArea>

      {/* Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto p-6">{children}</div>

      {/* Footer Area - Fixed at bottom, only shown when content exists */}
      {pageFooterContent && <PageFooterArea />}
    </main>
  );
};

export default MainContentWrapper;
