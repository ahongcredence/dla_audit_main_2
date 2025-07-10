import jsPDF from "jspdf";

interface CAPData {
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
}

export const generateCAPPDF = async (data: CAPData) => {
  // Create PDF
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Colors
  const primaryColor = [30, 58, 138]; // Navy blue #1e3a8a
  const textColor = [0, 0, 0]; // Black
  const grayColor = [102, 102, 102]; // Gray #666

  // Format the current date
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  // Generate CAP ID based on record ID
  const capId = data.recordId
    ? `CAP-${data.recordId.replace("CL-", "")}024`
    : "CAP-1024";

  // Helper function to clean text of HTML tags and formatting
  const cleanText = (text: string): string => {
    if (!text) return "";

    return (
      text
        // First normalize Unicode characters
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks
        .normalize("NFC")

        // Remove field labels and metadata
        .replace(/\(Field \d+\)/gi, "")
        .replace(/Narrative \(Field \d+\)/gi, "")
        .replace(/Justification \(Field \d+\)/gi, "")

        // Remove encoding artifacts and corrupted character sequences
        .replace(/[Ø=ÜÝ]+/g, "")
        .replace(/[^\x00-\x7F]+/g, " ") // Remove non-ASCII characters

        // Convert smart quotes and special punctuation to ASCII
        .replace(/[""]/g, '"')
        .replace(/['']/g, "'")
        .replace(/[–—]/g, "-")
        .replace(/…/g, "...")
        .replace(/[•·]/g, "•")

        // Remove HTML tags and markdown
        .replace(/<[^>]*>/g, "")
        .replace(/\*\*/g, "")
        .replace(/\*/g, "")

        // Fix common encoding issues
        .replace(/â€™/g, "'")
        .replace(/â€œ/g, '"')
        .replace(/â€/g, '"')
        .replace(/Â/g, "")

        // Normalize whitespace aggressively
        .replace(/\s+/g, " ")
        .replace(/\s*([.,:;!?])\s*/g, "$1 ")
        .replace(/\s+([.,:;!?])/g, "$1")

        // Clean up word boundaries
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/([a-zA-Z])(\d)/g, "$1 $2")
        .replace(/(\d)([a-zA-Z])/g, "$1 $2")

        // Final cleanup
        .trim()
        .replace(/\s+/g, " ")
    );
  };

  // Helper function to add text with word wrapping
  const addWrappedText = (
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    fontSize: number = 10,
    color: number[] = textColor,
    fontStyle: string = "normal"
  ): number => {
    const cleanedText = cleanText(text);
    pdf.setFont("helvetica", fontStyle);
    pdf.setFontSize(fontSize);
    pdf.setTextColor(color[0], color[1], color[2]);
    const lines = pdf.splitTextToSize(cleanedText, maxWidth);
    pdf.text(lines, x, y);
    return y + lines.length * (fontSize * 0.4); // Fixed line height calculation
  };

  // Helper function to check if we need a new page
  const checkPageBreak = (requiredSpace: number): number => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      pdf.addPage();
      return margin;
    }
    return yPosition;
  };

  // Header with Logo and Title
  yPosition = checkPageBreak(40);

  // DLA Logo (simple rectangle)
  pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.rect(margin, yPosition, 20, 15, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("DLA", margin + 10, yPosition + 10, {
    align: "center",
  });

  // Title
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.setFontSize(20);
  pdf.setFont("helvetica", "bold");
  pdf.text("DLA Finance AuditInsight CAP", margin + 25, yPosition + 10);

  // Generated date
  pdf.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Generated: ${currentDate}`, margin, yPosition + 20);

  // Header line
  pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.setLineWidth(1);
  pdf.line(margin, yPosition + 25, pageWidth - margin, yPosition + 25);

  yPosition += 35;

  // CAP Information Section
  yPosition = checkPageBreak(50);
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("CAP Information", margin, yPosition);

  pdf.setDrawColor(204, 204, 204);
  pdf.setLineWidth(0.5);
  pdf.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);

  yPosition += 10;

  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");

  const capInfo = [
    `Cluster ID: ${data.recordId || "CL-1000"}`,
    `CAP ID: ${capId}`,
    "Root Cause: Timing Mismatch in Disbursement Posting",
    "Finding Summary:",
    "    Disbursement occurred two days after JV posting, causing a delay in transaction closure and triggering an anomaly flag.",
  ];

  capInfo.forEach(info => {
    yPosition = addWrappedText(
      info,
      margin + 5,
      yPosition,
      contentWidth - 5,
      10
    );
    yPosition += 2;
  });

  yPosition += 10;

  // Narrative Section
  yPosition = checkPageBreak(30);
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Analyze", margin, yPosition);

  pdf.setDrawColor(204, 204, 204);
  pdf.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);

  yPosition += 10;

  const narrativeText = data.narrativeSummary
    ? data.narrativeSummary.replace(/\*\*/g, "")
    : `The financial transaction chain associated with Cluster ${data.recordId || "CL-1000"} was flagged due to a timing mismatch between the posting of the journal voucher (JV) and the execution of the disbursement. While the obligation, invoice, and JV were posted in proper sequence with consistent values, the disbursement occurred two business days later, triggering a system-generated anomaly. The delay stemmed from inter-system processing lag, not documentation gaps or manual intervention. Although the chain is complete and audit-traceable, this deviation from expected timelines reduces confidence in processing discipline and could elevate audit sensitivity if repeated.`;

  yPosition = addWrappedText(
    narrativeText,
    margin + 5,
    yPosition,
    contentWidth - 5,
    10,
    textColor,
    "normal"
  );
  yPosition += 10;

  // Justification Section
  yPosition = checkPageBreak(30);
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Interpret", margin, yPosition);

  pdf.setDrawColor(204, 204, 204);
  pdf.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);

  yPosition += 10;

  const justificationText = data.justification
    ? data.justification.replace(/\*\*/g, "")
    : "All records in the chain are complete, accurate, and system-linked using high-confidence logic (scores 0.82). No manual overrides were used. Each transaction matches in amount, and supporting documentation is available. The delay between the JV and disbursement did not result in duplication or error. While not material, the issue highlights inconsistent timing across systems, which—if left unaddressed—could weaken audit posture. This cluster is audit-supportable, but calls for a preventive response.";

  yPosition = addWrappedText(
    justificationText,
    margin + 5,
    yPosition,
    contentWidth - 5,
    10,
    textColor,
    "normal"
  );
  yPosition += 10;

  // Corrective Action Plan Section
  yPosition = checkPageBreak(50);
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Corrective Action Plan", margin, yPosition);

  pdf.setDrawColor(204, 204, 204);
  pdf.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);

  yPosition += 10;

  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text("CAP Details:", margin + 5, yPosition);
  yPosition += 8;

  const capDetails = [
    "• Remediation Priority: Medium",
    "• Estimated Recovery: None (process-focused)",
    "• Target Completion Date: 2024-09-30",
    "• Owner: Audit Team 2",
    "• CAP Status: Planned",
    "• CAP Type: Preventive Control (timing-based alert)",
  ];

  pdf.setFont("helvetica", "normal");
  capDetails.forEach(detail => {
    yPosition = addWrappedText(
      detail,
      margin + 10,
      yPosition,
      contentWidth - 10,
      10
    );
    yPosition += 2;
  });

  yPosition += 10;

  // Findings Summary Section
  yPosition = checkPageBreak(80);
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Findings Summary", margin, yPosition);

  pdf.setDrawColor(204, 204, 204);
  pdf.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);

  yPosition += 15;

  // Table data
  const tableData = [
    ["Indicator", "Score/Status", "Description"],
    [
      "Audit Confidence Score",
      data.keyMetrics?.auditScore || "82%",
      "Chain is reliable, but flagged for delay",
    ],
    [
      "Fixability Score",
      data.keyMetrics?.fixabilityScore || "82%",
      "Easily addressable through process control",
    ],
    [
      "Chain Completeness",
      data.keyMetrics?.chainCompleteness || "Complete",
      "All records from obligation to disbursement present",
    ],
    [
      "Link Confidence",
      data.keyMetrics?.linkConfidence || "0.82 - 1.00",
      "High-confidence system-generated linkages",
    ],
    [
      "Sequence Validity",
      "Valid",
      "Transaction dates follow chronological order",
    ],
    [
      "Manual Overrides",
      data.keyMetrics?.manualOverrides || "None",
      "All records automatically linked by system",
    ],
    [
      "Anomaly Flag",
      "Disbursement Delayed",
      "Disbursement outside expected timing window",
    ],
    [
      "NFR Prediction",
      data.keyMetrics?.nfrPrediction || "Potential NFR",
      "Could trigger audit review if pattern repeats",
    ],
    [
      "CAP Recommended",
      data.keyMetrics?.capRecommended || "Yes",
      "Procedural control needed to prevent recurrence",
    ],
    [
      "Justification Quality",
      data.keyMetrics?.justificationQuality || "Strong",
      "Chain supportable with no material weaknesses",
    ],
  ];

  // Table dimensions
  const colWidths = [60, 40, 70];
  const rowHeight = 8;
  let tableY = yPosition;

  // Draw table
  tableData.forEach((row, rowIndex) => {
    // Check if we need a new page for this row
    if (tableY + rowHeight > pageHeight - margin) {
      pdf.addPage();
      tableY = margin;
    }

    let cellX = margin + 5;

    row.forEach((cell, colIndex) => {
      // Header row styling
      if (rowIndex === 0) {
        pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.rect(cellX, tableY, colWidths[colIndex], rowHeight, "F");
        pdf.setTextColor(255, 255, 255);
        pdf.setFont("helvetica", "bold");
      } else {
        // Data row styling
        pdf.setDrawColor(204, 204, 204);
        pdf.rect(cellX, tableY, colWidths[colIndex], rowHeight);
        pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
        pdf.setFont("helvetica", "normal");
      }

      // Add text
      pdf.setFontSize(8);
      const lines = pdf.splitTextToSize(cell, colWidths[colIndex] - 4);
      pdf.text(lines, cellX + 2, tableY + 5);

      cellX += colWidths[colIndex];
    });

    tableY += rowHeight;
  });

  // Generate filename
  const filename = `DLA_CAP_${data.recordId || "CL-1000"}_${currentDate.replace(/\//g, "-")}.pdf`;

  // Save the PDF
  pdf.save(filename);
};
