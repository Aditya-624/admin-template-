"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard, DollarSign, TrendingUp, Users, Download,
  CheckCircle, Clock, XCircle, ArrowUpRight, Zap, Shield,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import { transactions, subscriptionPlans } from "@/lib/dummy-data";
import { cn, formatCurrency } from "@/lib/utils";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

const monthlyRevenue = [
  { month: "Jul", revenue: 95000 },
  { month: "Aug", revenue: 112000 },
  { month: "Sep", revenue: 98000 },
  { month: "Oct", revenue: 124000 },
  { month: "Nov", revenue: 138000 },
  { month: "Dec", revenue: 156000 },
];

const planColors = ["#64748b", "#6366f1", "#a855f7"];

export default function PaymentsPage() {
  const [filter, setFilter] = useState("all");

  const filtered = transactions.filter((t) =>
    filter === "all" ? true : t.status === filter
  );

  const statusIcon = (status: string) => {
    if (status === "completed") return <CheckCircle className="w-4 h-4 text-emerald-400" />;
    if (status === "pending") return <Clock className="w-4 h-4 text-yellow-400" />;
    if (status === "refunded") return <XCircle className="w-4 h-4 text-red-400" />;
    return null;
  };

  const statusVariant = (status: string) => {
    if (status === "completed") return "success";
    if (status === "pending") return "warning";
    if (status === "refunded") return "danger";
    return "default";
  };

  return (
    <div className="page-content space-y-6 animate-fade-in">
      <PageHeader
        title="Payments & Subscriptions"
        subtitle="Revenue, transactions, and subscription management"
        icon={CreditCard}
        iconColor="text-emerald-400"
        iconBg="bg-emerald-500/10"
        actions={
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-sm text-slate-300 hover:bg-slate-700 transition-colors">
            <Download className="w-4 h-4" /> Export Report
          </button>
        }
      />

      {/* Revenue Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Revenue", value: "$284K", change: "+18.9%", icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "This Month", value: "$48.2K", change: "+12.4%", icon: TrendingUp, color: "text-indigo-400", bg: "bg-indigo-500/10" },
          { label: "Active Subs", value: "48,291", change: "+8.7%", icon: Users, color: "text-purple-400", bg: "bg-purple-500/10" },
          { label: "Avg Revenue/User", value: "$5.89", change: "+3.2%", icon: ArrowUpRight, color: "text-cyan-400", bg: "bg-cyan-500/10" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass-card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", s.bg)}>
                <s.icon className={cn("w-4 h-4", s.color)} />
              </div>
              <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg">{s.change}</span>
            </div>
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className={cn("text-xl font-bold", s.color)}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="glass-card p-5">
            <h3 className="font-semibold text-slate-200 mb-4">Revenue Trend (6 months)</h3>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={monthlyRevenue}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                  formatter={(v: unknown) => [formatCurrency(Number(v)), "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2.5} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Transactions Table */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="glass-card overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-semibold text-slate-200">Recent Transactions</h3>
              <div className="flex gap-1">
                {["all", "completed", "pending", "refunded"].map((f) => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={cn("px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors",
                      filter === f ? "bg-emerald-500 text-white" : "text-slate-500 hover:text-slate-300")}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5 bg-slate-800/30">
                    {["Transaction", "Student", "Plan", "Amount", "Method", "Status", "Invoice"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((txn, i) => (
                    <motion.tr key={txn.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                      className="border-b border-white/5 hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3 text-xs font-mono text-slate-500">{txn.id}</td>
                      <td className="px-4 py-3 text-sm text-slate-300">{txn.student}</td>
                      <td className="px-4 py-3 text-xs text-slate-400">{txn.plan}</td>
                      <td className="px-4 py-3 text-sm font-bold text-emerald-400">{formatCurrency(txn.amount)}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-lg">{txn.method}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {statusIcon(txn.status)}
                          <Badge variant={statusVariant(txn.status) as "success" | "warning" | "danger" | "default"}>{txn.status}</Badge>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-indigo-400 cursor-pointer hover:text-indigo-300">{txn.invoice}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Subscription Plans */}
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
            className="glass-card p-5">
            <h3 className="font-semibold text-slate-200 mb-4">Subscription Plans</h3>
            <div className="space-y-3">
              {subscriptionPlans.map((plan, i) => (
                <motion.div key={plan.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.08 }}
                  className={cn("p-4 rounded-xl border relative overflow-hidden",
                    plan.popular ? "border-indigo-500/40 bg-indigo-500/5" : "border-white/10 bg-white/5")}>
                  {plan.popular && (
                    <span className="absolute top-2 right-2 text-xs bg-indigo-500 text-white px-2 py-0.5 rounded-lg">Popular</span>
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-200">{plan.name}</h4>
                    <span className="text-lg font-bold text-indigo-400">${plan.price}<span className="text-xs text-slate-500">/mo</span></span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span>{plan.students.toLocaleString()} subscribers</span>
                    <span className="text-emerald-400 font-medium">{formatCurrency(plan.revenue)}</span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(plan.students / 50000) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                      className={cn("h-full rounded-full bg-gradient-to-r", plan.color)} />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Plan Distribution Pie */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
            className="glass-card p-5">
            <h3 className="font-semibold text-slate-200 mb-3">Plan Distribution</h3>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={subscriptionPlans} cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={3} dataKey="students">
                  {subscriptionPlans.map((_, idx) => (
                    <Cell key={idx} fill={planColors[idx]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: unknown) => [Number(v).toLocaleString(), "Subscribers"]}
                  contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-around mt-2">
              {subscriptionPlans.map((p, idx) => (
                <div key={p.id} className="text-center">
                  <div className="w-2.5 h-2.5 rounded-full mx-auto mb-1" style={{ background: planColors[idx] }} />
                  <p className="text-xs text-slate-400">{p.name}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Payment Gateway */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }}
            className="glass-card p-5">
            <h3 className="font-semibold text-slate-200 mb-3">Payment Gateways</h3>
            <div className="space-y-2">
              {[
                { name: "Razorpay", status: "active", txns: 1842, color: "text-blue-400" },
                { name: "Stripe", status: "active", txns: 2910, color: "text-purple-400" },
                { name: "PayPal", status: "active", txns: 892, color: "text-yellow-400" },
              ].map((gw) => (
                <div key={gw.name} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5">
                  <div className="flex items-center gap-2">
                    <Shield className={cn("w-4 h-4", gw.color)} />
                    <span className="text-sm text-slate-300">{gw.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{gw.txns} txns</span>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full pulse-dot" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

