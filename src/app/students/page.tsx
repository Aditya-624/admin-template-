"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Download, Eye, Ban, MessageSquare, X,
  Brain, MapPin, Mail, Clock, BookOpen,
  ChevronDown, ChevronsUpDown, TrendingUp, TrendingDown,
  Users, Activity, UserX, UserPlus,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import { students } from "@/lib/dummy-data";
import { cn, getInitials, generateColor, formatDate } from "@/lib/utils";

type Student = typeof students[0];

function getStats(data: typeof students) {
  const total = data.length;
  const active = data.filter(s => s.status === "active").length;
  const suspended = data.filter(s => s.status === "suspended").length;
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 30);
  const newMonth = data.filter(s => new Date(s.joinDate) >= cutoff).length;
  return { total, active, suspended, newMonth };
}

const statusVariant = (s: string) =>
  s === "active" ? "success" : s === "inactive" ? "warning" : s === "suspended" ? "danger" : "default";
const subVariant = (s: string) =>
  s === "Enterprise" ? "purple" : s === "Pro" ? "info" : "default";

/* ── Shared glass panel style ── */
const panel = {
  background: "rgba(10,14,28,.82)",
  backdropFilter: "blur(24px) saturate(160%)",
  WebkitBackdropFilter: "blur(24px) saturate(160%)",
  border: "1px solid rgba(255,255,255,.10)",
  borderTop: "1px solid rgba(255,255,255,.18)",
  boxShadow: "0 8px 40px rgba(0,0,0,.55), 0 1px 0 rgba(255,255,255,.08) inset",
};

export default function StudentsPage() {
  const [selected, setSelected] = useState<Student | null>(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(8);
  const stats = getStats(students);

  const filtered = students.filter(s => {
    const mf = filter === "all" || s.status === filter;
    const ms =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.course.toLowerCase().includes(search.toLowerCase());
    return mf && ms;
  });

  const visible = filtered.slice(0, show);

  return (
    <div className="page-content animate-fade-in">

      {/* ══ STAT CARDS ══════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {[
          { label: "Total Students",  value: stats.total,     icon: Users,     color: "#818cf8", bg: "rgba(99,102,241,.15)",  change: "+12.4%" },
          { label: "Active Today",    value: stats.active,    icon: Activity,  color: "#34d399", bg: "rgba(52,211,153,.15)",  change: "+5.2%"  },
          { label: "New This Month",  value: stats.newMonth,  icon: UserPlus,  color: "#22d3ee", bg: "rgba(34,211,238,.15)",  change: "+8.7%"  },
          { label: "Suspended",       value: stats.suspended, icon: UserX,     color: "#f87171", bg: "rgba(248,113,113,.15)", change: "-2.1%"  },
        ].map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="stat-card p-5"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: s.bg, border: `1px solid ${s.color}44` }}>
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <span className="text-[12px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1"
                style={{ background: s.change.startsWith("+") ? "rgba(52,211,153,.15)" : "rgba(248,113,113,.15)", color: s.change.startsWith("+") ? "#34d399" : "#f87171" }}>
                {s.change.startsWith("+") ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {s.change}
              </span>
            </div>
            <p className="text-[32px] font-bold text-white leading-none mb-1">{s.value}</p>
            <p className="text-[13px] font-medium text-slate-400">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* ══ MAIN TABLE PANEL ════════════════════════ */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="glass-card mb-6 overflow-hidden">

        {/* Panel header */}
        <div className="flex items-center justify-between px-7 py-6"
          style={{ borderBottom: "1px solid rgba(255,255,255,.07)" }}>
          <div>
            <h2 className="text-[22px] font-bold text-white">Student Management</h2>
            <p className="text-[14px] mt-1" style={{ color: "rgba(148,163,184,.5)" }}>
              in last 30 days activity
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium transition-all hover:bg-white/10"
              style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.10)", color: "#cbd5e1" }}>
              <Download className="w-4 h-4" /> Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold text-white hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
              <Plus className="w-4 h-4" /> Add Student
            </button>
          </div>
        </div>

        {/* Controls: Show N + Filter pills + Search */}
        <div className="flex items-center justify-between px-7 py-4 gap-4 flex-wrap"
          style={{ borderBottom: "1px solid rgba(255,255,255,.06)", background: "rgba(0,0,0,.15)" }}>

          {/* Show N entries */}
          <div className="flex items-center gap-2">
            <span className="text-[13px]" style={{ color: "rgba(148,163,184,.6)" }}>Show</span>
            <div className="relative">
              <select value={show} onChange={e => setShow(Number(e.target.value))}
                className="appearance-none pl-3 pr-7 py-1.5 rounded-lg text-[13px] font-semibold outline-none cursor-pointer"
                style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.12)", color: "#e2e8f0" }}>
                {[6, 8, 10, 15, 20].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: "rgba(148,163,184,.5)" }} />
            </div>
            <span className="text-[13px]" style={{ color: "rgba(148,163,184,.6)" }}>entries</span>
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-1.5">
            {[
              { key: "all",       label: "All",       dot: "" },
              { key: "active",    label: "Active",    dot: "#34d399" },
              { key: "inactive",  label: "Inactive",  dot: "#facc15" },
              { key: "suspended", label: "Suspended", dot: "#f87171" },
            ].map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all"
                style={filter === f.key
                  ? { background: "rgba(99,102,241,.28)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,.45)" }
                  : { background: "rgba(255,255,255,.05)", color: "rgba(148,163,184,.75)", border: "1px solid rgba(255,255,255,.08)" }}>
                {f.dot && <span className="w-1.5 h-1.5 rounded-full" style={{ background: f.dot }} />}
                {f.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center gap-2">
            <span className="text-[13px]" style={{ color: "rgba(148,163,184,.6)" }}>Search:</span>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-[13px] outline-none w-44"
              style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.10)", color: "#e2e8f0" }} />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: "rgba(0,0,0,.25)", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
                {["Student Name", "Course", "Progress", "Status", "Plan", "AI Usage", "Actions"].map(h => (
                  <th key={h} className="px-6 py-4 text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] font-bold uppercase tracking-wider"
                        style={{ color: "rgba(148,163,184,.7)" }}>{h}</span>
                      {h !== "Actions" && <ChevronsUpDown className="w-3.5 h-3.5" style={{ color: "rgba(148,163,184,.35)" }} />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((student, i) => (
                <motion.tr key={student.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  onClick={() => setSelected(student)}
                  className="cursor-pointer transition-all"
                  style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,.06)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-11 h-11 rounded-full flex items-center justify-center text-white text-[14px] font-bold flex-shrink-0", generateColor(student.name))}>
                        {getInitials(student.name)}
                      </div>
                      <div>
                        <p className="text-[15px] font-semibold text-white">{student.name}</p>
                        <p className="text-[12px] mt-0.5" style={{ color: "rgba(148,163,184,.45)" }}>{student.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Course */}
                  <td className="px-6 py-5">
                    <p className="text-[14px] text-slate-300 max-w-[200px] truncate">{student.course}</p>
                    <p className="text-[12px] mt-0.5" style={{ color: "rgba(148,163,184,.4)" }}>{student.country}</p>
                  </td>

                  {/* Progress */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 w-40">
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,.08)" }}>
                        <div className="h-full rounded-full"
                          style={{ width: `${student.progress}%`, background: student.progress >= 70 ? "linear-gradient(90deg,#6366f1,#a855f7)" : "linear-gradient(90deg,#f59e0b,#ef4444)" }} />
                      </div>
                      <span className="text-[13px] font-bold w-9 text-right flex-shrink-0"
                        style={{ color: student.progress >= 70 ? "#818cf8" : "#f59e0b" }}>
                        {student.progress}%
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-5">
                    <Badge variant={statusVariant(student.status) as "success" | "warning" | "danger" | "default"}>
                      <span className={cn("w-1.5 h-1.5 rounded-full",
                        student.status === "active" && "bg-emerald-400",
                        student.status === "inactive" && "bg-yellow-400",
                        student.status === "suspended" && "bg-red-400")} />
                      {student.status}
                    </Badge>
                  </td>

                  {/* Plan */}
                  <td className="px-6 py-5">
                    <Badge variant={subVariant(student.subscription) as "purple" | "info" | "default"}>
                      {student.subscription}
                    </Badge>
                  </td>

                  {/* AI Usage */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1.5">
                      <Brain className="w-4 h-4" style={{ color: "#c084fc" }} />
                      <span className="text-[14px] font-bold" style={{ color: "#c084fc" }}>{student.aiUsage}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-5" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setSelected(student)}
                        className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                        style={{ background: "rgba(99,102,241,.15)", color: "#818cf8" }}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                        style={{ background: "rgba(34,211,153,.12)", color: "#34d399" }}>
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                        style={{ background: "rgba(239,68,68,.12)", color: "#f87171" }}>
                        <Ban className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-7 py-5"
          style={{ borderTop: "1px solid rgba(255,255,255,.06)", background: "rgba(0,0,0,.12)" }}>
          <p className="text-[13px]" style={{ color: "rgba(148,163,184,.5)" }}>
            Showing 1 to {Math.min(show, filtered.length)} of {filtered.length} entries
          </p>
          <div className="flex items-center gap-1">
            {["Prev", "1", "2", "Next"].map((p, i) => (
              <button key={i}
                className="px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all"
                style={p === "1"
                  ? { background: "rgba(99,102,241,.3)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,.45)" }
                  : { background: "rgba(255,255,255,.06)", color: "rgba(148,163,184,.7)", border: "1px solid rgba(255,255,255,.08)" }}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ══ PROFILE DRAWER ══════════════════════════ */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,.7)", backdropFilter: "blur(6px)" }}
              onClick={() => setSelected(null)} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="fixed right-0 top-0 h-full w-full max-w-[400px] z-50 overflow-y-auto"
              style={{ background: "rgba(8,12,24,.97)", backdropFilter: "blur(32px)", borderLeft: "1px solid rgba(255,255,255,.10)", boxShadow: "-20px 0 60px rgba(0,0,0,.7)" }}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-[18px] font-bold text-white">Student Profile</h2>
                  <button onClick={() => setSelected(null)} className="p-2 rounded-xl transition-colors hover:bg-white/10"
                    style={{ color: "rgba(148,163,184,.7)", background: "rgba(255,255,255,.06)" }}>
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Avatar card */}
                <div className="flex items-center gap-4 p-4 rounded-2xl mb-4"
                  style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.09)" }}>
                  <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0", generateColor(selected.name))}>
                    {getInitials(selected.name)}
                  </div>
                  <div>
                    <h3 className="text-[17px] font-bold text-white">{selected.name}</h3>
                    <p className="text-[13px] mt-0.5" style={{ color: "rgba(148,163,184,.6)" }}>{selected.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={statusVariant(selected.status) as "success" | "warning" | "danger" | "default"}>{selected.status}</Badge>
                      <Badge variant={subVariant(selected.subscription) as "purple" | "info" | "default"}>{selected.subscription}</Badge>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { l: "Progress",   v: `${selected.progress}%`,  c: "#818cf8" },
                    { l: "AI Usage",   v: String(selected.aiUsage), c: "#c084fc" },
                    { l: "Quiz Score", v: `${selected.quizScore}%`, c: "#22d3ee" },
                  ].map(s => (
                    <div key={s.l} className="rounded-xl p-3 text-center"
                      style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.08)" }}>
                      <p className="text-[18px] font-bold" style={{ color: s.c }}>{s.v}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: "rgba(148,163,184,.5)" }}>{s.l}</p>
                    </div>
                  ))}
                </div>

                {/* Info rows */}
                <div className="space-y-2 mb-4">
                  {[
                    { icon: Mail,     label: "Email",   value: selected.email },
                    { icon: BookOpen, label: "Course",  value: selected.course },
                    { icon: MapPin,   label: "Country", value: selected.country },
                    { icon: Clock,    label: "Joined",  value: formatDate(selected.joinDate) },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                      style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.07)" }}>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(99,102,241,.2)" }}>
                        <row.icon className="w-3.5 h-3.5" style={{ color: "#818cf8" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(148,163,184,.4)" }}>{row.label}</p>
                        <p className="text-[13px] font-medium text-slate-300 truncate">{row.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="rounded-xl p-4 mb-5"
                  style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[13px] font-semibold text-slate-300">Course Progress</p>
                    <span className="text-[13px] font-bold" style={{ color: "#818cf8" }}>{selected.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,.08)" }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${selected.progress}%` }} transition={{ duration: 1 }}
                      className="h-full rounded-full" style={{ background: "linear-gradient(90deg,#6366f1,#a855f7)" }} />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 py-3 rounded-xl text-[14px] font-semibold text-white hover:opacity-90 transition-opacity"
                    style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
                    Send Message
                  </button>
                  <button className="flex-1 py-3 rounded-xl text-[14px] font-semibold transition-colors"
                    style={{ background: "rgba(239,68,68,.12)", color: "#f87171", border: "1px solid rgba(239,68,68,.25)" }}>
                    Suspend
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

