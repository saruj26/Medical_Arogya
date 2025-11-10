"use client";

import React from "react";

interface CalendarGridProps {
  dates: string[]; // ISO dates YYYY-MM-DD
  selectedDate: string;
  onSelectDate: (dateISO: string) => void;
  maxCols?: number;
}

const weekdayShort = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { weekday: "short" });

const dayLabel = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export default function CalendarGrid({
  dates,
  selectedDate,
  onSelectDate,
  maxCols = 7,
}: CalendarGridProps) {
  if (!dates || dates.length === 0) {
    return <div className="text-sm text-gray-600">No available dates</div>;
  }

  // Arrange dates by weeks for a compact calendar-like grid. We'll group by the weekday index.
  // Build rows of up to maxCols columns.
  const rows: string[][] = [];
  for (let i = 0; i < dates.length; i += maxCols) {
    rows.push(dates.slice(i, i + maxCols));
  }

  return (
    <div>
      <div className="grid grid-cols-7 gap-2 text-xs text-gray-500 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((w) => (
          <div key={w} className="text-center">
            {w}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {rows.map((row, ri) => (
          <div key={ri} className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, ci) => {
              const iso = row[ci];
              if (!iso) {
                return <div key={ci} />;
              }

              const isSelected = iso === selectedDate;

              return (
                <button
                  key={ci}
                  onClick={() => onSelectDate(iso)}
                  className={`p-3 text-left rounded-lg transition-colors border-2 ${
                    isSelected
                      ? "bg-[#1656a4] text-white border-[#1656a4] shadow-lg"
                      : "bg-white hover:bg-[#1656a4]/5 border-gray-100"
                  }`}
                >
                  <div className="text-xs text-gray-400">
                    {weekdayShort(iso)}
                  </div>
                  <div className="font-medium">{dayLabel(iso)}</div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
