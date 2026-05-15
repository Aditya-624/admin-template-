"use client";

import React, { useState } from "react";
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
  { label: "Indigo",  bg: "linear-gradient(145deg, #0f0a1a 0%, #1e1b4b 50%, #0f0a1a 100%)", orb: "radial-gradient(ellipse 80% 70% at 40% 40%, rgba(99,102,241,.9) 0%, rgba(79,70,229,.65) 45%, transparent 75%)", swatch: "#6366f1" },
  { label: "Violet",  bg: "linear-gradient(145deg, #130a2a 0%, #2e1065 50%, #130a2a 100%)", orb: "radial-gradient(ellipse 80% 70% at 40% 40%, rgba(167,139,250,.9) 0%, rgba(139,92,246,.65) 45%, transparent 75%)", swatch: "#8b5cf6" },
  { label: "Fuchsia", bg: "linear-gradient(145deg, #1a0a20 0%, #4a044e 50%, #1a0a20 100%)", orb: "radial-gradient(ellipse 80% 70% at 40% 40%, rgba(232,121,249,.9) 0%, rgba(192,38,211,.65) 45%, transparent 75%)", swatch: "#d946ef" },
  { label: "Rose",    bg: "linear-gradient(145deg, #1a0a0f 0%, #4c0519 50%, #1a0a0f 100%)", orb: "radial-gradient(ellipse 80% 70% at 40% 40%, rgba(251,113,133,.9) 0%, rgba(244,63,94,.65) 45%, transparent 75%)",  swatch: "#f43f5e" },
  { label: "Amber",   bg: "linear-gradient(145deg, #1a0f00 0%, #451a03 50%, #1a0f00 100%)", orb: "radial-gradient(ellipse 80% 70% at 40% 40%, rgba(251,191,36,.9) 0%, rgba(245,158,11,.65) 45%, transparent 75%)",  swatch: "#f59e0b" },
  { label: "Emerald", bg: "linear-gradient(145deg, #021a0f 0%, #064e3b 50%, #021a0f 100%)", orb: "radial-gradient(ellipse 80% 70% at 40% 40%, rgba(52,211,153,.9) 0%, rgba(16,185,129,.65) 45%, transparent 75%)",  swatch: "#10b981" },
  { label: "Cyan",    bg: "linear-gradient(145deg, #021a1f 0%, #164e63 50%, #021a1f 100%)", orb: "radial-gradient(ellipse 80% 70% at 40% 40%, rgba(34,211,238,.9) 0%, rgba(6,182,212,.65) 45%, transparent 75%)",   swatch: "#06b6d4" },
  { label: "Sky",     bg: "linear-gradient(145deg, #040f1f 0%, #0c4a6e 50%, #040f1f 100%)", orb: "radial-gradient(ellipse 80% 70% at 40% 40%, rgba(56,189,248,.9) 0%, rgba(14,165,233,.65) 45%, transparent 75%)",  swatch: "#0ea5e9" },
  { label: "Aurora",  bg: "linear-gradient(145deg, #0a0f1a 0%, #1a0a2e 50%, #0a1a0f 100%)", orb: "radial-gradient(ellipse 90% 80% at 40% 40%, rgba(99,102,241,.7) 0%, rgba(168,85,247,.5) 30%, rgba(236,72,153,.4) 60%, rgba(16,185,129,.3) 85%, transparent 100%)", swatch: "#a855f7" },
  { label: "Sunset",  bg: "linear-gradient(145deg, #1a0a05 0%, #431407 50%, #1a0a05 100%)", orb: "radial-gradient(ellipse 80% 70% at 40% 40%, rgba(251,146,60,.9) 0%, rgba(239,68,68,.65) 45%, transparent 75%)",  swatch: "#f97316" },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { setMobileOpen } = useSidebar();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [activeColor, setActiveColor] = useState("Indigo");
  const [search, setSearch] = useState("");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const applyColor = (shift: typeof colorShifts[0]) => {
    setActiveColor(shift.label);
    setShowPalette(false);
    window.dispatchEvent(new CustomEvent("theme-color-shift", { detail: { bg: shift.bg, orb: shift.orb } }));
  };

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center gap-3 px-4 lg:px-5 glass-nav">

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

      {/* Search */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg glass-input flex-1 max-w-[480px]">
        <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Type to search..."
          className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-500 outline-none"
        />
      </div>

      <div className="flex-1" />

      {/* Right actions */}
      <div className="flex items-center gap-1.5">

        {/* AI Active pill */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
          <Zap className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-xs text-indigo-300 font-medium">AI Active</span>
        </div>

        {/* Color Shift Palette */}
        <div className="relative">
          <button
            onClick={() => { setShowPalette(!showPalette); setShowNotifications(false); setShowProfile(false); }}
            className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all"
            title="Color Shift"
            style={{ color: colorShifts.find(c => c.label === activeColor)?.swatch ?? "#6366f1" }}
          >
            <Palette className="w-4 h-4" />
          </button>

          <AnimatePresence>
            {showPalette && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.14 }}
                className="absolute right-0 top-full mt-2 w-52 glass-modal z-50 p-3"
              >
                <p className="text-[11px] text-slate-500 font-medium mb-2.5 px-1 tracking-wider">COLOR SHIFT</p>
                <div className="space-y-0.5">
                  {colorShifts.map((shift) => (
                    <button
                      key={shift.label}
                      onClick={() => applyColor(shift)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all"
                      style={{
                        background: activeColor === shift.label ? `${shift.swatch}18` : "transparent",
                        border: `1px solid ${activeColor === shift.label ? shift.swatch + "55" : "transparent"}`,
                      }}
                    >
                      <div
                        className="w-5 h-5 rounded-md flex-shrink-0"
                        style={{ background: shift.swatch, boxShadow: `0 2px 6px ${shift.swatch}66` }}
                      />
                      <span className="text-[13px] font-medium text-slate-200">{shift.label}</span>
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

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); setShowPalette(false); }}
            className="relative w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 notification-badge">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.14 }}
                className="absolute right-0 top-full mt-2 w-80 glass-modal overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-white/[0.08] flex items-center justify-between">
                  <h3 className="text-[14px] font-semibold text-white">Notifications</h3>
                  <span className="text-xs text-indigo-400 cursor-pointer hover:text-indigo-300">Mark all read</span>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={cn(
                        "px-4 py-3 border-b border-white/[0.05] hover:bg-white/[0.04] cursor-pointer transition-colors",
                        !notif.read && "bg-indigo-500/[0.04]"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm",
                          notif.type === "ai"      && "bg-purple-500/20 text-purple-400",
                          notif.type === "payment" && "bg-emerald-500/20 text-emerald-400",
                          notif.type === "alert"   && "bg-red-500/20 text-red-400",
                          notif.type === "student" && "bg-blue-500/20 text-blue-400",
                          notif.type === "teacher" && "bg-cyan-500/20 text-cyan-400",
                        )}>
                          {notif.type === "ai"      && "✨"}
                          {notif.type === "payment" && "💳"}
                          {notif.type === "alert"   && "⚠️"}
                          {notif.type === "student" && "👤"}
                          {notif.type === "teacher" && "🎓"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium text-slate-200">{notif.title}</p>
                          <p className="text-[12px] text-slate-500 mt-0.5 line-clamp-2">{notif.message}</p>
                          <p className="text-[11px] text-slate-600 mt-1">{notif.time}</p>
                        </div>
                        {!notif.read && (
                          <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 text-center border-t border-white/[0.06]">
                  <span className="text-xs text-indigo-400 cursor-pointer hover:text-indigo-300">View all notifications</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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
        <div className="relative">
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); setShowPalette(false); }}
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
                className="absolute right-0 top-full mt-2 w-48 glass-modal overflow-hidden z-50 py-1"
              >
                {[
                  { icon: User,     label: "Profile" },
                  { icon: Settings, label: "Settings" },
                  { icon: LogOut,   label: "Sign Out", danger: true },
                ].map((item) => (
                  <button
                    key={item.label}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium transition-colors",
                      item.danger
                        ? "text-red-400 hover:bg-red-500/10"
                        : "text-slate-300 hover:bg-white/[0.05]"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
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
