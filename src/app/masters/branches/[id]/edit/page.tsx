"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
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

export default function EditBranchPage() {
  const router = useRouter();
  const params = useParams();

  const idStr = Array.isArray(params.id) ? params.id[0] : params.id;
  const targetId = parseInt(idStr || "0", 10);

  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState<Branch>({
    id: 0,
    courseId: 0,
    name: "",
    shortForm: "",
    description: "",
    status: true,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [toast, setToast] = useState("");

  useEffect(() => {
    // Load courses
    const storedCourses = localStorage.getItem(COURSE_STORAGE_KEY);
    let courseList: Course[] = [];
    if (storedCourses) {
      try { courseList = JSON.parse(storedCourses); } catch { courseList = initialCourses; }
    } else {
      courseList = initialCourses;
      localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(initialCourses));
    }
    setCourses(courseList);

    // Load branch by ID
    const storedBranches = localStorage.getItem(BRANCHES_STORAGE_KEY);
    const list: Branch[] = storedBranches ? JSON.parse(storedBranches) : initialBranches;
    const found = list.find((b) => b.id === targetId);
    if (found) {
      setForm({
        id: found.id,
        courseId: found.courseId || 0,
        name: found.name || "",
        shortForm: found.shortForm || "",
        description: found.description || "",
        status: found.status !== undefined ? found.status : true,
      });
    } else {
      router.push("/masters/branches");
    }
    setLoading(false);
  }, [targetId, router]);

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
    const list: Branch[] = stored ? JSON.parse(stored) : initialBranches;
    const updated: Branch = {
      id: targetId,
      courseId: form.courseId,
      name: form.name.trim(),
      shortForm: form.shortForm.trim(),
      description: form.description.trim(),
      status: form.status,
    };
    localStorage.setItem(BRANCHES_STORAGE_KEY, JSON.stringify(list.map(b => (b.id === targetId ? updated : b))));
    setToast("✓ Branch updated successfully");
    window.setTimeout(() => router.push("/masters/branches"), 1000);
  };

  const fieldClass = (field: keyof ValidationErrors) =>
    errors[field] ? "edit-user-input edit-user-input-error" : "edit-user-input";

  if (loading) return null;

  return (
    <div className="edit-user-page">
      {toast && <div className="edit-user-toast">{toast}</div>}

      <section className="edit-user-card" style={{ maxWidth: "600px", width: "100%" }}>
        <div className="edit-user-header" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "14px", marginBottom: "24px" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "white" }}>Modify Branch</h1>
        </div>

        <form className="edit-user-form">
          {/* Branch ID — read-only */}
          <div className="edit-user-row">
            <label htmlFor="branch-id">Branch ID</label>
            <div className="edit-user-field">
              <input
                id="branch-id"
                className="edit-user-input"
                type="text"
                value={form.id}
                disabled
                readOnly
                style={{ opacity: 0.6, cursor: "not-allowed" }}
              />
            </div>
          </div>

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

          {/* Status — standard checkbox like other edit pages */}
          <div className="edit-user-row">
            <label htmlFor="status">Status</label>
            <div className="edit-user-field" style={{ display: "flex", alignItems: "center", minHeight: "42px" }}>
              <label style={{ display: "flex", alignItems: "center", cursor: "pointer", gap: "10px" }}>
                <input
                  id="status"
                  type="checkbox"
                  className="edit-user-checkbox"
                  checked={form.status}
                  onChange={(e) => updateField("status", e.target.checked)}
                />
                <span className="checkbox-text">
                  {form.status ? "True (Active)" : "False (Inactive)"}
                </span>
              </label>
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
