"use client";

import React, { useState } from "react";

import Card from "../Card";
import { processRootCauseData } from "./chartUtils";

interface TooltipData {
  name: string;
  value: number;
  color: string;
}

export default function RootCauseBarChart() {
  const data = processRootCauseData();
  const [tooltip, setTooltip] = useState<{
    show: boolean;
    data: TooltipData | null;
    x: number;
    y: number;
  }>({
    show: false,
    data: null,
    x: 0,
    y: 0,
  });

  // Add data validation
  if (!data || data.length === 0) {
    return (
      <Card
        header={{
          title: "Root Cause Category Distribution",
        }}
      >
        <div className="flex h-48 items-center justify-center text-gray-500">
          No data available
        </div>
      </Card>
    );
  }

  const maxValue = Math.max(...data.map(item => item.value));

  const handleMouseEnter = (item: TooltipData, event: React.MouseEvent) => {
    setTooltip({
      show: true,
      data: item,
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({
      show: false,
      data: null,
      x: 0,
      y: 0,
    });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (tooltip.show) {
      setTooltip(prev => ({
        ...prev,
        x: event.clientX,
        y: event.clientY,
      }));
    }
  };

  return (
    <>
      <Card
        header={{
          title: "Root Cause Category Distribution",
        }}
      >
        <div className="flex h-48 flex-col justify-center p-2">
          <div className="space-y-2">
            {data.map((item, index) => {
              const percentage = (item.value / maxValue) * 100;
              return (
                <div key={index} className="flex items-center gap-3">
                  {/* Label */}
                  <div className="w-20 flex-shrink-0 text-right text-xs text-gray-700">
                    {item.name}
                  </div>

                  {/* Bar Container */}
                  <div className="relative flex-1">
                    <div className="relative h-6 w-full overflow-hidden rounded-sm border border-gray-100 bg-gray-50">
                      {/* Bar */}
                      <div
                        className="h-full cursor-pointer rounded-sm transition-all duration-300 ease-out hover:opacity-90"
                        style={{
                          width: `${percentage}%`,
                          background: item.color,
                        }}
                        onMouseEnter={e => handleMouseEnter(item, e)}
                        onMouseLeave={handleMouseLeave}
                        onMouseMove={handleMouseMove}
                      />

                      {/* Value Label on Bar */}
                      <div className="absolute inset-0 flex items-center justify-start pl-2">
                        <span className="text-xs font-semibold text-white drop-shadow">
                          {item.value}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Custom Tooltip */}
      {tooltip.show && tooltip.data && (
        <div
          className="pointer-events-none fixed z-50 rounded-lg border border-gray-200 bg-white p-3 shadow-lg"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y - 10,
            transform: "translateY(-100%)",
          }}
        >
          <div className="text-sm font-medium text-gray-900">
            {tooltip.data.name}
          </div>
          <div className="text-sm text-gray-600">
            Count: <span className="font-medium">{tooltip.data.value}</span>
          </div>
        </div>
      )}
    </>
  );
}
