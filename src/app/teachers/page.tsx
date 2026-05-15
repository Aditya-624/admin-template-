"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Plus,
  Star,
  Users,
  BookOpen,
  DollarSign,
  Brain,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Eye,
  Shield,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import { teachers } from "@/lib/dummy-data";
import { cn, getInitials, generateColor, formatCurrency } from "@/lib/utils";

export default function TeachersPage() {
  const [view, setView] = useState<"grid" | "table">("grid");
  const [filter, setFilter] = useState("all");

  const filtered = teachers.filter((t) =>
    filter === "all" ? true : t.status === filter
  );

  return (
    <div className="page-content space-y-6 animate-fade-in">
      <PageHeader
        title="Teacher Management"
        subtitle="Manage instructors, approvals, and earnings"
        icon={GraduationCap}
        iconColor="text-purple-400"
        iconBg="bg-purple-500/10"
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-800 border border-white/10 rounded-xl p-1">
              {(["grid", "table"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors",
                    view === v ? "bg-indigo-500 text-white" : "text-slate-400 hover:text-slate-200"
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-500 text-white text-sm hover:bg-indigo-600 transition-colors">
              <Plus className="w-4 h-4" />
              Invite Teacher
            </button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Teachers", value: "1,847", icon: GraduationCap, color: "text-purple-400", bg: "bg-purple-500/10" },
          { label: "Verified", value: "1,624", icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Pending Review", value: "142", icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/10" },
          { label: "Total Earnings", value: "$284K", icon: DollarSign, color: "text-cyan-400", bg: "bg-cyan-500/10" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-4 flex items-center gap-3"
          >
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg)}>
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
            <div>
              <p className="text-xs text-slate-500">{stat.label}</p>
              <p className={cn("text-lg font-bold", stat.color)}>{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        {["all", "verified", "pending"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors",
              filter === f ? "bg-indigo-500 text-white" : "glass-inner text-slate-400 hover:text-slate-200"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Teacher Cards Grid */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((teacher, i) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-5 card-hover group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-sm",
                    generateColor(teacher.name)
                  )}>
                    {getInitials(teacher.name)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-200">{teacher.name}</h3>
                    <p className="text-xs text-slate-500">{teacher.specialization}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {teacher.status === "verified" ? (
                    <Badge variant="success">
                      <Shield className="w-3 h-3" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="warning">
                      <Clock className="w-3 h-3" />
                      Pending
                    </Badge>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { icon: BookOpen, value: teacher.courses, label: "Courses", color: "text-indigo-400" },
                  { icon: Users, value: teacher.students.toLocaleString(), label: "Students", color: "text-cyan-400" },
                  { icon: Star, value: teacher.rating, label: "Rating", color: "text-yellow-400" },
                ].map((stat) => (
                  <div key={stat.label} className="glass-inner p-2.5 text-center">
                    <stat.icon className={cn("w-4 h-4 mx-auto mb-1", stat.color)} />
                    <p className="text-sm font-bold text-slate-200">{stat.value}</p>
                    <p className="text-xs text-slate-600">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Earnings & AI */}
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl mb-4">
                <div>
                  <p className="text-xs text-slate-500">Total Earnings</p>
                  <p className="text-sm font-bold text-emerald-400">{formatCurrency(teacher.earnings)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">AI Content</p>
                  <div className="flex items-center gap-1 justify-end">
                    <Brain className="w-3.5 h-3.5 text-purple-400" />
                    <p className="text-sm font-bold text-purple-400">{teacher.aiContentGenerated}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-indigo-500/10 text-indigo-400 text-xs font-medium hover:bg-indigo-500/20 transition-colors">
                  <Eye className="w-3.5 h-3.5" />
                  View Profile
                </button>
                {teacher.status === "pending" && (
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-colors">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Approve
                  </button>
                )}
                <button className="p-2 rounded-xl bg-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/10 transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-slate-800/30">
                {["Teacher", "Specialization", "Courses", "Students", "Rating", "Earnings", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((teacher, i) => (
                <motion.tr
                  key={teacher.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-white/5 hover:bg-white/3 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold", generateColor(teacher.name))}>
                        {getInitials(teacher.name)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-200">{teacher.name}</p>
                        <p className="text-xs text-slate-500">{teacher.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-400">{teacher.specialization}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{teacher.courses}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{teacher.students.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm text-slate-300">{teacher.rating}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-emerald-400 font-medium">{formatCurrency(teacher.earnings)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={teacher.status === "verified" ? "success" : "warning"}>
                      {teacher.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/10 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

