"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, TrendingDown, Users, BookOpen,
  CreditCard, BarChart3, MoreHorizontal,
  ArrowUpRight, ArrowDownRight, Eye, Star,
  Activity, Zap, CheckCircle2, Clock, XCircle,
  MoreVertical,
} from "lucide-react";

import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { cn } from "@/lib/utils";
import {
  revenueData, students, transactions, recentActivities,
  dashboardStats, courseDistribution,
} from "@/lib/dummy-data";

/* ── Tooltip style ── */
const TIP: React.CSSProperties = {
  background: "rgba(10,14,20,.97)",
  border: "1px solid rgba(255,255,255,.10)",
  borderRadius: "8px",
  fontSize: "12px",
  color: "#e2e8f0",
  boxShadow: "0 10px 30px rgba(0,0,0,.4)",
};


/* ── Top stat cards ── */
const statCards = [
  {
    label: "Revenue",
    value: "$4805",
    change: "+$34 Since last week",
    up: true,
    icon: CreditCard,
    color: "#6366f1",
    bg: "rgba(99,102,241,.12)",
  },
  {
    label: "Total Customers",
    value: "8.4K",
    change: "+14% Since last week",
    up: true,
    icon: Users,
    color: "#06b6d4",
    bg: "rgba(6,182,212,.12)",
  },
  {
    label: "Store Visitors",
    value: "59K",
    change: "-12.4% Since last week",
    up: false,
    icon: BarChart3,
    color: "#f59e0b",
    bg: "rgba(245,158,11,.12)",
  },
];

/* ── Chart tab data ── */
const chartTabs = ["Total Sales", "Customers", "Store Visitors"];

/* ── Fade-in variants ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("Total Sales");

  const chartData = revenueData.slice(0, 9).map((d) => ({
    month: d.month,
    "Total Sales": d.revenue / 1000,
    Customers: d.subscriptions,
    "Store Visitors": d.courses / 100,
  }));

  return (
    <div className="page-content animate-fade-in">

      <div className="dashboard-header page-row">
        <div>
          <p className="dashboard-label">Dashboard</p>
          <h1 className="dashboard-title">eCommerce Overview</h1>
        </div>
        <div className="dashboard-filters flex flex-wrap gap-3 items-center">
          <button className="filter-button">Export Report</button>
        </div>
      </div>

      {/* ══ ROW 1 — Stat Cards (tall, 4-up) ══ */}
      <div className="page-row grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[20px] w-full">
        {[
          { title: "Total Users", value: "85,028", color: "#6366f1" },
          { title: "Page Views", value: "211,450", color: "#06b6d4" },
          { title: "Avg Session Duration", value: "3m 42s", color: "#a855f7" },
          { title: "Bounce Rate", value: "28.6%", color: "#f59e0b" },
        ].map((c, i) => (
          <motion.div
            key={c.title}
            {...fadeUp(i * 0.07)}
            className="stat-card"
            style={{ minHeight: 200, padding: 30, borderRadius: 14, overflow: "hidden" }}
          >
            <button
              aria-label="Card menu"
              className="absolute top-4 right-4 w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-slate-300 hover:bg-white/[0.08] transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[1rem] text-slate-300 font-semibold" style={{ fontSize: "1rem" }}>
                  {c.title}
                </p>
                <p
                  className="font-extrabold text-white leading-none"
                  style={{ fontSize: "2.2rem" }}
                >
                  {c.value}
                </p>
              </div>
            </div>

            {/* Mini bar chart area (80px height) */}
            <div className="mt-6" style={{ height: 80 }}>
              <ResponsiveContainer width="100%" height={80}>
                <BarChart
                  data={[5, 9, 7, 14, 10, 18, 14, 20].map((v) => ({ v }))}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <Bar
                    dataKey="v"
                    fill={c.color}
                    radius={[6, 6, 0, 0]}
                    opacity={0.95}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        ))}
      </div>



      {/* ══ ROW 2 — Sessions Area Chart (full width, tall) ══ */}
      <div className="page-row">
        <motion.div {...fadeUp(0.1)} className="glass-card" style={{ minHeight: 280, padding: 24, borderRadius: 14 }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[17px] font-bold text-white">Sessions</h3>
            </div>
            <button className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <AreaChart
              data={[
                { label: "Feb '00", date: "Feb 00", sessions: 12 },
                { label: "Mar '00", date: "Mar 00", sessions: 16 },
                { label: "Apr '00", date: "Apr 00", sessions: 11 },
                { label: "May '00", date: "May 00", sessions: 18 },
                { label: "Jun '00", date: "Jun 00", sessions: 23 },
                { label: "Jul '00", date: "Jul 00", sessions: 19 },
                { label: "Aug '00", date: "Aug 00", sessions: 26 },
                { label: "Sep '00", date: "Sep 00", sessions: 29 },
                { label: "Oct '00", date: "Oct 00", sessions: 24 },
                { label: "Nov '00", date: "Nov 00", sessions: 32 },
                { label: "Dec '00", date: "Dec 00", sessions: 35 },
              ]}
              margin={{ top: 10, right: 16, left: -10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,.05)"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fill: "#64748b", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                interval={0}
              />
              <YAxis
                ticks={[0, 7, 14, 21, 28, 35]}
                tick={{ fill: "#64748b", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={TIP}
                formatter={(v: unknown) => [v as number, "sessions"]}
                labelFormatter={(label: unknown) => String(label)}
              />
              <Area
                type="monotone"
                dataKey="sessions"
                stroke="#f8fafc"
                strokeWidth={3}
                fill="rgba(248,250,252,0.02)"
                dot={{ r: 8, fill: "#000000", stroke: "#f8fafc", strokeWidth: 2 }}
                activeDot={{ r: 9, fill: "#000000", stroke: "#f8fafc", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>

        </motion.div>
      </div>


      {/* ══ ROW 3 — Bottom Row (Traffic Sources + Sessions Device) ══ */}
      <div className="page-row grid grid-cols-1 xl:grid-cols-12 gap-[20px] w-full">
        {/* Left: Traffic Sources (60%) */}
        <motion.div {...fadeUp(0.2)} className="glass-card" style={{ gridColumn: "span 7 / span 7", minHeight: 440, padding: 28, borderRadius: 14 }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[1.1rem] font-bold text-white">Traffic Sources Status</h3>
            </div>
            <button className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div style={{ height: 340 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: "Direct", v: 28 },
                  { name: "Search", v: 34 },
                  { name: "Referral", v: 19 },
                  { name: "Social", v: 24 },
                  { name: "Email", v: 12 },
                ]}
                margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis ticks={[0, 10, 20, 30, 40]} tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TIP} formatter={(v: unknown) => [v as number, "sources"]} />
                <Bar dataKey="v" fill="#6366f1" radius={[10, 10, 0, 0]} opacity={0.95} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Right: Sessions Device (40%) */}
        <motion.div {...fadeUp(0.25)} className="glass-card" style={{ gridColumn: "span 5 / span 5", minHeight: 440, padding: 28, borderRadius: 14 }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[1.1rem] font-bold text-white">Sessions Device</h3>
            </div>
            <button className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-center" style={{ height: 340 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Mobile", value: 62, color: "#6366f1" },
                    { name: "Desktop", value: 28, color: "#06b6d4" },
                    { name: "Tablet", value: 10, color: "#a855f7" },
                  ]}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={72}
                  outerRadius={110}
                  paddingAngle={2}
                  stroke="rgba(255,255,255,0.08)"
                  isAnimationActive={false}
                />
                <Tooltip contentStyle={TIP} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>


      {/* Image-2 layout ends here (stat cards + sessions chart + bottom row). */}


    </div>
  );
}
