"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Edit } from "lucide-react";
import {
  CourseType,
  COURSE_TYPE_STORAGE_KEY,
  initialCourseTypes,
} from "@/lib/courses-data";

type ValidationErrors = Partial<Record<"name" | "shortForm", string>>;
const requiredFields: Array<keyof ValidationErrors> = ["name", "shortForm"];

export default function EditCourseTypePage() {
  const router = useRouter();
  const params = useParams();
  
  const idStr = Array.isArray(params.id) ? params.id[0] : params.id;
  const targetId = parseInt(idStr || "0", 10);

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<CourseType>({
    id: 0,
    name: "",
    shortForm: "",
    description: "",
    status: true
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [toast, setToast] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(COURSE_TYPE_STORAGE_KEY);
    const list: CourseType[] = stored ? JSON.parse(stored) : initialCourseTypes;
    const found = list.find((c) => c.id === targetId);
    if (found) {
      setForm({
        ...found,
        name: found.name || "",
        shortForm: found.shortForm || "",
        description: found.description || "",
        status: found.status !== undefined ? found.status : true
      });
    } else {
      router.push("/masters/courses/course-type");
    }
    setLoading(false);
  }, [targetId, router]);

  const updateField = (field: keyof CourseType, value: any) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
    if (field in errors && typeof value === 'string' && value.trim()) {
      setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const nextErrors: ValidationErrors = {};
    requiredFields.forEach((field) => {
      if (!(form[field as keyof CourseType] as string).trim()) {
        nextErrors[field] = "This field is required";
      }
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const saveCourseType = () => {
    if (!validateForm()) return;

    const stored = localStorage.getItem(COURSE_TYPE_STORAGE_KEY);
    const list: CourseType[] = stored ? JSON.parse(stored) : initialCourseTypes;
    
    const updated: CourseType = {
      id: targetId,
      name: form.name.trim(),
      shortForm: form.shortForm.trim(),
      description: form.description.trim(),
      status: form.status,
    };

    const next = list.map((c) => (c.id === targetId ? updated : c));
    localStorage.setItem(COURSE_TYPE_STORAGE_KEY, JSON.stringify(next));
    setToast("✓ Course Type updated successfully");

    window.setTimeout(() => {
      router.push("/masters/courses/course-type");
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

      <section className="edit-user-card" style={{ maxWidth: "600px", width: "100%" }}>
        <div className="edit-user-header" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "14px", marginBottom: "24px" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "white" }}><span style={{ display: "flex", alignItems: "center", gap: "10px" }}><Edit size={24} /> Modify Course Type</span></h1>
        </div>

        <form className="edit-user-form">
          <div className="edit-user-row">
            <label htmlFor="course-type-id">Course Type ID</label>
            <div className="edit-user-field">
              <input
                id="course-type-id"
                className="edit-user-input"
                type="text"
                value={form.id}
                disabled
                readOnly
                style={{ opacity: 0.6, cursor: "not-allowed" }}
              />
            </div>
          </div>

          <div className="edit-user-row">
            <label htmlFor="course-type-name">Course Type *</label>
            <div className="edit-user-field">
              <input
                id="course-type-name"
                className={fieldClass("name")}
                type="text"
                placeholder="Course Type"
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
                placeholder="Short Form"
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
                className="edit-user-input"
                placeholder="<Module Description"
                rows={4}
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
              />
            </div>
          </div>

          <div className="edit-user-row">
            <label htmlFor="status">Status</label>
            <div className="edit-user-field" style={{ display: "flex", alignItems: "center", minHeight: "42px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button
                  type="button"
                  id="status"
                  onClick={() => updateField("status", !form.status)}
                  className={`status-toggle ${form.status ? "active" : ""}`}
                  aria-pressed={form.status}
                  style={{
                    position: "relative",
                    width: "48px",
                    height: "24px",
                    borderRadius: "9999px",
                    background: form.status ? "#34c759" : "#4b5563",
                    border: "none",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease, transform 0.1s ease",
                    padding: "0"
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      background: "#ffffff",
                      position: "absolute",
                      top: "3px",
                      left: form.status ? "27px" : "3px",
                      transition: "left 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                    }}
                  />
                </button>
                <span
                  style={{
                    color: form.status ? "#34c759" : "#9ca3af",
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    transition: "color 0.2s ease"
                  }}
                >
                  {form.status ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          <div className="edit-user-actions" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "16px", marginTop: "24px" }}>
            <Link href="/masters/courses/course-type" className="edit-user-cancel">
              Cancel
            </Link>
            <button
              type="button"
              className="edit-user-update edit-user-update-green"
              onClick={saveCourseType}
            >
              Update
            </button>
          </div>
        </form>
      </section>

      <style>{`
        .edit-user-update-green {
          background: linear-gradient(135deg, #70ad47, #5a8d38) !important;
          border: 1px solid #70ad47 !important;
          color: white !important;
          font-weight: 600 !important;
          box-shadow: 0 4px 12px rgba(112, 173, 71, 0.2) !important;
        }
        .edit-user-update-green:hover {
          box-shadow: 0 6px 18px rgba(112, 173, 71, 0.35) !important;
          transform: translateY(-1px) !important;
          background: linear-gradient(135deg, #7ec250, #619a3b) !important;
        }
      `}</style>
    </div>
  );
}
