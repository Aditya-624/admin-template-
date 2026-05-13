"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X, Check, Palette } from "lucide-react";

/* ── Gaussian Texture — 6 swatches, 3×2 grid ── */
const gaussianThemes = [
  {
    id: "g1",
    label: "Ocean Teal",
    css: `radial-gradient(ellipse at 20% 25%, #4dd9c0 0%, #0ea5a0 30%, #0369a1 65%, #0c2461 100%)`,
  },
  {
    id: "g2",
    label: "Smoke Dark",
    css: `radial-gradient(ellipse at 50% 35%, #5a6a72 0%, #2e3d45 35%, #1a2530 65%, #0d1117 100%)`,
  },
  {
    id: "g3",
    label: "Forest Mist",
    css: `radial-gradient(ellipse at 65% 20%, #2dd4bf 0%, #059669 30%, #064e3b 65%, #022c22 100%)`,
  },
  {
    id: "g4",
    label: "Aurora",
    css: `radial-gradient(ellipse at 30% 30%, #ffffff 0%, #f0abfc 15%, #c084fc 35%, #818cf8 55%, #38bdf8 75%, #34d399 90%, #a3e635 100%)`,
  },
  {
    id: "g5",
    label: "Purple Haze",
    css: `radial-gradient(ellipse at 50% 50%, #f0abfc 0%, #d946ef 25%, #a855f7 55%, #3b0764 100%)`,
  },
  {
    id: "g6",
    label: "Sunset Glow",
    css: `radial-gradient(ellipse at 50% 45%, #fda4af 0%, #fb7185 20%, #f43f5e 45%, #be123c 70%, #4c0519 100%)`,
  },
];

/* ── Gradient Background — 9 swatches, 3×3 grid ── */
const gradientThemes = [
  {
    id: "bg1",
    label: "Teal Forest",
    bg: "linear-gradient(135deg, #0d9488 0%, #065f46 100%)",
    orb: "",
  },
  {
    id: "bg2",
    label: "Tropic",
    bg: "linear-gradient(135deg, #16a34a 0%, #ca8a04 50%, #0d9488 100%)",
    orb: "",
  },
  {
    id: "bg3",
    label: "Charcoal",
    bg: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
    orb: "",
  },
  {
    id: "bg4",
    label: "Terracotta",
    bg: "linear-gradient(135deg, #b45309 0%, #9f1239 50%, #7c3aed 100%)",
    orb: "",
  },
  {
    id: "bg5",
    label: "Royal Blue",
    bg: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
    orb: "",
  },
  {
    id: "bg6",
    label: "Lavender",
    bg: "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)",
    orb: "",
  },
  {
    id: "bg7",
    label: "Coral Blaze",
    bg: "linear-gradient(135deg, #f97316 0%, #e11d48 100%)",
    orb: "",
  },
  {
    id: "bg8",
    label: "Lime Burst",
    bg: "linear-gradient(135deg, #65a30d 0%, #84cc16 100%)",
    orb: "",
  },
  {
    id: "bg9",
    label: "Periwinkle",
    bg: "linear-gradient(135deg, #6366f1 0%, #818cf8 50%, #a5b4fc 100%)",
    orb: "",
  },
];

interface ThemeCustomizerProps {
  onGaussianChange: (css: string) => void;
  onGradientChange: (bg: string) => void;
  activeGaussian: string;
  activeGradient: string;
}

export default function ThemeCustomizer({
  onGaussianChange,
  onGradientChange,
  activeGaussian,
  activeGradient,
}: ThemeCustomizerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ── Floating trigger ── */}
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.1, x: -4 }}
        whileTap={{ scale: 0.95 }}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-[60] w-12 h-14 rounded-l-2xl flex items-center justify-center text-white shadow-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(99,102,241,.85), rgba(168,85,247,.85))",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,.2)",
          borderRight: "none",
          boxShadow: "-4px 0 24px rgba(99,102,241,.4)",
        }}
        title="Theme Customizer"
      >
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.4 }}>
          <Settings className="w-6 h-6" />
        </motion.div>
      </motion.button>

      {/* ── Backdrop ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Drawer ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 240 }}
            className="fixed right-0 top-0 h-full z-[60] flex flex-col"
            style={{
              width: "460px",
              background: "#111",
              borderLeft: "1px solid rgba(255,255,255,.1)",
              boxShadow: "-16px 0 64px rgba(0,0,0,.8)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-7 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,.08)" }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-[17px] font-bold text-white">Theme Customizer</h2>
                  <p className="text-[12px] text-slate-500 mt-0.5">Pick your background style</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-7 py-6 space-y-8">

              {/* ── Section 1: Gaussian Texture — 3×2 grid ── */}
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <h3 className="text-[15px] font-semibold text-white tracking-wide">Gaussian Texture</h3>
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,.08)" }} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {gaussianThemes.map((theme) => {
                    const active = activeGaussian === theme.css;
                    return (
                      <button
                        key={theme.id}
                        onClick={() => onGaussianChange(theme.css)}
                        className="relative group flex flex-col items-center gap-2"
                      >
                        <motion.div
                          whileHover={{ scale: 1.07 }}
                          whileTap={{ scale: 0.97 }}
                          transition={{ duration: 0.18 }}
                          className="w-full"
                          style={{
                            aspectRatio: "1",
                            borderRadius: "20px",
                            background: theme.css,
                            boxShadow: active
                              ? "0 0 0 3px #a855f7, 0 0 24px rgba(168,85,247,.55)"
                              : "0 6px 20px rgba(0,0,0,.55)",
                            outline: active ? "2px solid rgba(255,255,255,.25)" : "none",
                            outlineOffset: "3px",
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          {/* Bokeh blur overlay for gaussian feel */}
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              background: theme.css,
                              filter: "blur(8px)",
                              opacity: 0.5,
                              borderRadius: "inherit",
                            }}
                          />
                          {active && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center z-10"
                              style={{ background: "rgba(168,85,247,.95)", boxShadow: "0 2px 8px rgba(0,0,0,.5)" }}
                            >
                              <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                            </motion.div>
                          )}
                        </motion.div>
                        <span className="text-[11px] font-medium text-slate-400 group-hover:text-slate-200 transition-colors text-center leading-tight">
                          {theme.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* ── Section 2: Gradient Background — 3×3 grid ── */}
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <h3 className="text-[15px] font-semibold text-white tracking-wide">Gradient Background</h3>
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,.08)" }} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {gradientThemes.map((theme) => {
                    const active = activeGradient === theme.id;
                    return (
                      <button
                        key={theme.id}
                        onClick={() => onGradientChange(theme.bg)}
                        className="relative group flex flex-col items-center gap-2"
                      >
                        <motion.div
                          whileHover={{ scale: 1.07 }}
                          whileTap={{ scale: 0.97 }}
                          transition={{ duration: 0.18 }}
                          className="w-full"
                          style={{
                            aspectRatio: "1",
                            borderRadius: "20px",
                            background: theme.bg,
                            boxShadow: active
                              ? "0 0 0 3px #6366f1, 0 0 24px rgba(99,102,241,.55)"
                              : "0 6px 20px rgba(0,0,0,.55)",
                            outline: active ? "2px solid rgba(255,255,255,.25)" : "none",
                            outlineOffset: "3px",
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          {active && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                              style={{ background: "rgba(99,102,241,.95)", boxShadow: "0 2px 8px rgba(0,0,0,.5)" }}
                            >
                              <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                            </motion.div>
                          )}
                        </motion.div>
                        <span className="text-[11px] font-medium text-slate-400 group-hover:text-slate-200 transition-colors text-center leading-tight">
                          {theme.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

            </div>

            {/* Footer */}
            <div className="px-7 py-5" style={{ borderTop: "1px solid rgba(255,255,255,.08)" }}>
              <button
                onClick={() => {
onGradientChange(gradientThemes[2].bg);
                  onGaussianChange("");
                  setOpen(false);
                }}
                className="w-full py-3 rounded-xl text-[14px] font-semibold text-slate-300 hover:text-white transition-all"
                style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.10)" }}
              >
                Reset to Default
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export { gaussianThemes, gradientThemes };
