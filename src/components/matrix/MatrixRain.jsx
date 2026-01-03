"use client";

import { useEffect, useRef } from "react";

export default function MatrixRain({ mode, intensity = "standard" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Characters for the rain
    const latinChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const cyrillicChars = "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
    const mathChars = "∑∏∫∂∇√∞≈≠±×÷";
    const allChars = latinChars + cyrillicChars + mathChars;

    const phrases = [
      "WAKE UP NEO",
      "THE MATRIX HAS YOU",
      "FOLLOW THE WHITE RABBIT",
      "YOUR MIND MAKES IT REAL",
      "SYSTEM FAILURE",
      "CONSTRUCT RESET",
      "NEURAL PATTERN DETECTED",
      "CONSCIOUSNESS BREACH",
    ];

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = new Array(columns).fill(1);
    const speeds = new Array(columns)
      .fill(0)
      .map(() => Math.random() * 0.5 + 0.5);

    let phraseTimer = 0;
    let currentPhrase = null;
    let phraseX = 0;
    let phraseY = 0;
    let phraseAlpha = 0;

    // Adjust opacity based on intensity
    const getOpacityMultiplier = () => {
      switch (intensity) {
        case "minimal":
          return 0.3; // 5% effective
        case "aggressive":
          return 1.7; // 25% effective
        default:
          return 1; // 15% standard
      }
    };

    function draw() {
      // Semi-transparent black background for trail effect
      const bgAlpha = mode === "dark" ? 0.08 : 0.06;
      ctx.fillStyle = `rgba(0, 0, 0, ${bgAlpha})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set text properties
      ctx.font = `${fontSize}px monospace`;
      const baseAlpha = mode === "dark" ? 0.3 : 0.18;
      const textAlpha = baseAlpha * getOpacityMultiplier();

      for (let i = 0; i < drops.length; i++) {
        const char = allChars[Math.floor(Math.random() * allChars.length)];

        // Color variation for depth
        const brightness = Math.random() > 0.95 ? 1 : 0.7;
        ctx.fillStyle =
          mode === "dark"
            ? `rgba(204, 204, 204, ${textAlpha * brightness})`
            : `rgba(0, 255, 65, ${textAlpha * brightness})`;

        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(char, x, y);

        // Random glitch effect (more frequent in aggressive mode)
        const glitchChance = intensity === "aggressive" ? 0.98 : 0.99;
        if (Math.random() > glitchChance) {
          ctx.fillStyle =
            mode === "dark"
              ? `rgba(255, 255, 255, ${textAlpha * 1.5})`
              : `rgba(0, 255, 65, ${textAlpha * 1.5})`;
          ctx.fillText(char, x, y);
        }

        // Reset drop to top randomly
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
          speeds[i] = Math.random() * 0.5 + 0.5;
        }

        drops[i] += speeds[i];
      }

      // Phrase easter egg (more common in aggressive mode)
      phraseTimer++;
      const phraseChance = intensity === "aggressive" ? 0.985 : 0.99;
      if (phraseTimer > 60 && Math.random() > phraseChance && !currentPhrase) {
        currentPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        phraseX = Math.random() * (canvas.width - 300);
        phraseY = Math.random() * (canvas.height - 100) + 50;
        phraseAlpha = 0;
        phraseTimer = 0;
      }

      // Draw phrase
      if (currentPhrase) {
        phraseAlpha += 0.02;
        if (phraseAlpha > 1) phraseAlpha = 1;

        ctx.font = `bold ${fontSize}px monospace`;
        const phraseOpacity =
          intensity === "minimal"
            ? 0.15
            : intensity === "aggressive"
              ? 0.4
              : 0.25;
        ctx.fillStyle =
          mode === "dark"
            ? `rgba(255, 0, 51, ${Math.min(phraseAlpha, phraseOpacity)})`
            : `rgba(0, 255, 65, ${Math.min(phraseAlpha, phraseOpacity - 0.05)})`;
        ctx.fillText(currentPhrase, phraseX, phraseY);

        if (phraseAlpha >= 1) {
          setTimeout(() => {
            phraseAlpha = 0;
            currentPhrase = null;
          }, 2000);
        }
      }
    }

    const interval = setInterval(draw, 33); // ~60 FPS

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, [mode, intensity]);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
  );
}
