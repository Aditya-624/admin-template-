"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Save, ArrowLeft } from "lucide-react";
import API from "@/services/api";

const storageKey = "edtech_material_types_v1";

export default function AddMaterialTypePage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    const newItem = {
      id: Date.now().toString(),
      name,
      description,
      status,
    };
    // Persist locally
    const stored = localStorage.getItem(storageKey);
    const current: any[] = stored ? JSON.parse(stored) : [];
    const updated = [...current, newItem];
    localStorage.setItem(storageKey, JSON.stringify(updated));
    // Optionally send to backend (mock)
    API.post("/api/master/material-types", newItem)
      .then(() => {
        setToast("✓ Material Type added");
        setTimeout(() => {
          // navigate back to list
          window.location.href = "/masters/materials/material-types";
        }, 1000);
      })
      .catch(() => {
        setToast("✓ Added locally");
        setTimeout(() => {
          window.location.href = "/masters/materials/material-types";
        }, 1000);
      });
  };

  return (
    <div className="add-page" style={{ display: "flex", justifyContent: "center", padding: "24px" }}>
      <div className="form-card" style={{ maxWidth: "800px", width: "100%", display: "flex", flexDirection: "column", height: "100%" }}>
        <div className="toolbar" style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
          <Link href="/masters/materials/material-types" className="back-btn" style={{ display: "flex", alignItems: "center", color: "#fff" }}>
            <ArrowLeft size={16} style={{ marginRight: "4px" }} /> Back
          </Link>
        </div>

          <div className="form-wrapper" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="form-col" style={{ width: "100%" }}>
              <label>Name *</label>
              <input className="edit-user-input" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Material Type Name" />
              {error && <p className="edit-user-error">{error}</p>}
            </div>
            <div className="form-col" style={{ width: "100%" }}>
              <label>Description</label>
              <textarea className="edit-user-input" rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
            </div>
            <div className="form-col" style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <label>Status</label>
              <button type="button" onClick={() => setStatus(!status)} className="status-toggle" style={{ width: "80px", padding: "4px", background: status ? "#34c759" : "#4b5563", borderRadius: "9999px", color: "#fff" }}>
                {status ? "Active" : "Inactive"}
              </button>
            </div>
          </div>

        <div className="actions" style={{ marginTop: "auto", display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <button className="add-btn-card" onClick={handleSubmit}>
            <Save size={16} style={{ marginRight: "4px" }} /> Save
          </button>
        </div>
        {toast && <div className="edit-user-toast" style={{ marginTop: "12px", color: "#34c759" }}>{toast}</div>}
      </div>
    </div>
  );
}
