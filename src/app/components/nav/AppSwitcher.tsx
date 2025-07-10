"use client";

import React, { useState } from "react";

import AppItem from "./AppItem";
import AppPanel from "./AppPanel";

const AppSwitcher: React.FC = () => {
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const handlePanelOpen = (panelName: string) => {
    setActivePanel(activePanel === panelName ? null : panelName);
  };

  const handlePanelClose = () => {
    setActivePanel(null);
  };

  return (
    <>
      <div className="fixed top-0 left-0 z-10 flex h-full flex-col justify-between">
        {/* Top Section - 5 buttons fixed below DynamicLogoBar */}
        <div className="isolate -ml-0.75 flex flex-col space-y-2 p-2 pt-32">
          <AppItem
            label="Prompt"
            icon="prompt2"
            onClick={() => handlePanelOpen("Settings")}
            isPanelOpen={activePanel === "Settings"}
          />
          <AppItem
            label="History"
            icon="history"
            onClick={() => handlePanelOpen("Notifications")}
            isPanelOpen={activePanel === "Notifications"}
          />
          <AppItem
            label="Insights"
            icon="insight"
            onClick={() => handlePanelOpen("Profile")}
            isPanelOpen={activePanel === "Profile"}
          />
          <AppItem
            label="Domain"
            icon="domain"
            onClick={() => handlePanelOpen("Search")}
            isPanelOpen={activePanel === "Search"}
          />
          <AppItem
            label="Findings"
            icon="findings"
            onClick={() => handlePanelOpen("Help")}
            isPanelOpen={activePanel === "Help"}
          />
        </div>

        {/* Bottom Section - existing AppItems fixed to bottom */}
        <div className="isolate -ml-0.75 flex flex-col space-y-2 p-2">
          {/*<AppItem label="Home" icon="home" url="/" />*/}
          <AppItem
            label="Audit Workbench"
            icon="auditworkbench"
            url="/audit-workbench"
          />
          <AppItem label="CAP Manager" icon="capmanage" url="/cap-manager" />
          <AppItem
            label="Predict Insight"
            icon="predictinsight"
            url="/predict-insight"
          />
          <AppItem
            label="Transaction Chain"
            icon="linkchain"
            url="/transaction-chain"
          />
          <AppItem
            label="Data Explorer"
            icon="edasearch"
            url="/data-explorer"
          />
          <AppItem
            label="Knowledge Hub"
            icon="knowledgehub"
            url="/knowledge-hub"
          />
          {/*
          <AppItem
            label="Toolkit"
            icon="toolkit"
            url="www.google.com"
          />
          */}
        </div>
      </div>

      {/* App Panel */}
      <AppPanel activePanel={activePanel} onClose={handlePanelClose} />
    </>
  );
};

export default AppSwitcher;
