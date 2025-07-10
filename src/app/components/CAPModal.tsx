"use client";

import React from "react";

import { X } from "lucide-react";

interface CAPModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    keyMetrics?: {
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
    narrativeSummary?: string;
    justification?: string;
    actionSolution?: string;
    recordId?: string;
    totalRecords?: number;
    timestamp?: string;
  };
}

const CAPModal: React.FC<CAPModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  const formatDate = (timestamp?: string) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-sm bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-auditinsight-primary text-2xl font-bold">
            Generate Corrective Action Plan
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-gray-100"
            aria-label="Close modal"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-140px)] overflow-y-auto p-8">
          <div className="space-y-8 text-sm leading-relaxed">
            {/* Document Header */}
            <div className="border-b border-gray-300 pb-6 text-center">
              <h1 className="text-auditinsight-primary mb-2 text-3xl font-bold">
                CORRECTIVE ACTION PLAN
              </h1>
              <p className="text-lg text-gray-600">
                Transaction Chain Analysis Report
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Generated on: {formatDate(data.timestamp)}
              </p>
              {data.recordId && (
                <p className="text-sm text-gray-500">
                  Record ID: {data.recordId}
                </p>
              )}
            </div>

            {/* Key Metrics Section */}
            {data.keyMetrics && (
              <div className="space-y-4">
                <h2 className="text-auditinsight-primary border-b border-gray-200 pb-2 text-xl font-bold">
                  1. KEY METRICS
                </h2>
                <div className="grid grid-cols-2 gap-4 pl-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Classification:</span>
                      <span>{data.keyMetrics.classification}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Anomaly Flag:</span>
                      <span
                        className={
                          data.keyMetrics.anomalyFlag === "None"
                            ? "text-green-600"
                            : "text-orange-600"
                        }
                      >
                        {data.keyMetrics.anomalyFlag}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Link Confidence:</span>
                      <span className="text-blue-600">
                        {data.keyMetrics.linkConfidence}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Audit Score:</span>
                      <span className="text-auditinsight-primary font-medium">
                        {data.keyMetrics.auditScore}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Evidence Status:</span>
                      <span className="text-green-600">
                        {data.keyMetrics.evidenceStatus}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Fixability Score:</span>
                      <span className="text-blue-600">
                        {data.keyMetrics.fixabilityScore}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">
                        Justification Quality:
                      </span>
                      <span
                        className={
                          data.keyMetrics.justificationQuality === "High"
                            ? "text-green-600"
                            : "text-orange-600"
                        }
                      >
                        {data.keyMetrics.justificationQuality}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Manual Overrides:</span>
                      <span
                        className={
                          data.keyMetrics.manualOverrides === "None"
                            ? "text-green-600"
                            : "text-orange-600"
                        }
                      >
                        {data.keyMetrics.manualOverrides}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">NFR Prediction:</span>
                      <span
                        className={
                          data.keyMetrics.nfrPrediction === "Clean"
                            ? "text-green-600"
                            : "text-orange-600"
                        }
                      >
                        {data.keyMetrics.nfrPrediction}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">CAP Recommended:</span>
                      <span
                        className={
                          data.keyMetrics.capRecommended === "No"
                            ? "text-green-600"
                            : "text-orange-600"
                        }
                      >
                        {data.keyMetrics.capRecommended}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Chain Completeness:</span>
                      <span
                        className={
                          data.keyMetrics.chainCompleteness === "Complete"
                            ? "text-green-600"
                            : "text-orange-600"
                        }
                      >
                        {data.keyMetrics.chainCompleteness}
                      </span>
                    </div>
                    {data.totalRecords && (
                      <div className="flex justify-between">
                        <span className="font-medium">Total Records:</span>
                        <span>{data.totalRecords}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Risk Assessment Section */}
            <div className="space-y-4">
              <h2 className="text-auditinsight-primary border-b border-gray-200 pb-2 text-xl font-bold">
                2. RISK ASSESSMENT
              </h2>
              <div className="space-y-3 pl-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Compliance Risk:</span>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                    LOW
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Fraud Risk:</span>
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                    MEDIUM
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Processing Risk:</span>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                    LOW
                  </span>
                </div>
              </div>
            </div>

            {/* Summary Section */}
            {data.narrativeSummary && (
              <div className="space-y-4">
                <h2 className="text-auditinsight-primary border-b border-gray-200 pb-2 text-xl font-bold">
                  3. SUMMARY
                </h2>
                <div className="pl-4">
                  <p className="text-justify leading-relaxed">
                    {data.narrativeSummary.replace(/\*\*/g, "")}
                  </p>
                </div>
              </div>
            )}

            {/* Justification Section */}
            {data.justification && (
              <div className="space-y-4">
                <h2 className="text-auditinsight-primary border-b border-gray-200 pb-2 text-xl font-bold">
                  4. JUSTIFICATION
                </h2>
                <div className="pl-4">
                  <p className="text-justify leading-relaxed">
                    {data.justification.replace(/\*\*/g, "")}
                  </p>
                </div>
              </div>
            )}

            {/* Recommendation Section */}
            {data.actionSolution && (
              <div className="space-y-4">
                <h2 className="text-auditinsight-primary border-b border-gray-200 pb-2 text-xl font-bold">
                  5. RECOMMENDATION
                </h2>
                <div className="pl-4">
                  <p className="text-justify leading-relaxed">
                    {data.actionSolution.replace(/\*\*/g, "")}
                  </p>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 border-t border-gray-300 pt-6">
              <div className="text-center text-xs text-gray-500">
                <p>
                  This document was automatically generated by the AuditInsight
                  Transaction Chain Analysis system.
                </p>
                <p>For questions or concerns, please contact the audit team.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 p-6">
          <button
            onClick={() => {
              // Non-functional export button as requested
              alert("Export functionality not yet implemented");
            }}
            className="bg-auditinsight-primary hover:bg-auditinsight-primary-80 rounded-sm px-4 py-2 text-white transition-colors"
          >
            Export
          </button>
          <button
            onClick={onClose}
            className="rounded-sm bg-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CAPModal;
