"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
  Course,
  CourseType,
  COURSE_STORAGE_KEY,
  COURSE_TYPE_STORAGE_KEY,
  initialCourses,
  initialCourseTypes,
} from "@/lib/courses-data";

type ValidationErrors = Partial<Record<"courseTypeId" | "name" | "externals", string>>;

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  
  const idStr = Array.isArray(params.id) ? params.id[0] : params.id;
  const targetId = parseInt(idStr || "0", 10);

  const [loading, setLoading] = useState(true);
  const [courseTypes, setCourseTypes] = useState<CourseType[]>([]);
  const [form, setForm] = useState<Course>({
    id: 0,
    name: "",
    courseTypeId: 0,
    externals: 0,
    description: "",
    status: true
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [toast, setToast] = useState("");

  useEffect(() => {
    // Load course types
    const storedTypes = localStorage.getItem(COURSE_TYPE_STORAGE_KEY);
    let types: CourseType[] = [];
    if (storedTypes) {
      try {
        types = JSON.parse(storedTypes);
      } catch {
        types = initialCourseTypes;
      }
    } else {
      types = initialCourseTypes;
      localStorage.setItem(COURSE_TYPE_STORAGE_KEY, JSON.stringify(initialCourseTypes));
    }
    setCourseTypes(types);

    // Fetch and populate course by ID
    const storedCourses = localStorage.getItem(COURSE_STORAGE_KEY);
    const list: Course[] = storedCourses ? JSON.parse(storedCourses) : initialCourses;
    const found = list.find((c) => c.id === targetId);
    if (found) {
      setForm({
        ...found,
        name: found.name || "",
        courseTypeId: found.courseTypeId || 0,
        externals: found.externals !== undefined ? found.externals : 0,
        description: found.description || "",
        status: found.status !== undefined ? found.status : true
      });
    } else {
      router.push("/masters/courses/course");
    }
    setLoading(false);
  }, [targetId, router]);

  const updateField = (field: keyof Course, value: any) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
    if (field in errors) {
      setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const nextErrors: ValidationErrors = {};
    if (!form.courseTypeId || form.courseTypeId === 0) {
      nextErrors.courseTypeId = "Course Type is required";
    }
    if (!form.name.trim()) {
      nextErrors.name = "Course is required";
    }
    if (form.externals === undefined || form.externals === null || isNaN(form.externals) || form.externals < 0) {
      nextErrors.externals = "Number of Externals must be 0 or more";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const saveCourse = () => {
    if (!validateForm()) return;

    const stored = localStorage.getItem(COURSE_STORAGE_KEY);
    const list: Course[] = stored ? JSON.parse(stored) : initialCourses;
    
    const updated: Course = {
      id: targetId,
      name: form.name.trim(),
      courseTypeId: form.courseTypeId,
      externals: form.externals,
      description: form.description.trim(),
      status: form.status,
    };

    const next = list.map((c) => (c.id === targetId ? updated : c));
    localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(next));
    setToast("✓ Course updated successfully");

    window.setTimeout(() => {
      router.push("/masters/courses/course");
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
          <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "white" }}>Modify Course</h1>
        </div>

        <form className="edit-user-form">
          <div className="edit-user-row">
            <label htmlFor="course-id">Course ID</label>
            <div className="edit-user-field">
              <input
                id="course-id"
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
            <label htmlFor="course-type">Course Type *</label>
            <div className="edit-user-field">
              <select
                id="course-type"
                className={fieldClass("courseTypeId")}
                value={form.courseTypeId}
                onChange={(event) => updateField("courseTypeId", parseInt(event.target.value, 10))}
                style={{ cursor: "pointer" }}
              >
                <option value="0">-- Select Course Type --</option>
                {courseTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              {errors.courseTypeId && <p className="edit-user-error">{errors.courseTypeId}</p>}
            </div>
          </div>

          <div className="edit-user-row">
            <label htmlFor="course-name">Course *</label>
            <div className="edit-user-field">
              <input
                id="course-name"
                className={fieldClass("name")}
                type="text"
                placeholder="<Enter Course>"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
              />
              {errors.name && <p className="edit-user-error">{errors.name}</p>}
            </div>
          </div>

          <div className="edit-user-row">
            <label htmlFor="externals">Number of Externals *</label>
            <div className="edit-user-field">
              <input
                id="externals"
                className={fieldClass("externals")}
                type="number"
                min="0"
                placeholder="<Enter Number of Externals>"
                value={form.externals}
                onChange={(event) => updateField("externals", event.target.value === "" ? "" : parseInt(event.target.value, 10))}
              />
              {errors.externals && <p className="edit-user-error">{errors.externals}</p>}
            </div>
          </div>

          <div className="edit-user-row">
            <label htmlFor="description">Description</label>
            <div className="edit-user-field">
              <textarea
                id="description"
                className="edit-user-input"
                placeholder="<Enter Description about Number of Externals>"
                rows={4}
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
              />
            </div>
          </div>

          <div className="edit-user-row">
            <label htmlFor="status">Status</label>
            <div className="edit-user-field" style={{ display: "flex", alignItems: "center", minHeight: "42px" }}>
              <label style={{ display: "flex", alignItems: "center", cursor: "pointer", gap: "10px" }}>
                <input
                  id="status"
                  type="checkbox"
                  className="edit-user-checkbox"
                  checked={form.status}
                  onChange={(event) => updateField("status", event.target.checked)}
                />
                <span className="checkbox-text">
                  {form.status ? "True (Active)" : "False (Inactive)"}
                </span>
              </label>
            </div>
          </div>

          <div className="edit-user-actions" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "16px", marginTop: "24px" }}>
            <Link href="/masters/courses/course" className="edit-user-cancel">
              Cancel
            </Link>
            <button
              type="button"
              className="edit-user-update edit-user-update-green"
              onClick={saveCourse}
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
