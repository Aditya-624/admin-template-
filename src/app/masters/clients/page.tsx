"use client";

import { Building2 } from "lucide-react";

export default function ClientsPage() {
  return (
    <div className="page-content animate-fade-in" style={{ padding: "24px" }}>
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(99,102,241,.15)" }}
        >
          <Building2 className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Clients</h1>
          <p className="text-slate-400 text-sm mt-0.5">Manage client organizations and accounts.</p>
        </div>
      </div>

      <div className="table-card" style={{ padding: "48px 24px", textAlign: "center" }}>
        <p className="text-slate-400">Clients list — coming soon.</p>
      </div>
    </div>
  );
}
