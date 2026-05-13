"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, Sparkles, CreditCard, AlertTriangle, Users, GraduationCap,
  CheckCheck, Trash2, Filter, Send, Plus, Mail, Smartphone, Megaphone,
  X, Settings,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import { notifications } from "@/lib/dummy-data";
import { cn } from "@/lib/utils";

const allNotifications = [
  ...notifications,
  {
    id: "NOT006", type: "student", title: "Course Completion Milestone",
    message: "Yuki Tanaka completed 'Machine Learning Bootcamp' with 95% score.",
    time: "6 hours ago", read: true, priority: "normal",
  },
  {
    id: "NOT007", type: "ai", title: "AI Model Update Available",
    message: "GPT-4o Turbo is now available. Upgrade for 2x faster generation.",
    time: "8 hours ago", read: true, priority: "high",
  },
  {
    id: "NOT008", type: "payment", title: "Subscription Renewal",
    message: "42 subscriptions are due for renewal in the next 7 days.",
    time: "12 hours ago", read: true, priority: "normal",
  },
];

const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  ai: { icon: Sparkles, color: "text-purple-400", bg: "bg-purple-500/15" },
  payment: { icon: CreditCard, color: "text-emerald-400", bg: "bg-emerald-500/15" },
  alert: { icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/15" },
  student: { icon: Users, color: "text-blue-400", bg: "bg-blue-500/15" },
  teacher: { icon: GraduationCap, color: "text-cyan-400", bg: "bg-cyan-500/15" },
};

export default function NotificationsPage() {
  const [filter, setFilter] = useState("all");
  const [notifs, setNotifs] = useState(allNotifications);
  const [showCompose, setShowCompose] = useState(false);
  const [composeType, setComposeType] = useState("push");

  const filtered = notifs.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "high") return n.priority === "high";
    if (filter !== "all") return n.type === filter;
    return true;
  });

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  const deleteNotif = (id: string) => setNotifs((prev) => prev.filter((n) => n.id !== id));
  const markRead = (id: string) => setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  const unreadCount = notifs.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Notifications Center"
        subtitle="Manage alerts, announcements, and communications"
        icon={Bell}
        iconColor="text-yellow-400"
        iconBg="bg-yellow-500/10"
        badge={unreadCount > 0 ? `${unreadCount} unread` : undefined}
        actions={
          <div className="flex gap-2">
            <button onClick={markAllRead} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-sm text-slate-300 hover:bg-slate-700 transition-colors">
              <CheckCheck className="w-4 h-4" /> Mark all read
            </button>
            <button onClick={() => setShowCompose(true)} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-500 text-white text-sm hover:bg-indigo-600 transition-colors">
              <Plus className="w-4 h-4" /> Send Notification
            </button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Sent Today", value: "1,284", icon: Bell, color: "text-yellow-400" },
          { label: "Push Delivered", value: "98.4%", icon: Smartphone, color: "text-emerald-400" },
          { label: "Email Open Rate", value: "42.8%", icon: Mail, color: "text-indigo-400" },
          { label: "Announcements", value: "12", icon: Megaphone, color: "text-purple-400" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass-card p-4 flex items-center gap-3">
            <s.icon className={cn("w-5 h-5 flex-shrink-0", s.color)} />
            <div>
              <p className="text-xs text-slate-500">{s.label}</p>
              <p className={cn("text-lg font-bold", s.color)}>{s.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notification Feed */}
        <div className="lg:col-span-2 space-y-3">
          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-slate-500" />
            {["all", "unread", "high", "ai", "payment", "alert", "student"].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={cn("px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors",
                  filter === f ? "bg-indigo-500 text-white" : "glass-inner text-slate-400 hover:text-slate-200")}>
                {f}
              </button>
            ))}
          </div>

          <AnimatePresence>
            {filtered.map((notif, i) => {
              const config = typeConfig[notif.type] || typeConfig.student;
              const Icon = config.icon;
              return (
                <motion.div key={notif.id}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: i * 0.04 }}
                  className={cn("flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer group",
                    !notif.read ? "bg-indigo-500/5 border-indigo-500/20" : "bg-slate-800/50 border-white/10 hover:border-white/20")}
                  onClick={() => markRead(notif.id)}>
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", config.bg)}>
                    <Icon className={cn("w-5 h-5", config.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-slate-200">{notif.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{notif.message}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {notif.priority === "high" && <Badge variant="danger">High</Badge>}
                        {!notif.read && <div className="w-2 h-2 bg-indigo-500 rounded-full" />}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-slate-600">{notif.time}</span>
                      <button onClick={(e) => { e.stopPropagation(); deleteNotif(notif.id); }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No notifications found</p>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          {/* Quick Send */}
          <div className="glass-card p-5">
            <h3 className="font-semibold text-slate-200 mb-4">Quick Announcement</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                {[
                  { id: "push", icon: Smartphone, label: "Push" },
                  { id: "email", icon: Mail, label: "Email" },
                  { id: "both", icon: Bell, label: "Both" },
                ].map((t) => (
                  <button key={t.id} onClick={() => setComposeType(t.id)}
                    className={cn("flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-medium transition-colors",
                      composeType === t.id ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-400" : "bg-white/5 border-white/10 text-slate-500 hover:border-white/20")}>
                    <t.icon className="w-4 h-4" />
                    {t.label}
                  </button>
                ))}
              </div>
              <input placeholder="Notification title..." className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-indigo-500/50 transition-colors" />
              <textarea rows={3} placeholder="Message content..." className="w-full glass-input w-full px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none resize-none bg-transparent" />
              <select className="w-full glass-input px-3 py-2.5 text-sm text-slate-300 outline-none bg-transparent">
                <option>All Students</option>
                <option>Pro Subscribers</option>
                <option>Enterprise Users</option>
                <option>Inactive Users</option>
              </select>
              <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition-colors">
                <Send className="w-4 h-4" /> Send Now
              </button>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-4 h-4 text-slate-400" />
              <h3 className="font-semibold text-slate-200">Alert Settings</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: "AI Generation Alerts", enabled: true },
                { label: "Payment Notifications", enabled: true },
                { label: "New Enrollments", enabled: true },
                { label: "Teacher Approvals", enabled: false },
                { label: "System Alerts", enabled: true },
                { label: "Weekly Reports", enabled: false },
              ].map((setting) => (
                <div key={setting.label} className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">{setting.label}</span>
                  <div className={cn("w-10 h-5 rounded-full relative cursor-pointer transition-colors",
                    setting.enabled ? "bg-indigo-500" : "bg-slate-700")}>
                    <div className={cn("absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform",
                      setting.enabled ? "translate-x-5" : "translate-x-0.5")} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

