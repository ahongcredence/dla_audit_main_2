"use client";

import { useState } from "react";

import clsx from "clsx";

import { capData } from "./capData";

interface FormData {
  capId: string;
  issueClusterId: string;
  rootCauseCategory: string;
  capAction: string;
  estimatedRecovery: string;
  capStatus: string;
  remediationPriority: string;
  nfrIssued: boolean;
  auditOwnerGroup: string;
  targetCompletionDate: string;
  confidenceScore: number;
  narrativeSummary: string;
  capDescription: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function CapForm() {
  // Generate next CAP ID
  const generateNextCapId = () => {
    const existingIds = capData.map(item =>
      parseInt(item.capId.replace("CAP-", ""))
    );
    const maxId = Math.max(...existingIds);
    return `CAP-${(maxId + 1).toString().padStart(4, "0")}`;
  };

  const [formData, setFormData] = useState<FormData>({
    capId: generateNextCapId(),
    issueClusterId: "",
    rootCauseCategory: "",
    capAction: "",
    estimatedRecovery: "",
    capStatus: "Planned",
    remediationPriority: "",
    nfrIssued: false,
    auditOwnerGroup: "",
    targetCompletionDate: "",
    confidenceScore: 0.75,
    narrativeSummary: "",
    capDescription: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Validation function
  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.issueClusterId.trim()) {
      newErrors.issueClusterId = "Issue Cluster ID is required";
    } else if (!/^CL-\d+$/.test(formData.issueClusterId)) {
      newErrors.issueClusterId = "Format should be CL-XXXX";
    }

    if (!formData.rootCauseCategory) {
      newErrors.rootCauseCategory = "Root Cause Category is required";
    }

    if (!formData.capAction.trim()) {
      newErrors.capAction = "CAP Action is required";
    } else if (formData.capAction.length > 500) {
      newErrors.capAction = "CAP Action must be 500 characters or less";
    }

    if (!formData.estimatedRecovery.trim()) {
      newErrors.estimatedRecovery = "Estimated Recovery is required";
    } else if (
      isNaN(parseFloat(formData.estimatedRecovery)) ||
      parseFloat(formData.estimatedRecovery) <= 0
    ) {
      newErrors.estimatedRecovery = "Must be a positive number";
    }

    if (!formData.remediationPriority) {
      newErrors.remediationPriority = "Remediation Priority is required";
    }

    if (!formData.auditOwnerGroup) {
      newErrors.auditOwnerGroup = "Audit Owner Group is required";
    }

    if (!formData.targetCompletionDate) {
      newErrors.targetCompletionDate = "Target Completion Date is required";
    } else {
      const selectedDate = new Date(formData.targetCompletionDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.targetCompletionDate = "Target date must be in the future";
      }
    }

    if (formData.narrativeSummary.length > 300) {
      newErrors.narrativeSummary =
        "Narrative Summary must be 300 characters or less";
    }

    if (formData.capDescription.length > 1000) {
      newErrors.capDescription =
        "CAP Description must be 1000 characters or less";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean | number
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
      // Placeholder for actual submission logic
      alert("Form submitted successfully! (This is a placeholder)");
    }
  };

  const handleClear = () => {
    setFormData({
      capId: generateNextCapId(),
      issueClusterId: "",
      rootCauseCategory: "",
      capAction: "",
      estimatedRecovery: "",
      capStatus: "Planned",
      remediationPriority: "",
      nfrIssued: false,
      auditOwnerGroup: "",
      targetCompletionDate: "",
      confidenceScore: 0.75,
      narrativeSummary: "",
      capDescription: "",
    });
    setErrors({});
  };

  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    return isNaN(num)
      ? "$0.00"
      : `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="mx-auto w-[1261px]">
      <div className="w-full rounded-sm bg-white shadow-lg">
        <div className="p-6">
          <h3 className="mb-6 text-xl font-semibold text-gray-800">
            Add New Corrective Action Plan
          </h3>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
          >
            {/* CAP ID - Auto-generated, read-only */}
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                CAP ID
              </label>
              <input
                type="text"
                value={formData.capId}
                readOnly
                className="w-full cursor-not-allowed rounded-sm border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-600"
              />
            </div>

            {/* Issue Cluster ID */}
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Issue Cluster ID <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={formData.issueClusterId}
                onChange={e =>
                  handleInputChange("issueClusterId", e.target.value)
                }
                placeholder="CL-1234"
                className={`w-full rounded-sm border px-3 py-2 text-sm ${
                  errors.issueClusterId
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              {errors.issueClusterId && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.issueClusterId}
                </p>
              )}
            </div>

            {/* Root Cause Category */}
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Root Cause Category <span className="text-red-600">*</span>
              </label>
              <select
                value={formData.rootCauseCategory}
                onChange={e =>
                  handleInputChange("rootCauseCategory", e.target.value)
                }
                className={`w-full rounded-sm border px-3 py-2 text-sm ${
                  errors.rootCauseCategory
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              >
                <option value="">Select Category</option>
                <option value="Posting Delay">Posting Delay</option>
                <option value="Missing Backup">Missing Backup</option>
                <option value="Other">Other</option>
              </select>
              {errors.rootCauseCategory && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.rootCauseCategory}
                </p>
              )}
            </div>

            {/* Estimated Recovery */}
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Estimated Recovery <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <span className="absolute top-2 left-3 text-sm text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.estimatedRecovery}
                  onChange={e =>
                    handleInputChange("estimatedRecovery", e.target.value)
                  }
                  placeholder="0.00"
                  className={clsx(
                    "w-full rounded-sm border",
                    "py-2 pr-3 pl-8",
                    "text-sm",
                    errors.estimatedRecovery
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  )}
                />
              </div>
              {errors.estimatedRecovery && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.estimatedRecovery}
                </p>
              )}
              {formData.estimatedRecovery && !errors.estimatedRecovery && (
                <p className="mt-1 text-xs text-gray-600">
                  Preview: {formatCurrency(formData.estimatedRecovery)}
                </p>
              )}
            </div>

            {/* CAP Status */}
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                CAP Status
              </label>
              <select
                value={formData.capStatus}
                onChange={e => handleInputChange("capStatus", e.target.value)}
                className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="Planned">Planned</option>
                <option value="In Progress">In Progress</option>
                <option value="Implemented">Implemented</option>
                <option value="Pending Review">Pending Review</option>
              </select>
            </div>

            {/* Remediation Priority */}
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Remediation Priority <span className="text-red-600">*</span>
              </label>
              <select
                value={formData.remediationPriority}
                onChange={e =>
                  handleInputChange("remediationPriority", e.target.value)
                }
                className={`w-full rounded-sm border px-3 py-2 text-sm ${
                  errors.remediationPriority
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              >
                <option value="">Select Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              {errors.remediationPriority && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.remediationPriority}
                </p>
              )}
            </div>

            {/* Audit Owner Group */}
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Audit Owner Group <span className="text-red-600">*</span>
              </label>
              <select
                value={formData.auditOwnerGroup}
                onChange={e =>
                  handleInputChange("auditOwnerGroup", e.target.value)
                }
                className={`w-full rounded-sm border px-3 py-2 text-sm ${
                  errors.auditOwnerGroup
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              >
                <option value="">Select Team</option>
                <option value="Audit Team 1">Audit Team 1</option>
                <option value="Audit Team 2">Audit Team 2</option>
                <option value="Audit Team 3">Audit Team 3</option>
              </select>
              {errors.auditOwnerGroup && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.auditOwnerGroup}
                </p>
              )}
            </div>

            {/* Target Completion Date */}
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Target Completion Date <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                value={formData.targetCompletionDate}
                onChange={e =>
                  handleInputChange("targetCompletionDate", e.target.value)
                }
                className={`w-full rounded-sm border px-3 py-2 text-sm ${
                  errors.targetCompletionDate
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              {errors.targetCompletionDate && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.targetCompletionDate}
                </p>
              )}
            </div>

            {/* NFR Issued */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="nfrIssued"
                checked={formData.nfrIssued}
                onChange={e => handleInputChange("nfrIssued", e.target.checked)}
                className="mr-3 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="nfrIssued"
                className="text-sm font-bold text-gray-700"
              >
                Notice of Finding and Recommendation Issued
              </label>
            </div>

            {/* Confidence Score */}
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Confidence Score: {Math.round(formData.confidenceScore * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={formData.confidenceScore}
                onChange={e =>
                  handleInputChange(
                    "confidenceScore",
                    parseFloat(e.target.value)
                  )
                }
                className="slider h-2 w-full cursor-pointer appearance-none rounded-sm bg-gray-200"
              />
              <div className="mt-1 flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>

            {/* CAP Action - Full width */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-bold text-gray-700">
                CAP Action <span className="text-red-600">*</span>
              </label>
              <textarea
                value={formData.capAction}
                onChange={e => handleInputChange("capAction", e.target.value)}
                placeholder="Describe the corrective action plan..."
                rows={3}
                maxLength={500}
                className={clsx(
                  "resize-vertical w-full rounded-sm",
                  "border px-3 py-2",
                  "text-sm",
                  errors.capAction
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                )}
              />
              <div className="mt-1 flex items-center justify-between">
                {errors.capAction && (
                  <p className="text-xs text-red-600">{errors.capAction}</p>
                )}
                <p className="ml-auto text-xs text-gray-500">
                  {formData.capAction.length}/500 characters
                </p>
              </div>
            </div>

            {/* Narrative Summary - Full width */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Narrative Summary
              </label>
              <textarea
                value={formData.narrativeSummary}
                onChange={e =>
                  handleInputChange("narrativeSummary", e.target.value)
                }
                placeholder="Brief summary of the issue..."
                rows={2}
                maxLength={300}
                className={clsx(
                  "resize-vertical w-full rounded-sm",
                  "border px-3 py-2",
                  "text-sm",
                  errors.narrativeSummary
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                )}
              />
              <div className="mt-1 flex items-center justify-between">
                {errors.narrativeSummary && (
                  <p className="text-xs text-red-600">
                    {errors.narrativeSummary}
                  </p>
                )}
                <p className="ml-auto text-xs text-gray-500">
                  {formData.narrativeSummary.length}/300 characters
                </p>
              </div>
            </div>

            {/* CAP Description - Full width */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-bold text-gray-700">
                CAP Description
              </label>
              <textarea
                value={formData.capDescription}
                onChange={e =>
                  handleInputChange("capDescription", e.target.value)
                }
                placeholder="Detailed description of the corrective action plan..."
                rows={4}
                maxLength={1000}
                className={clsx(
                  "resize-vertical w-full rounded-sm",
                  "border px-3 py-2",
                  "text-sm",
                  errors.capDescription
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                )}
              />
              <div className="mt-1 flex items-center justify-between">
                {errors.capDescription && (
                  <p className="text-xs text-red-600">
                    {errors.capDescription}
                  </p>
                )}
                <p className="ml-auto text-xs text-gray-500">
                  {formData.capDescription.length}/1000 characters
                </p>
              </div>
            </div>

            {/* Form Actions - Full width */}
            <div className="flex gap-3 border-t border-gray-200 pt-4 md:col-span-2">
              <button
                type="submit"
                className="rounded-sm bg-[#293241] px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-[#1f2631]"
              >
                Submit CAP
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="rounded-sm border border-gray-500 bg-white px-6 py-2 text-sm font-bold text-gray-500 transition-colors hover:bg-gray-50"
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
