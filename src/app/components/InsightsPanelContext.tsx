"use client";

import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { usePathname } from "next/navigation";

import { useLayout } from "./LayoutContext";

// Type for API insights data
interface ApiInsights {
  keyMetrics: {
    classification: string;
    anomalyFlag: string;
    linkConfidence: string;
    auditScore: string;
    evidenceStatus: string;
    fixabilityScore: string;
    justificationQuality: string;
    manualOverrides: string;
    nfrPrediction: string;
    capRecommended: string;
    chainCompleteness: string;
  };
  narrativeSummary: string;
  justification: string;
  actionSolution: string;
  totalRecords: number;
  recordId: string;
  status: string;
  timestamp: string;
}

// Type for panel content - can be extended as needed
type PanelContent = {
  transactionInsights?: boolean;
  apiInsights?: ApiInsights | null;
} | null;

interface InsightsPanelContextType {
  showPanel: boolean;
  panelContent: PanelContent;
  togglePanel: () => void;
  setPanelContent: (content: PanelContent, autoOpen?: boolean) => void;
  clearPanelContent: () => void;
}

const InsightsPanelContext = createContext<
  InsightsPanelContextType | undefined
>(undefined);

// Route configuration - define which routes should show the panel
const PANEL_ROUTES: Record<string, boolean> = {
  "/transaction-chain": true,
  "/": false,
  // Add more routes as needed
};

interface InsightsPanelProviderProps {
  children: ReactNode;
}

export function InsightsPanelProvider({
  children,
}: InsightsPanelProviderProps) {
  const pathname = usePathname();
  const [panelContent, setPanelContentState] = useState<PanelContent>(null);
  const { isInsightsPanelOpen, toggleInsightsPanel } = useLayout();

  // Determine if panel should be shown based on current route
  const showPanel = PANEL_ROUTES[pathname] || false;

  // Close panel and clear content when navigating to a route that doesn't support it
  useEffect(() => {
    if (!showPanel) {
      setPanelContentState(null);
      // If we need to close the panel via layout context
      if (isInsightsPanelOpen) {
        toggleInsightsPanel();
      }
    }
  }, [showPanel, isInsightsPanelOpen, toggleInsightsPanel]);

  const togglePanel = useCallback(() => {
    if (showPanel) {
      toggleInsightsPanel();
    }
  }, [showPanel, toggleInsightsPanel]);

  const setPanelContent = useCallback(
    (content: PanelContent, autoOpen?: boolean) => {
      setPanelContentState(content);

      // Auto-open panel if content is provided
      if (content && showPanel && !isInsightsPanelOpen && autoOpen !== false) {
        toggleInsightsPanel();
      } else if (!content && isInsightsPanelOpen) {
        toggleInsightsPanel();
      }
    },
    [showPanel, isInsightsPanelOpen, toggleInsightsPanel]
  );

  const clearPanelContent = useCallback(() => {
    setPanelContentState(null);
    if (isInsightsPanelOpen) {
      toggleInsightsPanel();
    }
  }, [isInsightsPanelOpen, toggleInsightsPanel]);

  const contextValue: InsightsPanelContextType = useMemo(
    () => ({
      showPanel,
      panelContent,
      togglePanel,
      setPanelContent,
      clearPanelContent,
    }),
    [showPanel, panelContent, togglePanel, setPanelContent, clearPanelContent]
  );

  return (
    <InsightsPanelContext.Provider value={contextValue}>
      {children}
    </InsightsPanelContext.Provider>
  );
}

export function useInsightsPanel() {
  const context = useContext(InsightsPanelContext);
  if (context === undefined) {
    throw new Error(
      "useInsightsPanel must be used within an InsightsPanelProvider"
    );
  }
  return context;
}
