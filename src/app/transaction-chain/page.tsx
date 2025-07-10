"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import clsx from "clsx";
import { BarChart4, LightbulbIcon, Scale, Search } from "lucide-react";

import Card from "../components/Card";
import { useInsightsPanel } from "../components/InsightsPanelContext";
import TransactionChain from "../components/TransactionChain";
import { TransactionCard } from "../types";
import { generateCAPPDF } from "../utils/pdfGenerator";

// Utility functions for formatting data
const _formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const _formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatPercentage = (value: number): string => {
  return `${Math.round(value * 100)}%`;
};

// Format the content to improve structure of lists and text after colons
const formatContentText = (text: string): string => {
  if (!text) return "";

  // Add line breaks before list items (numbered or bullet points)
  let formattedText = text.replace(/([.?!])\s+([\d•\-*])/g, "$1\n\n$2");

  // Add line breaks after colons followed by text
  formattedText = formattedText.replace(/:\s+([A-Z])/g, ":\n$1");

  // Add line breaks before items that appear to be in a list
  formattedText = formattedText.replace(/(\.)(\s+)([•\-*]\s+)/g, "$1\n\n$3");

  // Add extra line break for numbered lists
  formattedText = formattedText.replace(/(\.)(\s+)(\d+\.)\s+/g, "$1\n\n$3 ");

  return formattedText;
};

// Component to render formatted content with sections like Analyze, Interpret, Recommend
const FormattedResponseContent: React.FC<{
  content: string;
}> = ({ content }) => {
  // Parse the content to identify sections
  const sections = content.split(/\*\*(Analyze|Interpret|Recommend)\*\*/);
  const formattedSections = [];

  for (let i = 1; i < sections.length; i += 2) {
    const sectionTitle = sections[i];
    const sectionContent = sections[i + 1]?.trim() || "";

    formattedSections.push({
      title: sectionTitle,
      content: sectionContent,
    });
  }

  return (
    <div className="h-full">
      {formattedSections.length > 0 ? (
        // Render parsed sections if found
        formattedSections.map((section, index) => (
          <div key={index} className={index > 0 ? "mt-6" : ""}>
            <h3 className="text-auditinsight-primary mb-3 text-lg font-bold">
              {section.title}
            </h3>
            <div className="text-sm leading-relaxed whitespace-pre-line text-gray-900">
              {formatContentText(section.content)}
            </div>
          </div>
        ))
      ) : (
        // Fallback: render raw content with HTML if parsing fails
        <div
          className="text-sm leading-relaxed whitespace-pre-line text-gray-900"
          dangerouslySetInnerHTML={{ __html: formatContentText(content) }}
        />
      )}
    </div>
  );
};

// Component to render formatted response with styled sections
const _FormattedResponse: React.FC<{
  content: string;
  suggestedQuestions?: string[];
  onQuestionClick?: (question: string) => void;
}> = ({ content, suggestedQuestions, onQuestionClick }) => {
  // Parse the content to identify sections
  const sections = content.split(/\*\*(Analyze|Interpret|Recommend)\*\*/);
  const formattedSections = [];

  for (let i = 1; i < sections.length; i += 2) {
    const sectionTitle = sections[i];
    const sectionContent = sections[i + 1]?.trim() || "";

    formattedSections.push({
      title: sectionTitle,
      content: sectionContent,
    });
  }

  return (
    <div className="h-full">
      {formattedSections.length > 0 ? (
        // Render parsed sections if found
        formattedSections.map((section, index) => (
          <div key={index} className={index > 0 ? "mt-6" : ""}>
            <h3 className="text-auditinsight-primary mb-3 text-lg font-bold">
              {section.title}
            </h3>
            <div className="text-sm leading-relaxed whitespace-pre-line text-gray-900">
              {formatContentText(section.content)}
            </div>
          </div>
        ))
      ) : (
        // Fallback: render raw content with HTML if parsing fails
        <div
          className="text-sm leading-relaxed whitespace-pre-line text-gray-900"
          dangerouslySetInnerHTML={{ __html: formatContentText(content) }}
        />
      )}
      {/* Suggested Questions */}
      {suggestedQuestions && suggestedQuestions.length > 0 && (
        <div className="mt-4">
          <h4 className="text-auditinsight-primary mb-2 text-base font-semibold">
            Suggested follow-on questions
          </h4>
          <div className="flex flex-wrap gap-2 pb-1">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => onQuestionClick?.(question)}
                className="border-auditinsight-primary text-auditinsight-primary hover:bg-auditinsight-primary cursor-pointer rounded-full border bg-white px-2 py-1 text-xs transition-colors duration-200 hover:text-white"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Define types for API response
interface ApiRecord {
  Cluster_Id: string;
  Transaction_Type: string;
  Transaction_Id: string;
  " Amount ": string;
  Date: string;
  "Linked To": string | null;
  "Link Status": string;
  "Link Confidence Score": number;
  "Link Type": string;
  "Date Gap (Days)": string | null;
  " Amount Delta $ ": string | null;
  "Sequence Validity Flag": boolean;
  "Manual Override Flag": boolean;
  "Linkage Justification Text": string;
  "Entity Match Score": number;
  "Chain Completeness Flag": boolean;
  "Link Risk Score": string;
  "Audit Score": number;
  Prediction: string;
}

interface ApiResponse {
  guid?: string;
  recordId?: string;
  status?: string;
  timestamp?: string;
  dataStats?: {
    totalRecords: number;
    filteredRecords: number;
    analysisScope: string;
    filterInfo: string;
    availableColumns: string[];
  };
  analysis?: {
    narrativeSummary?: string;
    justification?: string;
    actionSolution?: string;
    prompt_processed?: string;
    record_scope?: string;
    analysis_type?: string;
    suggestedFollowOn?: string[];
    sampleRecords?: ApiRecord[];
  };
  narrativeSummary?: string;
  justification?: string;
  actionSolution?: string;
  summary?: string;
  recommendations?: string;
  findings?: string;
  riskAssessment?: string;
  suggestedFollowOn?: string[];
  followOnQuestions?: string[];
}

// Helper function for Link Status badge styling
const getLinkStatusBadgeClass = (status: string | null) => {
  if (!status)
    return "w-fit rounded-sm bg-gray-500 px-3 py-1 text-xs text-white";

  switch (status.toUpperCase()) {
    case "ORIGIN":
      return "w-fit rounded-sm bg-green-800 px-3 py-1 text-xs text-white";
    case "STRONG LINK":
      return "w-fit rounded-sm bg-blue-800 px-3 py-1 text-xs text-white";
    case "WEAK LINK":
      return "w-fit rounded-sm bg-amber-800 px-3 py-1 text-xs text-white";
    case "NO LINK":
      return "w-fit rounded-sm bg-red-800 px-3 py-1 text-xs text-white";
    default:
      return "w-fit rounded-sm bg-gray-600 px-3 py-1 text-xs text-white";
  }
};

// Helper function for Prediction badge styling
const getPredictionBadgeClass = (prediction: string | null) => {
  if (!prediction)
    return "w-fit rounded-sm bg-gray-500 px-3 py-1 text-xs text-white";

  switch (prediction.toUpperCase()) {
    case "CLEAN":
      return "w-fit rounded-sm bg-green-800 px-3 py-1 text-xs text-white";
    case "POTENTIAL NFR":
      return "w-fit rounded-sm bg-amber-700 px-3 py-1 text-xs text-white";
    case "LIKELY NFR":
      return "w-fit rounded-sm bg-red-800 px-3 py-1 text-xs text-white";
    default:
      return "w-fit rounded-sm bg-gray-600 px-3 py-1 text-xs text-white";
  }
};

// Transform API response to card format
const transformApiDataToCards = (
  apiResponse: ApiResponse
): TransactionCard[] => {
  if (!apiResponse?.analysis?.sampleRecords) {
    return [];
  }

  const sampleRecords = apiResponse.analysis.sampleRecords;
  const cards: TransactionCard[] = [];

  // Define card configurations with varied colors and appropriate icons
  const cardConfigs = {
    Obligation: {
      id: "obligation",
      title: "OBLIGATION",
      icon: "ClipboardCheck",
      bgColor: "#1e3a8a", // Keep for fallback
      gradientClass: "bg-gradient-to-br from-blue-900 to-blue-700",
    },
    Invoice: {
      id: "invoice",
      title: "INVOICE",
      icon: "Receipt",
      bgColor: "#5b21b6", // Keep for fallback
      gradientClass: "bg-gradient-to-br from-purple-900 to-purple-700",
    },
    Disbursement: {
      id: "disbursement",
      title: "DISBURSEMENT",
      icon: "BadgeDollarSign",
      bgColor: "#065f46", // Keep for fallback
      gradientClass: "bg-gradient-to-br from-red-900 to-red-700",
    },
    "Goods Receipt": {
      id: "goods-receipt",
      title: "GOODS RECEIPT",
      icon: "ShoppingBag",
      bgColor: "#7c2d12", // Keep for fallback
      gradientClass: "bg-gradient-to-br from-green-900 to-green-700",
    },
    "Journal Voucher": {
      id: "journal-voucher",
      title: "JOURNAL VOUCHER",
      icon: "BookText",
      bgColor: "#7f1d1d", // Keep for fallback
      gradientClass: "bg-gradient-to-br from-red-900 to-red-700",
    },
  };

  // Process each record and create cards
  sampleRecords.forEach((record: ApiRecord) => {
    const transactionType = record.Transaction_Type;
    const config = cardConfigs[transactionType as keyof typeof cardConfigs];

    if (config) {
      const fields = [
        {
          label: "ID",
          value: record.Transaction_Id || "N/A",
          component: "text" as const,
        },
        {
          label: "Date",
          value: record.Date || "N/A",
          component: "text" as const,
        },
        {
          label: "Amount",
          value: record[" Amount "] || "N/A",
          component: "text" as const,
        },
        {
          label: "Status",
          value: record["Link Status"] || "N/A",
          component: "badge" as const,
          props: {
            className: getLinkStatusBadgeClass(record["Link Status"]),
          },
        },
        // Removed "Linked To" field from here as it's now handled specially in TransactionCard component
        {
          component: "chart" as const,
          label: "Confidence Score",
          value: formatPercentage(record["Link Confidence Score"] || 0),
          props: {
            score: Math.round((record["Link Confidence Score"] || 0) * 100),
            size: 38,
          },
        },
        {
          component: "chart" as const,
          label: "Audit Score",
          value: formatPercentage(record["Audit Score"] || 0),
          props: {
            score: Math.round((record["Audit Score"] || 0) * 100),
            size: 38,
          },
        },
        {
          label: "Prediction",
          value: record.Prediction || "N/A",
          component: "badge" as const,
          props: {
            className: getPredictionBadgeClass(record.Prediction),
          },
        },
      ];

      cards.push({
        id: config.id,
        title: config.title,
        icon: config.icon,
        bgColor: config.bgColor,
        gradientClass: config.gradientClass,
        fields: fields,
        // Adding linkedTo data as a top-level property so TransactionCard can access it
        linkedTo: record["Linked To"] || "N/A",
      });
    }
  });

  return cards;
};

// Transform API response to insights format
const transformApiDataToInsights = (apiResponse: ApiResponse) => {
  if (!apiResponse?.analysis?.sampleRecords) {
    return null;
  }

  const records = apiResponse.analysis.sampleRecords;

  // Calculate overall metrics from the records
  const totalRecords = records.length;
  const avgAuditScore =
    records.reduce((sum, record) => sum + (record["Audit Score"] || 0), 0) /
    totalRecords;
  const avgConfidence =
    records.reduce(
      (sum, record) => sum + (record["Link Confidence Score"] || 0),
      0
    ) / totalRecords;

  return {
    keyMetrics: {
      classification: "Transaction Chain",
      anomalyFlag: "None",
      linkConfidence: `${Math.round(avgConfidence * 100)}%`,
      auditScore: `${Math.round(avgAuditScore * 100)}%`,
      evidenceStatus: "Complete",
      fixabilityScore: "85%",
      justificationQuality: avgConfidence > 0.8 ? "High" : "Medium",
      manualOverrides: "None",
      nfrPrediction: "Clean",
      capRecommended: "No",
      chainCompleteness: "Complete",
    },
    narrativeSummary: apiResponse.narrativeSummary || "",
    justification: apiResponse.justification || "",
    actionSolution: apiResponse.actionSolution || "",
    totalRecords,
    recordId: apiResponse.recordId || "",
    status: apiResponse.status || "",
    timestamp: apiResponse.timestamp || "",
  };
};

export default function TransactionExplorerPage() {
  const { setPanelContent, clearPanelContent } = useInsightsPanel();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Ref to track if we've already loaded from URL params
  const initialLoadComplete = useRef(false);
  // Ref to track the last URL parameter we processed
  const lastUrlRecordId = useRef("");

  // State for loading and API response
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

  // Cache for API responses
  const [cachedResponses, setCachedResponses] = useState<
    Record<string, ApiResponse>
  >({});

  // State for input field - no default value
  const [recordId, setRecordId] = useState("");

  // State for PDF generation
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Memoize the panel content update function to avoid infinite loops
  const updatePanelContent = useCallback(
    (response: ApiResponse | null) => {
      const insightsData = response
        ? transformApiDataToInsights(response)
        : null;

      if (insightsData) {
        // Auto-open panel when data is available
        setPanelContent(
          {
            transactionInsights: true,
            apiInsights: insightsData,
          },
          true
        );
      }
    },
    [setPanelContent]
  );

  // Set the panel content when API response changes
  useEffect(() => {
    updatePanelContent(apiResponse);
  }, [apiResponse, updatePanelContent]);

  // Handle enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(false);
    }
  };

  // Handle search button click - memoized to use in useEffect
  const handleSearch = useCallback(
    async (skipValidation = false) => {
      // Validate input (skip validation when coming from URL navigation)
      if (!skipValidation && !recordId.trim()) {
        alert("Please enter a record ID.");
        return;
      }

      const trimmedRecordId = recordId.trim();

      // If there's still no recordId after trimming, don't proceed
      if (!trimmedRecordId) {
        return;
      }

      // Update URL with the recordId parameter without causing a page reload
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("recordId", trimmedRecordId);
      router.replace(currentUrl.pathname + currentUrl.search, {
        scroll: false,
      });

      // Check if we already have this result in cache
      if (cachedResponses[trimmedRecordId]) {
        console.log("Using cached response for record ID:", trimmedRecordId);
        setApiResponse(cachedResponses[trimmedRecordId]);
        updatePanelContent(cachedResponses[trimmedRecordId]);
        return;
      }

      // Clear panel content and close panel when starting a new search
      clearPanelContent();
      setApiResponse(null);

      setIsLoading(true);
      try {
        console.log("Calling transaction chain API...");

        const requestBody = {
          prompt: "Analyze", // Static prompt as per requirement
          recordId: trimmedRecordId,
        };

        const response = await fetch("/api/transaction-chain", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error(`API call failed: ${response.status}`);
        }

        const data = await response.json();
        console.log("Transaction Chain API Response:", data);

        // Store in cache
        setCachedResponses(prev => ({
          ...prev,
          [trimmedRecordId]: data,
        }));

        setApiResponse(data);
      } catch (error) {
        console.error("Error calling transaction chain API:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [recordId, cachedResponses, clearPanelContent, updatePanelContent, router]
  );

  // Auto-fetch data when component mounts with recordId in URL
  useEffect(() => {
    const urlRecordId = searchParams.get("recordId");

    if (urlRecordId && urlRecordId !== lastUrlRecordId.current) {
      // Update our ref to the latest URL parameter we've seen
      lastUrlRecordId.current = urlRecordId;

      // Only set the recordId if this is the first load
      // This preserves any manual edits the user has made
      if (!initialLoadComplete.current) {
        setRecordId(urlRecordId);
      }

      // Handle the case when navigating directly from audit workbench or URL param changes
      if (!initialLoadComplete.current) {
        // Use a slightly longer timeout to ensure the state update completes
        setTimeout(() => {
          // Make sure we're using the URL parameter directly rather than the state
          // which might not have updated yet
          const requestBody = {
            prompt: "Analyze",
            recordId: urlRecordId,
          };

          // Start loading state
          setIsLoading(true);

          // Clear panel and previous responses
          clearPanelContent();
          setApiResponse(null);

          console.log("Auto-fetching data for record ID:", urlRecordId);

          // Execute the API call directly instead of going through handleSearch
          fetch("/api/transaction-chain", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          })
            .then(response => {
              if (!response.ok) {
                throw new Error(`API call failed: ${response.status}`);
              }
              return response.json();
            })
            .then(data => {
              console.log("Transaction Chain API Response:", data);

              // Update cache
              setCachedResponses(prev => ({
                ...prev,
                [urlRecordId]: data,
              }));

              // Set response data
              setApiResponse(data);
            })
            .catch(error => {
              console.error("Error calling transaction chain API:", error);
            })
            .finally(() => {
              setIsLoading(false);
            });
        }, 100); // Slightly longer timeout
      }

      // Mark that we've completed the initial load
      initialLoadComplete.current = true;
    }
  }, [searchParams, clearPanelContent, updatePanelContent, setCachedResponses]);

  // Handle suggested question click - now only updates the search
  const _handleQuestionClick = useCallback(
    (question: string) => {
      // Extract any record ID pattern from the question (e.g., "CL-1234")
      const recordIdMatch = question.match(/\b([A-Z]+-\d+)\b/);
      if (recordIdMatch) {
        setRecordId(recordIdMatch[1]);
        handleSearch(false);
      }
    },
    [handleSearch]
  );

  // Handle PDF generation
  const handleGenerateCAP = async () => {
    if (!apiResponse) return;

    setIsGeneratingPDF(true);
    try {
      const insightsData = transformApiDataToInsights(apiResponse);
      if (insightsData) {
        await generateCAPPDF({
          keyMetrics: insightsData.keyMetrics,
          narrativeSummary: apiResponse.narrativeSummary,
          justification: apiResponse.justification,
          actionSolution: apiResponse.actionSolution,
          recordId: apiResponse.recordId,
          totalRecords: insightsData.totalRecords,
          timestamp: apiResponse.timestamp,
        });
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="mx-auto">
      <div className="flex min-h-full gap-6">
        {/* Main Content Area - no right padding needed */}
        <div className="w-full flex-shrink-0">
          <div className="text-left">
            {/* Search Section */}
            <div className="mb-4 flex items-center gap-4">
              {/* Record ID input - now wider since we removed the prompt field */}
              <div className="max-w-md flex-1">
                <input
                  type="text"
                  value={recordId}
                  onChange={e => setRecordId(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter Record ID (ex: CL-1000)"
                  className="w-full rounded-sm border border-gray-300 bg-white px-3 py-2 focus:border-gray-400 focus:ring-1 focus:ring-gray-200 focus:outline-none"
                  aria-label="Record ID"
                />
              </div>

              {/* Search button */}
              <div
                onClick={() => handleSearch(false)}
                className={clsx(
                  "flex items-center justify-center",
                  "px-4 py-2 text-white",
                  "bg-auditinsight-primary rounded-sm shadow-md",
                  "cursor-pointer transition-colors hover:bg-[#0a5a8f]",
                  isLoading ? "cursor-not-allowed opacity-50" : ""
                )}
              >
                <Search className="mr-2 h-6 w-6" />
                <span>Analyze</span>
                {isLoading && (
                  <span className="ml-2 text-sm">(Loading...)</span>
                )}
              </div>
            </div>

            {/* Content - Only show after API response */}
            {apiResponse && (
              <div className="space-y-6">
                {/* Transaction Chain Cards */}
                <TransactionChain
                  cards={transformApiDataToCards(apiResponse)}
                  showArrows={true}
                />

                {/* First Row: Narrative Summary and Justification side by side */}
                <div className="mb-6 grid grid-cols-2 items-start gap-6">
                  {/* Narrative Summary Card */}
                  <Card
                    header={{
                      title: (
                        <div className="flex items-center">
                          <BarChart4 className="mr-2 h-5 w-5" />
                          <span>Analyze</span>
                        </div>
                      ),
                    }}
                  >
                    {apiResponse.narrativeSummary ? (
                      <FormattedResponseContent
                        content={apiResponse.narrativeSummary}
                      />
                    ) : (
                      <div className="text-sm">
                        No narrative summary available.
                      </div>
                    )}
                  </Card>

                  {/* Justification Card */}
                  <Card
                    header={{
                      title: (
                        <div className="flex items-center">
                          <LightbulbIcon className="mr-2 h-5 w-5" />
                          <span>Interpret</span>
                        </div>
                      ),
                    }}
                  >
                    <div
                      className="text-sm leading-relaxed whitespace-pre-line"
                      dangerouslySetInnerHTML={{
                        __html:
                          apiResponse.justification ||
                          "No justification available.",
                      }}
                    />
                  </Card>
                </div>

                {/* Second Row: Follow-on questions in a horizontal row */}
                {/*
                {(apiResponse.suggestedFollowOn ||
                  apiResponse.followOnQuestions) && (
                  <div className="mb-6">
                    <Card
                      header={{
                        title: (
                          <div className="flex items-center">
                            <HelpCircle className="mr-2 h-5 w-5" />
                            <span>Suggested Questions</span>
                          </div>
                        ),
                      }}
                    >
                      <div className="px-2">
                        <div className="flex flex-wrap gap-2">
                          {(
                            apiResponse.suggestedFollowOn ||
                            apiResponse.followOnQuestions
                          )?.map((question, index) => (
                            <button
                              key={index}
                              onClick={() => handleQuestionClick(question)}
                              className="border-auditinsight-primary text-auditinsight-primary hover:bg-auditinsight-primary cursor-pointer rounded-full border bg-white px-3 py-1 text-xs transition-colors duration-200 hover:text-white"
                            >
                              {question}
                            </button>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
                  */}

                {/* Third Row: Recommendation Card */}
                <div>
                  <Card
                    header={{
                      title: (
                        <div className="flex items-center">
                          <Scale className="mr-2 h-5 w-5" />
                          <span>Recommend</span>
                        </div>
                      ),
                      actions: (
                        <button
                          onClick={handleGenerateCAP}
                          disabled={isGeneratingPDF}
                          className={clsx(
                            "bg-auditinsight-primary hover:bg-auditinsight-primary-80",
                            "rounded-md px-3 py-1",
                            "text-xs text-white transition-colors",
                            isGeneratingPDF
                              ? "cursor-not-allowed opacity-50"
                              : ""
                          )}
                        >
                          {isGeneratingPDF ? "Generating..." : "Generate CAP"}
                        </button>
                      ),
                    }}
                  >
                    <div
                      className="text-sm leading-relaxed whitespace-pre-line"
                      dangerouslySetInnerHTML={{
                        __html:
                          apiResponse.actionSolution ||
                          "No recommendation available.",
                      }}
                    />
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
