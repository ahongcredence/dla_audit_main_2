"use client";

import React, { useMemo, useState } from "react";

import { ChevronDown, ChevronUp, ChevronsUpDown, Download } from "lucide-react";

import { DataTableProps, TableColumn } from "../types";

type SortDirection = "asc" | "desc" | null;

interface SortState {
  column: string | null;
  direction: SortDirection;
}

export default function DataTable({
  columns,
  data,
  searchable = true,
  //filterable = true,
  exportable = true,
  title = "Data Table",
  maxHeight = "520px",
  searchPlaceholder = "Search by Keyword, ID, or Category",
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortState, setSortState] = useState<SortState>({
    column: null,
    direction: null,
  });

  // Sorting function
  const sortData = (
    data: Record<string, unknown>[],
    column: string,
    direction: SortDirection
  ) => {
    if (!direction) return data;

    return [...data].sort((a, b) => {
      let aValue = a[column];
      let bValue = b[column];

      // Handle React elements - don't sort them
      if (React.isValidElement(aValue) || React.isValidElement(bValue)) {
        return 0;
      }

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return direction === "asc" ? -1 : 1;
      if (bValue == null) return direction === "asc" ? 1 : -1;

      // Convert to appropriate types for comparison
      // Handle dates (assuming format like "04/10/25 15:30:11")
      if (column === "startTime" || column === "endTime") {
        const dateA = new Date(aValue as string);
        const dateB = new Date(bValue as string);
        if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
          aValue = dateA.getTime();
          bValue = dateB.getTime();
        }
      }
      // Handle numbers
      else if (typeof aValue === "number" && typeof bValue === "number") {
        // Numbers are already in correct format
      }
      // Handle strings (case-insensitive)
      else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  // Handle column header click for sorting
  const handleSort = (column: TableColumn) => {
    if (!column.sortable) return;

    setSortState(prevState => {
      if (prevState.column !== column.key) {
        // New column - start with ascending
        return { column: column.key, direction: "asc" };
      } else {
        // Same column - cycle through asc -> desc -> null
        switch (prevState.direction) {
          case "asc":
            return {
              column: column.key,
              direction: "desc",
            };
          case "desc":
            return { column: null, direction: null };
          default:
            return { column: column.key, direction: "asc" };
        }
      }
    });
  };

  // Get sort icon for column header
  const getSortIcon = (column: TableColumn) => {
    if (!column.sortable) return null;

    if (sortState.column !== column.key) {
      return <ChevronsUpDown className="ml-1 h-4 w-4 opacity-50" />;
    }

    switch (sortState.direction) {
      case "asc":
        return <ChevronUp className="ml-1 h-4 w-4" />;
      case "desc":
        return <ChevronDown className="ml-1 h-4 w-4" />;
      default:
        return <ChevronsUpDown className="ml-1 h-4 w-4 opacity-50" />;
    }
  };

  // Filter and sort data
  const processedData = useMemo(() => {
    // First filter the data
    let filtered = data;
    if (searchTerm) {
      filtered = data.filter(row =>
        Object.values(row).some(value => {
          // Skip React elements for search
          if (React.isValidElement(value)) {
            return false;
          }
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Then sort the filtered data
    if (sortState.column && sortState.direction) {
      return sortData(filtered, sortState.column, sortState.direction);
    }

    return filtered;
  }, [data, searchTerm, sortState]);

  // Enhanced CSV export with intelligent data sanitization for Excel compatibility
  const handleExport = () => {
    // Helper function to sanitize cell values for CSV export
    const sanitizeValue = (value: unknown, columnKey: string): string => {
      // Handle null/undefined
      if (value == null) return "";

      // Handle React elements - extract text content
      if (React.isValidElement(value)) {
        // Try to find text alternative in the data object first
        const textAlternatives = [
          `${columnKey}Text`, // e.g., capStatusText for capStatus
          `${columnKey}Raw`, // e.g., capStatusRaw for capStatus
          `${columnKey}Value`, // e.g., capStatusValue for capStatus
        ];

        // Look for text alternatives in the current row
        const currentRow = processedData.find(row =>
          Object.values(row).includes(value)
        );

        if (currentRow) {
          for (const altKey of textAlternatives) {
            if (currentRow[altKey] && typeof currentRow[altKey] === "string") {
              return sanitizeValue(currentRow[altKey], columnKey);
            }
          }
        }

        // Extract text from React element as fallback
        const extractTextFromElement = (
          element: React.ReactElement
        ): string => {
          const props = element.props as {
            children?: React.ReactNode;
          };
          if (typeof props?.children === "string") {
            return props.children;
          }
          if (Array.isArray(props?.children)) {
            return props.children
              .map((child: React.ReactNode) =>
                typeof child === "string"
                  ? child
                  : React.isValidElement(child)
                    ? extractTextFromElement(child)
                    : ""
              )
              .join(" ");
          }
          return "";
        };

        const extractedText = extractTextFromElement(value);
        if (extractedText) return extractedText;
      }

      // Convert to string for processing
      const stringValue = String(value);

      // Handle currency values - preserve formatting but make Excel-friendly
      if (stringValue.match(/^\$[\d,]+\.?\d*$/)) {
        // Remove $ and commas for Excel to recognize as number
        const numericValue = stringValue.replace(/[$,]/g, "");
        return numericValue;
      }

      // Handle percentage values
      if (stringValue.match(/^\d+%$/)) {
        const numericValue = stringValue.replace("%", "");
        return (parseFloat(numericValue) / 100).toString(); // Convert to decimal for Excel
      }

      // Handle dates - standardize format
      if (
        columnKey.toLowerCase().includes("date") ||
        stringValue.match(/^\d{1,2}\/\d{1,2}\/\d{2,4}$/)
      ) {
        try {
          const date = new Date(stringValue);
          if (!isNaN(date.getTime())) {
            return date.toLocaleDateString("en-US"); // MM/DD/YYYY format
          }
        } catch {
          // If date parsing fails, return original value
        }
      }

      // Handle large numbers with commas
      if (stringValue.match(/^\d{1,3}(,\d{3})*$/)) {
        return stringValue.replace(/,/g, ""); // Remove commas for Excel
      }

      // Escape special CSV characters
      if (
        stringValue.includes(",") ||
        stringValue.includes('"') ||
        stringValue.includes("\n")
      ) {
        // Escape quotes by doubling them and wrap in quotes
        return `"${stringValue.replace(/"/g, '""')}"`;
      }

      return stringValue;
    };

    // Generate CSV content with proper headers
    const headers = columns.map(col => col.label);
    const csvRows = processedData.map(row =>
      columns.map(col => sanitizeValue(row[col.key], col.key))
    );

    // Create CSV content with UTF-8 BOM for Excel compatibility
    const csvContent = [
      headers.join(","),
      ...csvRows.map(row => row.join(",")),
    ].join("\n");

    // Add UTF-8 BOM for proper Excel encoding
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    // Generate filename with timestamp
    const timestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:-]/g, "");
    const filename = `${title.replace(/\s+/g, "_").toLowerCase()}_${timestamp}.csv`;

    // Download the file
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a); // Ensure compatibility across browsers
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const renderCellContent = (
    row: Record<string, unknown>,
    column: TableColumn
  ) => {
    const value = row[column.key];

    // If column has a custom render function, use it
    if (column.render) {
      return column.render(value, row);
    }

    // If value is a React element, return it directly
    if (React.isValidElement(value)) {
      return value;
    }

    // Format numbers with commas for better readability
    if (
      typeof value === "number" &&
      (column.key === "packets" || column.key === "bytes")
    ) {
      return value.toLocaleString();
    }

    return String(value);
  };

  return (
    <div className="border-auditinsight-gray-40 rounded-sm border bg-white px-3 py-2 shadow-sm">
      {/* Table Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h3 className="text-xl font-semibold">{title}</h3>
          {searchable && (
            <div className="relative">
              <input
                type="text"
                placeholder={searchPlaceholder}
                className="w-[325px] rounded-sm border-2 border-gray-100 bg-white px-3 py-2 text-sm"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          {/*
          {filterable && (
            <button className="flex items-center gap-2 rounded-sm border border-gray-500 bg-white px-3 py-1.5 text-sm font-bold hover:bg-gray-50">
              <span>Filter</span>
              <Filter className="h-4 w-4" />
            </button>
          )}
          */}
          {exportable && (
            <button
              onClick={handleExport}
              className="flex items-center gap-2 rounded-sm border border-gray-500 bg-white px-3 py-1.5 text-sm font-bold hover:bg-gray-50"
            >
              <span>Export</span>
              <Download className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-sm">
        <div style={{ maxHeight }} className="overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10">
              <tr className="bg-[#182851]">
                {columns.map(column => (
                  <th
                    key={column.key}
                    className={`px-2 py-1 text-left text-base font-bold text-white ${
                      column.width && column.width !== "auto"
                        ? `w-[${column.width}]`
                        : ""
                    } ${column.sortable ? "cursor-pointer select-none hover:bg-[#1f3a6b]" : ""}`}
                    style={
                      column.width && column.width !== "auto"
                        ? { width: column.width }
                        : {}
                    }
                    onClick={() => handleSort(column)}
                  >
                    <div className="flex items-center">
                      {column.label}
                      {getSortIcon(column)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {processedData.map((row, index) => (
                <tr
                  key={String(row.id) || index}
                  className="border-b border-gray-200"
                >
                  {columns.map(column => (
                    <td key={column.key} className="px-2 py-1 text-base">
                      {renderCellContent(row, column)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results info */}
      {searchTerm && (
        <div className="mt-2 text-sm text-gray-600">
          Showing {processedData.length} of {data.length} results
        </div>
      )}
    </div>
  );
}
