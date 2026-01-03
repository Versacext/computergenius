"use client";

import { useState, useEffect } from "react";
import MatrixRain from "@/components/matrix/MatrixRain";
import MatrixAudio from "@/components/matrix/MatrixAudio";
import Header from "@/components/matrix/Header";
import ProtocolGrid from "@/components/matrix/ProtocolGrid";
import Analytics from "@/components/matrix/Analytics";
import Calendar from "@/components/matrix/Calendar";
import GlobalStyles from "@/components/matrix/GlobalStyles";

// Simple encryption/decryption using base64 (можно заменить на более сложный алгоритм)
const encryptData = (data) => {
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
  } catch (e) {
    console.error("ENCRYPTION ERROR 0x9A");
    return null;
  }
};

const decryptData = (encrypted) => {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(encrypted))));
  } catch (e) {
    console.error("DECRYPTION ERROR 0x9B");
    return null;
  }
};

export default function MorpheusTracker() {
  const [mode, setMode] = useState("green"); // 'green' or 'dark'
  const [view, setView] = useState("protocols"); // 'protocols', 'analytics', 'calendar'
  const [protocols, setProtocols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rainIntensity, setRainIntensity] = useState("standard"); // 'minimal', 'standard', 'aggressive'
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.3);

  // Load data from localStorage with decryption
  useEffect(() => {
    const stored = localStorage.getItem("morpheus_protocols");
    const storedIntensity = localStorage.getItem("morpheus_rain_intensity");
    const storedAudio = localStorage.getItem("morpheus_audio_enabled");
    const storedVolume = localStorage.getItem("morpheus_audio_volume");

    if (storedIntensity) {
      setRainIntensity(storedIntensity);
    }

    if (storedAudio) {
      setAudioEnabled(storedAudio === "true");
    }

    if (storedVolume) {
      setAudioVolume(parseFloat(storedVolume));
    }

    if (stored) {
      try {
        const decrypted = decryptData(stored);
        if (decrypted) {
          setProtocols(decrypted);
        }
      } catch (e) {
        console.error("SYSTEM ERROR 0x7B: DATA CORRUPTION DETECTED");
      }
    }
    setLoading(false);
  }, []);

  // Save data to localStorage with encryption
  useEffect(() => {
    if (!loading) {
      const encrypted = encryptData(protocols);
      if (encrypted) {
        localStorage.setItem("morpheus_protocols", encrypted);
      }
    }
  }, [protocols, loading]);

  // Save rain intensity
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("morpheus_rain_intensity", rainIntensity);
    }
  }, [rainIntensity, loading]);

  // Save audio settings
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("morpheus_audio_enabled", audioEnabled.toString());
      localStorage.setItem("morpheus_audio_volume", audioVolume.toString());
    }
  }, [audioEnabled, audioVolume, loading]);

  const toggleMode = () => {
    setMode((prev) => (prev === "green" ? "dark" : "green"));
  };

  const exportData = () => {
    const exportObj = {
      version: "1.0",
      exported: new Date().toISOString(),
      protocols: protocols,
      rainIntensity: rainIntensity,
    };

    const dataStr = JSON.stringify(exportObj, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `morpheus_backup_${Date.now()}.matrix`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (imported.protocols) {
          if (confirm("IMPORT WILL OVERWRITE CURRENT DATA. PROCEED?")) {
            setProtocols(imported.protocols);
            if (imported.rainIntensity) {
              setRainIntensity(imported.rainIntensity);
            }
          }
        } else {
          alert("INVALID DATA FORMAT");
        }
      } catch (error) {
        console.error("IMPORT ERROR 0x8C:", error);
        alert("FILE CORRUPTION DETECTED");
      }
    };
    reader.readAsText(file);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="font-mono text-[#00FF41] text-sm">
          INITIALIZING SYSTEM...
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${mode === "green" ? "bg-[#0A0A0A]" : "bg-black"} text-[#CCCCCC] font-mono relative overflow-hidden`}
    >
      <MatrixRain mode={mode} intensity={rainIntensity} />
      <MatrixAudio mode={mode} isPlaying={audioEnabled} volume={audioVolume} />
      <GlobalStyles />

      <div className="relative z-10">
        <Header
          mode={mode}
          toggleMode={toggleMode}
          view={view}
          setView={setView}
          onExport={exportData}
          onImport={importData}
          rainIntensity={rainIntensity}
          setRainIntensity={setRainIntensity}
          audioEnabled={audioEnabled}
          setAudioEnabled={setAudioEnabled}
          audioVolume={audioVolume}
          setAudioVolume={setAudioVolume}
        />

        <main className="container mx-auto px-4 py-6 max-w-7xl">
          {view === "protocols" && (
            <ProtocolGrid
              protocols={protocols}
              setProtocols={setProtocols}
              mode={mode}
            />
          )}

          {view === "analytics" && (
            <Analytics protocols={protocols} mode={mode} />
          )}

          {view === "calendar" && (
            <Calendar protocols={protocols} mode={mode} />
          )}
        </main>
      </div>
    </div>
  );
}
