"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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

    // Default to the first type if available
    if (types.length > 0) {
      setForm(f => ({ ...f, courseTypeId: types[0].id }));
    }

    // Auto-increment ID
    const storedCourses = localStorage.getItem(COURSE_STORAGE_KEY);
    const existing: Course[] = storedCourses ? JSON.parse(storedCourses) : initialCourses;
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
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const saveCourse = () => {
    if (!validateForm()) return;

    const stored = localStorage.getItem(COURSE_STORAGE_KEY);
    const current = stored ? JSON.parse(stored) as Course[] : initialCourses;
    
    const next = [...current, form];
    localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(next));
    setToast("✓ Course created successfully");

    window.setTimeout(() => {
      router.push("/masters/courses/course");
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
          <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "white" }}>New Course</h1>
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
                value={form.externals === 0 && errors.externals === undefined ? "" : form.externals}
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
