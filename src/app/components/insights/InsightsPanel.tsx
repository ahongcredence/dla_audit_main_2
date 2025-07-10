"use client";

import React from "react";

import clsx from "clsx";
import { Clock, Shield, TrendingUp } from "lucide-react";

import EnhancedAuditScoreChart from "../EnhancedAuditScoreChart";
import { useInsightsPanel } from "../InsightsPanelContext";
import { useLayout } from "../LayoutContext";
import {
  InsightSection,
  KeyValueRow,
  MetricItem,
  RiskIndicator,
} from "./index";

const InsightsPanel: React.FC = () => {
  const { showPanel, panelContent } = useInsightsPanel();
  const { isInsightsPanelOpen, insightsPanelWidth } = useLayout();

  // Don't render anything if panel shouldn't be shown on this route
  if (!showPanel) {
    return null;
  }

  return (
    <>
      {/* Panel */}
      <div
        className={clsx(
          "fixed top-30 right-0",
          "z-20 overflow-hidden bg-white",
          "transition-all duration-300 ease-in-out",
          isInsightsPanelOpen
            ? "border-auditinsight-gray-40 border-l shadow-2xl"
            : "border-l-0 shadow-none"
        )}
        style={{
          height: "calc(100vh - 80px)",
          width: `${insightsPanelWidth}px`,
        }}
        aria-hidden={!isInsightsPanelOpen}
      >
        {/* Toggle button */}
        {/*
        <button
          onClick={toggleInsightsPanel}
          className="absolute top-4 -left-3 z-30 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-md hover:bg-gray-100"
          aria-label={
            isInsightsPanelOpen ? "Close insights panel" : "Open insights panel"
          }
        >
          <ChevronRight
            className={clsx(
              "h-4 w-4 transition-transform",
              isInsightsPanelOpen && "rotate-180"
            )}
          />
        </button>
        */}
        <div className="h-full w-full overflow-y-auto p-3">
          {isInsightsPanelOpen && (
            <>
              <div className="border-auditinsight-gray-40 mb-4 border-b pb-2">
                <h3 className="m-0 text-lg font-semibold text-slate-900">
                  AI Findings
                </h3>
              </div>
              <div className="flex-1">
                {panelContent ? (
                  <div className="space-y-2">
                    {/* Key Metrics Section */}
                    <InsightSection
                      title="Key Metrics"
                      icon={<TrendingUp className="h-4 w-4" />}
                    >
                      {panelContent.apiInsights && (
                        <>
                          <MetricItem
                            label="Classification"
                            value={
                              panelContent.apiInsights.keyMetrics.classification
                            }
                            valueColor="primary"
                          />
                          <MetricItem
                            label="Anomaly Flag"
                            value={
                              panelContent.apiInsights.keyMetrics.anomalyFlag
                            }
                            valueColor={
                              panelContent.apiInsights.keyMetrics
                                .anomalyFlag === "None"
                                ? "green"
                                : "yellow"
                            }
                          />
                          <MetricItem
                            label="Link Confidence"
                            value={
                              panelContent.apiInsights.keyMetrics.linkConfidence
                            }
                            valueColor="blue"
                          />
                          <div className="flex items-center justify-between rounded px-1 py-0.5 transition-colors duration-200 hover:bg-gray-100">
                            <div className="text-sm text-gray-700">
                              Audit Score
                            </div>
                            <div className="flex items-center">
                              <EnhancedAuditScoreChart
                                score={parseInt(
                                  panelContent.apiInsights.keyMetrics.auditScore
                                )}
                                size={40}
                              />
                            </div>
                          </div>
                          <MetricItem
                            label="Evidence Status"
                            value={
                              panelContent.apiInsights.keyMetrics.evidenceStatus
                            }
                            valueColor="green"
                          />
                          <div className="flex items-center justify-between rounded px-1 py-0.5 transition-colors duration-200 hover:bg-gray-100">
                            <div className="text-sm text-gray-700">
                              Fixability Score
                            </div>
                            <div className="flex items-center">
                              <EnhancedAuditScoreChart
                                score={parseInt(
                                  panelContent.apiInsights.keyMetrics
                                    .fixabilityScore
                                )}
                                size={40}
                              />
                            </div>
                          </div>
                          <MetricItem
                            label="Manual Overrides"
                            value={
                              panelContent.apiInsights.keyMetrics
                                .manualOverrides
                            }
                            valueColor={
                              panelContent.apiInsights.keyMetrics
                                .manualOverrides === "None"
                                ? "green"
                                : "yellow"
                            }
                          />
                          <MetricItem
                            label="NFR Prediction"
                            value={
                              panelContent.apiInsights.keyMetrics.nfrPrediction
                            }
                            valueColor={
                              panelContent.apiInsights.keyMetrics
                                .nfrPrediction === "Clean"
                                ? "green"
                                : "yellow"
                            }
                          />
                          <MetricItem
                            label="CAP Recommended"
                            value={
                              panelContent.apiInsights.keyMetrics.capRecommended
                            }
                            valueColor={
                              panelContent.apiInsights.keyMetrics
                                .capRecommended === "No"
                                ? "green"
                                : "yellow"
                            }
                          />
                          <MetricItem
                            label="Chain Completeness"
                            value={
                              panelContent.apiInsights.keyMetrics
                                .chainCompleteness
                            }
                            valueColor={
                              panelContent.apiInsights.keyMetrics
                                .chainCompleteness === "Complete"
                                ? "green"
                                : "yellow"
                            }
                          />
                        </>
                      )}
                    </InsightSection>

                    {/* Risk Assessment */}
                    {panelContent.apiInsights && (
                      <InsightSection
                        title="Risk Assessment"
                        icon={<Shield className="h-4 w-4" />}
                      >
                        <RiskIndicator label="Compliance Risk" level="LOW" />
                        <RiskIndicator label="Fraud Risk" level="MEDIUM" />
                        <RiskIndicator label="Processing Risk" level="LOW" />
                      </InsightSection>
                    )}

                    {/* Analysis Summary */}
                    {panelContent.apiInsights && (
                      <InsightSection
                        title="Analysis Summary"
                        icon={<Clock className="h-4 w-4" />}
                      >
                        <div className="space-y-1 text-sm">
                          <KeyValueRow
                            label="Record ID:"
                            value={panelContent.apiInsights.recordId || "N/A"}
                            valueColor="primary"
                          />
                          <KeyValueRow
                            label="Total Records:"
                            value={panelContent.apiInsights.totalRecords.toString()}
                            valueColor="blue"
                          />
                          <KeyValueRow
                            label="Status:"
                            value={panelContent.apiInsights.status || "N/A"}
                            valueColor={
                              panelContent.apiInsights.status === "Complete"
                                ? "green"
                                : "yellow"
                            }
                          />
                          <KeyValueRow
                            label="Justification Quality:"
                            value={
                              panelContent.apiInsights.keyMetrics
                                .justificationQuality
                            }
                            valueColor={
                              panelContent.apiInsights.keyMetrics
                                .justificationQuality === "High"
                                ? "green"
                                : "yellow"
                            }
                          />
                          <KeyValueRow
                            label="Last Updated:"
                            value={
                              panelContent.apiInsights.timestamp
                                ? (() => {
                                    const date = new Date(
                                      panelContent.apiInsights.timestamp
                                    );
                                    const dateStr = date.toLocaleDateString();
                                    // Format time without seconds (hours and minutes only)
                                    const timeStr = date.toLocaleTimeString(
                                      [],
                                      {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      }
                                    );
                                    return (
                                      <>
                                        {dateStr}
                                        <br />
                                        {timeStr}
                                      </>
                                    );
                                  })()
                                : "N/A"
                            }
                          />
                        </div>
                      </InsightSection>
                    )}
                  </div>
                ) : (
                  <p className="mt-8 text-center text-sm text-gray-500 italic">
                    No insights available
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default InsightsPanel;
