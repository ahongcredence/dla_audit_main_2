"use client";

import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface LayoutContextType {
  // Sidebar state
  isSidebarExpanded: boolean;
  toggleSidebar: () => void;
  sidebarWidth: number;

  // Insights panel state
  isInsightsPanelOpen: boolean;
  toggleInsightsPanel: () => void;
  insightsPanelWidth: number;

  // Page title and icon
  pageTitle: string;
  setPageTitle: (title: string) => void;
  pageIcon: string;
  setPageIcon: (icon: string) => void;

  // Page title area actions
  pageTitleActions: React.ReactNode;
  setPageTitleActions: (actions: React.ReactNode) => void;

  // Page footer content
  pageFooterContent: React.ReactNode;
  setPageFooterContent: (content: React.ReactNode) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

// Configuration constants
const SIDEBAR_COLLAPSED_WIDTH = 60;
const SIDEBAR_EXPANDED_WIDTH = 240;
const INSIGHTS_PANEL_WIDTH = 320;

interface LayoutProviderProps {
  children: ReactNode;
}

export function LayoutProvider({ children }: LayoutProviderProps) {
  // Sidebar state
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const sidebarWidth = isSidebarExpanded
    ? SIDEBAR_EXPANDED_WIDTH
    : SIDEBAR_COLLAPSED_WIDTH;

  // Insights panel state
  const [isInsightsPanelOpen, setIsInsightsPanelOpen] = useState(false);
  const insightsPanelWidth = isInsightsPanelOpen ? INSIGHTS_PANEL_WIDTH : 0;

  // Page title and icon
  const [pageTitle, setPageTitle] = useState("");
  const [pageIcon, setPageIcon] = useState("");

  // Page title area actions
  const [pageTitleActions, setPageTitleActions] =
    useState<React.ReactNode>(null);

  // Page footer content
  const [pageFooterContent, setPageFooterContent] =
    useState<React.ReactNode>(null);

  // Toggle functions
  const toggleSidebar = useCallback(() => {
    setIsSidebarExpanded(prev => !prev);
  }, []);

  const toggleInsightsPanel = useCallback(() => {
    setIsInsightsPanelOpen(prev => !prev);
  }, []);

  const contextValue = useMemo(
    () => ({
      isSidebarExpanded,
      toggleSidebar,
      sidebarWidth,
      isInsightsPanelOpen,
      toggleInsightsPanel,
      insightsPanelWidth,
      pageTitle,
      setPageTitle,
      pageIcon,
      setPageIcon,
      pageTitleActions,
      setPageTitleActions,
      pageFooterContent,
      setPageFooterContent,
    }),
    [
      isSidebarExpanded,
      toggleSidebar,
      sidebarWidth,
      isInsightsPanelOpen,
      toggleInsightsPanel,
      insightsPanelWidth,
      pageTitle,
      setPageTitle,
      pageIcon,
      setPageIcon,
      pageTitleActions,
      setPageTitleActions,
      pageFooterContent,
      setPageFooterContent,
    ]
  );

  return (
    <LayoutContext.Provider value={contextValue}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
}
