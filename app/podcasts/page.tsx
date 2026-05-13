"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mic,
  Play,
  Pause,
  Plus,
  Clock,
  Headphones,
  FileText,
  Volume2,
  SkipBack,
  SkipForward,
  Upload,
  Brain,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import { podcasts } from "@/lib/dummy-data";
import { cn } from "@/lib/utils";

export default function PodcastsPage() {
  const [playing, setPlaying] = useState<string | null>(null);
  const [progress, setProgress] = useState(35);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Podcast Management"
        subtitle="AI-generated audio content for your courses"
        icon={Mic}
        iconColor="text-pink-400"
        iconBg="bg-pink-500/10"
        actions={
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-sm text-slate-300 hover:bg-slate-700 transition-colors">
              <Upload className="w-4 h-4" />
              Upload
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm hover:opacity-90 transition-opacity">
              <Brain className="w-4 h-4" />
              Generate AI Podcast
            </button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Episodes", value: "284", color: "text-pink-400" },
          { label: "Total Plays", value: "48.2K", color: "text-indigo-400" },
          { label: "Avg Duration", value: "28 min", color: "text-cyan-400" },
          { label: "AI Generated", value: "91%", color: "text-purple-400" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-4"
          >
            <p className="text-xs text-slate-500 mb-1">{stat.label}</p>
            <p className={cn("text-xl font-bold", stat.color)}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Podcast List */}
        <div className="lg:col-span-2 space-y-3">
          {podcasts.map((podcast, i) => (
            <motion.div
              key={podcast.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={cn(
                "bg-slate-800/50 border rounded-2xl p-4 transition-all duration-200",
                playing === podcast.id
                  ? "border-pink-500/40 bg-pink-500/5"
                  : "border-white/10 hover:border-white/20"
              )}
            >
              <div className="flex items-center gap-4">
                {/* Play Button */}
                <button
                  onClick={() => setPlaying(playing === podcast.id ? null : podcast.id)}
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all",
                    playing === podcast.id
                      ? "bg-pink-500 shadow-glow-purple"
                      : "bg-pink-500/10 hover:bg-pink-500/20"
                  )}
                >
                  {playing === podcast.id ? (
                    <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-pink-400 ml-0.5" />
                  )}
                </button>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-medium text-slate-200 truncate">{podcast.title}</h3>
                    <Badge variant={podcast.status === "published" ? "success" : "warning"}>
                      {podcast.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{podcast.course}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {podcast.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Headphones className="w-3.5 h-3.5" />
                      {podcast.plays.toLocaleString()} plays
                    </div>
                    <div className="flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5" />
                      {podcast.voice}
                    </div>
                    {podcast.transcript && (
                      <div className="flex items-center gap-1 text-cyan-400">
                        <FileText className="w-3.5 h-3.5" />
                        Transcript
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Bar (when playing) */}
              {playing === podcast.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">10:02</span>
                    <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden cursor-pointer">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500">{podcast.duration}</span>
                  </div>
                  <div className="flex items-center justify-center gap-4 mt-3">
                    <button className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/10 transition-colors">
                      <SkipBack className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPlaying(null)}
                      className="w-10 h-10 rounded-xl bg-pink-500 flex items-center justify-center hover:bg-pink-600 transition-colors"
                    >
                      <Pause className="w-5 h-5 text-white" />
                    </button>
                    <button className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/10 transition-colors">
                      <SkipForward className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Generate Panel */}
        <div className="space-y-4">
          <div className="glass-card p-5">
            <h3 className="font-semibold text-slate-200 mb-4">Generate AI Podcast</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Topic / Script</label>
                <textarea
                  rows={4}
                  placeholder="Enter the topic or paste your script here..."
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-pink-500/50 resize-none transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Voice Model</label>
                <select className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-pink-500/50 transition-colors">
                  <option>Neural Voice Pro (Male)</option>
                  <option>Neural Voice Pro (Female)</option>
                  <option>Studio Voice (Male)</option>
                  <option>Natural Voice (Female)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Style</label>
                <div className="grid grid-cols-3 gap-2">
                  {["Educational", "Conversational", "Formal"].map((style) => (
                    <button
                      key={style}
                      className="py-2 rounded-lg bg-white/5 text-xs text-slate-400 hover:bg-pink-500/10 hover:text-pink-400 transition-colors"
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
              <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-medium hover:opacity-90 transition-opacity shadow-glow-purple">
                <Mic className="w-4 h-4" />
                Generate Podcast
              </button>
            </div>
          </div>

          {/* Voice Models */}
          <div className="glass-card p-5">
            <h3 className="font-semibold text-slate-200 mb-3">Available Voices</h3>
            <div className="space-y-2">
              {[
                { name: "Neural Voice Pro", lang: "English", quality: "HD", active: true },
                { name: "Studio Voice", lang: "English", quality: "HD", active: true },
                { name: "Natural Voice", lang: "Multi-lang", quality: "Standard", active: true },
                { name: "ElevenLabs", lang: "Multi-lang", quality: "Ultra HD", active: false },
              ].map((voice) => (
                <div key={voice.name} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      voice.active ? "bg-emerald-400" : "bg-slate-600"
                    )} />
                    <div>
                      <p className="text-xs font-medium text-slate-300">{voice.name}</p>
                      <p className="text-xs text-slate-600">{voice.lang} â€¢ {voice.quality}</p>
                    </div>
                  </div>
                  <button className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 transition-colors">
                    <Play className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

