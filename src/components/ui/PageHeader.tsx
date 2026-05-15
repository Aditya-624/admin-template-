"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
  iconColor?: string;
  iconBg?: string;
  actions?: React.ReactNode;
  badge?: string;
}

export default function PageHeader({
  title,
  subtitle,
  icon: Icon,
  iconColor = "text-indigo-400",
  iconBg = "bg-indigo-500/10",
  actions,
  badge,
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex items-center justify-between mb-8"
    >
      <div className="flex items-center gap-4">
        {Icon && (
          <div className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center border border-white/10",
            iconBg
          )}>
            <Icon className={cn("w-5 h-5", iconColor)} />
          </div>
        )}
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-slate-100 tracking-tight">{title}</h1>
            {badge && (
              <span className="text-xs glass-inner text-indigo-300 px-2.5 py-0.5 rounded-lg font-semibold border border-indigo-500/20">
                {badge}
              </span>
            )}
          </div>
          {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2.5">{actions}</div>}
    </motion.div>
  );
}
