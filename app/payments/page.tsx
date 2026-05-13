"use client";

import React from "react";
import { motion } from "framer-motion";
import { MoreHorizontal, MoreVertical } from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TIP: React.CSSProperties = {
  background: "rgba(10,14,20,.97)",
  border: "1px solid rgba(255,255,255,.10)",
  borderRadius: "10px",
  fontSize: "12px",
  color: "#e2e8f0",
  boxShadow: "0 14px 30px rgba(0,0,0,.35)",
};

const stats = [
  { title: "Total Users", value: "85,028", color: "#6366f1" },
  { title: "Page Views", value: "211,450", color: "#06b6d4" },
  { title: "Avg Session Duration", value: "3m 42s", color: "#a855f7" },
  { title: "Bounce Rate", value: "28.6%", color: "#f59e0b" },
];

const sessionsData = [
  { label: "Feb '00", sessions: 12 },
  { label: "Mar '00", sessions: 16 },
  { label: "Apr '00", sessions: 11 },
  { label: "May '00", sessions: 18 },
  { label: "Jun '00", sessions: 23 },
  { label: "Jul '00", sessions: 19 },
  { label: "Aug '00", sessions: 26 },
  { label: "Sep '00", sessions: 29 },
  { label: "Oct '00", sessions: 24 },
  { label: "Nov '00", sessions: 32 },
  { label: "Dec '00", sessions: 35 },
];

const sourceData = [
  { name: "Direct", value: 28 },
  { name: "Search", value: 34 },
  { name: "Referral", value: 19 },
  { name: "Social", value: 24 },
  { name: "Email", value: 12 },
];

const deviceData = [
  { name: "Mobile", value: 62, color: "#6366f1" },
  { name: "Desktop", value: 28, color: "#06b6d4" },
  { name: "Tablet", value: 10, color: "#a855f7" },
];

const userActivityData = [
  { time: "00:00", users: 120 },
  { time: "04:00", users: 80 },
  { time: "08:00", users: 250 },
  { time: "12:00", users: 420 },
  { time: "16:00", users: 380 },
  { time: "20:00", users: 290 },
];

const topUsers = [
  { name: "Sarah Johnson", sessions: 245, avatar: "SJ" },
  { name: "Mike Chen", sessions: 198, avatar: "MC" },
  { name: "Emma Davis", sessions: 176, avatar: "ED" },
  { name: "Alex Rodriguez", sessions: 152, avatar: "AR" },
  { name: "Lisa Wang", sessions: 134, avatar: "LW" },
];

const revenueBreakdown = [
  { name: "Subscriptions", value: 45, color: "#6366f1" },
  { name: "One-time", value: 30, color: "#06b6d4" },
  { name: "Add-ons", value: 15, color: "#a855f7" },
  { name: "Refunds", value: 10, color: "#f59e0b" },
];

const recentActivities = [
  { user: "John Doe", action: "Completed course", time: "2 min ago", type: "course" },
  { user: "Jane Smith", action: "Made payment", time: "5 min ago", type: "payment" },
  { user: "Bob Wilson", action: "Joined webinar", time: "8 min ago", type: "webinar" },
  { user: "Alice Brown", action: "Updated profile", time: "12 min ago", type: "profile" },
  { user: "Charlie Davis", action: "Downloaded resource", time: "15 min ago", type: "download" },
];

const performanceData = [
  { metric: "Load Time", value: "1.2s", change: -8, color: "#10b981" },
  { metric: "Uptime", value: "99.9%", change: 0.1, color: "#6366f1" },
  { metric: "Error Rate", value: "0.1%", change: -0.05, color: "#f59e0b" },
  { metric: "Response Time", value: "245ms", change: -12, color: "#06b6d4" },
];

const geographicData = [
  { country: "United States", users: 12500, percentage: 35 },
  { country: "United Kingdom", users: 8200, percentage: 23 },
  { country: "Canada", users: 6100, percentage: 17 },
  { country: "Australia", users: 4200, percentage: 12 },
  { country: "Germany", users: 3100, percentage: 9 },
  { country: "Others", users: 1200, percentage: 4 },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

export default function PaymentsPage() {
  return (
    <div className="page-content animate-fade-in">
      <div className="dashboard-header page-row">
        <div>
          <p className="dashboard-label">Payments & Subscriptions</p>
          <h1 className="dashboard-title">Sessions Dashboard</h1>
        </div>
        <div className="dashboard-filters flex flex-wrap gap-3 items-center">
          <button className="filter-button">Export Report</button>
        </div>
      </div>

      <div className="page-row grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[20px] w-full">
        {stats.map((card, index) => (
          <motion.div
            key={card.title}
            {...fadeUp(index * 0.06)}
            className="glass-card"
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
                <p className="text-[1rem] text-slate-300 font-semibold">{card.title}</p>
                <p className="font-extrabold text-white leading-none" style={{ fontSize: "2.2rem" }}>
                  {card.value}
                </p>
              </div>
            </div>

            <div className="mt-6" style={{ height: 80 }}>
              <ResponsiveContainer width="100%" height={80}>
                <BarChart data={[5, 9, 7, 14, 10, 18, 14, 20].map((v) => ({ value: v }))}>
                  <Bar dataKey="value" fill={card.color} radius={[6, 6, 0, 0]} opacity={0.95} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="page-row">
        <motion.div {...fadeUp(0.1)} className="glass-card chart-card" style={{ minHeight: 292, padding: 24, borderRadius: 14 }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[17px] font-bold text-white">Sessions</h3>
            </div>
            <button className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div style={{ minHeight: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sessionsData} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} interval={0} />
                <YAxis ticks={[0, 7, 14, 21, 28, 35]} tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TIP} formatter={(value: unknown) => [value as number, "sessions"]} />
                <Area
                  type="monotone"
                  dataKey="sessions"
                  stroke="rgba(99,102,241,0.95)"
                  strokeWidth={3}
                  fill="rgba(99,102,241,0.12)"
                  dot={{ r: 8, fill: "#000000", stroke: "#f8fafc", strokeWidth: 2 }}
                  activeDot={{ r: 9, fill: "#000000", stroke: "#f8fafc", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="page-row grid grid-cols-1 xl:grid-cols-12 gap-[20px] w-full">
        <motion.div {...fadeUp(0.2)} className="glass-card chart-card" style={{ gridColumn: "span 7 / span 7", minHeight: 450, padding: 28, borderRadius: 14 }}>
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
              <BarChart data={sourceData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis ticks={[0, 10, 20, 30, 40]} tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TIP} formatter={(value: unknown) => [value as number, "sources"]} />
                <Bar dataKey="value" fill="rgba(99,102,241,0.7)" radius={[10, 10, 0, 0]} opacity={0.95} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div {...fadeUp(0.25)} className="glass-card" style={{ gridColumn: "span 5 / span 5", minHeight: 450, padding: 28, borderRadius: 14 }}>
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
                  data={deviceData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={72}
                  outerRadius={110}
                  paddingAngle={2}
                  stroke="rgba(255,255,255,0.08)"
                  isAnimationActive={false}
                >
                  {deviceData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={TIP} formatter={(value: unknown) => [value as number, "sessions"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* ══ ROW 4 — User Activity & Top Users ══ */}
      <div className="page-row grid grid-cols-1 xl:grid-cols-12 gap-[20px] w-full">
        <motion.div {...fadeUp(0.3)} className="glass-card" style={{ gridColumn: "span 8 / span 8", minHeight: 400, padding: 28, borderRadius: 14 }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[1.1rem] font-bold text-white">User Activity (24h)</h3>
            </div>
            <button className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userActivityData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)" vertical={false} />
                <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TIP} formatter={(value: unknown) => [value as number, "active users"]} />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="rgba(99,102,241,0.1)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div {...fadeUp(0.35)} className="glass-card" style={{ gridColumn: "span 4 / span 4", minHeight: 400, padding: 28, borderRadius: 14 }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[1.1rem] font-bold text-white">Top Users</h3>
            </div>
            <button className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {topUsers.map((user, index) => (
              <div key={user.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                    {user.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.sessions} sessions</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ══ ROW 5 — Revenue Breakdown & Performance Metrics ══ */}
      <div className="page-row grid grid-cols-1 xl:grid-cols-12 gap-[20px] w-full">
        <motion.div {...fadeUp(0.4)} className="glass-card" style={{ gridColumn: "span 6 / span 6", minHeight: 380, padding: 28, borderRadius: 14 }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[1.1rem] font-bold text-white">Revenue Breakdown</h3>
            </div>
            <button className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-center" style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueBreakdown}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  stroke="rgba(255,255,255,0.08)"
                  isAnimationActive={false}
                >
                  {revenueBreakdown.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={TIP} formatter={(value: unknown) => [`${value}%`, "revenue"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div {...fadeUp(0.45)} className="glass-card" style={{ gridColumn: "span 6 / span 6", minHeight: 380, padding: 28, borderRadius: 14 }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[1.1rem] font-bold text-white">Performance Metrics</h3>
            </div>
            <button className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {performanceData.map((metric) => (
              <div key={metric.metric} className="text-center">
                <p className="text-2xl font-bold" style={{ color: metric.color }}>{metric.value}</p>
                <p className="text-sm text-slate-400 mt-1">{metric.metric}</p>
                <p className={`text-xs mt-2 ${metric.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {metric.change > 0 ? '+' : ''}{metric.change}{metric.metric.includes('%') ? '%' : metric.metric.includes('Time') ? 'ms' : 's'}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ══ ROW 6 — Geographic Data & Recent Activity ══ */}
      <div className="page-row grid grid-cols-1 xl:grid-cols-12 gap-[20px] w-full">
        <motion.div {...fadeUp(0.5)} className="glass-card" style={{ gridColumn: "span 7 / span 7", minHeight: 420, padding: 28, borderRadius: 14 }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[1.1rem] font-bold text-white">Geographic Distribution</h3>
            </div>
            <button className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {geographicData.map((country) => (
              <div key={country.country} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {country.country.split(' ').map(word => word[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{country.country}</p>
                    <p className="text-xs text-slate-400">{country.users.toLocaleString()} users</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-indigo-400 h-2 rounded-full"
                      style={{ width: `${country.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-white w-10 text-right">{country.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div {...fadeUp(0.55)} className="glass-card" style={{ gridColumn: "span 5 / span 5", minHeight: 420, padding: 28, borderRadius: 14 }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[1.1rem] font-bold text-white">Recent Activity</h3>
            </div>
            <button className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  activity.type === 'course' ? 'bg-green-500/20 text-green-400' :
                  activity.type === 'payment' ? 'bg-blue-500/20 text-blue-400' :
                  activity.type === 'webinar' ? 'bg-purple-500/20 text-purple-400' :
                  activity.type === 'profile' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {activity.type === 'course' ? '📚' :
                   activity.type === 'payment' ? '💳' :
                   activity.type === 'webinar' ? '🎥' :
                   activity.type === 'profile' ? '👤' : '📁'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{activity.user}</p>
                  <p className="text-xs text-slate-400">{activity.action}</p>
                  <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

    </div>
  );
}
