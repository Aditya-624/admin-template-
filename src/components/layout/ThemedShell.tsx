"use client";

import React, { useState, useEffect } from "react";


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

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

function applyTableAccent(label: string, swatch: string) {
  const root = document.documentElement;
  const rgb = hexToRgb(swatch);

  root.setAttribute("data-theme", label.toLowerCase());
  root.style.setProperty("--table-accent", swatch);
  root.style.setProperty("--table-accent-rgb", rgb);
  root.style.setProperty("--table-hover-bg", `rgba(${rgb}, 0.12)`);
}

export default function ThemedShell({ children }: ThemedShellProps) {
  const [bg, setBg] = useState("linear-gradient(145deg, #040f1f 0%, #0c4a6e 50%, #040f1f 100%)"); // Default Sky

  /* Apply light/dark text mode based on background brightness */
  useEffect(() => {
    const bright = getBrightness(bg);
    if (bright > 140) {
      document.body.setAttribute("data-bg", "light");
    } else {
      document.body.removeAttribute("data-bg");
    }
  }, [bg]);

  useEffect(() => {
    // Load persisted theme configurations on mount
    const savedBg = localStorage.getItem("theme-bg");
    const savedLabel = localStorage.getItem("theme-label");
    const savedSwatch = localStorage.getItem("theme-swatch");
    if (savedBg) {
      setBg(savedBg);
    }
    if (savedLabel && savedSwatch) {
      applyTableAccent(savedLabel, savedSwatch);
    }

    const handler = (e: Event) => {
      const { bg: newBg, label, swatch } = (e as CustomEvent).detail;
      setBg(newBg);
      if (newBg) {
        localStorage.setItem("theme-bg", newBg);
      }
      if (label && swatch) {
        applyTableAccent(label, swatch);
        localStorage.setItem("theme-label", label);
        localStorage.setItem("theme-swatch", swatch);
      }
    };
    window.addEventListener("theme-color-shift", handler);
    return () => window.removeEventListener("theme-color-shift", handler);
  }, []);


  return (
    <>
      <div
        className="fixed inset-0 z-0 transition-all duration-700"
        style={{ background: bg }}
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10">{children}</div>
    </>
  );
}
