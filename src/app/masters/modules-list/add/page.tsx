"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import API from "@/services/api";
import { Plus } from "lucide-react";

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

export default function AddModulePage() {
  const router = useRouter();
  
  const [form, setForm] = useState<Module>({
    id: 0,
    name: "",
    description: "",
    shortForm: "",
    status: true
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [toast, setToast] = useState("");

  useEffect(() => {
    const storedRows = localStorage.getItem(storageKey);
    const existing = storedRows ? JSON.parse(storedRows) : initialData;
    let maxId = 0;
    if (existing.length > 0) {
      existing.forEach((m: Module) => {
        if (m.id > maxId) maxId = m.id;
      });
    }
    setForm(f => ({ ...f, id: maxId + 1 }));
  }, []);

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

    console.log("Sending POST request to create module:", form);
    API.post("/api/master/modules", form)
      .then((res) => {
        console.log("Successfully created module on backend:", res.data);
        const stored = localStorage.getItem(storageKey);
        const current = stored ? JSON.parse(stored) as Module[] : initialData;
        const next = [...current, { ...form, id: res.data.id ?? form.id }];
        localStorage.setItem(storageKey, JSON.stringify(next));
        setToast("✓ Module created successfully");
        window.setTimeout(() => {
          router.push("/masters/modules-list");
        }, 1000);
      })
      .catch((err) => {
        console.warn("Backend create module failed, checking secondary endpoint /api/modules...", err);
        API.post("/api/modules", form)
          .then((res) => {
            const stored = localStorage.getItem(storageKey);
            const current = stored ? JSON.parse(stored) as Module[] : initialData;
            const next = [...current, { ...form, id: res.data.id ?? form.id }];
            localStorage.setItem(storageKey, JSON.stringify(next));
            setToast("✓ Module created successfully");
            window.setTimeout(() => {
              router.push("/masters/modules-list");
            }, 1000);
          })
          .catch((err2) => {
            console.error("All endpoints failed. Saving locally to localStorage:", err2);
            const stored = localStorage.getItem(storageKey);
            const current = stored ? JSON.parse(stored) as Module[] : initialData;
            const next = [...current, form];
            localStorage.setItem(storageKey, JSON.stringify(next));
            setToast("✓ Module created locally");
            window.setTimeout(() => {
              router.push("/masters/modules-list");
            }, 1000);
          });
      });
  };

  const fieldClass = (field: keyof ValidationErrors) =>
    errors[field] ? "edit-user-input edit-user-input-error" : "edit-user-input";

  return (
    <div className="edit-user-page">
      {toast && (
        <div className="edit-user-toast">
          {toast}
        </div>
      )}

      <section className="edit-user-card">
        <div className="edit-user-header">
          <h1><span style={{ display: "flex", alignItems: "center", gap: "10px" }}><Plus size={24} /> Create Module</span></h1>
        </div>

        <form className="edit-user-form">
          <div className="edit-user-row">
            <label htmlFor="module-name">Module *</label>
            <div className="edit-user-field">
              <input
                id="module-name"
                className={fieldClass("name")}
                type="text"
                placeholder="<Enter Module>"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
              />
              {errors.name && <p className="edit-user-error">{errors.name}</p>}
            </div>
          </div>

          <div className="edit-user-row">
            <label htmlFor="short-form">Short Form *</label>
            <div className="edit-user-field">
              <input
                id="short-form"
                className={fieldClass("shortForm")}
                type="text"
                placeholder="<Enter Short Form>"
                value={form.shortForm}
                onChange={(event) => updateField("shortForm", event.target.value)}
              />
              {errors.shortForm && <p className="edit-user-error">{errors.shortForm}</p>}
            </div>
          </div>

          <div className="edit-user-row">
            <label htmlFor="description">Description</label>
            <div className="edit-user-field">
              <textarea
                id="description"
                className={fieldClass("description")}
                placeholder="<Enter Description about Module>"
                rows={4}
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
              />
              {errors.description && <p className="edit-user-error">{errors.description}</p>}
            </div>
          </div>

          <div className="edit-user-actions" style={{ justifyContent: "flex-end" }}>
            <Link href="/masters/modules-list" className="edit-user-cancel">
              Cancel
            </Link>
            <button type="button" className="edit-user-update" onClick={saveModule}>
              Submit
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
