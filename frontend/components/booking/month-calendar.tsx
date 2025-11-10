"use client";

import { useMemo, useState } from "react";

interface Props {
  selectedDate?: string;
  onSelectDate: (iso: string) => void;
  allowPast?: boolean;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatISO(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default function MonthCalendar({
  selectedDate,
  onSelectDate,
  allowPast = false,
}: Props) {
  const today = useMemo(() => formatISO(new Date()), []);

  const [displayMonth, setDisplayMonth] = useState(() => {
    if (selectedDate) return new Date(selectedDate + "T00:00:00");
    const d = new Date();
    d.setDate(1);
    return d;
  });

  const days = useMemo(() => {
    const year = displayMonth.getFullYear();
    const month = displayMonth.getMonth();

    const firstOfMonth = new Date(year, month, 1);
    const startingWeekday = firstOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: Array<{ iso?: string; isBlank?: boolean }> = [];
    for (let i = 0; i < startingWeekday; i++) cells.push({ isBlank: true });
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      cells.push({ iso: formatISO(date) });
    }
    while (cells.length % 7 !== 0) cells.push({ isBlank: true });
    return cells;
  }, [displayMonth]);

  const handlePrev = () => {
    const d = new Date(displayMonth);
    d.setMonth(d.getMonth() - 1);
    setDisplayMonth(d);
  };
  const handleNext = () => {
    const d = new Date(displayMonth);
    d.setMonth(d.getMonth() + 1);
    setDisplayMonth(d);
  };

  const displayTitle = `${displayMonth.toLocaleString(undefined, {
    month: "long",
  })} ${displayMonth.getFullYear()}`;

  const isDisabled = (iso?: string) => {
    if (!iso) return true;
    if (allowPast) return false;
    return iso < today;
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center justify-between mb-2">
        <button
          aria-label="Previous month"
          onClick={handlePrev}
          className="px-2 py-1 rounded hover:bg-gray-100"
        >
          ‹
        </button>
        <div className="font-semibold">{displayTitle}</div>
        <button
          aria-label="Next month"
          onClick={handleNext}
          className="px-2 py-1 rounded hover:bg-gray-100"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-1">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 mt-1">
        {days.map((cell, idx) => {
          const iso = cell.iso;
          const disabled = isDisabled(iso);
          const selected = iso && iso === selectedDate;
          const todayMark = iso && iso === today;

          // only allow hover bg for active, non-selected, non-disabled date cells
          const hoverClass =
            !cell.isBlank && !disabled && !selected ? "hover:bg-[#e6f4ff]" : "";

          return (
            <button
              key={idx}
              onClick={() => {
                if (!iso || disabled) return;
                onSelectDate(iso);
              }}
              disabled={disabled}
              aria-pressed={selected ? true : undefined}
              className={`h-10 flex items-center justify-center rounded-md text-sm focus:outline-none transition-colors ${
                cell.isBlank ? "opacity-0 pointer-events-none" : "bg-white"
              } ${
                selected
                  ? "bg-[#dbeefe] text-[#1656a4] font-semibold"
                  : "text-gray-700"
              } ${todayMark && !selected ? "ring-1 ring-[#1656a4]/30" : ""} ${
                disabled && !selected ? "text-gray-300" : ""
              } ${hoverClass}`}
            >
              {cell.isBlank ? "" : iso?.slice(8, 10)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
