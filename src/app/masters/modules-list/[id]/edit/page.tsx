"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import API from "@/services/api";

type Module = {
  id: number;
  name: string;
  description: string;
  shortForm: string;
  status: boolean;
};

const initialData: Module[] = [
  { id: 1, name: "Learn", description: "Saral Vidhya", shortForm: "LRN", status: true },
  { id: 2, name: "Evaluate", description: "Saral Nirnayah", shortForm: "EVL", status: true },
  { id: 3, name: "Teach", description: "Saral Bhodhana", shortForm: "TCH", status: true },
  { id: 4, name: "Train", description: "Saral Shikshana", shortForm: "TRN", status: true },
  { id: 5, name: "Compete", description: "Saral Pratiyogita", shortForm: "CMP", status: true },
];

const storageKey = "masters-modules-list-v1";

type ValidationErrors = Partial<Record<"name" | "description" | "shortForm", string>>;
const requiredFields: Array<keyof ValidationErrors> = ["name", "description", "shortForm"];

export default function EditModulePage() {
  const router = useRouter();
  const params = useParams();
  const idStr = Array.isArray(params.id) ? params.id[0] : params.id;
  const targetId = parseInt(idStr || "0", 10);

  const [form, setForm] = useState<Module>({
    id: 0,
    name: "",
    description: "",
    shortForm: "",
    status: true
  });

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [toast, setToast] = useState("");

  useEffect(() => {
    console.log(`Fetching module details for ID: ${targetId}...`);
    setLoading(true);

    // Try API
    API.get(`/api/master/modules/${targetId}`)
      .then((res) => {
        if (res.data) {
          setForm({
            id: typeof res.data.id === "number" ? res.data.id : targetId,
            name: String(res.data.name ?? res.data.module ?? ""),
            description: String(res.data.description ?? ""),
            shortForm: String(res.data.shortForm ?? res.data.short_form ?? ""),
            status: res.data.status === true || res.data.status === "Active" || res.data.status === 1
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Backend fetch failed, trying secondary endpoint...", err);
        API.get(`/api/modules/${targetId}`)
          .then((res) => {
            if (res.data) {
              setForm({
                id: typeof res.data.id === "number" ? res.data.id : targetId,
                name: String(res.data.name ?? ""),
                description: String(res.data.description ?? ""),
                shortForm: String(res.data.shortForm ?? ""),
                status: res.data.status === true || res.data.status === "Active" || res.data.status === 1
              });
            }
            setLoading(false);
          })
          .catch((err2) => {
            console.error("All module fetch API calls failed. Reading from local storage:", err2);
            const storedRows = localStorage.getItem(storageKey);
            const existing = storedRows ? JSON.parse(storedRows) : initialData;
            const found = existing.find((m: Module) => m.id === targetId);
            if (found) {
              setForm(found);
            } else {
              router.push("/masters/modules-list");
            }
            setLoading(false);
          });
      });
  }, [targetId, router]);

  const updateField = (field: keyof Module, value: any) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
    if (field in errors && typeof value === 'string' && value.trim()) {
      setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const nextErrors: ValidationErrors = {};
    requiredFields.forEach((field) => {
      if (!(form[field as keyof Module] as string).trim()) {
        nextErrors[field] = "This field is required";
      }
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const saveModule = () => {
    if (!validateForm()) return;

    console.log("Sending PUT request to update module:", form);
    API.put(`/api/master/modules/${targetId}`, form)
      .then((res) => {
        console.log("Successfully updated module on backend:", res.data);
        const stored = localStorage.getItem(storageKey);
        const current = stored ? JSON.parse(stored) as Module[] : initialData;
        const next = current.map((m) => (m.id === targetId ? form : m));
        localStorage.setItem(storageKey, JSON.stringify(next));
        setToast("✓ Module updated successfully");
        window.setTimeout(() => {
          router.push("/masters/modules-list");
        }, 1000);
      })
      .catch((err) => {
        console.warn("Backend update module failed, trying secondary endpoint /api/modules...", err);
        API.put(`/api/modules/${targetId}`, form)
          .then((res) => {
            const stored = localStorage.getItem(storageKey);
            const current = stored ? JSON.parse(stored) as Module[] : initialData;
            const next = current.map((m) => (m.id === targetId ? form : m));
            localStorage.setItem(storageKey, JSON.stringify(next));
            setToast("✓ Module updated successfully");
            window.setTimeout(() => {
              router.push("/masters/modules-list");
            }, 1000);
          })
          .catch((err2) => {
            console.error("All endpoints failed. Saving locally to localStorage:", err2);
            const stored = localStorage.getItem(storageKey);
            const current = stored ? JSON.parse(stored) as Module[] : initialData;
            const next = current.map((m) => (m.id === targetId ? form : m));
            localStorage.setItem(storageKey, JSON.stringify(next));
            setToast("✓ Module updated locally");
            window.setTimeout(() => {
              router.push("/masters/modules-list");
            }, 1000);
          });
      });
  };

  const fieldClass = (field: keyof ValidationErrors) =>
    errors[field] ? "edit-user-input edit-user-input-error" : "edit-user-input";

  if (loading) return null;

  return (
    <div className="edit-user-page">
      {toast && (
        <div className="edit-user-toast">
          {toast}
        </div>
      )}

      <section className="edit-user-card">
        <div className="edit-user-header">
          <h1>✏️ Edit Module</h1>
        </div>

        <form className="edit-user-form">
          <div className="edit-user-row">
            <label htmlFor="module-name">Module Name *</label>
            <div className="edit-user-field">
              <input
                id="module-name"
                className={fieldClass("name")}
                type="text"
                placeholder="<Enter Module Name>"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
              />
              {errors.name && <p className="edit-user-error">{errors.name}</p>}
            </div>
          </div>

          <div className="edit-user-row">
            <label htmlFor="description">Description *</label>
            <div className="edit-user-field">
              <textarea
                id="description"
                className={fieldClass("description")}
                placeholder="<Enter Description>"
                rows={3}
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
              />
              {errors.description && <p className="edit-user-error">{errors.description}</p>}
            </div>
          </div>

          <div className="edit-user-row">
            <label htmlFor="short-form">Short Form *</label>
            <div className="edit-user-field">
              <input
                id="short-form"
                className={fieldClass("shortForm")}
                type="text"
                placeholder="<Enter Short Form, e.g. LRN>"
                value={form.shortForm}
                onChange={(event) => updateField("shortForm", event.target.value)}
              />
              {errors.shortForm && <p className="edit-user-error">{errors.shortForm}</p>}
            </div>
          </div>

          <div className="edit-user-row" style={{ alignItems: "center" }}>
            <label htmlFor="status" style={{ marginBottom: 0 }}>Status</label>
            <div className="edit-user-field">
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", width: "fit-content" }}>
                <input
                  type="checkbox"
                  id="status"
                  checked={form.status}
                  onChange={(e) => updateField("status", e.target.checked)}
                  style={{ width: "16px", height: "16px", accentColor: "#8b5cf6" }}
                />
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>
                  {form.status ? "True (Active)" : "False (Inactive)"}
                </span>
              </label>
            </div>
          </div>

          <div className="edit-user-actions">
            <Link href="/masters/modules-list" className="edit-user-cancel">
              Cancel
            </Link>
            <button type="button" className="edit-user-update" onClick={saveModule}>
              Update
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
