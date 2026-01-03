"use client";

export default function Analytics({ protocols, mode }) {
  const accentColor = mode === "green" ? "#00FF41" : "#CCCCCC";

  // Calculate statistics
  const activeProtocols = protocols.filter((p) => p.status === "ACTIVE").length;
  const totalProtocols = protocols.length;

  const totalCompletions = protocols.reduce(
    (sum, p) => sum + Object.keys(p.completions).length,
    0,
  );

  const averageStreak =
    protocols.length > 0
      ? Math.round(
          protocols.reduce((sum, p) => sum + p.streak, 0) / protocols.length,
        )
      : 0;

  const longestStreak =
    protocols.length > 0 ? Math.max(...protocols.map((p) => p.streak)) : 0;

  // Calculate compliance (completion rate for last 7 days)
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    last7Days.push(date.toISOString().split("T")[0]);
  }

  const possibleCompletions = activeProtocols * 7;
  const actualCompletions = protocols.reduce((sum, p) => {
    return sum + last7Days.filter((date) => p.completions[date]).length;
  }, 0);

  const compliance =
    possibleCompletions > 0
      ? Math.round((actualCompletions / possibleCompletions) * 100)
      : 0;

  const criticalFailures = protocols.filter(
    (p) => p.status === "COMPROMISED",
  ).length;

  // Uptime calculation (days since first protocol)
  const oldestProtocol = protocols.reduce((oldest, p) => {
    const pDate = new Date(p.createdAt);
    return pDate < oldest ? pDate : oldest;
  }, new Date());

  const uptime =
    protocols.length > 0
      ? Math.floor((new Date() - oldestProtocol) / (1000 * 60 * 60 * 24))
      : 0;

  return (
    <div className="space-y-6">
      <h2 className="text-lg tracking-wider" style={{ color: accentColor }}>
        SYSTEM ANALYTICS
      </h2>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="SYSTEM UPTIME" value={`${uptime} DAYS`} mode={mode} />
        <StatCard
          label="NEURAL COMPLIANCE"
          value={`${compliance}%`}
          mode={mode}
          highlight={compliance >= 80}
        />
        <StatCard
          label="PROTOCOLS ACTIVE"
          value={`${activeProtocols}/${totalProtocols}`}
          mode={mode}
        />
        <StatCard
          label="CRITICAL FAILURES"
          value={criticalFailures}
          mode={mode}
          alert={criticalFailures > 0}
        />
      </div>

      {/* Circular Progress Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CircularProgress
          label="COMPLIANCE RATE"
          value={compliance}
          max={100}
          mode={mode}
        />
        <CircularProgress
          label="AVG STREAK"
          value={averageStreak}
          max={Math.max(averageStreak, 30)}
          unit="DAYS"
          mode={mode}
        />
        <CircularProgress
          label="TOTAL COMPLETIONS"
          value={totalCompletions}
          max={Math.max(totalCompletions, 100)}
          mode={mode}
        />
      </div>

      {/* Protocol Performance */}
      <div className="border border-[#1A1A1A] bg-[#000000] bg-opacity-40 p-6">
        <h3
          className="text-sm tracking-wider mb-4"
          style={{ color: accentColor }}
        >
          PROTOCOL PERFORMANCE
        </h3>
        <div className="space-y-3">
          {protocols.length === 0 ? (
            <div className="text-[#666666] text-xs text-center py-8">
              NO PROTOCOL DATA AVAILABLE
            </div>
          ) : (
            protocols.map((protocol) => {
              const completionRate = calculateCompletionRate(protocol);
              return (
                <div
                  key={protocol.id}
                  className="border-b border-[#111111] pb-3 last:border-0"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-[#CCCCCC]">
                      {protocol.name}
                    </div>
                    <div
                      className="text-xs"
                      style={{
                        color: completionRate >= 80 ? accentColor : "#666666",
                      }}
                    >
                      {completionRate}%
                    </div>
                  </div>
                  <div className="w-full h-1 bg-[#1A1A1A]">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${completionRate}%`,
                        backgroundColor:
                          completionRate >= 80 ? accentColor : "#666666",
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[9px] text-[#666666]">
                    <span>STREAK: {protocol.streak} DAYS</span>
                    <span>DIFFICULTY: {protocol.difficulty}/10</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* System Status */}
      <div className="border border-[#1A1A1A] bg-[#000000] bg-opacity-40 p-6">
        <h3
          className="text-sm tracking-wider mb-4"
          style={{ color: accentColor }}
        >
          SYSTEM STATUS
        </h3>
        <div className="space-y-2 text-xs">
          <StatusLine
            label="LONGEST ACTIVE STREAK"
            value={`${longestStreak} DAYS`}
            mode={mode}
          />
          <StatusLine
            label="TOTAL PROTOCOL EXECUTIONS"
            value={totalCompletions}
            mode={mode}
          />
          <StatusLine
            label="AVERAGE DIFFICULTY"
            value={
              protocols.length > 0
                ? `${Math.round(protocols.reduce((sum, p) => sum + p.difficulty, 0) / protocols.length)}/10`
                : "N/A"
            }
            mode={mode}
          />
          <StatusLine
            label="SYSTEM INTEGRITY"
            value={
              compliance >= 80
                ? "OPTIMAL"
                : compliance >= 50
                  ? "ACCEPTABLE"
                  : "DEGRADED"
            }
            mode={mode}
            status={
              compliance >= 80
                ? "success"
                : compliance >= 50
                  ? "warning"
                  : "error"
            }
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, mode, highlight, alert }) {
  const accentColor = mode === "green" ? "#00FF41" : "#CCCCCC";
  const alertColor = "#FF0033";

  return (
    <div className="border border-[#1A1A1A] bg-[#000000] bg-opacity-40 p-4">
      <div className="text-[10px] text-[#666666] tracking-widest mb-2">
        {label}
      </div>
      <div
        className="text-2xl font-bold tracking-wider"
        style={{
          color: alert ? alertColor : highlight ? accentColor : "#CCCCCC",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function CircularProgress({ label, value, max, unit = "", mode }) {
  const accentColor = mode === "green" ? "#00FF41" : "#CCCCCC";
  const percentage = Math.min((value / max) * 100, 100);
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="border border-[#1A1A1A] bg-[#000000] bg-opacity-40 p-6 flex flex-col items-center">
      <div className="relative w-32 h-32 mb-4">
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx="64"
            cy="64"
            r="45"
            stroke="#1A1A1A"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="64"
            cy="64"
            r="45"
            stroke={accentColor}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: accentColor }}>
              {value}
            </div>
            {unit && <div className="text-[9px] text-[#666666]">{unit}</div>}
          </div>
        </div>
      </div>
      <div className="text-[10px] text-[#666666] tracking-widest text-center">
        {label}
      </div>
    </div>
  );
}

function StatusLine({ label, value, mode, status }) {
  const accentColor = mode === "green" ? "#00FF41" : "#CCCCCC";
  const statusColors = {
    success: "#00FF41",
    warning: "#FFAA00",
    error: "#FF0033",
  };

  return (
    <div className="flex items-center justify-between py-2 border-b border-[#111111]">
      <span className="text-[#666666]">{label}</span>
      <span style={{ color: status ? statusColors[status] : accentColor }}>
        {value}
      </span>
    </div>
  );
}

function calculateCompletionRate(protocol) {
  const daysSinceCreation =
    Math.floor(
      (new Date() - new Date(protocol.createdAt)) / (1000 * 60 * 60 * 24),
    ) + 1;
  const completions = Object.keys(protocol.completions).length;
  return Math.round((completions / daysSinceCreation) * 100);
}
