"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Bell, LayoutGrid,
  ChevronDown, Settings, LogOut, User,
  Menu, Sun, Moon, Home, Layers, FileText,
  Lock, Sliders, BarChart2, Table2, Palette,
  Users,
} from "lucide-react";

import { useTheme } from "@/contexts/ThemeContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { notifications } from "@/lib/dummy-data";
import { cn } from "@/lib/utils";

const colorShifts = [
  { label: "Indigo",  bg: "linear-gradient(145deg, #0f0a1a 0%, #1e1b4b 50%, #0f0a1a 100%)", orb: "radial-gradient(ellipse 80% 70% at 40% 40%, rgba(99,102,241,.9) 0%, rgba(79,70,229,.65) 45%, transparent 75%)",  swatch: "#6366f1" },
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

const mastersUsers = [
  { id: 1, name: "Dr. Sarah Johnson", role: "Mathematics Master", avatar: "SJ", status: "online" },
  { id: 2, name: "Prof. Michael Chen", role: "Physics Master", avatar: "MC", status: "offline" },
  { id: 3, name: "Dr. Emma Davis", role: "Chemistry Master", avatar: "ED", status: "online" },
  { id: 4, name: "Prof. Alex Rodriguez", role: "Biology Master", avatar: "AR", status: "away" },
  { id: 5, name: "Dr. Lisa Wang", role: "Computer Science Master", avatar: "LW", status: "online" },
];

const navItems = [
  {
    label: "Dashboard",
    icon: Home,
    children: [
      { href: "/",          label: "eCommerce",     desc: "Sales overview" },
      { href: "/analytics", label: "Analytics",     desc: "Charts & metrics" },
    ],
  },
  {
    label: "Apps & Pages",
    icon: Layers,
    children: [
      { href: "/students",      label: "Students",      desc: "Manage students" },
      { href: "/teachers",      label: "Teachers",      desc: "Manage teachers" },
      { href: "/courses",       label: "Courses",       desc: "Course catalog" },
      { href: "/notifications", label: "Notifications",  desc: "Alerts & updates" },
      { href: "/podcasts",      label: "Podcasts",      desc: "Audio content" },
    ],
  },
  {
    label: "Forms",
    icon: FileText,
    children: [
      { href: "/quizzes",    label: "Quizzes",    desc: "Quiz builder" },
      { href: "/ai-control", label: "AI Control", desc: "AI settings" },
    ],
  },
  {
    label: "Authentication",
    icon: Lock,
    children: [
      { href: "/settings", label: "Settings", desc: "Platform config" },
    ],
  },
  {
    label: "UI Elements",
    icon: Sliders,
    children: [
      { href: "/analytics",  label: "Widgets", desc: "UI components" },
      { href: "/ai-control", label: "Icons",   desc: "Icon library" },
    ],
  },
  {
    label: "Charts",
    icon: BarChart2,
    children: [
      { href: "/analytics", label: "Area Charts", desc: "Trend lines" },
      { href: "/analytics", label: "Bar Charts",  desc: "Comparisons" },
    ],
  },
  {
    label: "Tables",
    icon: Table2,
    children: [
      { href: "/students", label: "Basic Tables",  desc: "Simple data tables" },
      { href: "/payments", label: "Data Tables",   desc: "Advanced with filters" },
    ],
  },
  {
    label: "Masters",
    icon: Users,
    children: [
      { href: "/masters/user-list", label: "User List", desc: "Manage users" },
      ...mastersUsers.map((master) => ({
        href: `/masters/${master.id}`,
        label: master.name,
        desc: "Master details",
      })),
    ],
  },
];

/* ── Clean dropdown ── */
function NavDropdown({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.ElementType;
  children: { href: string; label: string; desc?: string }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative h-full flex items-center">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-2 px-6 h-full text-[15px] font-medium transition-all whitespace-nowrap border-b-[3px] select-none",
          open
            ? "text-white border-indigo-400 bg-white/[0.04]"
            : "text-slate-300 hover:text-white border-transparent hover:bg-white/[0.04] hover:border-white/20"
        )}
      >
        <Icon className={cn("w-[17px] h-[17px] flex-shrink-0", open ? "text-indigo-400" : "text-slate-500")} />
        {label}
        <ChevronDown
          className={cn(
            "w-4 h-4 flex-shrink-0 transition-transform duration-200",
            open ? "rotate-180 text-indigo-400" : "text-slate-500"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 top-full z-50"
            style={{
              minWidth: children.length > 3 ? "360px" : "220px",
              background: "rgba(8,10,20,0.98)",
              backdropFilter: "blur(32px)",
              border: "1px solid rgba(255,255,255,.12)",
              borderRadius: "16px",
              boxShadow: "0 20px 60px rgba(0,0,0,.7)",
              marginTop: "6px",
              padding: "16px",
            }}
          >
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">{label}</p>
            <div style={{
              display: "grid",
              gridTemplateColumns: children.length > 3 ? "1fr 1fr" : "1fr",
              gap: "4px",
            }}>
              {children.map((child) => (
                <Link
                  key={child.href + child.label}
                  href={child.href}
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 px-3 py-3 rounded-xl text-[14px] font-medium text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all group"
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "rgba(99,102,241,.15)" }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  </div>
                  <div>
                    <p className="leading-tight">{child.label}</p>
                    {child.desc && <p className="text-[11px] text-slate-500 mt-0.5 font-normal">{child.desc}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TopNav() {
  const { theme, toggleTheme } = useTheme();
  const { setMobileOpen } = useSidebar();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [activeColor, setActiveColor] = useState("Indigo");
  const [search, setSearch] = useState("");

  const applyColor = (shift: typeof colorShifts[0]) => {
    setActiveColor(shift.label);
    setShowPalette(false);
    window.dispatchEvent(new CustomEvent("theme-color-shift", { detail: { bg: shift.bg, orb: shift.orb } }));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <header className="sticky top-0 z-30 glass-nav">

        {/* ══ ROW 1 — 72px ══ */}
        <div className="min-h-[72px] relative flex items-center gap-4 px-10 md:px-16 border-b border-white/[0.08]">


          {/* Mobile menu */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-3 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <Menu className="w-7 h-7" />
          </button>

          {/* Logo (minimal monogram) */}
          <Link href="/" className="flex items-center flex-shrink-0" style={{ marginLeft: "2px" }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{
              background: "linear-gradient(135deg, rgba(99,102,241,.35), rgba(168,85,247,.25))",
              border: "1px solid rgba(255,255,255,.12)",
              boxShadow: "0 10px 32px rgba(0,0,0,.35)",
            }}>
              <span className="text-[18px] font-black" style={{ color: "#f8fafc" }}>N</span>
            </div>
          </Link>


          {/* Search — centered */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3 px-5 py-4 rounded-2xl glass-input" style={{ width: "min(560px, 50vw)" }}>


            <Search className="w-6 h-6 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type to search..."
              className="flex-1 bg-transparent text-[16px] text-slate-200 placeholder-slate-500 outline-none"
            />
            <button
              className="flex items-center justify-center px-5 py-2.5 rounded-[20px] text-[14px] font-semibold text-white transition-all whitespace-nowrap"
              style={{ background: "#7c3aed", boxShadow: "0 6px 18px rgba(124,58,237,.35)" }}
            >
              Search
            </button>

          </div>

          <div className="flex-1" />

          {/* Right actions */}
          <div className="flex items-center gap-2">

            {/* Color Shift Palette */}
            <div className="relative">
              <button
                onClick={() => { setShowPalette(!showPalette); setShowNotifications(false); setShowProfile(false); }}
                className="w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all"
                title="Color Shift"
                style={{ color: colorShifts.find(c => c.label === activeColor)?.swatch ?? "#6366f1" }}
              >
                <Palette className="w-[24px] h-[24px]" />
              </button>

              <AnimatePresence>
                {showPalette && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-3 w-52 z-50"
                    style={{
                      background: "rgba(8,10,20,0.98)",
                      backdropFilter: "blur(32px)",
                      border: "1px solid rgba(255,255,255,.12)",
                      borderRadius: "16px",
                      boxShadow: "0 24px 64px rgba(0,0,0,.7)",
                      padding: "12px",
                    }}
                  >
                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mb-2.5 px-1">Color Shift</p>
                    <div className="space-y-0.5">
                      {colorShifts.map((shift) => (
                        <button
                          key={shift.label}
                          onClick={() => applyColor(shift)}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all hover:bg-white/10"
                          style={{
                            background: activeColor === shift.label ? `${shift.swatch}18` : "transparent",
                            border: `1px solid ${activeColor === shift.label ? shift.swatch + "55" : "transparent"}`,
                          }}
                        >
                          <div className="w-5 h-5 rounded-md flex-shrink-0" style={{ background: shift.swatch, boxShadow: `0 2px 6px ${shift.swatch}66` }} />
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
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                {theme === "dark" ? (
                  <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Sun className="w-[24px] h-[24px]" />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Moon className="w-[24px] h-[24px]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Apps grid */}
            <button className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all" aria-label="Apps">
              <LayoutGrid className="w-[24px] h-[24px]" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
                className="relative w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Notifications"
              >
                <Bell className="w-[24px] h-[24px]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-lg notification-badge">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-3 w-96 z-50 overflow-hidden"
                    style={{
                      background: "rgba(8,10,20,0.98)",
                      backdropFilter: "blur(32px)",
                      border: "1px solid rgba(255,255,255,.12)",
                      borderRadius: "16px",
                      boxShadow: "0 24px 64px rgba(0,0,0,.7)",
                    }}
                  >
                    <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between">
                      <div>
                        <h3 className="text-[15px] font-bold text-white">Notifications</h3>
                        <p className="text-[12px] text-slate-500 mt-0.5">{unreadCount} unread</p>
                      </div>
                      <button className="text-[12px] text-indigo-400 hover:text-indigo-300 font-semibold transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-500/10">
                        Mark all read
                      </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={cn(
                            "px-5 py-4 border-b border-white/[0.05] hover:bg-white/[0.05] cursor-pointer transition-colors",
                            !notif.read && "bg-indigo-500/[0.05]"
                          )}
                        >
                          <div className="flex items-start gap-3.5">
                            <div className={cn(
                              "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base",
                              notif.type === "ai"      && "bg-purple-500/20",
                              notif.type === "payment" && "bg-emerald-500/20",
                              notif.type === "alert"   && "bg-red-500/20",
                              notif.type === "student" && "bg-blue-500/20",
                              notif.type === "teacher" && "bg-cyan-500/20",
                            )}>
                              {notif.type === "ai" && "✨"}
                              {notif.type === "payment" && "💳"}
                              {notif.type === "alert" && "⚠️"}
                              {notif.type === "student" && "👤"}
                              {notif.type === "teacher" && "🎓"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-semibold text-slate-200">{notif.title}</p>
                              <p className="text-[12px] text-slate-500 mt-0.5 line-clamp-2">{notif.message}</p>
                              <p className="text-[11px] text-slate-600 mt-1.5">{notif.time}</p>
                            </div>
                            {!notif.read && <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full flex-shrink-0 mt-1" />}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-5 py-3.5 text-center border-t border-white/[0.06]">
                      <button className="text-[13px] text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                        View all notifications →
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>



            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
                className="flex items-center gap-3 px-3 py-2 rounded-2xl hover:bg-white/[0.08] transition-all"
              >
                <div
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-red-500 flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0"
                  style={{ boxShadow: "0 0 0 2.5px rgba(255,255,255,.2)" }}
                >
                  PS
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-[14px] font-semibold text-white leading-tight">Pauline Seitz</p>
                  <p className="text-[12px] text-slate-400 leading-tight mt-0.5">Web Designer</p>
                </div>
                <ChevronDown className={cn("w-4 h-4 text-slate-500 hidden md:block transition-transform duration-200", showProfile && "rotate-180")} />
              </button>

              <AnimatePresence>
                {showProfile && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-3 w-56 z-50 overflow-hidden"
                    style={{
                      background: "rgba(8,10,20,0.98)",
                      backdropFilter: "blur(32px)",
                      border: "1px solid rgba(255,255,255,.12)",
                      borderRadius: "16px",
                      boxShadow: "0 24px 64px rgba(0,0,0,.7)",
                    }}
                  >
                    {/* Profile header */}
                    <div className="px-4 py-4 border-b border-white/[0.08] flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-red-500 flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0">
                        PS
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-white">Pauline Seitz</p>
                        <p className="text-[11px] text-slate-400">Web Designer</p>
                      </div>
                    </div>
                    <div className="p-2">
                      {[
                        { icon: User,     label: "My Profile",  sub: "View profile" },
                        { icon: Settings, label: "Settings",    sub: "Preferences" },
                        { icon: LogOut,   label: "Sign Out",    sub: "Logout",       danger: true },
                      ].map((item) => (
                        <button
                          key={item.label}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all",
                            item.danger
                              ? "text-red-400 hover:bg-red-500/10"
                              : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
                          )}
                        >
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                            item.danger ? "bg-red-500/15" : "bg-white/[0.07]"
                          )}>
                            <item.icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-[13px] font-medium leading-tight">{item.label}</p>
                            <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{item.sub}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ══ ROW 2 — Nav menu ══ */}
        <div className="w-full relative z-40 hidden lg:block border-b border-white/[0.08]">
          <div className="flex items-stretch h-[56px] px-16">
            {navItems.map((item) => (
              <NavDropdown key={item.label} label={item.label} icon={item.icon} children={item.children} />
            ))}
          </div>
        </div>

      </header>

      {/* Overlay */}
      {(showNotifications || showProfile || showPalette) && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => { setShowNotifications(false); setShowProfile(false); setShowPalette(false); }}
        />
      )}
    </>
  );
}
