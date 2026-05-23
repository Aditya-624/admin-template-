"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import {
  CourseType,
  COURSE_TYPE_STORAGE_KEY,
  initialCourseTypes,
} from "@/lib/courses-data";

type ValidationErrors = Partial<Record<"name" | "shortForm", string>>;
const requiredFields: Array<keyof ValidationErrors> = ["name", "shortForm"];

export default function AddCourseTypePage() {
  const router = useRouter();
  
  const [form, setForm] = useState<CourseType>({
    id: 0,
    name: "",
    shortForm: "",
    description: "",
    status: true
  });

  useEffect(() => {
    const stored = localStorage.getItem(COURSE_TYPE_STORAGE_KEY);
    const existing = stored ? JSON.parse(stored) : initialCourseTypes;
    let maxId = 0;
    if (existing.length > 0) {
      existing.forEach((u: CourseType) => {
        if (u.id > maxId) maxId = u.id;
      });
    }
    setForm(f => ({ ...f, id: maxId + 1 }));
  }, []);

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [toast, setToast] = useState("");

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
    const current = stored ? JSON.parse(stored) as CourseType[] : initialCourseTypes;
    
    const next = [...current, form];
    localStorage.setItem(COURSE_TYPE_STORAGE_KEY, JSON.stringify(next));
    setToast("✓ Course Type created successfully");

    window.setTimeout(() => {
      router.push("/masters/courses/course-type");
    }, 1000);
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

      <section className="edit-user-card" style={{ maxWidth: "600px", width: "100%" }}>
        <div className="edit-user-header" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "14px", marginBottom: "24px" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "white" }}><span style={{ display: "flex", alignItems: "center", gap: "10px" }}><Plus size={24} /> New Course Type</span></h1>
        </div>

        <form className="edit-user-form">
          <div className="edit-user-row">
            <label htmlFor="course-type-name">Course Type *</label>
            <div className="edit-user-field">
              <input
                id="course-type-name"
                className={fieldClass("name")}
                type="text"
                placeholder="<Enter Course Type>"
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
                className="edit-user-input"
                placeholder="<Enter Description about Course Type>"
                rows={4}
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
              />
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
              Submit
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
