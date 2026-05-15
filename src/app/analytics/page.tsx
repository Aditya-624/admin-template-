"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, TrendingUp, Users, BookOpen, Brain,
  Activity, Globe, Clock, Zap, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { cn } from "@/lib/utils";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter, ZAxis,
} from "recharts";

const engagementByDay = [
  { day: "Mon", students: 8420, completions: 1240, aiUsage: 3200 },
  { day: "Tue", students: 9840, completions: 1580, aiUsage: 4100 },
  { day: "Wed", students: 7920, completions: 1120, aiUsage: 2900 },
  { day: "Thu", students: 11200, completions: 1890, aiUsage: 5200 },
  { day: "Fri", students: 12840, completions: 2100, aiUsage: 6100 },
  { day: "Sat", students: 9200, completions: 1650, aiUsage: 4400 },
  { day: "Sun", students: 6800, completions: 980, aiUsage: 2100 },
];

const retentionData = [
  { week: "W1", rate: 100 },
  { week: "W2", rate: 84 },
  { week: "W3", rate: 72 },
  { week: "W4", rate: 65 },
  { week: "W5", rate: 58 },
  { week: "W6", rate: 54 },
  { week: "W7", rate: 51 },
  { week: "W8", rate: 48 },
];

const courseCompletionData = [
  { course: "ML Bootcamp", rate: 68, students: 4821 },
  { course: "Full Stack", rate: 72, students: 3642 },
  { course: "UI/UX Design", rate: 81, students: 2180 },
  { course: "Cybersecurity", rate: 59, students: 1890 },
  { course: "Data Science", rate: 75, students: 3210 },
];

const radarData = [
  { subject: "Engagement", A: 84, fullMark: 100 },
  { subject: "Completion", A: 73, fullMark: 100 },
  { subject: "Satisfaction", A: 91, fullMark: 100 },
  { subject: "AI Usage", A: 68, fullMark: 100 },
  { subject: "Retention", A: 54, fullMark: 100 },
  { subject: "Revenue", A: 78, fullMark: 100 },
];

const geoData = [
  { country: "India", students: 18420, flag: "ðŸ‡®ðŸ‡³" },
  { country: "USA", students: 12840, flag: "ðŸ‡ºðŸ‡¸" },
  { country: "UK", students: 4920, flag: "ðŸ‡¬ðŸ‡§" },
  { country: "Germany", students: 3210, flag: "ðŸ‡©ðŸ‡ª" },
  { country: "Japan", students: 2840, flag: "ðŸ‡¯ðŸ‡µ" },
  { country: "Brazil", students: 2190, flag: "ðŸ‡§ðŸ‡·" },
];

const kpiCards = [
  { label: "Avg Session Duration", value: "24 min", change: 8.2, up: true, icon: Clock, color: "text-indigo-400", bg: "bg-indigo-500/10" },
  { label: "Course Completion Rate", value: "73.4%", change: 3.1, up: true, icon: BookOpen, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { label: "AI Feature Adoption", value: "68%", change: 22.4, up: true, icon: Brain, color: "text-purple-400", bg: "bg-purple-500/10" },
  { label: "Churn Rate", value: "4.2%", change: 1.8, up: false, icon: TrendingUp, color: "text-red-400", bg: "bg-red-500/10" },
  { label: "NPS Score", value: "72", change: 5.0, up: true, icon: Activity, color: "text-cyan-400", bg: "bg-cyan-500/10" },
  { label: "Real-time Users", value: "12,847", change: 0, up: true, icon: Users, color: "text-yellow-400", bg: "bg-yellow-500/10" },
];

export default function AnalyticsPage() {
  const [range, setRange] = useState("7d");

  return (
    <div className="page-content space-y-6 animate-fade-in">
      <PageHeader
        title="Analytics Dashboard"
        subtitle="Deep insights into platform performance and user behavior"
        icon={BarChart3}
        iconColor="text-cyan-400"
        iconBg="bg-cyan-500/10"
        actions={
          <div className="flex items-center gap-1 bg-slate-800 border border-white/10 rounded-xl p-1">
            {["24h", "7d", "30d", "90d"].map((r) => (
              <button key={r} onClick={() => setRange(r)}
                className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  range === r ? "bg-cyan-500 text-white" : "text-slate-400 hover:text-slate-200")}>
                {r}
              </button>
            ))}
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {kpiCards.map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="glass-card p-4 card-hover">
            <div className="flex items-center justify-between mb-3">
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", kpi.bg)}>
                <kpi.icon className={cn("w-4 h-4", kpi.color)} />
              </div>
              {kpi.change !== 0 && (
                <div className={cn("flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-lg",
                  kpi.up ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400")}>
                  {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {kpi.change}%
                </div>
              )}
              {kpi.change === 0 && (
                <div className="flex items-center gap-1 text-xs text-cyan-400">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full pulse-dot" />
                  Live
                </div>
              )}
            </div>
            <p className="text-xs text-slate-500 mb-0.5">{kpi.label}</p>
            <p className={cn("text-2xl font-bold", kpi.color)}>{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-slate-800/50 border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-200">Student Engagement</h3>
              <p className="text-xs text-slate-500">Daily active students, completions & AI usage</p>
            </div>
            <Zap className="w-4 h-4 text-yellow-400" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={engagementByDay}>
              <defs>
                <linearGradient id="studGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="aiGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }} />
              <Area type="monotone" dataKey="students" stroke="#6366f1" strokeWidth={2} fill="url(#studGrad)" name="Students" />
              <Area type="monotone" dataKey="aiUsage" stroke="#a855f7" strokeWidth={2} fill="url(#aiGrad)" name="AI Usage" />
              <Line type="monotone" dataKey="completions" stroke="#22c55e" strokeWidth={2} dot={false} name="Completions" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Radar Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="glass-card p-5">
          <h3 className="font-semibold text-slate-200 mb-1">Platform Health</h3>
          <p className="text-xs text-slate-500 mb-3">Overall performance score</p>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 9 }} />
              <Radar name="Score" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Retention */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass-card p-5">
          <h3 className="font-semibold text-slate-200 mb-1">User Retention Curve</h3>
          <p className="text-xs text-slate-500 mb-4">8-week cohort retention</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={retentionData}>
              <defs>
                <linearGradient id="retGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="week" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                formatter={(v: unknown) => [`${v}%`, "Retention"]} />
              <Area type="monotone" dataKey="rate" stroke="#06b6d4" strokeWidth={2.5} fill="url(#retGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Course Completion */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="glass-card p-5">
          <h3 className="font-semibold text-slate-200 mb-1">Course Completion Rates</h3>
          <p className="text-xs text-slate-500 mb-4">Top 5 courses by enrollment</p>
          <div className="space-y-3">
            {courseCompletionData.map((c, i) => (
              <div key={c.course}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400 truncate max-w-[160px]">{c.course}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{c.students.toLocaleString()} students</span>
                    <span className="font-medium text-slate-300">{c.rate}%</span>
                  </div>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${c.rate}%` }} transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Geo Distribution */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-cyan-400" />
          <h3 className="font-semibold text-slate-200">Geographic Distribution</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {geoData.map((geo, i) => (
            <motion.div key={geo.country} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.55 + i * 0.05 }}
              className="glass-inner p-3 text-center hover:bg-white/10 transition-colors cursor-pointer">
              <div className="text-2xl mb-1">{geo.flag}</div>
              <p className="text-xs font-medium text-slate-300">{geo.country}</p>
              <p className="text-sm font-bold text-indigo-400">{(geo.students / 1000).toFixed(1)}K</p>
              <div className="mt-1.5 h-1 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-indigo-500"
                  style={{ width: `${(geo.students / 18420) * 100}%` }} />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

