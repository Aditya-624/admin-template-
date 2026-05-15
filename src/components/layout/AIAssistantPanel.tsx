"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Send,
  X,
  ChevronRight,
  Brain,
  Zap,
  BookOpen,
  Mic,
  ClipboardList,
  TrendingUp,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

const quickActions = [
  { icon: Brain, label: "Generate Study Notes", color: "text-purple-400", bg: "bg-purple-500/10" },
  { icon: ClipboardList, label: "Create Quiz", color: "text-indigo-400", bg: "bg-indigo-500/10" },
  { icon: Mic, label: "Generate Podcast", color: "text-cyan-400", bg: "bg-cyan-500/10" },
  { icon: TrendingUp, label: "Analytics Report", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { icon: BookOpen, label: "Course Summary", color: "text-orange-400", bg: "bg-orange-500/10" },
];

const aiSuggestions = [
  "📊 Student engagement dropped 12% this week",
  "🎯 3 courses need content updates",
  "⚡ AI token usage at 85% — upgrade soon",
  "🏆 Top performer: Priya Patel (9840 pts)",
];

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hello! I'm your AI assistant. I can help you generate content, analyze data, manage courses, and more. What would you like to do today?",
    time: "now",
  },
];

export default function AIAssistantPanel() {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      time: "now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const responses = [
        "I'll analyze that for you right away. Based on the current data, I can see some interesting patterns...",
        "Great idea! I can generate that content using our AI models. Would you prefer GPT-4o or Gemini Pro?",
        "I've processed your request. Here are the insights from the latest analytics data...",
        "Sure! I can create a comprehensive quiz with 20 MCQs on that topic. Shall I proceed?",
      ];
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
        time: "now",
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Toggle Button (when closed) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl animated-gradient shadow-glow flex items-center justify-center z-40 hover:scale-110 transition-transform"
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 320 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 320 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="hidden xl:flex flex-col w-80 h-screen sticky top-0 glass-ai-panel flex-shrink-0"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg animated-gradient flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">AI Assistant</h3>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full pulse-dot" />
                      <span className="text-xs text-emerald-400">GPT-4o Active</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* AI Insights */}
              <div className="space-y-1.5">
                {aiSuggestions.slice(0, 2).map((s, i) => (
                  <div key={i} className="text-xs text-slate-400 bg-white/5 rounded-lg px-2.5 py-1.5 cursor-pointer hover:bg-white/10 transition-colors">
                    {s}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-3 border-b border-white/10">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Quick Actions</p>
              <div className="grid grid-cols-1 gap-1.5">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-[1.02] text-left",
                      action.bg,
                      "hover:brightness-125"
                    )}
                  >
                    <action.icon className={cn("w-4 h-4 flex-shrink-0", action.color)} />
                    <span className={cn("text-xs font-medium", action.color)}>{action.label}</span>
                    <ChevronRight className={cn("w-3 h-3 ml-auto", action.color)} />
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex gap-2", msg.role === "user" && "flex-row-reverse")}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                    msg.role === "assistant"
                      ? "animated-gradient"
                      : "bg-indigo-500"
                  )}>
                    {msg.role === "assistant" ? (
                      <Sparkles className="w-3 h-3 text-white" />
                    ) : (
                      <span className="text-xs text-white font-bold">A</span>
                    )}
                  </div>
                  <div className={cn(
                    "max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed",
                    msg.role === "assistant"
                      ? "bg-white/5 text-slate-300 rounded-tl-none"
                      : "bg-indigo-500/20 text-indigo-200 rounded-tr-none"
                  )}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-lg animated-gradient flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <div className="bg-white/5 rounded-xl rounded-tl-none px-3 py-2">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                          className="w-1.5 h-1.5 bg-slate-400 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/10">
              <div className="flex items-center gap-2 bg-white/5 rounded-xl border border-white/10 px-3 py-2 focus-within:border-indigo-500/50 transition-colors">
                <MessageSquare className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask AI anything..."
                  className="flex-1 bg-transparent text-xs text-slate-200 placeholder-slate-600 outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="p-1 rounded-lg bg-indigo-500 text-white disabled:opacity-40 hover:bg-indigo-600 transition-colors"
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>
              <div className="flex items-center gap-1 mt-2 justify-center">
                <Zap className="w-3 h-3 text-yellow-400" />
                <span className="text-xs text-slate-600">Powered by GPT-4o • 2.8M tokens used</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
