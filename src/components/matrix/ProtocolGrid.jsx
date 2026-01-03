"use client";

import { useState } from "react";
import { Plus, X, Check } from "lucide-react";

export default function ProtocolGrid({ protocols, setProtocols, mode }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProtocol, setNewProtocol] = useState({
    name: "",
    difficulty: 5,
    status: "ACTIVE",
  });

  const accentColor = mode === "green" ? "#00FF41" : "#CCCCCC";

  const addProtocol = () => {
    if (!newProtocol.name.trim()) return;

    const protocol = {
      id: Date.now(),
      name: newProtocol.name.toUpperCase(),
      difficulty: newProtocol.difficulty,
      status: newProtocol.status,
      completions: {},
      streak: 0,
      createdAt: new Date().toISOString(),
    };

    setProtocols([...protocols, protocol]);
    setNewProtocol({ name: "", difficulty: 5, status: "ACTIVE" });
    setShowAddModal(false);
  };

  const toggleCompletion = (protocolId, date) => {
    setProtocols(
      protocols.map((p) => {
        if (p.id === protocolId) {
          const completions = { ...p.completions };
          if (completions[date]) {
            delete completions[date];
          } else {
            completions[date] = true;
          }

          // Calculate streak
          let streak = 0;
          const today = new Date();
          for (let i = 0; i < 365; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(checkDate.getDate() - i);
            const dateStr = checkDate.toISOString().split("T")[0];
            if (completions[dateStr]) {
              streak++;
            } else {
              break;
            }
          }

          return { ...p, completions, streak };
        }
        return p;
      }),
    );
  };

  const deleteProtocol = (id) => {
    if (confirm("CONFIRM PROTOCOL DELETION?")) {
      setProtocols(protocols.filter((p) => p.id !== id));
    }
  };

  const getWeekDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();

  const calculateCompletion = (protocol) => {
    const total = Object.keys(protocol.completions).length;
    const daysSinceCreation =
      Math.floor(
        (new Date() - new Date(protocol.createdAt)) / (1000 * 60 * 60 * 24),
      ) + 1;
    return Math.round((total / daysSinceCreation) * 100);
  };

  if (protocols.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-[#666666] text-sm mb-6 tracking-wider">
            NO ACTIVE PROTOCOLS
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 border-2 text-sm tracking-wider transition-all duration-100 hover:bg-opacity-10"
            style={{
              borderColor: accentColor,
              color: accentColor,
              backgroundColor: `${accentColor}10`,
            }}
          >
            + INITIALIZE FIRST PROTOCOL
          </button>
        </div>

        {showAddModal && (
          <AddProtocolModal
            newProtocol={newProtocol}
            setNewProtocol={setNewProtocol}
            addProtocol={addProtocol}
            onClose={() => setShowAddModal(false)}
            mode={mode}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg tracking-wider" style={{ color: accentColor }}>
            NEURAL PROTOCOLS
          </h2>
          <div className="text-[10px] text-[#666666] mt-1 tracking-widest">
            ACTIVE: {protocols.filter((p) => p.status === "ACTIVE").length}/
            {protocols.length}
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 border text-xs tracking-wider transition-all duration-100 flex items-center gap-2 hover:bg-opacity-10"
          style={{
            borderColor: accentColor,
            color: accentColor,
            backgroundColor: `${accentColor}05`,
          }}
        >
          <Plus size={14} />
          ADD PROTOCOL
        </button>
      </div>

      {/* Grid Header */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-[2fr,1fr,1fr,1fr,repeat(7,80px)] gap-2 mb-2 pb-2 border-b border-[#1A1A1A]">
            <div className="text-[10px] text-[#666666] tracking-widest">
              PROTOCOL ID
            </div>
            <div className="text-[10px] text-[#666666] tracking-widest">
              DIFFICULTY
            </div>
            <div className="text-[10px] text-[#666666] tracking-widest">
              STREAK
            </div>
            <div className="text-[10px] text-[#666666] tracking-widest">
              STATUS
            </div>
            {weekDates.map((date, i) => (
              <div
                key={i}
                className="text-[10px] text-[#666666] tracking-widest text-center"
              >
                {date
                  .toLocaleDateString("en-US", { weekday: "short" })
                  .toUpperCase()}
                <div className="text-[9px] mt-0.5">{date.getDate()}</div>
              </div>
            ))}
          </div>

          {/* Protocol Rows */}
          <div className="space-y-2">
            {protocols.map((protocol) => (
              <div
                key={protocol.id}
                className="grid grid-cols-[2fr,1fr,1fr,1fr,repeat(7,80px)] gap-2 items-center py-3 border-b border-[#111111] hover:bg-[#0A0A0A] transition-all duration-100 group"
              >
                <div className="flex items-center gap-2">
                  <div className="text-sm text-[#CCCCCC]">{protocol.name}</div>
                  <button
                    onClick={() => deleteProtocol(protocol.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-100"
                  >
                    <X
                      size={12}
                      className="text-[#FF0033] hover:text-[#FF3355]"
                    />
                  </button>
                </div>
                <div className="text-xs text-[#CCCCCC]">
                  {protocol.difficulty}/10
                </div>
                <div
                  className="text-xs font-bold"
                  style={{
                    color: protocol.streak > 0 ? accentColor : "#666666",
                  }}
                >
                  {protocol.streak} DAYS
                </div>
                <div
                  className={`text-[10px] px-2 py-1 border inline-block w-fit ${
                    protocol.status === "ACTIVE"
                      ? "border-[#00FF41] text-[#00FF41]"
                      : protocol.status === "SUSPENDED"
                        ? "border-[#666666] text-[#666666]"
                        : "border-[#FF0033] text-[#FF0033]"
                  }`}
                >
                  {protocol.status}
                </div>

                {weekDates.map((date, i) => {
                  const dateStr = date.toISOString().split("T")[0];
                  const isCompleted = protocol.completions[dateStr];
                  const isToday =
                    dateStr === new Date().toISOString().split("T")[0];
                  const isFuture = date > new Date();

                  return (
                    <button
                      key={i}
                      onClick={() =>
                        !isFuture && toggleCompletion(protocol.id, dateStr)
                      }
                      disabled={isFuture}
                      className={`h-10 border transition-all duration-100 flex items-center justify-center ${
                        isFuture
                          ? "border-[#1A1A1A] cursor-not-allowed"
                          : isCompleted
                            ? "border-[#00FF41] bg-[#00FF41] bg-opacity-10 hover:bg-opacity-20"
                            : "border-[#333333] hover:border-[#666666]"
                      }`}
                      style={
                        isToday && !isFuture
                          ? { boxShadow: `0 0 10px ${accentColor}40` }
                          : {}
                      }
                    >
                      {isCompleted && (
                        <Check size={16} className="text-[#00FF41]" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddProtocolModal
          newProtocol={newProtocol}
          setNewProtocol={setNewProtocol}
          addProtocol={addProtocol}
          onClose={() => setShowAddModal(false)}
          mode={mode}
        />
      )}
    </div>
  );
}

function AddProtocolModal({
  newProtocol,
  setNewProtocol,
  addProtocol,
  onClose,
  mode,
}) {
  const accentColor = mode === "green" ? "#00FF41" : "#CCCCCC";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0A0A0A] border-2 border-[#1A1A1A] p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm tracking-wider" style={{ color: accentColor }}>
            NEW PROTOCOL
          </h3>
          <button onClick={onClose}>
            <X size={16} className="text-[#666666] hover:text-[#CCCCCC]" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] text-[#666666] mb-2 tracking-widest">
              PROTOCOL NAME
            </label>
            <input
              type="text"
              value={newProtocol.name}
              onChange={(e) =>
                setNewProtocol({ ...newProtocol, name: e.target.value })
              }
              placeholder="PROTOCOL_ALPHA_03"
              className="w-full bg-[#000000] border border-[#333333] px-3 py-2 text-sm text-[#CCCCCC] focus:outline-none focus:border-[#00FF41] transition-all duration-100"
              style={{ caretColor: accentColor }}
            />
          </div>

          <div>
            <label className="block text-[10px] text-[#666666] mb-2 tracking-widest">
              DIFFICULTY LEVEL: {newProtocol.difficulty}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={newProtocol.difficulty}
              onChange={(e) =>
                setNewProtocol({
                  ...newProtocol,
                  difficulty: parseInt(e.target.value),
                })
              }
              className="w-full"
              style={{ accentColor: accentColor }}
            />
          </div>

          <div>
            <label className="block text-[10px] text-[#666666] mb-2 tracking-widest">
              INITIAL STATUS
            </label>
            <select
              value={newProtocol.status}
              onChange={(e) =>
                setNewProtocol({ ...newProtocol, status: e.target.value })
              }
              className="w-full bg-[#000000] border border-[#333333] px-3 py-2 text-sm text-[#CCCCCC] focus:outline-none focus:border-[#00FF41] transition-all duration-100"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="SUSPENDED">SUSPENDED</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={addProtocol}
            className="flex-1 py-2 border-2 text-xs tracking-wider transition-all duration-100"
            style={{
              borderColor: accentColor,
              color: accentColor,
              backgroundColor: `${accentColor}10`,
            }}
          >
            CONFIRM
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-[#333333] text-xs text-[#666666] tracking-wider hover:border-[#666666] hover:text-[#CCCCCC] transition-all duration-100"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}
