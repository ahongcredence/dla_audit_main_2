// Mock responses for specific transaction chain queries
export interface MockTransactionResponse {
  analysis: {
    sampleRecords: Array<{
      ID: string;
      Date: string;
      Amount: number;
      "Linked To": string | null;
      "Link Type": string;
      Confidence: number;
      "Audit Score": number;
      "Transaction Type": string;
    }>;
  };
  narrativeSummary: string;
  justification: string;
  actionSolution: string;
  suggestedQuestions: string[];
  guid: string;
  recordId: string;
  status: string;
  timestamp: string;
}

export const mockResponses: Record<string, MockTransactionResponse> = {
  "Show me all disbursements over $50,000 that are weakly linked or flagged as Potential NFR.":
    {
      analysis: {
        sampleRecords: [
          {
            ID: "DIS-2024-001",
            Date: "2024-03-15",
            Amount: 75000,
            "Linked To": "OBL-2024-045",
            "Link Type": "Semantic",
            Confidence: 0.63,
            "Audit Score": 0.58,
            "Transaction Type": "Disbursement",
          },
          {
            ID: "DIS-2024-002",
            Date: "2024-03-18",
            Amount: 82500,
            "Linked To": "INV-2024-123",
            "Link Type": "Semantic",
            Confidence: 0.61,
            "Audit Score": 0.65,
            "Transaction Type": "Disbursement",
          },
          {
            ID: "DIS-2024-003",
            Date: "2024-03-22",
            Amount: 95000,
            "Linked To": "OBL-2024-067",
            "Link Type": "Semantic",
            Confidence: 0.67,
            "Audit Score": 0.62,
            "Transaction Type": "Disbursement",
          },
          {
            ID: "DIS-2024-004",
            Date: "2024-03-25",
            Amount: 68000,
            "Linked To": "INV-2024-156",
            "Link Type": "Semantic",
            Confidence: 0.59,
            "Audit Score": 0.61,
            "Transaction Type": "Disbursement",
          },
        ],
      },
      narrativeSummary:
        '**Analyze**\n\nWe identified 19 disbursements over $50,000 with the following risk indicators:\n• Link Status = WEAK LINK\n• Prediction = Potential NFR\n• Average audit score: 0.63\n• Average amount delta: $5,397\n• CAP Recommendation: 100% flagged, with 19 labeled "CAP – Review Disbursement"\n\nAll transactions are semantically linked with moderate-to-low confidence (avg: 0.63), and date gaps range from 0 to 293 days.\n\n**Interpret**\n\nThese disbursements are not traceable through exact references to obligations or invoices. The weak semantic links, long date gaps, and material dollar values create elevated audit risk—especially when clustered in the same processing window.\n\n**Recommend**\n\nPrioritize these 19 records for CAP action. Begin root cause analysis on semantic disbursement chains with low confidence and flag them for justification generation.',
      justification:
        "The analysis reveals systematic weaknesses in disbursement traceability that pose significant audit risks. With 100% of identified transactions showing weak semantic linkage and potential NFR classification, immediate remediation is required to ensure compliance with federal audit standards.",
      actionSolution:
        "Implement immediate CAP actions for all 19 flagged disbursements. Establish enhanced documentation requirements for semantic-only links and develop automated alerts for disbursements exceeding confidence thresholds. Consider manual review processes for high-value transactions with weak linkage.",
      suggestedQuestions: [
        "Are there similar issues in the $50K–$100K range that also show these audit risk signals?",
        "Do these disbursements show significant amount increases compared to their upstream documents?",
        "Are these disbursements concentrated within specific fiscal periods?",
      ],
      guid: "mock-analysis-001",
      recordId: "CL-1000",
      status: "completed",
      timestamp: new Date().toISOString(),
    },

  "Are there similar issues in the $50K–$100K range that also show these audit risk signals?":
    {
      analysis: {
        sampleRecords: [
          {
            ID: "DIS-2024-005",
            Date: "2024-03-10",
            Amount: 65000,
            "Linked To": "OBL-2024-089",
            "Link Type": "Semantic",
            Confidence: 0.52,
            "Audit Score": 0.48,
            "Transaction Type": "Disbursement",
          },
          {
            ID: "JV-2024-012",
            Date: "2024-03-12",
            Amount: 78000,
            "Linked To": "INV-2024-201",
            "Link Type": "Semantic",
            Confidence: 0.55,
            "Audit Score": 0.51,
            "Transaction Type": "Journal Voucher",
          },
          {
            ID: "INV-2024-087",
            Date: "2024-03-14",
            Amount: 72500,
            "Linked To": "OBL-2024-112",
            "Link Type": "Semantic",
            Confidence: 0.49,
            "Audit Score": 0.53,
            "Transaction Type": "Invoice",
          },
          {
            ID: "DIS-2024-006",
            Date: "2024-03-16",
            Amount: 89000,
            "Linked To": "JV-2024-045",
            "Link Type": "Semantic",
            Confidence: 0.58,
            "Audit Score": 0.56,
            "Transaction Type": "Disbursement",
          },
        ],
      },
      narrativeSummary:
        "**Analyze**\n\nYes — we identified 42 transactions between $50,000 and $100,000 that share the same risk profile as the high-value disbursements:\n• 100% have Link Status = WEAK LINK or Prediction = Potential NFR\n• Average audit score: 0.53\n• Average link confidence: 0.53\n• Average amount delta: $7,959\n• Average date gap: 55 days\n\n**CAP Recommendations:**\n• 19: Review Disbursement\n• 16: Review Journal Voucher\n• 7: Review Invoice\n\n**Transaction Types:**\n• 19 Disbursements\n• 16 Journal Vouchers\n• 7 Invoices\n\n**Interpret**\n\nThe audit risk is not limited to high-dollar transactions. This mid-value range reveals a consistent pattern of:\n• Semantic-only linkage\n• Weak confidence\n• Financial mismatches across document steps\n• Concentrated CAP flags across multiple transaction types\n\nThis indicates a systemic breakdown in document traceability—especially in disbursement and voucher chains.\n\n**Recommend**\n\nImmediately include this $50K–$100K cohort in audit remediation plans. Cluster by transaction type and CAP category. Use these records to train classification models for future risk detection across all transaction values.",
      justification:
        "The expanded analysis confirms that audit risk patterns extend beyond high-value transactions into the mid-range category. The consistent weak linkage patterns across multiple transaction types indicate systemic process failures requiring comprehensive remediation rather than isolated fixes.",
      actionSolution:
        "Develop a comprehensive remediation strategy that addresses the $50K-$100K transaction cohort alongside high-value disbursements. Implement transaction-type-specific review processes and establish automated monitoring for similar risk patterns across all value ranges.",
      suggestedQuestions: [
        "Do these transactions show significant amount increases compared to their upstream documents?",
        "How many of these transactions are clustered within the same obligation or voucher chains?",
        "Are audit risks in this range higher during specific months or fiscal quarters?",
      ],
      guid: "mock-analysis-002",
      recordId: "CL-1000",
      status: "completed",
      timestamp: new Date().toISOString(),
    },
};

// Helper function to get mock response by exact query match
export function getMockResponse(query: string): MockTransactionResponse | null {
  return mockResponses[query] || null;
}
