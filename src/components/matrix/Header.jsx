"use client";

import { useState } from "react";
import { Download, Upload, Settings, X, Volume2, VolumeX } from "lucide-react";

export default function Header({
  mode,
  toggleMode,
  view,
  setView,
  onExport,
  onImport,
  rainIntensity,
  setRainIntensity,
  audioEnabled,
  setAudioEnabled,
  audioVolume,
  setAudioVolume,
}) {
  const [showSettings, setShowSettings] = useState(false);
  const accentColor = mode === "green" ? "#00FF41" : "#CCCCCC";

  return (
    <header className="border-b border-[#1A1A1A] bg-[#000000] bg-opacity-60 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#00FF41] flex items-center justify-center relative">
              <div
                className="w-3 h-3 bg-[#00FF41]"
                style={{
                  clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                }}
              ></div>
              {mode === "green" && (
                <div className="absolute inset-0 bg-[#00FF41] opacity-20 animate-pulse"></div>
              )}
            </div>
            <div>
              <div className="text-[#CCCCCC] text-base font-bold tracking-wider">
                MORPHEUS
              </div>
              <div className="text-[#666666] text-[10px] tracking-widest">
                NEURAL PROTOCOL SYSTEM
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setView("protocols")}
              className={`px-4 py-2 text-xs tracking-wider transition-all duration-100 ${
                view === "protocols"
                  ? `text-[${accentColor}] border-b-2 border-[${accentColor}]`
                  : "text-[#666666] hover:text-[#CCCCCC]"
              }`}
              style={
                view === "protocols"
                  ? {
                      color: accentColor,
                      borderBottomColor: accentColor,
                    }
                  : {}
              }
            >
              PROTOCOLS
            </button>
            <button
              onClick={() => setView("analytics")}
              className={`px-4 py-2 text-xs tracking-wider transition-all duration-100 ${
                view === "analytics"
                  ? "text-current"
                  : "text-[#666666] hover:text-[#CCCCCC]"
              }`}
              style={
                view === "analytics"
                  ? {
                      color: accentColor,
                      borderBottom: `2px solid ${accentColor}`,
                    }
                  : {}
              }
            >
              ANALYTICS
            </button>
            <button
              onClick={() => setView("calendar")}
              className={`px-4 py-2 text-xs tracking-wider transition-all duration-100 ${
                view === "calendar"
                  ? "text-current"
                  : "text-[#666666] hover:text-[#CCCCCC]"
              }`}
              style={
                view === "calendar"
                  ? {
                      color: accentColor,
                      borderBottom: `2px solid ${accentColor}`,
                    }
                  : {}
              }
            >
              TEMPORAL GRID
            </button>
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="p-2 border border-[#1A1A1A] transition-all duration-100 hover:border-[#333333]"
              style={{ color: audioEnabled ? accentColor : "#666666" }}
              title={audioEnabled ? "DISABLE AUDIO" : "ENABLE AUDIO"}
            >
              {audioEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 border border-[#1A1A1A] transition-all duration-100 hover:border-[#333333]"
              style={{ color: accentColor }}
              title="SYSTEM SETTINGS"
            >
              <Settings size={14} />
            </button>

            <button
              onClick={toggleMode}
              className="px-3 py-2 border border-[#1A1A1A] text-xs tracking-wider transition-all duration-100 hover:border-[#333333] hidden sm:block"
              style={{ color: accentColor }}
            >
              {mode === "green" ? "GREEN MODE" : "DARK MODE"}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center gap-1 mt-4 border-t border-[#1A1A1A] pt-3">
          <button
            onClick={() => setView("protocols")}
            className={`flex-1 px-3 py-2 text-[10px] tracking-wider transition-all duration-100 ${
              view === "protocols"
                ? "text-current border-b-2"
                : "text-[#666666]"
            }`}
            style={
              view === "protocols"
                ? {
                    color: accentColor,
                    borderBottomColor: accentColor,
                  }
                : {}
            }
          >
            PROTOCOLS
          </button>
          <button
            onClick={() => setView("analytics")}
            className={`flex-1 px-3 py-2 text-[10px] tracking-wider transition-all duration-100 ${
              view === "analytics"
                ? "text-current border-b-2"
                : "text-[#666666]"
            }`}
            style={
              view === "analytics"
                ? {
                    color: accentColor,
                    borderBottomColor: accentColor,
                  }
                : {}
            }
          >
            ANALYTICS
          </button>
          <button
            onClick={() => setView("calendar")}
            className={`flex-1 px-3 py-2 text-[10px] tracking-wider transition-all duration-100 ${
              view === "calendar" ? "text-current border-b-2" : "text-[#666666]"
            }`}
            style={
              view === "calendar"
                ? {
                    color: accentColor,
                    borderBottomColor: accentColor,
                  }
                : {}
            }
          >
            TEMPORAL
          </button>
        </nav>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <SettingsPanel
          mode={mode}
          toggleMode={toggleMode}
          onExport={onExport}
          onImport={onImport}
          rainIntensity={rainIntensity}
          setRainIntensity={setRainIntensity}
          audioEnabled={audioEnabled}
          setAudioEnabled={setAudioEnabled}
          audioVolume={audioVolume}
          setAudioVolume={setAudioVolume}
          onClose={() => setShowSettings(false)}
        />
      )}
    </header>
  );
}

function SettingsPanel({
  mode,
  toggleMode,
  onExport,
  onImport,
  rainIntensity,
  setRainIntensity,
  audioEnabled,
  setAudioEnabled,
  audioVolume,
  setAudioVolume,
  onClose,
}) {
  const accentColor = mode === "green" ? "#00FF41" : "#CCCCCC";

  const handleImportClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".matrix,.json";
    input.onchange = onImport;
    input.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0A0A0A] border-2 border-[#1A1A1A] p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm tracking-wider" style={{ color: accentColor }}>
            SYSTEM SETTINGS
          </h3>
          <button onClick={onClose}>
            <X size={16} className="text-[#666666] hover:text-[#CCCCCC]" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Visual Mode */}
          <div>
            <label className="block text-[10px] text-[#666666] mb-3 tracking-widest">
              VISUAL MODE
            </label>
            <button
              onClick={toggleMode}
              className="w-full px-4 py-3 border text-xs tracking-wider transition-all duration-100"
              style={{
                borderColor: accentColor,
                color: accentColor,
                backgroundColor: `${accentColor}10`,
              }}
            >
              {mode === "green" ? "GREEN MODE ACTIVE" : "DARK MODE ACTIVE"}
            </button>
          </div>

          {/* Audio Control */}
          <div>
            <label className="block text-[10px] text-[#666666] mb-3 tracking-widest">
              AMBIENT AUDIO
            </label>
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`w-full px-4 py-3 border text-xs tracking-wider transition-all duration-100 mb-3`}
              style={
                audioEnabled
                  ? {
                      borderColor: accentColor,
                      color: accentColor,
                      backgroundColor: `${accentColor}10`,
                    }
                  : {
                      borderColor: "#333333",
                      color: "#666666",
                    }
              }
            >
              {audioEnabled ? "🔊 AUDIO ENABLED" : "🔇 AUDIO DISABLED"}
            </button>

            {audioEnabled && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] text-[#666666] tracking-widest">
                    VOLUME
                  </span>
                  <span className="text-[9px]" style={{ color: accentColor }}>
                    {Math.round(audioVolume * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={audioVolume}
                  onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
                  className="w-full h-1 bg-[#1A1A1A] appearance-none cursor-pointer"
                  style={{
                    accentColor: accentColor,
                  }}
                />
                <div className="text-[8px] text-[#666666] mt-2 tracking-wider">
                  GENERATIVE AMBIENT SOUNDSCAPE
                </div>
              </div>
            )}
          </div>

          {/* Rain Intensity */}
          <div>
            <label className="block text-[10px] text-[#666666] mb-3 tracking-widest">
              BACKGROUND INTENSITY
            </label>
            <div className="space-y-2">
              {["minimal", "standard", "aggressive"].map((intensity) => (
                <button
                  key={intensity}
                  onClick={() => setRainIntensity(intensity)}
                  className={`w-full px-4 py-2 border text-xs tracking-wider transition-all duration-100 ${
                    rainIntensity === intensity ? "border-2" : ""
                  }`}
                  style={
                    rainIntensity === intensity
                      ? {
                          borderColor: accentColor,
                          color: accentColor,
                          backgroundColor: `${accentColor}10`,
                        }
                      : {
                          borderColor: "#333333",
                          color: "#666666",
                        }
                  }
                >
                  {intensity.toUpperCase()}
                  {intensity === "minimal" && " - 5% OPACITY"}
                  {intensity === "standard" && " - 15% OPACITY"}
                  {intensity === "aggressive" && " - 25% OPACITY"}
                </button>
              ))}
            </div>
          </div>

          {/* Data Management */}
          <div>
            <label className="block text-[10px] text-[#666666] mb-3 tracking-widest">
              DATA MANAGEMENT
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onExport}
                className="px-4 py-3 border border-[#333333] text-xs tracking-wider transition-all duration-100 hover:border-[#666666] flex items-center justify-center gap-2"
                style={{ color: accentColor }}
              >
                <Download size={14} />
                EXPORT
              </button>
              <button
                onClick={handleImportClick}
                className="px-4 py-3 border border-[#333333] text-xs tracking-wider transition-all duration-100 hover:border-[#666666] flex items-center justify-center gap-2"
                style={{ color: accentColor }}
              >
                <Upload size={14} />
                IMPORT
              </button>
            </div>
            <div className="text-[9px] text-[#666666] mt-2 tracking-wider">
              EXPORT FORMAT: ENCRYPTED .MATRIX FILE
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-2 border border-[#333333] text-xs text-[#666666] tracking-wider hover:border-[#666666] hover:text-[#CCCCCC] transition-all duration-100"
        >
          CLOSE
        </button>
      </div>
    </div>
  );
}
