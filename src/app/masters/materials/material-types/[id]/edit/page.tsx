"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Edit, Save, ArrowLeft, Trash2 } from "lucide-react";
import API from "@/services/api";
import { mockMaterialTypes, MaterialType } from "@/app/masters/materials/material-types/mockData";

const storageKey = "edtech_material_types_v1";

type ValidationErrors = Partial<Record<keyof MaterialType, string>>;

export default function EditMaterialTypePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const materialId = decodeURIComponent(params.id);

  const getStoredMaterial = (id: string, fallback: MaterialType): MaterialType => {
    if (typeof window === "undefined") return fallback;
    const stored = localStorage.getItem(storageKey);
    if (!stored) return fallback;
    try {
      const parsed = JSON.parse(stored) as MaterialType[];
      return parsed.find(m => m.id === id) ?? fallback;
    } catch {
      return fallback;
    }
  };

  const [form, setForm] = useState<MaterialType>(() => {
    const fallback = mockMaterialTypes[0] || { id: "", name: "", description: "", status: true };
    return getStoredMaterial(materialId, fallback);
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [validation, setValidation] = useState<ValidationErrors>({});

  // Load from API on mount
  useEffect(() => {
    API.get(`/api/master/material-types/${materialId}`)
      .then(res => {
        const data = res.data;
        const mapped: MaterialType = {
          id: String(data.id ?? materialId),
          name: String(data.name ?? data.material_type ?? data.materialType ?? ""),
          description: String(data.description ?? ""),
          status: data.status === true || data.status === "Active" || data.status === "active" || data.status === 1 || String(data.status).toLowerCase() === "true",
        };
        setForm(mapped);
        localStorage.setItem(storageKey, JSON.stringify([mapped]));
        setLoading(false);
      })
      .catch(() => {
        // fallback to local storage / mock data
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          try {
            const parsed = JSON.parse(stored) as MaterialType[];
            const found = parsed.find(m => m.id === materialId);
            if (found) setForm(found);
          } catch {}
        }
        setLoading(false);
      });
  }, [materialId]);

  const updateField = (field: keyof MaterialType, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (validation[field]) {
      setValidation(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const errors: ValidationErrors = {};
    if (!form.name.trim()) errors.name = "Name required";
    if (!form.description.trim()) errors.description = "Description required";
    setValidation(errors);
    return Object.keys(errors).length === 0;
  };

  const saveMaterial = () => {
    if (!validate()) return;
    const payload = {
      name: form.name,
      description: form.description,
      status: form.status,
    };
    API.patch(`/api/master/material-types/${materialId}`, payload)
      .then(() => {
        // update local storage
        const stored = localStorage.getItem(storageKey);
        const list: MaterialType[] = stored ? JSON.parse(stored) : [];
        const updated = list.map(m => (m.id === materialId ? { ...m, ...payload } : m));
        localStorage.setItem(storageKey, JSON.stringify(updated));
        setToast("✓ Material Type updated");
        setTimeout(() => router.push("/masters/materials/material-types"), 1000);
      })
      .catch(err => {
        console.error("Update failed", err);
        setToast("✓ Updated locally");
        // still update local storage
        const stored = localStorage.getItem(storageKey);
        const list: MaterialType[] = stored ? JSON.parse(stored) : [];
        const updated = list.map(m => (m.id === materialId ? { ...m, ...payload } : m));
        localStorage.setItem(storageKey, JSON.stringify(updated));
        setTimeout(() => router.push("/masters/materials/material-types"), 1000);
      });
  };

  const deleteMaterial = () => {
    if (!window.confirm("Delete this material type permanently?")) return;
    API.delete(`/api/master/material-types/${materialId}`)
      .then(() => {
        const stored = localStorage.getItem(storageKey);
        const list: MaterialType[] = stored ? JSON.parse(stored) : [];
        const filtered = list.filter(m => m.id !== materialId);
        localStorage.setItem(storageKey, JSON.stringify(filtered));
        router.push("/masters/materials/material-types");
      })
      .catch(() => {
        const stored = localStorage.getItem(storageKey);
        const list: MaterialType[] = stored ? JSON.parse(stored) : [];
        const filtered = list.filter(m => m.id !== materialId);
        localStorage.setItem(storageKey, JSON.stringify(filtered));
        router.push("/masters/materials/material-types");
      });
  };

  const fieldClass = (field: keyof ValidationErrors) =>
    validation[field] ? "edit-user-input edit-user-input-error" : "edit-user-input";

  if (loading) {
    return (
      <div className="datatable-page" style={{ display: "flex", justifyContent: "center", padding: "24px" }}>
        <div className="text-slate-400">Loading material type...</div>
      </div>
    );
  }

  return (
    <div className="add-page" style={{ display: "flex", justifyContent: "center", padding: "24px" }}>
      <div className="form-card" style={{ maxWidth: "800px", width: "100%", display: "flex", flexDirection: "column", height: "100%" }}>
        <div className="toolbar" style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
          <Link href="/masters/materials/material-types" className="back-btn" style={{ display: "flex", alignItems: "center", color: "#fff" }}>
            <ArrowLeft size={16} style={{ marginRight: "4px" }} /> Back
          </Link>
        </div>
        <h2 style={{ color: "#fff", marginBottom: "12px" }}>Edit Material Type</h2>
        <div className="form-wrapper" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="form-col">
            <label>Name *</label>
            <input className={fieldClass("name")} type="text" value={form.name} onChange={e => updateField("name", e.target.value)} placeholder="Material Type Name" />
            {validation.name && <p className="edit-user-error">{validation.name}</p>}
          </div>
          <div className="form-col">
            <label>Description *</label>
            <textarea className={fieldClass("description")} rows={3} value={form.description} onChange={e => updateField("description", e.target.value)} placeholder="Description" />
            {validation.description && <p className="edit-user-error">{validation.description}</p>}
          </div>
          <div className="form-col" style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            <label>Status</label>
            <button type="button" onClick={() => updateField("status", !form.status)} className="status-toggle" style={{ width: "80px", padding: "4px", background: form.status ? "#34c759" : "#4b5563", borderRadius: "9999px", color: "#fff" }}>
              {form.status ? "Active" : "Inactive"}
            </button>
          </div>
        </div>
        <div className="actions" style={{ marginTop: "auto", display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <Link href="/masters/materials/material-types" className="add-btn-card">Cancel</Link>
          <button className="add-btn-card" onClick={saveMaterial}>
            <Save size={16} style={{ marginRight: "4px" }} /> Save
          </button>
          <button className="add-btn-card" onClick={deleteMaterial} style={{ background: "#dc2626" }}>
            <Trash2 size={16} style={{ marginRight: "4px" }} /> Delete
          </button>
        </div>
        {toast && <div className="edit-user-toast" style={{ marginTop: "12px", color: "#34c759" }}>{toast}</div>}
      </div>
    </div>
  );
}
