"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Bell, LayoutGrid,
  ChevronDown, Settings, LogOut, User,
  Menu, Sun, Moon, Home, Layers, FileText,
  Lock, Sliders, BarChart2, Table2, Palette,
  Users, ChevronRight,
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
];



const navItems = [
  {
    label: "Dashboard",
    icon: Home,
    children: [
      { href: "/", label: "eCommerce", desc: "Sales overview" },
      { href: "/analytics", label: "Analytics", desc: "Charts & metrics" },
    ],
  },

  {
    label: "Transaction",
    icon: Table2,
    children: [
      {
        label: "User Access Privileges",
        desc: "Manage access rights",
        subItems: [
          { href: "/transaction/user-access-privileges-list", label: "User Access Privileges" },
        ]
      },
      {
        label: "User Modules List",
        desc: "Manage user modules",
        subItems: [
          { href: "/transaction/user-modules-list", label: "User Modules List" },
        ]
      }
    ],
  },
  {
    label: "Masters",
    icon: Users,
    children: [
      {
        label: "User Management",
        desc: "Manage system users",
        subItems: [
          { href: "/masters/usertype-list", label: "UserType" },
          { href: "/masters/user-list", label: "User" },
          { href: "/masters/privileges-list", label: "Privileges" },
        ]
      },
      {
        label: "Clients",
        desc: "Manage clients",
        subItems: [
          { href: "/masters/clients", label: "Clients" },
          { href: "/masters/contacts", label: "Contacts" },
        ]
      }
    ],
  },
];

/* ── Clean dropdown ── */
function NestedNavItem({ child, setOpen }: { child: any, setOpen: any }) {
  const [isHovered, setIsHovered] = useState(false);

  if (child.subItems) {
    return (
      <div
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center justify-between px-3 py-3 rounded-xl text-[14px] font-medium text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "rgba(99,102,241,.15)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            </div>
            <div>
              <p className="leading-tight">{child.label}</p>
              {child.desc && <p className="text-[11px] text-slate-500 mt-0.5 font-normal">{child.desc}</p>}
            </div>
          </div>
          <ChevronRight className="w-4 h-4 opacity-50" />
        </div>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute left-full top-0 ml-2 z-[60]"
              style={{
                minWidth: "220px",
                background: "#171717",
                backdropFilter: "none",
                border: "1px solid rgba(255, 255, 255, 0.04)",
                borderRadius: "18px",
                boxShadow: "0 12px 30px rgba(0, 0, 0, 0.28)",
                padding: "10px 14px",
              }}
            >
              <div className="flex flex-col gap-1">
                {child.subItems.map((sub: any) => (
                  <Link
                    key={sub.href + sub.label}
                    href={sub.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all group/sub"
                  >
                    <div className="w-1.5 h-1.5 rounded-full border border-slate-500 group-hover/sub:border-indigo-400 group-hover/sub:bg-indigo-400 transition-colors flex-shrink-0" />
                    {sub.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // normal link
  return (
    <Link
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
  );
}

function NavDropdown({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.ElementType;
  children: any[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div 
      className="relative flex items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div
        className={cn(
          "nav-item",
          open ? "active" : ""
        )}
      >
        <Icon className="nav-icon" />
        {label}
        <ChevronDown
          className={cn(
            "chevron transition-transform duration-200",
            open ? "rotate-180" : ""
          )}
        />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-0 top-full z-50 submenu-flyout mt-2"
            style={{
              minWidth: children.length > 3 ? "360px" : "240px",
            }}
          >
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">{label}</p>
            <div style={{
              display: "grid",
              gridTemplateColumns: children.length > 3 ? "1fr 1fr" : "1fr",
              gap: "4px",
            }}>
              {children.map((child) => (
                <NestedNavItem key={child.label} child={child} setOpen={setOpen} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const SEARCHABLE_PAGES = [
  { label: "UserType List", href: "/masters/usertype-list", category: "Masters" },
  { label: "User List", href: "/masters/user-list", category: "Masters" },
  { label: "Privileges List", href: "/masters/privileges-list", category: "Masters" },
  { label: "Modules List", href: "/masters/modules-list", category: "Masters" },
  { label: "Clients", href: "/masters/clients", category: "Masters" },
  { label: "Contacts", href: "/masters/contacts", category: "Masters" },
  { label: "User Access Privileges List", href: "/transaction/user-access-privileges-list", category: "Transaction" },
  { label: "User Modules List", href: "/transaction/user-modules-list", category: "Transaction" },
  { label: "eCommerce Dashboard", href: "/", category: "Dashboard" },
  { label: "Analytics Dashboard", href: "/analytics", category: "Dashboard" },
  { label: "Students", href: "/students", category: "Apps & Pages" },
  { label: "Teachers", href: "/teachers", category: "Apps & Pages" },
  { label: "Courses", href: "/courses", category: "Apps & Pages" },
  { label: "Notifications", href: "/notifications", category: "Apps & Pages" },
  { label: "Podcasts", href: "/podcasts", category: "Apps & Pages" },
  { label: "Quizzes", href: "/quizzes", category: "Forms" },
  { label: "AI Control", href: "/ai-control", category: "Forms" },
  { label: "Settings", href: "/settings", category: "Authentication" },
];

export default function TopNav() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { setMobileOpen } = useSidebar();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [activeColor, setActiveColor] = useState("Indigo");
  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const parent = headerRef.current?.parentElement;
      const main = document.querySelector("main");

      const scrollY = window.scrollY || 0;
      const parentScroll = parent?.scrollTop || 0;
      const mainScroll = main?.scrollTop || 0;

      if (scrollY > 15 || parentScroll > 15 || mainScroll > 15) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Listen to parent container
    const parent = headerRef.current?.parentElement;
    if (parent) {
      parent.addEventListener("scroll", handleScroll, { passive: true });
    }

    // Listen to main container
    const main = document.querySelector("main");
    if (main) {
      main.addEventListener("scroll", handleScroll, { passive: true });
    }

    // Run once on mount
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (parent) {
        parent.removeEventListener("scroll", handleScroll);
      }
      if (main) {
        main.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const applyColor = (shift: typeof colorShifts[0]) => {
    setActiveColor(shift.label);
    setShowPalette(false);
    window.dispatchEvent(new CustomEvent("theme-color-shift", { detail: { bg: shift.bg, orb: shift.orb } }));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <header
        ref={headerRef}
        className={cn("floating-header", scrolled && "header-scrolled")}
      >
        <nav className="topbar">

          {/* LEFT: Logo */}
          <div className="navbar-left">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all mr-3"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
              <img
                src="/nirnayah-logo.svg"
                alt="Nirnayah Logo"
                className="h-10 w-auto object-contain"
              />
              <span className="text-[17px] font-extrabold tracking-tight text-white hidden sm:block">
                Nirnayah
              </span>
            </Link>
          </div>



          {/* RIGHT: Icons + User */}
          <div className="navbar-right">

            {/* Profile */}
            <div 
              className="relative"
              onMouseEnter={() => { setShowProfile(true); setShowNotifications(false); setShowPalette(false); }}
              onMouseLeave={() => setShowProfile(false)}
            >
              <div
                className="user-info"
              >
                <div className="user-avatar">
                  PS
                </div>
                <div className="user-text hidden md:flex">
                  <span className="user-name">Pauline Seitz</span>
                  <span className="user-role">Web Designer</span>
                </div>
                <ChevronDown className={cn("chevron hidden md:block transition-transform duration-200", showProfile && "rotate-180")} />
              </div>

              <AnimatePresence>
                {showProfile && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute right-0 top-full mt-2 w-56 z-50 submenu-flyout !p-0"
                  >
                    <div className="p-2">
                      <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all text-slate-300 hover:bg-white/[0.06] hover:text-white">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/[0.07]">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[13px] font-medium leading-tight">My Profile</p>
                          <p className="text-[11px] text-slate-500 leading-tight mt-0.5">View profile</p>
                        </div>
                      </button>
                      <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all text-slate-300 hover:bg-white/[0.06] hover:text-white">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/[0.07]">
                          <Settings className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[13px] font-medium leading-tight">Settings</p>
                          <p className="text-[11px] text-slate-500 leading-tight mt-0.5">Preferences</p>
                        </div>
                      </button>

                      {/* Nested Color Shift */}
                      <div 
                        className="relative w-full"
                        onMouseEnter={() => setShowPalette(true)}
                        onMouseLeave={() => setShowPalette(false)}
                      >
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all text-slate-300 hover:bg-white/[0.06] hover:text-white">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/[0.07]">
                            <Palette className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-[13px] font-medium leading-tight">Theme Color</p>
                            <p className="text-[11px] text-slate-500 leading-tight mt-0.5">Customizer</p>
                          </div>
                        </button>

                        <AnimatePresence>
                          {showPalette && (
                            <motion.div
                              initial={{ opacity: 0, x: 8, scale: 0.98 }}
                              animate={{ opacity: 1, x: 0, scale: 1 }}
                              exit={{ opacity: 0, x: 8, scale: 0.98 }}
                              transition={{ duration: 0.18, ease: "easeOut" }}
                              className="absolute right-full top-0 mr-2 w-52 z-50 submenu-flyout p-2"
                            >
                              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mb-2 px-1">Color Shift</p>
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
                      
                      <div className="h-px w-full bg-white/[0.06] my-1" />

                      <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all text-red-400 hover:bg-red-500/10">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-red-500/15">
                          <LogOut className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[13px] font-medium leading-tight">Sign Out</p>
                          <p className="text-[11px] text-slate-500 leading-tight mt-0.5">Logout</p>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </nav>

        {/* ══ ROW 2 — Nav menu ══ */}
        <div className="navbar-menu hidden lg:flex">
          {navItems.map((item) => (
            <NavDropdown key={item.label} label={item.label} icon={item.icon} children={item.children} />
          ))}
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
