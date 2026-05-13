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
          <div className="date-chip">
            <span>From Date</span>
            <strong>01 Jan 2024</strong>
          </div>
          <div className="date-chip">
            <span>To Date</span>
            <strong>31 Jan 2024</strong>
          </div>
          <button className="filter-button">Export Report</button>
        </div>
      </div>

      {/* ══ ROW 1 — Stat Cards (tall, 4-up) ══ */}
      <div className="page-row grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[22px] w-full">
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
            style={{ minHeight: 192, padding: 30, borderRadius: 15, overflow: "hidden" }}
          >
            <button
              aria-label="Card menu"
              className="absolute top-4 right-4 w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-slate-300 hover:bg-white/[0.08] transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[16px] text-slate-300 font-semibold" style={{ fontSize: "1rem" }}>
                  {c.title}
                </p>
                <p
                  className="font-extrabold text-white leading-none"
                  style={{ fontSize: "2.45rem" }}
                >
                  {c.value}
                </p>
              </div>
            </div>

            {/* Mini bar chart area (70-80px) */}
            <div className="mt-6" style={{ height: 78 }}>
              <ResponsiveContainer width="100%" height={78}>
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
        <motion.div {...fadeUp(0.1)} className="glass-card" style={{ minHeight: 292, padding: 24 }}>
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
                dot={{ r: 6, fill: "#f8fafc", stroke: "#f8fafc", strokeWidth: 2 }}
                activeDot={{ r: 7, fill: "#f8fafc", stroke: "#f8fafc", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>

        </motion.div>
      </div>


      {/* ══ ROW 3 — Bottom Row (Traffic Sources + Sessions Device) ══ */}
      <div className="page-row grid grid-cols-1 xl:grid-cols-12 gap-[22px] w-full">
        {/* Left: Traffic Sources (60%) */}
        <motion.div {...fadeUp(0.2)} className="glass-card" style={{ gridColumn: "span 7 / span 7", minHeight: 390, padding: 28 }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[18px] font-bold text-white">Traffic Sources</h3>
            </div>
            <button className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div style={{ height: 300 }}>
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
        <motion.div {...fadeUp(0.25)} className="glass-card" style={{ gridColumn: "span 5 / span 5", minHeight: 390, padding: 28 }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[18px] font-bold text-white">Sessions by Device</h3>
            </div>
            <button className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-center" style={{ height: 300 }}>
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
                  outerRadius={100}
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


      {/* (Reference layout: remaining dashboard content moved below) */}
      <div className="page-row">


        {/* Left column — 3 mini stat cards stacked */}
        <div className="flex flex-col" style={{gap:"24px"}}>
          {[
            { label: "Bounce Rate",   value: "48.32%", change: "+12.34 Increase", sub: "From Last Week", color: "#6366f1", icon: Activity },
            { label: "Pageviews",     value: "52.64%", change: "+21.34 Increase", sub: "From Last Week", color: "#06b6d4", icon: Eye },
            { label: "New Sessions",  value: "68.23%", change: "+18.42 Increase", sub: "From Last Week", color: "#a855f7", icon: Zap },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.label} {...fadeUp(0.2 + i * 0.06)} className="stat-card flex-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[13px] text-slate-400 font-medium">{item.label}</p>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: item.color + "22" }}>
                    <Icon className="w-4 h-4" style={{ color: item.color }} />
                  </div>
                </div>
                <p className="text-[26px] font-bold text-white leading-tight">{item.value}</p>
                <p className="text-[12px] text-emerald-400 font-semibold mt-1">{item.change}</p>
                <p className="text-[11px] text-slate-500">{item.sub}</p>
                <div className="stat-accent" style={{ background: item.color, opacity: 0.5 }} />
              </motion.div>
            );
          })}
        </div>

        {/* Top Categories — Pie chart */}
        <motion.div {...fadeUp(0.28)} className="glass-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[15px] font-bold text-white">Top Categories</h3>
              <p className="text-[12px] text-slate-500 mt-0.5">Visitors</p>
            </div>
            <button className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-center mb-4">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Kids", value: 25, fill: "#6366f1" },
                    { name: "Women", value: 10, fill: "#06b6d4" },
                    { name: "Men", value: 65, fill: "#a855f7" },
                    { name: "Furniture", value: 14, fill: "#f59e0b" },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                />
                <Tooltip contentStyle={TIP} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2">
            {[
              { name: "Kids", value: 25, color: "#6366f1" },
              { name: "Women", value: 10, color: "#06b6d4" },
              { name: "Men", value: 65, color: "#a855f7" },
              { name: "Furniture", value: 14, color: "#f59e0b" },
            ].map((cat) => (
              <div key={cat.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: cat.color }} />
                <span className="text-[12px] text-slate-400">{cat.name}</span>
                <span className="text-[12px] font-semibold text-white">{cat.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Visitors chart */}
        <motion.div {...fadeUp(0.31)} className="glass-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[15px] font-bold text-white">Visitors</h3>
              <p className="text-[12px] text-slate-500 mt-0.5">43,540</p>
            </div>
            <button className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData.slice(0, 9)}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.06)" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TIP} />
              <Line type="monotone" dataKey="Customers" stroke="#6366f1" strokeWidth={2} dot={{ r: 4, fill: "#6366f1" }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* ══ ROW 5 — Sales Overview + New Customers ══ */}
      <div className="page-row grid grid-cols-1 xl:grid-cols-2" style={{gap:"24px"}}>

        {/* Sales Overview bar chart */}
        <motion.div {...fadeUp(0.35)} className="glass-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[15px] font-bold text-white">Sales Overview</h3>
              <p className="text-[12px] text-slate-500 mt-0.5">Total Sales 87%</p>
            </div>
            <button className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: "Last Week",  value: "$289.42" },
              { label: "Last Month", value: "$856.14" },
              { label: "Last Year",  value: "$987K" },
            ].map((s) => (
              <div key={s.label} className="glass-inner px-3 py-2.5 text-center">
                <p className="text-[11px] text-slate-500 mb-1">{s.label}</p>
                <p className="text-[14px] font-bold text-white">{s.value}</p>
              </div>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData.slice(0, 9)} margin={{ top: 0, right: 0, left: -25, bottom: 0 }} barSize={15}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.06)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TIP} formatter={(v) => [`$${Number(v).toLocaleString()}`, "Revenue"]} />
              <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* New Customers list */}
        <motion.div {...fadeUp(0.38)} className="glass-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[15px] font-bold text-white">New Customers</h3>
              <p className="text-[12px] text-slate-500 mt-0.5">43,540</p>
            </div>
            <button className="px-3 py-1.5 rounded-lg text-[12px] font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors">
              View All
            </button>
          </div>

          <div style={{display:"flex",flexDirection:"column"}}>
            {[
              { name: "Emy Jackson", email: "emy_jac@xyz.com", rating: 4.4 },
              { name: "Martin Hughes", email: "martin.hug@xyz.com", rating: 4.2 },
              { name: "Laura Madison", email: "laura_01@xyz.com", rating: 4.8 },
              { name: "Shoan Stephen", email: "s.stephen@xyz.com", rating: 4.1 },
              { name: "Keate Medona", email: "Keate@xyz.com", rating: 4.6 },
            ].map((customer) => (
              <div key={customer.name} className="flex items-center gap-3 py-3" style={{borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-red-500 flex items-center justify-center text-white text-[12px] font-bold" style={{flexShrink:0}}>
                  {customer.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div style={{flex:1}}>
                  <p className="text-[13px] font-semibold text-slate-200">{customer.name}</p>
                  <p className="text-[11px] text-slate-500">{customer.email}</p>
                </div>
                <div className="flex items-center gap-1" style={{flexShrink:0}}>
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-[12px] text-slate-400">{customer.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ══ ROW 6 — Orders Summary table ══ */}
      <motion.div {...fadeUp(0.4)} className="glass-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[15px] font-bold text-white">Orders Summary</h3>
            <p className="text-[12px] text-slate-500 mt-0.5">43,540</p>
          </div>
          <div className="flex items-center gap-3">
            {[
              { label: "Completed", pct: "68%", color: "#22c55e" },
              { label: "Cancelled", pct: "60%", color: "#ef4444" },
              { label: "In Progress", pct: "45%", color: "#f59e0b" },
            ].map((s) => (
              <div key={s.label} className="hidden md:flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                <span className="text-[12px] text-slate-400">{s.label}</span>
                <span className="text-[12px] font-bold" style={{ color: s.color }}>{s.pct}</span>
              </div>
            ))}
            <button className="px-3 py-1.5 rounded-lg text-[12px] font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors">
              View All
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Product</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: "#897656", product: "Light Blue Chair", customer: "Brooklyn Zeo", date: "12 Jul 2020", amount: "$64.00", status: "Pending" },
                { id: "#987549", product: "Green Sport Shoes", customer: "Martin Hughes", date: "14 Jul 2020", amount: "$45.00", status: "Dispatched" },
                { id: "#685749", product: "Red Headphone 07", customer: "Shoan Stephen", date: "15 Jul 2020", amount: "$67.00", status: "Completed" },
                { id: "#887459", product: "Mini Laptop Device", customer: "Alister Campel", date: "18 Jul 2020", amount: "$87.00", status: "Completed" },
                { id: "#335428", product: "Purple Mobile Phone", customer: "Keate Medona", date: "20 Jul 2020", amount: "$75.00", status: "Pending" },
                { id: "#224578", product: "Smart Hand Watch", customer: "Winslet Maya", date: "22 Jul 2020", amount: "$80.00", status: "Dispatched" },
                { id: "#447896", product: "T-Shirt Blue", customer: "Emy Jackson", date: "28 Jul 2020", amount: "$96.00", status: "Pending" },
              ].map((row) => (
                <tr key={row.id}>
                  <td className="text-[13px] font-mono text-indigo-400">{row.id}</td>
                  <td className="text-[13px] text-slate-300">{row.product}</td>
                  <td className="text-[13px] text-slate-300">{row.customer}</td>
                  <td className="text-[13px] text-slate-400">{row.date}</td>
                  <td className="text-[13px] font-semibold text-white">{row.amount}</td>
                  <td>
                    <span className={cn(
                      "badge",
                      row.status === "Completed" && "badge-success",
                      row.status === "Pending" && "badge-warning",
                      row.status === "Dispatched" && "badge-info",
                    )}>
                      {row.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button className="p-1 rounded text-slate-500 hover:text-slate-300">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 rounded text-slate-500 hover:text-slate-300">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
}
