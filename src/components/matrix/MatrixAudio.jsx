"use client";

import { useEffect, useRef } from "react";

export default function MatrixAudio({ mode, isPlaying, volume = 0.3 }) {
  const audioContextRef = useRef(null);
  const gainNodeRef = useRef(null);
  const oscillatorsRef = useRef([]);
  const noiseNodeRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initialize AudioContext
    if (!audioContextRef.current) {
      audioContextRef.current = new (
        window.AudioContext || window.webkitAudioContext
      )();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
    }

    const audioContext = audioContextRef.current;
    const gainNode = gainNodeRef.current;

    if (isPlaying) {
      // Resume AudioContext if suspended
      if (audioContext.state === "suspended") {
        audioContext.resume();
      }

      // Set volume
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);

      // Create deep drone bass (base frequency)
      const bassDrone = audioContext.createOscillator();
      bassDrone.type = "sine";
      bassDrone.frequency.setValueAtTime(55, audioContext.currentTime); // A1 note

      const bassGain = audioContext.createGain();
      bassGain.gain.setValueAtTime(0.15, audioContext.currentTime);
      bassDrone.connect(bassGain);
      bassGain.connect(gainNode);
      bassDrone.start();
      oscillatorsRef.current.push({ osc: bassDrone, gain: bassGain });

      // Create harmonic drone (perfect fifth)
      const harmonic = audioContext.createOscillator();
      harmonic.type = "sine";
      harmonic.frequency.setValueAtTime(82.5, audioContext.currentTime); // E2 note

      const harmonicGain = audioContext.createGain();
      harmonicGain.gain.setValueAtTime(0.1, audioContext.currentTime);
      harmonic.connect(harmonicGain);
      harmonicGain.connect(gainNode);
      harmonic.start();
      oscillatorsRef.current.push({ osc: harmonic, gain: harmonicGain });

      // Create subtle pad (octave)
      const pad = audioContext.createOscillator();
      pad.type = "triangle";
      pad.frequency.setValueAtTime(110, audioContext.currentTime); // A2 note

      const padGain = audioContext.createGain();
      padGain.gain.setValueAtTime(0.08, audioContext.currentTime);
      pad.connect(padGain);
      padGain.connect(gainNode);
      pad.start();
      oscillatorsRef.current.push({ osc: pad, gain: padGain });

      // Add filtered white noise for texture
      const bufferSize = 2 * audioContext.sampleRate;
      const noiseBuffer = audioContext.createBuffer(
        1,
        bufferSize,
        audioContext.sampleRate,
      );
      const output = noiseBuffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = audioContext.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const noiseFilter = audioContext.createBiquadFilter();
      noiseFilter.type = "lowpass";
      noiseFilter.frequency.setValueAtTime(200, audioContext.currentTime);

      const noiseGain = audioContext.createGain();
      noiseGain.gain.setValueAtTime(0.03, audioContext.currentTime);

      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(gainNode);
      whiteNoise.start();

      noiseNodeRef.current = {
        source: whiteNoise,
        filter: noiseFilter,
        gain: noiseGain,
      };

      // Random glitch effects
      const glitchInterval = setInterval(() => {
        if (!isPlaying) return;

        // Random frequency modulation
        if (Math.random() > 0.7) {
          const glitchOsc = audioContext.createOscillator();
          glitchOsc.type = "square";
          glitchOsc.frequency.setValueAtTime(
            Math.random() * 1000 + 200,
            audioContext.currentTime,
          );

          const glitchGain = audioContext.createGain();
          glitchGain.gain.setValueAtTime(0, audioContext.currentTime);
          glitchGain.gain.linearRampToValueAtTime(
            0.02,
            audioContext.currentTime + 0.01,
          );
          glitchGain.gain.linearRampToValueAtTime(
            0,
            audioContext.currentTime + 0.1,
          );

          glitchOsc.connect(glitchGain);
          glitchGain.connect(gainNode);
          glitchOsc.start();
          glitchOsc.stop(audioContext.currentTime + 0.1);
        }

        // Pulse effect (mode-based)
        if (mode === "green" && Math.random() > 0.85) {
          const currentTime = audioContext.currentTime;
          oscillatorsRef.current.forEach(({ gain }) => {
            const currentGain = gain.gain.value;
            gain.gain.cancelScheduledValues(currentTime);
            gain.gain.setValueAtTime(currentGain, currentTime);
            gain.gain.linearRampToValueAtTime(
              currentGain * 1.3,
              currentTime + 0.05,
            );
            gain.gain.linearRampToValueAtTime(currentGain, currentTime + 0.3);
          });
        }
      }, 2000);

      return () => {
        clearInterval(glitchInterval);
      };
    } else {
      // Stop all oscillators
      oscillatorsRef.current.forEach(({ osc }) => {
        try {
          osc.stop();
        } catch (e) {
          // Already stopped
        }
      });
      oscillatorsRef.current = [];

      // Stop noise
      if (noiseNodeRef.current) {
        try {
          noiseNodeRef.current.source.stop();
        } catch (e) {
          // Already stopped
        }
        noiseNodeRef.current = null;
      }
    }

    return () => {
      oscillatorsRef.current.forEach(({ osc }) => {
        try {
          osc.stop();
        } catch (e) {
          // Already stopped
        }
      });
      oscillatorsRef.current = [];

      if (noiseNodeRef.current) {
        try {
          noiseNodeRef.current.source.stop();
        } catch (e) {
          // Already stopped
        }
        noiseNodeRef.current = null;
      }
    };
  }, [isPlaying, mode]);

  // Update volume
  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        volume,
        audioContextRef.current.currentTime,
      );
    }
  }, [volume]);

  return null;
}
