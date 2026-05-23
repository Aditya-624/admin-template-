"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Bell, ShoppingCart, LayoutGrid,
  ChevronDown, Settings, LogOut, User,
  Menu, Sun, Moon, Zap, Palette,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { notifications } from "@/lib/dummy-data";
import { cn } from "@/lib/utils";

const colorShifts = [
  { label: "Cyan", bg: "linear-gradient(145deg, #021a1f 0%, #164e63 50%, #021a1f 100%)", orb: "radial-gradient(ellipse 80% 70% at 40% 40%, rgba(34,211,238,.9) 0%, rgba(6,182,212,.65) 45%, transparent 75%)", swatch: "#06b6d4" },
  { label: "Sky", bg: "linear-gradient(145deg, #040f1f 0%, #0c4a6e 50%, #040f1f 100%)", orb: "radial-gradient(ellipse 80% 70% at 40% 40%, rgba(56,189,248,.9) 0%, rgba(14,165,233,.65) 45%, transparent 75%)", swatch: "#0ea5e9" },
  { label: "Smoke Dark", bg: "radial-gradient(ellipse at 50% 0%, #3b495c 0%, #263344 100%)", orb: "none", swatch: "#3b495c" },
  { label: "Periwinkle", bg: "linear-gradient(135deg, #6366f1 0%, #818cf8 50%, #a5b4fc 100%)", orb: "none", swatch: "#818cf8" },
  { label: "Pinkish", bg: "linear-gradient(145deg, #FFF5F7 0%, #FFE4E6 50%, #FECDD3 100%)", orb: "radial-gradient(ellipse 80% 70% at 40% 40%, rgba(251,113,133,.4) 0%, rgba(244,63,94,.25) 45%, transparent 75%)", swatch: "#fb7185" },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { setMobileOpen } = useSidebar();
  const headerRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [activeColor, setActiveColor] = useState("Indigo");
  const [search, setSearch] = useState("");

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Scroll detection
  useEffect(() => {
    // Check initial scroll position
    const checkScroll = () => {
      const scrolled = window.scrollY > 10;
      setIsScrolled(scrolled);
      console.log('Scroll Y:', window.scrollY, 'Scrolled:', scrolled);
    };

    // Call on mount to check initial position
    checkScroll();

    // Add scroll listener
    window.addEventListener("scroll", checkScroll, { passive: true });
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  const applyColor = (shift: typeof colorShifts[0]) => {
    setActiveColor(shift.label);
    setShowPalette(false);
    window.dispatchEvent(new CustomEvent("theme-color-shift", { detail: { bg: shift.bg, orb: shift.orb } }));
  };

  return (
    <header ref={headerRef} className={`sticky top-0 z-30 h-16 flex items-center gap-3 px-4 lg:px-5 glass-nav ${isScrolled ? 'scrolled' : ''}`}>

      {/* Mobile menu */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="hidden md:flex items-center gap-3 mr-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold">
          D
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-white">Dashtrans</p>
          <p className="text-[11px] text-slate-500">Admin Panel</p>
        </div>
      </div>



      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-1.5">

        {/* AI Active pill */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
          <Zap className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-xs text-indigo-300 font-medium">AI Active</span>
        </div>



        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <AnimatePresence mode="wait">
            {theme === "dark" ? (
              <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Sun className="w-4.5 h-4.5" />
              </motion.div>
            ) : (
              <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Moon className="w-4.5 h-4.5" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Apps grid */}
        <button className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
          <LayoutGrid className="w-4.5 h-4.5" />
        </button>



        {/* Cart */}
        <div className="relative">
          <button className="relative w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
            <ShoppingCart className="w-4.5 h-4.5" />
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-indigo-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
              8
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-7 bg-white/[0.10] mx-1" />

        {/* Profile */}
        <div 
          className="relative"
          onMouseEnter={() => { setShowProfile(true); setShowNotifications(false); setShowPalette(false); }}
          onMouseLeave={() => setShowProfile(false)}
        >
          <button
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-white/[0.07] transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-red-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ boxShadow: "0 0 0 2px rgba(255,255,255,.15)" }}>
              SA
            </div>
            <div className="hidden md:block text-left">
              <p className="text-[13px] font-semibold text-white leading-tight">Super Admin</p>
              <p className="text-[11px] text-slate-400 leading-tight mt-0.5">Administrator</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden md:block" />
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.14 }}
                className="absolute right-0 top-full mt-2 w-48 glass-modal z-50 py-1"
              >
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium transition-colors text-slate-300 hover:bg-white/[0.05]">
                  <User className="w-4 h-4" /> Profile
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium transition-colors text-slate-300 hover:bg-white/[0.05]">
                  <Settings className="w-4 h-4" /> Settings
                </button>
                
                {/* Nested Color Shift */}
                <div
                  className="relative w-full"
                  onMouseEnter={() => setShowPalette(true)}
                  onMouseLeave={() => setShowPalette(false)}
                >
                  <button className="w-full flex items-center justify-between px-4 py-2.5 text-[13px] font-medium transition-colors text-slate-300 hover:bg-white/[0.05]">
                    <div className="flex items-center gap-3">
                      <Palette className="w-4 h-4" /> Theme Color
                    </div>
                  </button>

                  <AnimatePresence>
                    {showPalette && (
                      <motion.div
                        initial={{ opacity: 0, x: 8, scale: 0.96 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 8, scale: 0.96 }}
                        transition={{ duration: 0.14 }}
                        className="absolute right-full top-0 mr-1 w-52 glass-modal z-50 p-2"
                      >
                        <p className="text-[11px] text-slate-500 font-medium mb-1.5 px-2 tracking-wider">COLOR SHIFT</p>
                        <div className="space-y-0.5">
                          {colorShifts.map((shift) => (
                            <button
                              key={shift.label}
                              onClick={() => applyColor(shift)}
                              className="w-full flex items-center gap-3 px-2 py-1.5 rounded-lg transition-all"
                              style={{
                                background: activeColor === shift.label ? `${shift.swatch}18` : "transparent",
                                border: `1px solid ${activeColor === shift.label ? shift.swatch + "55" : "transparent"}`,
                              }}
                            >
                              <div
                                className="w-4 h-4 rounded-md flex-shrink-0"
                                style={{ background: shift.swatch, boxShadow: `0 2px 6px ${shift.swatch}66` }}
                              />
                              <span className="text-[12px] font-medium text-slate-200">{shift.label}</span>
                              {activeColor === shift.label && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: shift.swatch }} />
                              )}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="h-px w-full bg-white/[0.08] my-1" />
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium transition-colors text-red-400 hover:bg-red-500/10">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Click outside */}
      {(showNotifications || showProfile || showPalette) && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => { setShowNotifications(false); setShowProfile(false); setShowPalette(false); }}
        />
      )}
    </header>
  );
}
