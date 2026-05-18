"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import React, { useState, useEffect } from "react";

const initialPrivileges = [
  { id: 1, name: "SyllabusUpload", description: "User can upload Syllabus", status: true },
  { id: 2, name: "SyllabusReview", description: "User can review Syllabus", status: true },
  { id: 3, name: "SyllabusApproval", description: "User can Approval Syllabus", status: true },
  { id: 4, name: "CourseUpload", description: "User can upload Course", status: true },
  { id: 5, name: "CourseReview", description: "User can review Course", status: true },
  { id: 6, name: "CourseApproval", description: "User can Approve Course", status: true },
];

const storageKey = "masters-privileges-list-v1";

type Privilege = {
  id: number;
  name: string;
  description: string;
  status: boolean;
};

type ValidationErrors = Partial<Record<"name" | "description", string>>;
const requiredFields: Array<keyof ValidationErrors> = ["name", "description"];

export default function EditPrivilegePage() {
  const router = useRouter();
  const params = useParams();
  const idStr = Array.isArray(params.id) ? params.id[0] : params.id;
  const targetId = parseInt(idStr || "0", 10);

  const [form, setForm] = useState<Privilege>({
    id: 0,
    name: "",
    description: "",
    status: true
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedRows = localStorage.getItem(storageKey);
    const existingPrivileges = storedRows ? JSON.parse(storedRows) : initialPrivileges;
    
    const found = existingPrivileges.find((p: Privilege) => p.id === targetId);
    if (found) {
      setForm(found);
    } else {
      router.push("/masters/privileges-list");
    }
    setLoading(false);
  }, [targetId, router]);

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [toast, setToast] = useState("");

  const updateField = (field: keyof Privilege, value: any) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
    if (field in errors && typeof value === 'string' && value.trim()) {
      setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const nextErrors: ValidationErrors = {};
    requiredFields.forEach((field) => {
      if (!(form[field as keyof Privilege] as string).trim()) {
        nextErrors[field] = "This field is required";
      }
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const savePrivilege = () => {
    if (!validateForm()) return;

    const storedPrivileges = localStorage.getItem(storageKey);
    const currentPrivileges = storedPrivileges ? JSON.parse(storedPrivileges) as Privilege[] : initialPrivileges;
    
    const nextPrivileges = currentPrivileges.map((p) => (p.id === targetId ? form : p));
    
    localStorage.setItem(storageKey, JSON.stringify(nextPrivileges));
    setToast("✓ Privilege updated successfully");

    window.setTimeout(() => {
      router.push("/masters/privileges-list");
    }, 1000);
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
          <h1>✏️ Edit Privilege</h1>
        </div>

        <form className="edit-user-form">
          <div className="edit-user-row">
            <label htmlFor="privilege-name">Privilege Name *</label>
            <div className="edit-user-field">
              <input
                id="privilege-name"
                className={fieldClass("name")}
                type="text"
                placeholder="<Enter Privilege Name>"
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
            <Link href="/masters/privileges-list" className="edit-user-cancel">
              Cancel
            </Link>
            <button type="button" className="edit-user-update" onClick={savePrivilege}>
              Update
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
