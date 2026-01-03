"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Calendar({ protocols, mode }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const accentColor = mode === "green" ? "#00FF41" : "#CCCCCC";

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const getDayStatus = (date) => {
    if (!date) return null;

    const dateStr = date.toISOString().split("T")[0];
    const today = new Date().toISOString().split("T")[0];

    if (dateStr > today) return "future";

    const activeProtocols = protocols.filter((p) => p.status === "ACTIVE");
    if (activeProtocols.length === 0) return "none";

    const completedCount = activeProtocols.filter(
      (p) => p.completions[dateStr],
    ).length;
    const completionRate = completedCount / activeProtocols.length;

    if (completionRate === 1) return "complete";
    if (completionRate > 0) return "partial";
    return "missed";
  };

  const getDayColor = (status) => {
    switch (status) {
      case "complete":
        return "#00FF41";
      case "partial":
        return "#009926";
      case "missed":
        return "#FF0033";
      case "future":
        return "#333333";
      default:
        return "#1A1A1A";
    }
  };

  const getDayDetails = (date) => {
    if (!date) return null;

    const dateStr = date.toISOString().split("T")[0];
    const activeProtocols = protocols.filter((p) => p.status === "ACTIVE");
    const completedProtocols = activeProtocols.filter(
      (p) => p.completions[dateStr],
    );

    return {
      total: activeProtocols.length,
      completed: completedProtocols.length,
      protocols: completedProtocols,
    };
  };

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
    );
  };

  const days = getDaysInMonth(currentDate);
  const monthName = currentDate
    .toLocaleDateString("en-US", { month: "long", year: "numeric" })
    .toUpperCase();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg tracking-wider" style={{ color: accentColor }}>
          TEMPORAL GRID
        </h2>
        <div className="flex items-center gap-4">
          <button
            onClick={previousMonth}
            className="p-2 border border-[#333333] hover:border-[#666666] transition-all duration-100"
          >
            <ChevronLeft size={16} className="text-[#CCCCCC]" />
          </button>
          <div className="text-sm text-[#CCCCCC] tracking-wider min-w-[200px] text-center">
            {monthName}
          </div>
          <button
            onClick={nextMonth}
            className="p-2 border border-[#333333] hover:border-[#666666] transition-all duration-100"
          >
            <ChevronRight size={16} className="text-[#CCCCCC]" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-[10px] text-[#666666] tracking-widest">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 border"
            style={{ borderColor: "#00FF41", backgroundColor: "#00FF4120" }}
          ></div>
          <span>COMPLETE</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 border"
            style={{ borderColor: "#009926", backgroundColor: "#00992620" }}
          ></div>
          <span>PARTIAL</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 border"
            style={{ borderColor: "#FF0033", backgroundColor: "#FF003320" }}
          ></div>
          <span>MISSED</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border border-[#333333]"></div>
          <span>FUTURE</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="border border-[#1A1A1A] bg-[#000000] bg-opacity-40 p-6">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
            <div
              key={day}
              className="text-center text-[10px] text-[#666666] tracking-widest py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const status = getDayStatus(date);
            const color = getDayColor(status);
            const isToday =
              date.toISOString().split("T")[0] ===
              new Date().toISOString().split("T")[0];
            const details = getDayDetails(date);

            return (
              <div
                key={index}
                className="aspect-square border transition-all duration-100 hover:scale-105 relative group cursor-pointer"
                style={{
                  borderColor: color,
                  backgroundColor:
                    status !== "future" && status !== "none"
                      ? `${color}20`
                      : "transparent",
                  boxShadow: isToday ? `0 0 10px ${color}60` : "none",
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="text-xs"
                    style={{
                      color: status === "future" ? "#666666" : "#CCCCCC",
                    }}
                  >
                    {date.getDate()}
                  </span>
                </div>

                {/* Tooltip */}
                {details && status !== "future" && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                    <div className="bg-[#000000] border border-[#333333] p-3 whitespace-nowrap text-[10px]">
                      <div className="text-[#666666] tracking-widest mb-1">
                        {date
                          .toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                          .toUpperCase()}
                      </div>
                      <div className="text-[#CCCCCC]">
                        COMPLETED: {details.completed}/{details.total}
                      </div>
                      {details.protocols.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-[#1A1A1A]">
                          {details.protocols.slice(0, 3).map((p) => (
                            <div
                              key={p.id}
                              className="text-[#00FF41] text-[9px]"
                            >
                              • {p.name}
                            </div>
                          ))}
                          {details.protocols.length > 3 && (
                            <div className="text-[#666666] text-[9px] mt-1">
                              +{details.protocols.length - 3} MORE
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard
          label="TOTAL DAYS"
          value={days.filter((d) => d && getDayStatus(d) !== "future").length}
          mode={mode}
        />
        <SummaryCard
          label="COMPLETE DAYS"
          value={days.filter((d) => d && getDayStatus(d) === "complete").length}
          mode={mode}
          highlight
        />
        <SummaryCard
          label="PARTIAL DAYS"
          value={days.filter((d) => d && getDayStatus(d) === "partial").length}
          mode={mode}
        />
        <SummaryCard
          label="MISSED DAYS"
          value={days.filter((d) => d && getDayStatus(d) === "missed").length}
          mode={mode}
          alert
        />
      </div>
    </div>
  );
}

function SummaryCard({ label, value, mode, highlight, alert }) {
  const accentColor = mode === "green" ? "#00FF41" : "#CCCCCC";
  const alertColor = "#FF0033";

  return (
    <div className="border border-[#1A1A1A] bg-[#000000] bg-opacity-40 p-4">
      <div className="text-[10px] text-[#666666] tracking-widest mb-2">
        {label}
      </div>
      <div
        className="text-2xl font-bold"
        style={{
          color: alert ? alertColor : highlight ? accentColor : "#CCCCCC",
        }}
      >
        {value}
      </div>
    </div>
  );
}
