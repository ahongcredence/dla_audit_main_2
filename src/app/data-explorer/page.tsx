"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import clsx from "clsx";
import { BadgeDollarSign, FileText, Receipt, ShoppingBag } from "lucide-react";

import DataTable from "../components/DataTable";
import { useLayout } from "../components/LayoutContext";
import ChatInput from "../components/chat/ChatInput";
import { TableColumn } from "../types";

// Define the interface for prompt cards
interface PromptCard {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  gradientClasses: string;
}

export default function DataExplorerPage() {
  const { setPageTitle, setPageIcon, setPageFooterContent } = useLayout();

  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Define the prompt cards
  const promptCards: PromptCard[] = [
    {
      id: "obligation",
      title: "Obligation",
      description:
        "Analyze obligations for compliance with financial regulations and potential audit risks",
      icon: FileText,
      gradientClasses: "bg-gradient-to-br from-blue-900 to-blue-700",
    },
    {
      id: "goods-received",
      title: "Goods Received",
      description:
        "Examine goods received records to verify proper receipt and documentation of assets",
      icon: ShoppingBag,
      gradientClasses: "bg-gradient-to-br from-green-900 to-green-700",
    },
    {
      id: "invoice",
      title: "Invoice",
      description:
        "Review invoices for accuracy, approval status, and payment validation",
      icon: Receipt,
      gradientClasses: "bg-gradient-to-br from-sky-900 to-sky-700",
    },
    {
      id: "disbursement",
      title: "Disbursement",
      description:
        "Evaluate disbursement transactions for proper authorization and documentation",
      icon: BadgeDollarSign,
      gradientClasses: "bg-gradient-to-br from-red-900 to-red-700",
    },
  ];

  // Define the columns for the data table
  const columns: TableColumn[] = [
    {
      key: "transactionId",
      label: "Transaction ID",
      sortable: true,
    },
    {
      key: "type",
      label: "Transaction Type",
      sortable: true,
    },
    {
      key: "date",
      label: "Date",
      sortable: true,
    },
    {
      key: "amount",
      label: "Amount",
      sortable: true,
    },
    {
      key: "vendor",
      label: "Vendor/Supplier",
      sortable: true,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
    },
    {
      key: "documentNumber",
      label: "Document Number",
      sortable: true,
    },
    {
      key: "riskScore",
      label: "Risk Score",
      sortable: true,
    },
    {
      key: "department",
      label: "Department",
      sortable: true,
    },
  ];

  // Mock data for the table
  const mockData = [
    {
      id: "1",
      transactionId: "OBL-2025-00123",
      type: "Obligation",
      date: "05/15/2025",
      amount: "$45,250.00",
      vendor: "Acme Defense Systems",
      status: "Active",
      documentNumber: "CONT-2025-A7821",
      riskScore: "Low",
      department: "DLA Operations",
    },
    {
      id: "2",
      transactionId: "GR-2025-03471",
      type: "Goods Received",
      date: "05/23/2025",
      amount: "$32,120.50",
      vendor: "TechSupply Corp",
      status: "Verified",
      documentNumber: "RCPT-2025-B4109",
      riskScore: "Medium",
      department: "Equipment Division",
    },
    {
      id: "3",
      transactionId: "INV-2025-09123",
      type: "Invoice",
      date: "06/02/2025",
      amount: "$32,120.50",
      vendor: "TechSupply Corp",
      status: "Pending Approval",
      documentNumber: "INV-TS-45921",
      riskScore: "Low",
      department: "Accounts Payable",
    },
    {
      id: "4",
      transactionId: "DIS-2025-01832",
      type: "Disbursement",
      date: "06/12/2025",
      amount: "$32,120.50",
      vendor: "TechSupply Corp",
      status: "Completed",
      documentNumber: "PAY-2025-18473",
      riskScore: "Low",
      department: "Treasury",
    },
    {
      id: "5",
      transactionId: "OBL-2025-00456",
      type: "Obligation",
      date: "05/18/2025",
      amount: "$128,950.75",
      vendor: "Global Military Solutions",
      status: "Active",
      documentNumber: "CONT-2025-A7903",
      riskScore: "High",
      department: "Procurement",
    },
    {
      id: "6",
      transactionId: "GR-2025-03689",
      type: "Goods Received",
      date: "06/01/2025",
      amount: "$76,432.25",
      vendor: "Advanced Components Inc",
      status: "Partial",
      documentNumber: "RCPT-2025-B4298",
      riskScore: "Medium",
      department: "Supply Chain",
    },
    {
      id: "7",
      transactionId: "INV-2025-09845",
      type: "Invoice",
      date: "06/08/2025",
      amount: "$76,432.25",
      vendor: "Advanced Components Inc",
      status: "Approved",
      documentNumber: "INV-AC-78341",
      riskScore: "Low",
      department: "Accounts Payable",
    },
    {
      id: "8",
      transactionId: "DIS-2025-02143",
      type: "Disbursement",
      date: "06/15/2025",
      amount: "$76,432.25",
      vendor: "Advanced Components Inc",
      status: "Pending",
      documentNumber: "PAY-2025-19264",
      riskScore: "Medium",
      department: "Treasury",
    },
    {
      id: "9",
      transactionId: "OBL-2025-00789",
      type: "Obligation",
      date: "05/20/2025",
      amount: "$215,780.00",
      vendor: "Tactical Equipment Ltd",
      status: "Under Review",
      documentNumber: "CONT-2025-A8012",
      riskScore: "High",
      department: "DLA Operations",
    },
    {
      id: "10",
      transactionId: "GR-2025-03912",
      type: "Goods Received",
      date: "05/29/2025",
      amount: "$89,321.50",
      vendor: "SecureTech Systems",
      status: "Verified",
      documentNumber: "RCPT-2025-B4532",
      riskScore: "Low",
      department: "Equipment Division",
    },
  ];

  // Handle prompt card click
  const handlePromptCardClick = (cardId: string) => {
    setSelectedPrompt(cardId);
    // Future functionality would go here
    console.log(`Selected prompt card: ${cardId}`);
  };

  // Handle search input submission
  const handleSearchSubmit = useCallback(async (query: string) => {
    console.log("Search query:", query);
    setIsProcessing(true);

    // Simulate API call delay
    setTimeout(() => {
      setIsProcessing(false);
    }, 1000);

    // Future functionality would go here
  }, []);

  // Memoize the knowledge hub input component for the footer to prevent re-renders
  const dataExplorerInputComponent = useMemo(
    () => (
      <div className="flex-1">
        <ChatInput
          onSubmit={handleSearchSubmit}
          disabled={isProcessing}
          placeholder="Ask a question about audit data or request analysis..."
        />
      </div>
    ),
    [isProcessing, handleSearchSubmit]
  );

  // Set page title and icon
  useEffect(() => {
    setPageTitle("Data Explorer");
    setPageIcon("edasearch");

    // Clean up when component unmounts
    return () => {
      setPageTitle("");
      setPageIcon("");
    };
  }, [setPageTitle, setPageIcon]);

  // Handle footer content with useCallback to avoid render loops
  const updateFooterContent = useCallback(() => {
    setPageFooterContent(dataExplorerInputComponent);
  }, [setPageFooterContent, dataExplorerInputComponent]);

  // Set footer content on mount and clean up on unmount - no dependencies
  useEffect(() => {
    updateFooterContent();

    return () => {
      setPageFooterContent(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col space-y-6">
      {/* Prompt Cards Section */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {promptCards.map(card => (
          <button
            key={card.id}
            onClick={() => handlePromptCardClick(card.id)}
            className={clsx(
              "overflow-hidden rounded-sm border text-left",
              "border-gray-200 p-4 text-white shadow-sm",
              "transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg",
              "cursor-pointer",
              card.gradientClasses,
              selectedPrompt === card.id ? "ring-2 ring-offset-2" : ""
            )}
          >
            <div className="mb-2 flex items-center">
              <card.icon className="mr-2 h-5 w-5" />
              <h3 className="text-lg font-bold">{card.title}</h3>
            </div>
            <p className="text-sm">{card.description}</p>
          </button>
        ))}
      </div>

      {/* Data Table Section */}
      <div>
        <DataTable
          title="Audit Data"
          columns={columns}
          data={mockData}
          searchable={true}
          exportable={true}
          searchPlaceholder="Search transactions by ID, vendor, or type..."
        />
      </div>

      {/* Footer is managed through MainContentWrapper via context */}
    </div>
  );
}
