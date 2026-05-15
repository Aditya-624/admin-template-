"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Sparkles,
  Zap,
  FileText,
  Mic,
  ClipboardList,
  BookOpen,
  Map,
  CreditCard,
  Play,
  RefreshCw,
  Settings,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import { aiModels } from "@/lib/dummy-data";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const generationTypes = [
  { id: "notes", icon: FileText, label: "Study Notes", desc: "Generate comprehensive study notes from course content", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20", count: 12840 },
  { id: "mindmap", icon: Map, label: "Mind Maps", desc: "Create visual mind maps for complex topics", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", count: 4210 },
  { id: "quiz", icon: ClipboardList, label: "Quizzes", desc: "Auto-generate MCQs and assessments", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20", count: 8920 },
  { id: "flashcard", icon: CreditCard, label: "Flashcards", desc: "Create spaced repetition flashcard decks", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", count: 6540 },
  { id: "podcast", icon: Mic, label: "Podcasts", desc: "Generate AI voice podcasts from text content", color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20", count: 1840 },
  { id: "summary", icon: BookOpen, label: "Summaries", desc: "Condense long content into key takeaways", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", count: 9280 },
];

const promptHistory = [
  { id: 1, prompt: "Generate study notes for React Hooks chapter", model: "GPT-4o", tokens: 2840, status: "completed", time: "2 min ago" },
  { id: 2, prompt: "Create 20 MCQs for Machine Learning basics", model: "Gemini Pro", tokens: 1920, status: "completed", time: "15 min ago" },
  { id: 3, prompt: "Generate podcast script for Python OOP", model: "GPT-4o", tokens: 4200, status: "processing", time: "32 min ago" },
  { id: 4, prompt: "Create mind map for Data Structures", model: "Ollama Llama", tokens: 1100, status: "completed", time: "1 hour ago" },
  { id: 5, prompt: "Summarize Cybersecurity module 5", model: "GPT-4o", tokens: 890, status: "failed", time: "2 hours ago" },
];

const weeklyUsage = [
  { day: "Mon", tokens: 284000 },
  { day: "Tue", tokens: 392000 },
  { day: "Wed", tokens: 318000 },
  { day: "Thu", tokens: 456000 },
  { day: "Fri", tokens: 521000 },
  { day: "Sat", tokens: 389000 },
  { day: "Sun", tokens: 241000 },
];

export default function AIControlPage() {
  const [selectedType, setSelectedType] = useState("notes");
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("openai");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerated(true);
    }, 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="AI Content Control Panel"
        subtitle="Generate, manage, and monitor AI-powered educational content"
        icon={Brain}
        iconColor="text-purple-400"
        iconBg="bg-purple-500/10"
        badge="AI Active"
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-2 h-2 bg-emerald-400 rounded-full pulse-dot" />
              <span className="text-xs text-emerald-400 font-medium">All Models Online</span>
            </div>
            <button className="p-2 rounded-xl bg-slate-800 border border-white/10 text-slate-400 hover:text-white transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        }
      />

      {/* AI Models Status */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {aiModels.map((model, i) => (
          <motion.div
            key={model.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSelectedModel(model.id)}
            className={cn(
              "p-4 rounded-xl border cursor-pointer transition-all duration-200",
              selectedModel === model.id
                ? "bg-indigo-500/10 border-indigo-500/40 shadow-glow"
                : "bg-slate-800/50 border-white/10 hover:border-white/20"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold",
                model.id === "openai" && "bg-emerald-500/20 text-emerald-400",
                model.id === "gemini" && "bg-blue-500/20 text-blue-400",
                model.id === "ollama" && "bg-orange-500/20 text-orange-400",
                model.id === "huggingface" && "bg-yellow-500/20 text-yellow-400",
              )}>
                {model.id === "openai" && "ðŸ¤–"}
                {model.id === "gemini" && "âœ¨"}
                {model.id === "ollama" && "ðŸ¦™"}
                {model.id === "huggingface" && "ðŸ¤—"}
              </div>
              <Badge variant={model.status === "active" ? "success" : "default"}>
                {model.status}
              </Badge>
            </div>
            <p className="text-xs font-medium text-slate-300 mb-1 truncate">{model.name}</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  style={{ width: `${model.usage}%` }}
                />
              </div>
              <span className="text-xs text-slate-500">{model.usage}%</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generation Panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Content Type Selector */}
          <div className="glass-card p-5">
            <h3 className="font-semibold text-slate-200 mb-4">Content Type</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {generationTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={cn(
                    "p-3 rounded-xl border text-left transition-all duration-200",
                    selectedType === type.id
                      ? `${type.bg} ${type.border} shadow-sm`
                      : "bg-white/5 border-white/10 hover:border-white/20"
                  )}
                >
                  <type.icon className={cn("w-5 h-5 mb-2", selectedType === type.id ? type.color : "text-slate-500")} />
                  <p className={cn("text-xs font-medium", selectedType === type.id ? type.color : "text-slate-400")}>
                    {type.label}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">{type.count.toLocaleString()} generated</p>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Input */}
          <div className="glass-card p-5">
            <h3 className="font-semibold text-slate-200 mb-4">Generation Prompt</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-slate-500">Model:</span>
                <div className="flex items-center gap-1">
                  {aiModels.filter(m => m.status === "active").map((model) => (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModel(model.id)}
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-xs font-medium transition-colors",
                        selectedModel === model.id
                          ? "bg-indigo-500 text-white"
                          : "bg-white/5 text-slate-400 hover:bg-white/10"
                      )}
                    >
                      {model.name.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`Describe what you want to generate...\n\nExample: "Generate comprehensive study notes for Chapter 5: Neural Networks, covering perceptrons, activation functions, backpropagation, and practical applications."`}
                rows={5}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-indigo-500/50 resize-none transition-colors"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>{prompt.length} chars</span>
                  <span>~{Math.ceil(prompt.length / 4)} tokens</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setPrompt(""); setGenerated(false); }}
                    className="px-3 py-2 rounded-xl bg-white/5 text-slate-400 text-sm hover:bg-white/10 transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isGenerating}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all shadow-glow"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Generated Output */}
            {generated && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl"
              >
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-400">Content Generated Successfully</span>
                  <span className="text-xs text-slate-500 ml-auto">2,840 tokens used</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  <strong className="text-indigo-300">Chapter 5: Neural Networks â€” Study Notes</strong><br /><br />
                  <strong>1. Introduction to Neural Networks</strong><br />
                  Neural networks are computational models inspired by biological neural systems. They consist of interconnected nodes (neurons) organized in layers: input, hidden, and output layers...<br /><br />
                  <strong>2. Perceptrons</strong><br />
                  The perceptron is the simplest form of a neural network, capable of binary classification. It takes multiple inputs, applies weights, sums them, and passes through an activation function...
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-medium hover:bg-indigo-500/30 transition-colors">
                    <Play className="w-3 h-3" />
                    Use Content
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 text-xs font-medium hover:bg-white/10 transition-colors">
                    <RefreshCw className="w-3 h-3" />
                    Regenerate
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          {/* Token Usage */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-200">Token Usage</h3>
              <Zap className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-400">Monthly Limit</span>
                  <span className="text-slate-300">2.84M / 5M</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "56.8%" }}
                    transition={{ duration: 1.5 }}
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  />
                </div>
                <p className="text-xs text-slate-600 mt-1">56.8% used â€¢ Resets in 19 days</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Today", value: "142K", color: "text-indigo-400" },
                  { label: "This Week", value: "892K", color: "text-purple-400" },
                  { label: "Cost Today", value: "$7.10", color: "text-emerald-400" },
                  { label: "Cost Month", value: "$142", color: "text-cyan-400" },
                ].map((item) => (
                  <div key={item.label} className="glass-inner p-2.5">
                    <p className="text-xs text-slate-500">{item.label}</p>
                    <p className={cn("text-sm font-bold", item.color)}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Weekly Usage Chart */}
          <div className="glass-card p-5">
            <h3 className="font-semibold text-slate-200 mb-4">Weekly Token Usage</h3>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={weeklyUsage} barSize={16}>
                <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(v: unknown) => [`${(Number(v) / 1000).toFixed(0)}K tokens`]}
                  contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "12px" }}
                />
                <Bar dataKey="tokens" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Prompt History */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-200">Prompt History</h3>
              <Clock className="w-4 h-4 text-slate-500" />
            </div>
            <div className="space-y-2">
              {promptHistory.map((item) => (
                <div key={item.id} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/8 cursor-pointer transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-xs text-slate-300 line-clamp-1 flex-1">{item.prompt}</p>
                    {item.status === "completed" && <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                    {item.status === "processing" && <RefreshCw className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0 animate-spin" />}
                    {item.status === "failed" && <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <span>{item.model}</span>
                    <span>â€¢</span>
                    <span>{item.tokens} tokens</span>
                    <span>â€¢</span>
                    <span>{item.time}</span>
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

