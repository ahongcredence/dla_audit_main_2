import React from "react";

import clsx from "clsx";
import {
  ArrowRight,
  Award,
  BadgeDollarSign,
  BookOpen,
  BookText,
  Calendar,
  ClipboardCheck,
  CreditCard,
  DollarSign,
  FileText,
  Hash,
  Link,
  Receipt,
  ShoppingBag,
} from "lucide-react";

import { TransactionCardField, TransactionCardProps } from "../types";
import EnhancedAuditScoreChart from "./EnhancedAuditScoreChart";

const iconMap = {
  FileText,
  Receipt,
  BookOpen,
  CreditCard,
  ClipboardCheck,
  BookText,
  BadgeDollarSign,
  ShoppingBag,
};

export default function TransactionCard({
  card,
  className = "",
}: TransactionCardProps) {
  const IconComponent = iconMap[card.icon as keyof typeof iconMap];

  // Helper function to render label with BadgePercent icon in place of "Score"
  const renderLabel = (label: string) => {
    const hasScore = label.includes("Score");
    const hasMultipleWords = label.includes(" ");

    // For labels with "Score", replace with BadgePercent icon
    if (hasScore) {
      const parts = label.split("Score");
      return (
        <div className="flex flex-col text-sm">
          <div className="flex items-center">
            <span>{parts[0]}</span>
            <Award className="mx-0.5 h-4.5 w-4.5" />
          </div>
        </div>
      );
    }

    // For other multi-word labels, split them into two lines
    if (hasMultipleWords) {
      const words = label.split(" ");
      const midpoint = Math.ceil(words.length / 2);
      const firstLine = words.slice(0, midpoint).join(" ");
      const secondLine = words.slice(midpoint).join(" ");

      return (
        <div className="flex flex-col text-xs">
          <span>{firstLine}</span>
          <span>{secondLine}</span>
        </div>
      );
    }

    // For single-word labels that don't contain "Score"
    return <div className="text-sm">{label}</div>;
  };

  // Add a special field for the linkage if linkedTo is provided
  const hasLinkage = card.linkedTo && card.linkedTo !== "N/A";

  // Parse the linkedTo value if it contains "->"
  let leftPart = "";
  let rightPart = card.linkedTo || "";

  if (
    hasLinkage &&
    typeof card.linkedTo === "string" &&
    card.linkedTo.includes("->")
  ) {
    const parts = card.linkedTo.split("->");
    leftPart = parts[0];
    rightPart = parts[1];
  }

  // Helper function to identify field types based on label text
  const getFieldType = (label: string) => {
    const labelLower = label.toLowerCase();
    if (labelLower.includes("id")) return "id";
    if (labelLower.includes("date")) return "date";
    if (labelLower.match(/amount|cost|price|value|payment/i)) return "amount";
    return "default";
  };

  // Function to render value based on field type
  const renderValue = (label: string, value: string) => {
    const fieldType = getFieldType(label);

    // For ID fields
    if (fieldType === "id") {
      return (
        <div className="flex items-center space-x-1">
          <Hash className="h-3.5 w-3.5 text-gray-500" />
          <span className="rounded-sm bg-gray-100 px-2 py-0.5 font-mono text-sm">
            {value}
          </span>
        </div>
      );
    }

    // For Date fields
    if (fieldType === "date") {
      return (
        <div className="flex items-center space-x-1">
          <Calendar className="text-auditinsight-gray-70 h-3.5 w-3.5" />
          <span className="text-auditinsight-gray-70 text-sm">{value}</span>
        </div>
      );
    }

    // For Amount fields
    if (fieldType === "amount") {
      // Determine if value contains a number we can parse
      const hasNumber = /[\d.]/.test(value);

      // Strip currency symbols and format the number
      let formattedValue = value;
      if (hasNumber) {
        // Extract numeric value (remove currency symbols like $ but keep - for negative)
        const numValue = parseFloat(value.replace(/[^0-9.-]+/g, ""));
        const isNegative = numValue < 0;

        // Format with thousands separator and two decimal places
        formattedValue = Math.abs(numValue).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

        // Add negative sign back if needed
        if (isNegative) {
          formattedValue = `-${formattedValue}`;
        }
      }

      const textColorClass = formattedValue.startsWith("-")
        ? "text-rose-900"
        : "text-emerald-900";

      return (
        <div className="flex items-center justify-end ">
          <DollarSign className={`h-4 w-4 ${textColorClass}`} />
          <span
            className={`text-md font-mono font-bold tabular-nums ${textColorClass}`}
          >
            {formattedValue}
          </span>
        </div>
      );
    }

    // Default rendering
    return <div className="font-semibold">{value}</div>;
  };

  const renderField = (field: TransactionCardField, index: number) => {
    switch (field.component) {
      case "badge":
        return (
          <div key={index} className="flex items-center justify-between">
            {renderLabel(field.label)}
            <div
              className={
                field.props?.className ||
                "w-fit rounded-sm bg-gray-500 px-3 py-1 text-xs text-white"
              }
            >
              {field.value}
            </div>
          </div>
        );

      case "chart":
        return (
          <div key={index} className="flex items-center justify-between">
            {renderLabel(field.label)}
            <div className="flex items-center gap-2">
              <EnhancedAuditScoreChart
                score={field.props?.score || 0}
                size={field.props?.size || 45}
              />
            </div>
          </div>
        );

      case "row":
        return (
          <div key={index}>
            <div className="grid grid-cols-2 gap-2">
              {field.subFields?.map((subField, subIndex) => (
                <div
                  key={subIndex}
                  className="flex items-center justify-between"
                >
                  {renderLabel(subField.label)}
                  {subField.component === "chart" ? (
                    <div className="flex items-center">
                      <EnhancedAuditScoreChart
                        score={subField.props?.score || 0}
                        size={subField.props?.size || 45}
                      />
                    </div>
                  ) : (
                    renderValue(subField.label, subField.value)
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case "text":
      default:
        return (
          <div key={index} className="flex items-center justify-between">
            {renderLabel(field.label)}
            {renderValue(field.label, field.value)}
          </div>
        );
    }
  };

  return (
    <div
      className={clsx(
        "w-[220px] px-2 py-1.5",
        "border-auditinsight-gray-40 border bg-white",
        "overflow-hidden rounded-sm shadow-sm",
        className
      )}
    >
      <div className={`-mx-2 -mt-1.5 mb-1.5 p-1.5 ${card.gradientClass || ""}`}>
        <div className="flex items-center gap-1.5 font-semibold text-white">
          {IconComponent && <IconComponent className="h-5 w-5 text-white" />}
          {card.title}
        </div>
      </div>
      <div className="space-y-1.5">
        {card.fields.map((field, index) => renderField(field, index))}

        {/* Add footer - either linkage display or placeholder */}
        <div className="my-1 flex items-center justify-between border-t border-gray-200 px-1 pt-1">
          {hasLinkage ? (
            // Linkage display for cards with linkedTo
            <>
              {leftPart && (
                <div className="text-auditinsight-gray-80 text-left text-xs font-semibold">
                  {leftPart}
                </div>
              )}
              <ArrowRight
                size={14}
                className="text-auditinsight-gray-80 mx-2"
              />
              <div className="text-auditinsight-gray-80 text-right text-xs font-semibold">
                {rightPart}
              </div>
            </>
          ) : (
            // Placeholder footer with link icon for cards without linkedTo
            <>
              <div className="flex-1"></div>
              <Link
                size={14}
                className="text-auditinsight-gray-50 mx-2 opacity-50"
              />
              <div className="flex-1"></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
