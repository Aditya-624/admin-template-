"use client";

import React, { useState, useEffect } from "react";
import ThemeCustomizer, { gradientThemes } from "./ThemeCustomizer";

interface ThemedShellProps {
  children: React.ReactNode;
}

/* Extract first hex color from a CSS gradient string and return brightness 0-255 */
function getBrightness(css: string): number {
  const hex = css.match(/#([0-9a-f]{6})/i)?.[1];
  if (!hex) return 0;
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

export default function ThemedShell({ children }: ThemedShellProps) {
  const def = gradientThemes[2];
  const [bg, setBg] = useState(def.bg);
  const [gaussianCss, setGaussianCss] = useState("");
  const [activeGradient, setActiveGradient] = useState(def.id);

  /* Apply light/dark text mode based on background brightness */
  useEffect(() => {
    const activeCss = gaussianCss || bg;
    const bright = getBrightness(activeCss);
    if (bright > 140) {
      document.body.setAttribute("data-bg", "light");
    } else {
      document.body.removeAttribute("data-bg");
    }
  }, [bg, gaussianCss]);

  useEffect(() => {
    const handler = (e: Event) => {
      const { bg: newBg } = (e as CustomEvent).detail;
      setBg(newBg);
      setGaussianCss("");
      setActiveGradient("");
    };
    window.addEventListener("theme-color-shift", handler);
    return () => window.removeEventListener("theme-color-shift", handler);
  }, []);

  const handleGradientChange = (newBg: string) => {
    setBg(newBg);
    setGaussianCss("");
    const found = gradientThemes.find((t) => t.bg === newBg);
    if (found) setActiveGradient(found.id);
  };

  const handleGaussianChange = (css: string) => {
    setGaussianCss(css);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-0 transition-all duration-700"
        style={{ background: gaussianCss || bg }}
        aria-hidden="true"
      >
        {gaussianCss && (
          <div
            className="absolute inset-0"
            style={{ background: gaussianCss, filter: "blur(60px)", opacity: 0.6 }}
          />
        )}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10">{children}</div>

      <ThemeCustomizer
        onGradientChange={handleGradientChange}
        onGaussianChange={handleGaussianChange}
        activeGradient={activeGradient}
        activeGaussian={gaussianCss}
      />
    </>
  );
}
