"use client";

import React from "react";

interface FormattedMarkdownProps {
  content: string;
}

const FormattedMarkdown: React.FC<FormattedMarkdownProps> = ({ content }) => {
  // Enhanced formatting for the predict-insight response
  const enhanceContent = (rawContent: string): string => {
    let enhancedContent = rawContent;

    // Define styles for each section type using Tailwind colors
    const sectionStyles = {
      ANALYZE: {
        bgColor: "bg-red-50",
        borderColor: "border-red-500",
        emoji: "🔍",
      },
      INTERPRET: {
        bgColor: "bg-amber-50",
        borderColor: "border-amber-400",
        emoji: "💡",
      },
      RECOMMEND: {
        bgColor: "bg-green-50",
        borderColor: "border-green-500",
        emoji: "✅",
      },
    };

    // Process each section separately with proper styling
    Object.entries(sectionStyles).forEach(([sectionName, style]) => {
      const { emoji, bgColor, borderColor } = style;

      // Look for strong/bold sections
      const strongPattern = new RegExp(
        `<strong>${sectionName}:</strong>\\s*([\\s\\S]*?)(?=<strong>|$)`,
        "gi"
      );

      enhancedContent = enhancedContent.replace(
        strongPattern,
        (_match, content) => {
          // Build the section header HTML
          const html = `
                    <div class="mb-6 pb-2">
                        <div class="flex items-center mb-4 ${bgColor} p-3 rounded-lg border-l-4 ${borderColor}">
                            <span class="text-2xl mr-3">${emoji}</span>
                            <h3 class="text-slate-800 font-bold text-xl uppercase tracking-wide m-0">${sectionName}</h3>
                        </div>
                        <div class="pl-3">
                            <div class="prose prose-sky prose-sm max-w-none">
                                ${content.trim()}
                            </div>
                        </div>
                    </div>
                `;

          return html;
        }
      );

      // Also look for emoji-based format
      const emojiPattern = new RegExp(
        `${emoji}\\s+\\*\\*${sectionName}\\*\\*\\s*([\\s\\S]*?)(?=(🔍|💡|✅)\\s+\\*\\*|$)`,
        "g"
      );

      enhancedContent = enhancedContent.replace(
        emojiPattern,
        (_match, content) => {
          // Build the section header HTML
          let html = `
                    <div class="mb-6 pb-2">
                        <div class="flex items-center mb-4 ${bgColor} p-3 rounded-lg border-l-4 ${borderColor}">
                            <span class="text-2xl mr-3">${emoji}</span>
                            <h3 class="text-slate-800 font-bold text-xl uppercase tracking-wide m-0">${sectionName}</h3>
                        </div>
                        <div class="pl-3">
                            <ul class="list-disc pl-5 space-y-1 py-2">`;

          // Process bullet points in the content
          const bulletPoints = content.trim().split("\n");
          bulletPoints.forEach(point => {
            const trimmedPoint = point.trim();
            if (trimmedPoint) {
              if (trimmedPoint.startsWith("-")) {
                // Format bullet points
                const bulletContent = trimmedPoint.substring(1).trim();
                // Highlight numbers and values
                const highlightedContent = bulletContent.replace(
                  /(\$[\d,.]+|[\d,.]+%|\b\d{1,3}(,\d{3})*(\.\d+)?(?!\w))/g,
                  '<span class="font-semibold text-cyan-800">$1</span>'
                );
                html += `<li class="mb-2">${highlightedContent}</li>`;
              } else {
                html += `<p class="mb-2">${trimmedPoint}</p>`;
              }
            }
          });

          // Close all tags
          html += `
                            </ul>
                        </div>
                    </div>
                `;

          return html;
        }
      );
    });

    return enhancedContent;
  };

  const processedContent = enhanceContent(content);

  return (
    <div className="predict-insight-content">
      <div
        className="prose prose-sky prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />
    </div>
  );
};

export default FormattedMarkdown;
