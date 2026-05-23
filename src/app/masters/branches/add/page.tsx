"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import {
  Branch,
  BRANCHES_STORAGE_KEY,
  initialBranches,
} from "@/lib/branches-data";
import {
  Course,
  COURSE_STORAGE_KEY,
  initialCourses,
} from "@/lib/courses-data";

type ValidationErrors = Partial<Record<"courseId" | "name" | "shortForm", string>>;

export default function AddBranchPage() {
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState<Branch>({
    id: 0,
    courseId: 0,
    name: "",
    shortForm: "",
    description: "",
    status: true,
  });

  useEffect(() => {
    // Load courses for dropdown selection
    const storedCourses = localStorage.getItem(COURSE_STORAGE_KEY);
    let courseList: Course[] = [];
    if (storedCourses) {
      try {
        courseList = JSON.parse(storedCourses);
      } catch {
        courseList = initialCourses;
      }
    } else {
      courseList = initialCourses;
      localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(initialCourses));
    }
    setCourses(courseList);

    // Default to first course if available
    if (courseList.length > 0) {
      setForm(f => ({ ...f, courseId: courseList[0].id }));
    }

    // Auto-increment Branch ID
    const storedBranches = localStorage.getItem(BRANCHES_STORAGE_KEY);
    const existing: Branch[] = storedBranches ? JSON.parse(storedBranches) : initialBranches;
    let maxId = 0;
    existing.forEach((b: Branch) => { if (b.id > maxId) maxId = b.id; });
    setForm(f => ({ ...f, id: maxId + 1 }));
  }, []);

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [toast, setToast] = useState("");

  const updateField = (field: keyof Branch, value: any) => {
    setForm(f => ({ ...f, [field]: value }));
    if (field in errors) {
      setErrors(e => ({ ...e, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const nextErrors: ValidationErrors = {};
    if (!form.courseId || form.courseId === 0) nextErrors.courseId = "Course is required";
    if (!form.name.trim()) nextErrors.name = "Branch is required";
    if (!form.shortForm.trim()) nextErrors.shortForm = "Short Form is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const saveBranch = () => {
    if (!validateForm()) return;
    const stored = localStorage.getItem(BRANCHES_STORAGE_KEY);
    const current = stored ? (JSON.parse(stored) as Branch[]) : initialBranches;
    localStorage.setItem(BRANCHES_STORAGE_KEY, JSON.stringify([...current, form]));
    setToast("✓ Branch created successfully");
    window.setTimeout(() => router.push("/masters/branches"), 1000);
  };

  const fieldClass = (field: keyof ValidationErrors) =>
    errors[field] ? "edit-user-input edit-user-input-error" : "edit-user-input";

  return (
    <div className="edit-user-page">
      {toast && <div className="edit-user-toast">{toast}</div>}

      <section className="edit-user-card" style={{ maxWidth: "600px", width: "100%" }}>
        <div className="edit-user-header" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "14px", marginBottom: "24px" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "white" }}><span style={{ display: "flex", alignItems: "center", gap: "10px" }}><Plus size={24} /> New Branch</span></h1>
        </div>

        <form className="edit-user-form">
          {/* Course */}
          <div className="edit-user-row">
            <label htmlFor="course-select">Course *</label>
            <div className="edit-user-field">
              <select
                id="course-select"
                className={fieldClass("courseId")}
                value={form.courseId}
                onChange={(e) => updateField("courseId", parseInt(e.target.value, 10))}
                style={{ cursor: "pointer" }}
              >
                <option value="0">-- Select Course --</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
              {errors.courseId && <p className="edit-user-error">{errors.courseId}</p>}
            </div>
          </div>

          {/* Branch */}
          <div className="edit-user-row">
            <label htmlFor="branch-name">Branch *</label>
            <div className="edit-user-field">
              <input
                id="branch-name"
                className={fieldClass("name")}
                type="text"
                placeholder="<Enter Branch>"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
              {errors.name && <p className="edit-user-error">{errors.name}</p>}
            </div>
          </div>

          {/* Short Form */}
          <div className="edit-user-row">
            <label htmlFor="branch-shortform">Short Form *</label>
            <div className="edit-user-field">
              <input
                id="branch-shortform"
                className={fieldClass("shortForm")}
                type="text"
                placeholder="<Enter Branch's Short Form>"
                value={form.shortForm}
                onChange={(e) => updateField("shortForm", e.target.value)}
              />
              {errors.shortForm && <p className="edit-user-error">{errors.shortForm}</p>}
            </div>
          </div>

          {/* Description */}
          <div className="edit-user-row">
            <label htmlFor="description">Description</label>
            <div className="edit-user-field">
              <textarea
                id="description"
                className="edit-user-input"
                placeholder="<Enter Description about Branch>"
                rows={4}
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
              />
            </div>
          </div>

          {/* Status */}
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

          {/* Actions */}
          <div className="edit-user-actions" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "16px", marginTop: "24px" }}>
            <Link href="/masters/branches" className="edit-user-cancel">
              Cancel
            </Link>
            <button
              type="button"
              className="edit-user-update edit-user-update-green"
              onClick={saveBranch}
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
