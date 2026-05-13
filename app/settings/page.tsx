"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings, Brain, Palette, Shield, Users, Bell,
  Eye, EyeOff, Save, RefreshCw, CheckCircle, Zap,
  Sun, Moon, Monitor, Globe, Lock, Unlock, Mail, Smartphone,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

const tabs = [
  { id: "general", label: "General", icon: Settings },
  { id: "ai", label: "AI Models", icon: Brain },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "security", label: "Security", icon: Shield },
  { id: "roles", label: "Roles & Permissions", icon: Users },
  { id: "notifications", label: "Notifications", icon: Bell },
];

const apiKeys = [
  { id: "openai", label: "OpenAI API Key", value: "sk-proj-â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢", active: true },
  { id: "gemini", label: "Google Gemini API Key", value: "AIzaâ€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢", active: true },
  { id: "huggingface", label: "HuggingFace Token", value: "hf_â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢", active: false },
  { id: "razorpay", label: "Razorpay Key ID", value: "rzp_live_â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢", active: true },
  { id: "stripe", label: "Stripe Secret Key", value: "sk_live_â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢", active: true },
];

const roles = [
  { name: "Super Admin", users: 1, permissions: ["all"], color: "text-red-400", bg: "bg-red-500/10" },
  { name: "Admin", users: 4, permissions: ["manage_users", "manage_courses", "view_analytics"], color: "text-orange-400", bg: "bg-orange-500/10" },
  { name: "Content Manager", users: 8, permissions: ["manage_courses", "ai_tools"], color: "text-indigo-400", bg: "bg-indigo-500/10" },
  { name: "Support", users: 12, permissions: ["view_users", "notifications"], color: "text-cyan-400", bg: "bg-cyan-500/10" },
  { name: "Analyst", users: 3, permissions: ["view_analytics", "view_reports"], color: "text-emerald-400", bg: "bg-emerald-500/10" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleKey = (id: string) => setShowKeys((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="page-content space-y-6 animate-fade-in">
      <PageHeader
        title="Settings"
        subtitle="Configure your platform, AI models, and preferences"
        icon={Settings}
        iconColor="text-slate-400"
        iconBg="bg-slate-500/10"
        actions={
          <button onClick={handleSave}
            className={cn("flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
              saved ? "bg-emerald-500 text-white" : "bg-indigo-500 text-white hover:bg-indigo-600")}>
            {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        }
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="glass-card p-2 space-y-1">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left",
                  activeTab === tab.id ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30" : "text-slate-400 hover:text-slate-200 hover:bg-white/5")}>
                <tab.icon className="w-4 h-4 flex-shrink-0" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>

            {/* General */}
            {activeTab === "general" && (
              <div className="space-y-4">
                <div className="glass-card p-5">
                  <h3 className="font-semibold text-slate-200 mb-4">Platform Settings</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: "Platform Name", value: "EduAI Platform" },
                      { label: "Admin Email", value: "admin@edtech.ai" },
                      { label: "Support Email", value: "support@edtech.ai" },
                      { label: "Platform URL", value: "https://edtech.ai" },
                    ].map((field) => (
                      <div key={field.label}>
                        <label className="text-xs text-slate-400 mb-1.5 block">{field.label}</label>
                        <input defaultValue={field.value}
                          className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500/50 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="glass-card p-5">
                  <h3 className="font-semibold text-slate-200 mb-4">Localization</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-400 mb-1.5 block">Default Language</label>
                      <select className="w-full glass-input px-3 py-2.5 text-sm text-slate-300 outline-none bg-transparent">
                        <option>English (US)</option>
                        <option>Hindi</option>
                        <option>Spanish</option>
                        <option>French</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1.5 block">Timezone</label>
                      <select className="w-full glass-input px-3 py-2.5 text-sm text-slate-300 outline-none bg-transparent">
                        <option>UTC+5:30 (IST)</option>
                        <option>UTC+0 (GMT)</option>
                        <option>UTC-5 (EST)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI Models */}
            {activeTab === "ai" && (
              <div className="space-y-4">
                <div className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <h3 className="font-semibold text-slate-200">API Keys</h3>
                  </div>
                  <div className="space-y-3">
                    {apiKeys.map((key) => (
                      <div key={key.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                        <div className={cn("w-2 h-2 rounded-full flex-shrink-0", key.active ? "bg-emerald-400" : "bg-slate-600")} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-400 mb-0.5">{key.label}</p>
                          <p className="text-sm font-mono text-slate-300 truncate">
                            {showKeys[key.id] ? key.value.replace(/â€¢/g, "x") : key.value}
                          </p>
                        </div>
                        <button onClick={() => toggleKey(key.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/10 transition-colors">
                          {showKeys[key.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="glass-card p-5">
                  <h3 className="font-semibold text-slate-200 mb-4">AI Model Preferences</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Default Text Model", options: ["GPT-4o", "Gemini Pro", "Llama 3.2"] },
                      { label: "Default Voice Model", options: ["Neural Voice Pro", "Studio Voice", "ElevenLabs"] },
                      { label: "Default Image Model", options: ["DALL-E 3", "Stable Diffusion", "Midjourney"] },
                    ].map((pref) => (
                      <div key={pref.label} className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">{pref.label}</span>
                        <select className="glass-input px-3 py-2 text-sm text-slate-300 outline-none bg-transparent">
                          {pref.options.map((o) => <option key={o}>{o}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Appearance */}
            {activeTab === "appearance" && (
              <div className="space-y-4">
                <div className="glass-card p-5">
                  <h3 className="font-semibold text-slate-200 mb-4">Theme</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "dark", icon: Moon, label: "Dark", active: theme === "dark" },
                      { id: "light", icon: Sun, label: "Light", active: theme === "light" },
                      { id: "system", icon: Monitor, label: "System", active: false },
                    ].map((t) => (
                      <button key={t.id} onClick={toggleTheme}
                        className={cn("flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
                          t.active ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-400" : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20")}>
                        <t.icon className="w-6 h-6" />
                        <span className="text-sm font-medium">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Security */}
            {activeTab === "security" && (
              <div className="space-y-4">
                <div className="glass-card p-5">
                  <h3 className="font-semibold text-slate-200 mb-4">Security Settings</h3>
                  <div className="space-y-4">
                    {[
                      { label: "Two-Factor Authentication", desc: "Require 2FA for all admin accounts", enabled: true, icon: Shield },
                      { label: "Session Timeout", desc: "Auto-logout after 30 minutes of inactivity", enabled: true, icon: Lock },
                      { label: "IP Whitelist", desc: "Restrict access to specific IP addresses", enabled: false, icon: Globe },
                      { label: "Audit Logging", desc: "Log all admin actions for compliance", enabled: true, icon: Unlock },
                    ].map((setting) => (
                      <div key={setting.label} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                        <div className="flex items-center gap-3">
                          <setting.icon className="w-5 h-5 text-slate-400" />
                          <div>
                            <p className="text-sm font-medium text-slate-300">{setting.label}</p>
                            <p className="text-xs text-slate-500">{setting.desc}</p>
                          </div>
                        </div>
                        <div className={cn("w-11 h-6 rounded-full relative cursor-pointer transition-colors",
                          setting.enabled ? "bg-indigo-500" : "bg-slate-700")}>
                          <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform",
                            setting.enabled ? "translate-x-6" : "translate-x-1")} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Roles */}
            {activeTab === "roles" && (
              <div className="space-y-4">
                <div className="glass-card overflow-hidden">
                  <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-200">Admin Roles</h3>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs hover:bg-indigo-500/20 transition-colors">
                      <Users className="w-3.5 h-3.5" /> Add Role
                    </button>
                  </div>
                  <div className="divide-y divide-white/5">
                    {roles.map((role, i) => (
                      <motion.div key={role.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                        className="flex items-center gap-4 px-5 py-4 hover:bg-white/3 transition-colors">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", role.bg)}>
                          <Shield className={cn("w-5 h-5", role.color)} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-200">{role.name}</p>
                          <p className="text-xs text-slate-500">{role.users} user{role.users !== 1 ? "s" : ""}</p>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {role.permissions.slice(0, 3).map((p) => (
                            <span key={p} className="text-xs bg-white/5 text-slate-400 px-2 py-0.5 rounded-lg">{p}</span>
                          ))}
                          {role.permissions.length > 3 && (
                            <span className="text-xs bg-white/5 text-slate-500 px-2 py-0.5 rounded-lg">+{role.permissions.length - 3}</span>
                          )}
                        </div>
                        <button className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/10 transition-colors">
                          <Settings className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === "notifications" && (
              <div className="glass-card p-5">
                <h3 className="font-semibold text-slate-200 mb-4">Notification Preferences</h3>
                <div className="space-y-3">
                  {[
                    { label: "New student enrollment", push: true, email: true },
                    { label: "Payment received", push: true, email: true },
                    { label: "AI generation complete", push: true, email: false },
                    { label: "Teacher approval request", push: true, email: true },
                    { label: "System alerts", push: true, email: true },
                    { label: "Weekly analytics report", push: false, email: true },
                    { label: "Course published", push: false, email: false },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <span className="text-sm text-slate-400">{item.label}</span>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                          <div className={cn("w-8 h-4 rounded-full relative cursor-pointer", item.push ? "bg-indigo-500" : "bg-slate-700")}>
                            <div className={cn("absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform", item.push ? "translate-x-4" : "translate-x-0.5")} />
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          <div className={cn("w-8 h-4 rounded-full relative cursor-pointer", item.email ? "bg-indigo-500" : "bg-slate-700")}>
                            <div className={cn("absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform", item.email ? "translate-x-4" : "translate-x-0.5")} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}



