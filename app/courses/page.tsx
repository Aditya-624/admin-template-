"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Plus,
  Star,
  Users,
  Clock,
  DollarSign,
  Brain,
  CheckCircle,
  Edit,
  Trash2,
  Eye,
  Filter,
  TrendingUp,
  Video,
  FileText,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import { courses } from "@/lib/dummy-data";
import { cn, formatCurrency } from "@/lib/utils";

const categoryColors: Record<string, string> = {
  Technology: "bg-indigo-500/15 text-indigo-400",
  Business: "bg-emerald-500/15 text-emerald-400",
  Design: "bg-pink-500/15 text-pink-400",
  Science: "bg-cyan-500/15 text-cyan-400",
  Arts: "bg-orange-500/15 text-orange-400",
};

const statusVariant = (status: string) => {
  if (status === "published") return "success";
  if (status === "review") return "warning";
  if (status === "draft") return "default";
  return "default";
};

export default function CoursesPage() {
  const [view, setView] = useState<"grid" | "table">("grid");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = courses.filter((c) => {
    const matchesFilter = filter === "all" || c.status === filter || c.category.toLowerCase() === filter;
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="page-content space-y-6 animate-fade-in">
      <PageHeader
        title="Course Management"
        subtitle="Manage, publish, and analyze your courses"
        icon={BookOpen}
        iconColor="text-cyan-400"
        iconBg="bg-cyan-500/10"
        badge={`${courses.length} courses`}
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
              New Course
            </button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Courses", value: "3,642", icon: BookOpen, color: "text-cyan-400" },
          { label: "Published", value: "2,891", icon: CheckCircle, color: "text-emerald-400" },
          { label: "In Review", value: "284", icon: Clock, color: "text-yellow-400" },
          { label: "Total Revenue", value: "$284K", icon: DollarSign, color: "text-indigo-400" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-4"
          >
            <div className="flex items-center gap-2 mb-1">
              <stat.icon className={cn("w-4 h-4", stat.color)} />
              <p className="text-xs text-slate-500">{stat.label}</p>
            </div>
            <p className={cn("text-xl font-bold", stat.color)}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 flex-1 px-3 py-2 glass-input">
          <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-600 outline-none"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-slate-500" />
          {["all", "published", "review", "draft"].map((f) => (
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
      </div>

      {/* Course Grid */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="glass-card overflow-hidden card-hover group"
            >
              {/* Thumbnail */}
              <div className="relative h-36 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-cyan-600/20 flex items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-indigo-400" />
                </div>
                <div className="absolute top-3 left-3">
                  <span className={cn("text-xs px-2 py-1 rounded-lg font-medium", categoryColors[course.category] || "bg-slate-500/15 text-slate-400")}>
                    {course.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge variant={statusVariant(course.status) as "success" | "warning" | "default"}>
                    {course.status}
                  </Badge>
                </div>
                {course.aiSummary && (
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-purple-500/20 border border-purple-500/30 rounded-lg px-2 py-1">
                    <Brain className="w-3 h-3 text-purple-400" />
                    <span className="text-xs text-purple-400">AI</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-slate-200 mb-1 line-clamp-2 group-hover:text-indigo-300 transition-colors">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-500 mb-3">by {course.instructor}</p>

                {/* Meta */}
                <div className="flex items-center gap-3 mb-3 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Video className="w-3.5 h-3.5" />
                    {course.lessons} lessons
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    {course.rating}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-sm">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-400">{course.students.toLocaleString()}</span>
                  </div>
                  <span className="text-sm font-bold text-emerald-400">{formatCurrency(course.price)}</span>
                </div>

                {/* Completion Rate */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500">Completion Rate</span>
                    <span className="text-slate-400">{course.completionRate}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500"
                      style={{ width: `${course.completionRate}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-indigo-500/10 text-indigo-400 text-xs font-medium hover:bg-indigo-500/20 transition-colors">
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 text-slate-400 text-xs font-medium hover:bg-white/10 transition-colors">
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-slate-800/30">
                {["Course", "Instructor", "Students", "Rating", "Revenue", "Completion", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((course, i) => (
                <motion.tr
                  key={course.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-white/5 hover:bg-white/3 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-200 max-w-[200px] truncate">{course.title}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className={cn("text-xs px-1.5 py-0.5 rounded-md", categoryColors[course.category] || "bg-slate-500/15 text-slate-400")}>
                            {course.category}
                          </span>
                          {course.aiSummary && <Brain className="w-3 h-3 text-purple-400" />}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-400">{course.instructor}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-sm text-slate-300">{course.students.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm text-slate-300">{course.rating}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-emerald-400 font-medium">{formatCurrency(course.revenue)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500" style={{ width: `${course.completionRate}%` }} />
                      </div>
                      <span className="text-xs text-slate-400">{course.completionRate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant(course.status) as "success" | "warning" | "default"}>
                      {course.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"><Eye className="w-4 h-4" /></button>
                      <button className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/10 transition-colors"><Edit className="w-4 h-4" /></button>
                      <button className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 className="w-4 h-4" /></button>
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

