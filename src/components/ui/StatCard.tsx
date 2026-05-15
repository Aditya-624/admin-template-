"use client";

import React, { ElementType } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: ElementType;
  iconColor: string;
  iconBg: string;
  accentColor: string;
  sparkData: number[];
  delay?: number;
}

export default function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  iconColor,
  iconBg,
  accentColor,
  sparkData,
  delay = 0,
}: StatCardProps) {
  const isPositive = change >= 0;

  const chartData = sparkData.map((v, i) => ({ i, v }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className="stat-card card-hover p-5 pb-14 cursor-default"
    >
      {/* Icon + change badge row */}
      <div className="flex items-start justify-between mb-3">
        {/* Icon circle */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: iconBg }}
        >
          <Icon className="w-5 h-5" style={{ color: iconColor }} />
        </div>

        {/* Change badge */}
        <div
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold",
            isPositive
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
              : "bg-red-500/15 text-red-400 border border-red-500/20"
          )}
        >
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {isPositive ? "+" : ""}
          {change}%
        </div>
      </div>

      {/* Value */}
      <p className="text-2xl font-bold text-white leading-none mb-1">{value}</p>

      {/* Title */}
      <p className="text-sm text-slate-400 font-medium mb-1">{title}</p>

      {/* Change label */}
      <p className="text-xs text-slate-500">{changeLabel}</p>

      {/* Sparkline */}
      <div className="sparkline-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line
              type="monotone"
              dataKey="v"
              stroke={accentColor}
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(8,11,26,.95)",
                border: "1px solid rgba(255,255,255,.10)",
                borderRadius: "10px",
                fontSize: "11px",
              }}
              itemStyle={{ color: "#e2e8f0" }}
              labelFormatter={() => ""}
              formatter={(v: unknown) => [v as number, ""]}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Accent line at very bottom */}
      <div
        className="stat-accent"
        style={{ background: `linear-gradient(90deg, ${accentColor}cc, ${accentColor}44)` }}
      />
    </motion.div>
  );
}
