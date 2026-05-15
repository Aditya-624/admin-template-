"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, Brain,
  Mic, ClipboardList, CreditCard, BarChart3, Settings,
  Bell, ChevronDown,
  Layers, Zap, LayoutGrid, ShoppingCart, Package,
  FileText, PieChart, Map, HelpCircle, X, Table2,
  Lock, AlertTriangle, Clock, DollarSign, Menu, Headphones, User,
} from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";

/* ── Nav data ── */
const navSections = [
  {
    section: null,
    items: [
      {
        label: "Dashboard", icon: LayoutDashboard,
        children: [
          { href: "/",          label: "eCommerce" },
          { href: "/analytics", label: "Analytics" },
        ],
      },
      {
        label: "Application", icon: LayoutGrid,
        children: [
          { href: "/students",      label: "Students" },
          { href: "/teachers",      label: "Teachers" },
          { href: "/courses",       label: "Courses" },
          { href: "/notifications", label: "Notifications" },
          { href: "/podcasts",      label: "Podcasts" },
        ],
      },
    ],
  },
  {
    section: "UI ELEMENTS",
    items: [
      { href: "/analytics", label: "Widgets",    icon: PieChart,      children: [] },
      { label: "eCommerce",  icon: ShoppingCart, children: [{ href: "/payments", label: "Payments" }, { href: "/courses", label: "Products" }] },
      { label: "Components", icon: Package,      children: [{ href: "/ai-control", label: "AI Control" }, { href: "/quizzes", label: "Quizzes" }] },
      { label: "Content",    icon: FileText,     children: [{ href: "/podcasts", label: "Podcasts" }, { href: "/courses", label: "Courses" }] },
      { href: "/ai-control", label: "Icons",     icon: Layers,        children: [] },
    ],
  },
  {
    section: "FORMS & TABLES",
    items: [
      { label: "Forms",  icon: FileText, children: [{ href: "/ai-control", label: "AI Control" }, { href: "/quizzes", label: "Quizzes" }, { href: "/podcasts", label: "Podcasts" }] },
      { href: "/students", label: "Tables", icon: Table2, children: [] },
    ],
  },
  {
    section: "PAGES",
    items: [
      { label: "Authentication", icon: Lock, children: [{ href: "/settings", label: "Sign In" }, { href: "/settings", label: "Sign Up" }] },
      { href: "/settings",      label: "User Profile",      icon: User,   children: [] },
      { href: "/analytics",     label: "Timeline",          icon: Clock,  children: [] },
      { label: "Errors",        icon: AlertTriangle,        children: [{ href: "/settings", label: "404" }, { href: "/settings", label: "500" }] },
      { href: "/settings",      label: "FAQ",               icon: HelpCircle, children: [] },
      { href: "/payments",      label: "Pricing",           icon: DollarSign, children: [] },
    ],
  },
  {
    section: "CHARTS & MAPS",
    items: [
      { href: "/analytics", label: "Charts", icon: BarChart3, children: [] },
      { href: "/analytics", label: "Maps",   icon: Map,       children: [] },
    ],
  },
  {
    section: "OTHERS",
    items: [
      { label: "Menu Levels",   icon: Menu,         children: [{ href: "/ai-control", label: "Level 1" }, { href: "/settings", label: "Level 2" }] },
      { href: "/settings",   label: "Documentation", icon: HelpCircle, children: [] },
      { href: "/settings",   label: "Support",       icon: Headphones,  children: [] },
    ],
  },
];

type NavChild = { href: string; label: string };
type NavItem  = { href?: string; label: string; icon: React.ElementType; children: NavChild[] };

/* ── Single nav row ── */
function SidebarItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const Icon        = item.icon;
  const hasKids     = item.children.length > 0;
  const childActive = hasKids && item.children.some((c) => c.href === pathname);
  const leafActive  = !hasKids && item.href === pathname;
  const isActive    = leafActive || childActive;
  const [open, setOpen] = useState(childActive);

  if (!hasKids) {
    return (
      <Link
        href={item.href ?? "#"}
        className={cn(
          "flex items-center gap-3 px-5 py-[11px] text-[14px] font-medium transition-colors",
          isActive
            ? "text-white bg-white/[0.08] border-l-[3px] border-indigo-400"
            : "text-slate-400 hover:text-white hover:bg-white/[0.05] border-l-[3px] border-transparent"
        )}
      >
        <Icon className="w-[20px] h-[20px] flex-shrink-0" />
        <span className="flex-1">{item.label}</span>
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-full flex items-center gap-3 px-5 py-[11px] text-[14px] font-medium transition-colors border-l-[3px]",
          isActive
            ? "text-white bg-white/[0.08] border-indigo-400"
            : "text-slate-400 hover:text-white hover:bg-white/[0.05] border-transparent"
        )}
      >
        <Icon className="w-[18px] h-[18px] flex-shrink-0" />
        <span className="flex-1 text-left">{item.label}</span>
        <ChevronDown
          className={cn(
            "w-[16px] h-[16px] flex-shrink-0 transition-transform duration-200",
            open ? "rotate-180" : "rotate-0"
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            {item.children.map((child) => (
              <Link
                key={child.href + child.label}
                href={child.href}
                className={cn(
                  "flex items-center gap-3 pl-[48px] pr-5 py-[9px] text-[13.5px] transition-colors",
                  pathname === child.href
                    ? "text-indigo-400 font-semibold"
                    : "text-slate-500 hover:text-slate-200"
                )}
              >
                <span className={cn(
                  "w-[7px] h-[7px] rounded-full flex-shrink-0",
                  pathname === child.href ? "bg-indigo-400" : "bg-slate-600"
                )} />
                {child.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Sidebar content ── */
function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { setMobileOpen } = useSidebar();

  return (
    <div className="flex flex-col h-full">
      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3">
        {navSections.map((section, si) => (
          <div key={si}>
            {section.section && (
              <p className="px-5 pt-5 pb-2 text-[11px] font-bold text-slate-600 uppercase tracking-[0.15em]">
                {section.section}
              </p>
            )}
            {section.items.map((item, ii) => (
              <SidebarItem key={ii} item={item as NavItem} pathname={pathname} />
            ))}
          </div>
        ))}
      </nav>
    </div>
  );
}

/* ── Main export ── */
export default function Sidebar() {
  const { mobileOpen, setMobileOpen } = useSidebar();

  return (
    <>
      {/* Desktop */}
      <aside
        className="hidden lg:flex flex-col flex-shrink-0 h-screen sticky top-0"
        style={{
          width: "260px",
          background: "#141824",
          borderRight: "1px solid rgba(255,255,255,.07)",
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -200 }} animate={{ x: 0 }} exit={{ x: -200 }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="fixed left-0 top-0 h-full z-50 lg:hidden flex flex-col"
              style={{ width: "260px", background: "#141824", borderRight: "1px solid rgba(255,255,255,.07)" }}
            >
              <button onClick={() => setMobileOpen(false)}
                className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors">
                <X className="w-4 h-4" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
