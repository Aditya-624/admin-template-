"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardList, Plus, Brain, Trophy, Target, TrendingUp,
  Users, Star, Zap, Edit, Trash2, Eye, BarChart2,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import { quizzes, leaderboard } from "@/lib/dummy-data";
import { cn } from "@/lib/utils";
import {
  RadialBarChart, RadialBar, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

const difficultyColor: Record<string, string> = {
  easy: "success",
  medium: "warning",
  hard: "danger",
};

const passRateData = quizzes.map((q) => ({
  name: q.title.split(" ").slice(0, 2).join(" "),
  pass: q.passRate,
  attempts: q.attempts,
}));

export default function QuizzesPage() {
  const [tab, setTab] = useState<"quizzes" | "leaderboard">("quizzes");

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Quiz & Exam Management"
        subtitle="Create, manage, and analyze assessments"
        icon={ClipboardList}
        iconColor="text-orange-400"
        iconBg="bg-orange-500/10"
        actions={
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm hover:bg-purple-500/20 transition-colors">
              <Brain className="w-4 h-4" /> AI Generate
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-500 text-white text-sm hover:bg-orange-600 transition-colors">
              <Plus className="w-4 h-4" /> New Quiz
            </button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Quizzes", value: "284", icon: ClipboardList, color: "text-orange-400", bg: "bg-orange-500/10" },
          { label: "Total Attempts", value: "94.8K", icon: Users, color: "text-indigo-400", bg: "bg-indigo-500/10" },
          { label: "Avg Pass Rate", value: "68%", icon: Target, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "AI Generated", value: "76%", icon: Brain, color: "text-purple-400", bg: "bg-purple-500/10" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass-card p-4 flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", s.bg)}>
              <s.icon className={cn("w-5 h-5", s.color)} />
            </div>
            <div>
              <p className="text-xs text-slate-500">{s.label}</p>
              <p className={cn("text-xl font-bold", s.color)}>{s.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-800/50 border border-white/10 rounded-xl p-1 w-fit">
        {(["quizzes", "leaderboard"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={cn("px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors",
              tab === t ? "bg-orange-500 text-white" : "text-slate-400 hover:text-slate-200")}>
            {t === "leaderboard" ? "ðŸ† Leaderboard" : "ðŸ“ Quizzes"}
          </button>
        ))}
      </div>

      {tab === "quizzes" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quiz List */}
          <div className="lg:col-span-2 space-y-3">
            {quizzes.map((quiz, i) => (
              <motion.div key={quiz.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                className="glass-card p-5 hover:border-orange-500/30 transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-200 group-hover:text-orange-300 transition-colors">{quiz.title}</h3>
                      {quiz.aiGenerated && (
                        <span className="flex items-center gap-1 text-xs bg-purple-500/15 text-purple-400 px-2 py-0.5 rounded-lg">
                          <Brain className="w-3 h-3" /> AI
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{quiz.course}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={difficultyColor[quiz.difficulty] as "success" | "warning" | "danger"}>{quiz.difficulty}</Badge>
                    <Badge variant={quiz.status === "active" ? "success" : "default"}>{quiz.status}</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    { label: "Questions", value: quiz.questions, icon: ClipboardList },
                    { label: "Attempts", value: quiz.attempts.toLocaleString(), icon: Users },
                    { label: "Avg Score", value: `${quiz.avgScore}%`, icon: Star },
                    { label: "Pass Rate", value: `${quiz.passRate}%`, icon: Target },
                  ].map((stat) => (
                    <div key={stat.label} className="glass-inner p-2.5 text-center">
                      <stat.icon className="w-4 h-4 text-slate-500 mx-auto mb-1" />
                      <p className="text-sm font-bold text-slate-200">{stat.value}</p>
                      <p className="text-xs text-slate-600">{stat.label}</p>
                    </div>
                  ))}
                </div>
                {/* Pass Rate Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Pass Rate</span>
                    <span className="text-slate-400">{quiz.passRate}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${quiz.passRate}%` }} transition={{ duration: 1, delay: i * 0.1 }}
                      className={cn("h-full rounded-full", quiz.passRate >= 70 ? "bg-emerald-500" : quiz.passRate >= 50 ? "bg-yellow-500" : "bg-red-500")} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs hover:bg-indigo-500/20 transition-colors"><Eye className="w-3.5 h-3.5" /> View</button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 text-xs hover:bg-white/10 transition-colors"><Edit className="w-3.5 h-3.5" /> Edit</button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 text-xs hover:bg-white/10 transition-colors"><BarChart2 className="w-3.5 h-3.5" /> Analytics</button>
                  <button className="ml-auto p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pass Rate Chart */}
          <div className="space-y-4">
            <div className="glass-card p-5">
              <h3 className="font-semibold text-slate-200 mb-4">Pass Rate Comparison</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={passRateData} layout="vertical" barSize={10}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <YAxis type="category" dataKey="name" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "12px" }} />
                  <Bar dataKey="pass" fill="#f97316" radius={[0, 4, 4, 0]} name="Pass Rate %" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* AI Quiz Generator */}
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-purple-400" />
                <h3 className="font-semibold text-slate-200">AI Quiz Generator</h3>
              </div>
              <div className="space-y-3">
                <input placeholder="Topic or course name..." className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-purple-500/50 transition-colors" />
                <div className="grid grid-cols-2 gap-2">
                  <select className="glass-input px-3 py-2 text-sm text-slate-300 outline-none bg-transparent">
                    <option>10 Questions</option>
                    <option>20 Questions</option>
                    <option>40 Questions</option>
                  </select>
                  <select className="glass-input px-3 py-2 text-sm text-slate-300 outline-none bg-transparent">
                    <option>Medium</option>
                    <option>Easy</option>
                    <option>Hard</option>
                  </select>
                </div>
                <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-sm font-medium hover:opacity-90 transition-opacity">
                  <Zap className="w-4 h-4" /> Generate Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Leaderboard */
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
          <div className="p-5 border-b border-white/10 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <h3 className="font-semibold text-slate-200">Top Performers</h3>
          </div>
          <div className="divide-y divide-white/5">
            {leaderboard.map((entry, i) => (
              <motion.div key={entry.rank} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                className="flex items-center gap-4 px-5 py-4 hover:bg-white/3 transition-colors">
                <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0",
                  entry.rank === 1 ? "bg-yellow-500/20" : entry.rank === 2 ? "bg-slate-400/20" : entry.rank === 3 ? "bg-orange-500/20" : "bg-white/5")}>
                  {entry.badge}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-200">{entry.name}</p>
                  <p className="text-xs text-slate-500">{entry.courses} courses â€¢ {entry.streak} day streak ðŸ”¥</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-indigo-400">{entry.score.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">points</p>
                </div>
                <div className="w-20">
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                      style={{ width: `${(entry.score / 10000) * 100}%` }} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

