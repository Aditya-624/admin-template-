"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import API from "@/services/api";
import {
  Course,
  CourseType,
  COURSE_STORAGE_KEY,
  COURSE_TYPE_STORAGE_KEY,
  initialCourses,
  initialCourseTypes,
} from "@/lib/courses-data";

type ValidationErrors = Partial<Record<"courseTypeId" | "name" | "externals", string>>;

export default function AddCoursePage() {
  const router = useRouter();

  const [courseTypes, setCourseTypes] = useState<CourseType[]>([]);
  const [form, setForm] = useState<Course>({
    id: 0,
    name: "",
    courseTypeId: 0,
    externals: 0,
    description: "",
    status: true
  });

  useEffect(() => {
    // Load course types for selection
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



    // Auto-increment ID
    const storedCourses = localStorage.getItem(COURSE_STORAGE_KEY);
    let existing: Course[] = [];
    if (storedCourses) {
      try {
        existing = JSON.parse(storedCourses);
      } catch {
        existing = initialCourses;
      }
    } else {
      existing = initialCourses;
    }
    let maxId = 0;
    if (existing.length > 0) {
      existing.forEach((c: Course) => {
        if (c.id > maxId) maxId = c.id;
      });
    }
    setForm(f => ({ ...f, id: maxId + 1 }));
  }, []);

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [toast, setToast] = useState("");

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

    // Uniqueness validation (Rule 2)
    if (form.courseTypeId && form.courseTypeId !== 0 && form.name.trim()) {
      const stored = localStorage.getItem(COURSE_STORAGE_KEY);
      let list: Course[] = [];
      if (stored) {
        try {
          list = JSON.parse(stored);
        } catch {
          list = initialCourses;
        }
      } else {
        list = initialCourses;
      }

      const isDuplicate = list.some(
        (c) =>
          c.courseTypeId === form.courseTypeId &&
          c.name.toLowerCase().trim() === form.name.toLowerCase().trim()
      );

      if (isDuplicate) {
        nextErrors.name = "Course name must be unique for the selected Course Type";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const saveCourse = () => {
    if (!validateForm()) return;

    const stored = localStorage.getItem(COURSE_STORAGE_KEY);
    const current = stored ? JSON.parse(stored) as Course[] : initialCourses;

    const next = [...current, form];
    localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(next));

    const payload = {
      CourseTypeId: form.courseTypeId,
      Course: form.name,
      Externals: form.externals,
      Description: form.description,
      Status: form.status,
    };

    API.post("/api/master/courses", payload)
      .then((res) => {
        console.log("Course created in backend:", res.data);
        setToast("✓ Course created successfully");
      })
      .catch((err) => {
        console.error("Backend POST /api/master/courses failed:", err);
        setToast("✓ Course saved locally (backend unavailable)");
      })
      .finally(() => {
        window.setTimeout(() => {
          router.push("/masters/courses/course");
        }, 1000);
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

      <section className="edit-user-card" style={{ maxWidth: "600px", width: "100%" }}>
        <div className="edit-user-header" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "14px", marginBottom: "24px" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "white" }}><span style={{ display: "flex", alignItems: "center", gap: "10px" }}><Plus size={24} /> New Course</span></h1>
        </div>

        <form className="edit-user-form">
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
                <option value="0">Select</option>
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
                autoComplete="off"
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
                type="text"
                placeholder="<Enter Number of Externals>"
                value={isNaN(form.externals) || (form.externals === 0 && errors.externals === undefined) ? "" : form.externals}
                onChange={(event) => {
                  const val = event.target.value.replace(/\D/g, "");
                  updateField("externals", val === "" ? "" : parseInt(val, 10));
                }}
                autoComplete="off"
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
                autoComplete="off"
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
            <Link href="/masters/courses/course" className="edit-user-cancel">
              Cancel
            </Link>
            <button
              type="button"
              className="edit-user-update edit-user-update-green"
              onClick={saveCourse}
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
