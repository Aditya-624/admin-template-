"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import API from "@/services/api";
import { MaterialMeta1 } from "../mockData";

const storageKey = "transaction-material-meta-1-v1";

type CourseOption = { id: string; name: string };
type BranchOption = { id: string; name: string; courseId: string };
type SubjectOption = { id: string; courseId: string; branchId: string; name: string; shortForm: string };
type MaterialTypeOption = { id: string; name: string };

export default function AddMaterialMeta1Page() {
  const router = useRouter();

  // Master options states
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [branches, setBranches] = useState<BranchOption[]>([]);
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [materialTypes, setMaterialTypes] = useState<MaterialTypeOption[]>([]);

  // Loading states
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingMaterialTypes, setLoadingMaterialTypes] = useState(true);

  // Form states
  const [courseId, setCourseId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [subjectShortForm, setSubjectShortForm] = useState("");
  const [materialTypeId, setMaterialTypeId] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [chaptersCount, setChaptersCount] = useState("");
  const [description, setDescription] = useState("");

  // Validation & feedback states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState("");

  // Fetch Courses
  useEffect(() => {
    setLoadingCourses(true);
    API.get("/api/master/courses")
      .then((res) => {
        const rawData = res.data;
        const data = Array.isArray(rawData) ? rawData : (rawData && Array.isArray(rawData.data) ? rawData.data : []);
        const mapped = data.map((c: any, idx: number) => ({
          id: String(c.id ?? c.course_id ?? c.courseId ?? (idx + 1)),
          name: String(c.name ?? c.course ?? c.courseName ?? "N/A"),
        }));
        setCourses(mapped.length ? mapped : [{ id: "1", name: "B. Tech." }, { id: "2", name: "M. Tech." }]);
      })
      .catch(() => {
        setCourses([
          { id: "1", name: "B. Tech." },
          { id: "2", name: "M. Tech." },
        ]);
      })
      .finally(() => setLoadingCourses(false));

    // Fetch Branches
    setLoadingBranches(true);
    API.get("/api/master/branches")
      .then((res) => {
        const rawData = res.data;
        const data = Array.isArray(rawData) ? rawData : (rawData && Array.isArray(rawData.data) ? rawData.data : []);
        const mapped = data.map((b: any, idx: number) => ({
          id: String(b.id ?? b.branch_id ?? b.branchId ?? (idx + 1)),
          name: String(b.name ?? b.branch ?? b.branchName ?? "N/A"),
          courseId: String(b.courseId ?? b.course_id ?? "1"),
        }));
        setBranches(mapped.length ? mapped : [
          { id: "1", name: "ECE", courseId: "1" },
          { id: "2", name: "EEE", courseId: "1" },
          { id: "3", name: "ME", courseId: "1" },
          { id: "4", name: "CE", courseId: "1" },
          { id: "5", name: "CSE", courseId: "1" },
          { id: "6", name: "CSE-DS", courseId: "2" },
        ]);
      })
      .catch(() => {
        setBranches([
          { id: "1", name: "ECE", courseId: "1" },
          { id: "2", name: "EEE", courseId: "1" },
          { id: "3", name: "ME", courseId: "1" },
          { id: "4", name: "CE", courseId: "1" },
          { id: "5", name: "CSE", courseId: "1" },
          { id: "6", name: "CSE-DS", courseId: "2" },
        ]);
      })
      .finally(() => setLoadingBranches(false));

    // Fetch Subjects
    setLoadingSubjects(true);
    API.get("/api/master/subjects")
      .then((res) => {
        const rawData = res.data;
        const data = Array.isArray(rawData) ? rawData : (rawData && Array.isArray(rawData.data) ? rawData.data : []);
        const mapped = data.map((s: any, idx: number) => ({
          id: String(s.id ?? s.subject_id ?? s.subjectId ?? (idx + 1)),
          courseId: String(s.courseId ?? s.course_id ?? "1"),
          branchId: String(s.branchId ?? s.branch_id ?? "5"),
          name: String(s.name ?? s.subjectName ?? "N/A"),
          shortForm: String(s.shortForm ?? s.subjectShortForm ?? s.short_form ?? "N/A"),
        }));
        setSubjects(mapped.length ? mapped : [
          { id: "1", courseId: "1", branchId: "5", name: "C Language", shortForm: "C" },
          { id: "2", courseId: "1", branchId: "5", name: "Software Engineering", shortForm: "SE" },
          { id: "3", courseId: "1", branchId: "1", name: "Computer Networks", shortForm: "CN" },
          { id: "4", courseId: "1", branchId: "1", name: "Data Science", shortForm: "DS" },
        ]);
      })
      .catch(() => {
        setSubjects([
          { id: "1", courseId: "1", branchId: "5", name: "C Language", shortForm: "C" },
          { id: "2", courseId: "1", branchId: "5", name: "Software Engineering", shortForm: "SE" },
          { id: "3", courseId: "1", branchId: "1", name: "Computer Networks", shortForm: "CN" },
          { id: "4", courseId: "1", branchId: "1", name: "Data Science", shortForm: "DS" },
        ]);
      })
      .finally(() => setLoadingSubjects(false));

    // Fetch Material Types
    setLoadingMaterialTypes(true);
    API.get("/api/master/material-types")
      .then((res) => {
        const rawData = res.data;
        const data = Array.isArray(rawData) ? rawData : (rawData && Array.isArray(rawData.data) ? rawData.data : []);
        const mapped = data.map((t: any, idx: number) => ({
          id: String(t.id ?? t.material_type_id ?? t.materialTypeId ?? (idx + 1)),
          name: String(t.name ?? t.materialTypeName ?? t.material_type_name ?? "N/A"),
        }));
        setMaterialTypes(mapped.length ? mapped : [
          { id: "1", name: "Syllabus" },
          { id: "2", name: "Course Material" },
          { id: "3", name: "Question Paper" },
          { id: "4", name: "Key" },
          { id: "5", name: "Scheme of Validation" },
          { id: "6", name: "Answer Sheet" },
        ]);
      })
      .catch(() => {
        setMaterialTypes([
          { id: "1", name: "Syllabus" },
          { id: "2", name: "Course Material" },
          { id: "3", name: "Question Paper" },
          { id: "4", name: "Key" },
          { id: "5", name: "Scheme of Validation" },
          { id: "6", name: "Answer Sheet" },
        ]);
      })
      .finally(() => setLoadingMaterialTypes(false));
  }, []);

  // Filter branches by selected Course
  const filteredBranches = branches.filter((b) => !courseId || b.courseId === courseId);

  // Filter subjects by selected Course and Branch
  const filteredSubjects = subjects.filter(
    (s) => (!courseId || s.courseId === courseId) && (!branchId || s.branchId === branchId)
  );

  // Auto-fill Short Form when Subject changes
  useEffect(() => {
    if (!subjectId) {
      setSubjectShortForm("");
      return;
    }
    const matched = subjects.find((s) => s.id === subjectId);
    if (matched) {
      setSubjectShortForm(matched.shortForm);
    }
  }, [subjectId, subjects]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!courseId) newErrors.course = "Course is required";
    if (!branchId) newErrors.branch = "Branch is required";
    if (!subjectId) newErrors.subject = "Subject is required";
    if (!materialTypeId) newErrors.materialType = "Material Type is required";
    if (!year.trim()) newErrors.year = "Year is required";
    if (!semester.trim()) newErrors.semester = "Semester is required";

    const numChapters = Number(chaptersCount);
    if (chaptersCount && (isNaN(numChapters) || numChapters < 0)) {
      newErrors.chaptersCount = "Chapters count must be positive";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      setToast("✗ Please fix validation errors");
      setTimeout(() => setToast(""), 3000);
      return;
    }

    const selectedCourseObj = courses.find((c) => c.id === courseId);
    const selectedBranchObj = branches.find((b) => b.id === branchId);
    const selectedSubjectObj = subjects.find((s) => s.id === subjectId);
    const selectedMaterialTypeObj = materialTypes.find((t) => t.id === materialTypeId);

    const stored = localStorage.getItem(storageKey);
    const currentList: MaterialMeta1[] = stored ? JSON.parse(stored) : [];

    let maxId = 0;
    currentList.forEach((r) => {
      if (r.id > maxId) maxId = r.id;
    });

    const newRecord: MaterialMeta1 = {
      id: maxId + 1,
      courseId,
      courseName: selectedCourseObj ? selectedCourseObj.name : "N/A",
      branchId,
      branchName: selectedBranchObj ? selectedBranchObj.name : "N/A",
      subjectId,
      subjectName: selectedSubjectObj ? selectedSubjectObj.name : "N/A",
      subjectShortForm,
      materialTypeId,
      materialTypeName: selectedMaterialTypeObj ? selectedMaterialTypeObj.name : "N/A",
      year: year.trim(),
      semester: semester.trim(),
      chaptersCount: chaptersCount ? Number(chaptersCount) : 0,
      description: description.trim(),
      status: true,
    };

    const payload = {
      CourseId: parseInt(courseId, 10),
      BranchId: parseInt(branchId, 10),
      SubjectId: parseInt(subjectId, 10),
      MaterialTypeId: parseInt(materialTypeId, 10),
      Year: year.trim(),
      Semester: semester.trim(),
      ChaptersCount: chaptersCount ? Number(chaptersCount) : 0,
      Description: description.trim(),
      Status: true,
    };

    API.post("/api/material-meta-1", payload)
      .then(() => {
        setToast("✓ Material Meta created successfully");
      })
      .catch(() => {
        setToast("✓ Material Meta saved locally (backend offline)");
      })
      .finally(() => {
        const nextList = [newRecord, ...currentList];
        localStorage.setItem(storageKey, JSON.stringify(nextList));
        setTimeout(() => router.push("/transaction/material-meta-1-list"), 1200);
      });
  };

  const fieldClass = (field: string) =>
    errors[field] ? "edit-user-input edit-user-input-error" : "edit-user-input";

  return (
    <div className="edit-user-page">
      {toast && (
        <div
          className={`edit-user-toast ${toast.startsWith("✗") ? "bg-red-500/90" : "bg-emerald-500/90"}`}
          style={{
            position: "fixed",
            top: "24px",
            right: "24px",
            padding: "12px 24px",
            borderRadius: "8px",
            color: "#fff",
            zIndex: 9999,
            backdropFilter: "blur(8px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          {toast}
        </div>
      )}

      <section className="edit-user-card wide-card" style={{ maxWidth: "1100px", width: "100%" }}>
        <div className="edit-user-header">
          <h1>
            <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Plus size={24} /> New Material Meta
            </span>
          </h1>
        </div>

        <form className="form-two-col" onSubmit={(e) => e.preventDefault()}>
          {/* Column 1 */}
          <div className="form-col">
            <div className="edit-user-row compact">
              <label htmlFor="course-select">Course *</label>
              <div className="edit-user-field">
                {loadingCourses ? (
                  <div className="edit-user-input" style={{ opacity: 0.7 }}>Loading...</div>
                ) : (
                  <select
                    id="course-select"
                    className={fieldClass("course")}
                    value={courseId}
                    onChange={(e) => {
                      setCourseId(e.target.value);
                      setBranchId("");
                      setSubjectId("");
                      setSubjectShortForm("");
                      if (errors.course) setErrors((prev) => ({ ...prev, course: "" }));
                    }}
                  >
                    <option value="">Select</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                )}
                {errors.course && <p className="edit-user-error">{errors.course}</p>}
              </div>
            </div>

            <div className="edit-user-row compact">
              <label htmlFor="subject-select">Subject *</label>
              <div className="edit-user-field">
                {loadingSubjects ? (
                  <div className="edit-user-input" style={{ opacity: 0.7 }}>Loading...</div>
                ) : (
                  <select
                    id="subject-select"
                    className={fieldClass("subject")}
                    value={subjectId}
                    onChange={(e) => {
                      setSubjectId(e.target.value);
                      if (errors.subject) setErrors((prev) => ({ ...prev, subject: "" }));
                    }}
                    disabled={!branchId}
                  >
                    <option value="">Select</option>
                    {filteredSubjects.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                )}
                {errors.subject && <p className="edit-user-error">{errors.subject}</p>}
              </div>
            </div>

            <div className="edit-user-row compact">
              <label htmlFor="material-type-select">Material Type *</label>
              <div className="edit-user-field">
                {loadingMaterialTypes ? (
                  <div className="edit-user-input" style={{ opacity: 0.7 }}>Loading...</div>
                ) : (
                  <select
                    id="material-type-select"
                    className={fieldClass("materialType")}
                    value={materialTypeId}
                    onChange={(e) => {
                      setMaterialTypeId(e.target.value);
                      if (errors.materialType) setErrors((prev) => ({ ...prev, materialType: "" }));
                    }}
                  >
                    <option value="">Select</option>
                    {materialTypes.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                )}
                {errors.materialType && <p className="edit-user-error">{errors.materialType}</p>}
              </div>
            </div>

            <div className="edit-user-row compact">
              <label htmlFor="semester-input">Semester *</label>
              <div className="edit-user-field">
                <input
                  id="semester-input"
                  type="text"
                  className={fieldClass("semester")}
                  placeholder="<Enter Semester of the Subject>"
                  value={semester}
                  onChange={(e) => {
                    setSemester(e.target.value);
                    if (errors.semester) setErrors((prev) => ({ ...prev, semester: "" }));
                  }}
                />
                {errors.semester && <p className="edit-user-error">{errors.semester}</p>}
              </div>
            </div>

            <div className="edit-user-row compact">
              <label htmlFor="description-input">Description</label>
              <div className="edit-user-field">
                <textarea
                  id="description-input"
                  className="edit-user-input"
                  placeholder="<Enter Description about Material Meta>"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ minHeight: "80px", resize: "vertical" }}
                />
              </div>
            </div>
          </div>

          {/* Column 2 */}
          <div className="form-col">
            <div className="edit-user-row compact">
              <label htmlFor="branch-select">Branch *</label>
              <div className="edit-user-field">
                {loadingBranches ? (
                  <div className="edit-user-input" style={{ opacity: 0.7 }}>Loading...</div>
                ) : (
                  <select
                    id="branch-select"
                    className={fieldClass("branch")}
                    value={branchId}
                    onChange={(e) => {
                      setBranchId(e.target.value);
                      setSubjectId("");
                      setSubjectShortForm("");
                      if (errors.branch) setErrors((prev) => ({ ...prev, branch: "" }));
                    }}
                    disabled={!courseId}
                  >
                    <option value="">Select</option>
                    {filteredBranches.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                )}
                {errors.branch && <p className="edit-user-error">{errors.branch}</p>}
              </div>
            </div>

            <div className="edit-user-row compact">
              <label htmlFor="short-form-input">Subject Short Form</label>
              <div className="edit-user-field">
                <input
                  id="short-form-input"
                  type="text"
                  className="edit-user-input"
                  value={subjectShortForm}
                  disabled
                  placeholder="PPS"
                  style={{ background: "rgba(255, 255, 255, 0.08)", color: "rgba(255,255,255,0.6)" }}
                />
              </div>
            </div>

            <div className="edit-user-row compact">
              <label htmlFor="year-input">Year *</label>
              <div className="edit-user-field">
                <input
                  id="year-input"
                  type="text"
                  className={fieldClass("year")}
                  placeholder="<Enter Year of the Subject>"
                  value={year}
                  onChange={(e) => {
                    setYear(e.target.value);
                    if (errors.year) setErrors((prev) => ({ ...prev, year: "" }));
                  }}
                />
                {errors.year && <p className="edit-user-error">{errors.year}</p>}
              </div>
            </div>

            <div className="edit-user-row compact">
              <label htmlFor="chapters-input">Chapters Count</label>
              <div className="edit-user-field">
                <input
                  id="chapters-input"
                  type="text"
                  className={fieldClass("chaptersCount")}
                  placeholder="5"
                  value={chaptersCount}
                  onChange={(e) => {
                    setChaptersCount(e.target.value.replace(/\D/g, ""));
                    if (errors.chaptersCount) setErrors((prev) => ({ ...prev, chaptersCount: "" }));
                  }}
                />
                {errors.chaptersCount && <p className="edit-user-error">{errors.chaptersCount}</p>}
              </div>
            </div>
          </div>

          {/* Form Actions Row */}
          <div className="edit-user-actions form-actions-row">
            <Link href="/transaction/material-meta-1-list" className="edit-user-cancel">
              Cancel
            </Link>
            <button
              type="button"
              className="edit-user-update"
              style={{ background: "#22c55e", boxShadow: "0 4px 12px rgba(34, 197, 94, 0.2)" }}
              onClick={handleSave}
            >
              Submit
            </button>
          </div>
        </form>
      </section>

      <style>{`
        .form-two-col {
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
          gap: 20px 48px !important;
          align-items: start !important;
        }
        .form-two-col .form-col {
          display: flex !important;
          flex-direction: column !important;
          gap: 18px !important;
        }
        .form-two-col .edit-user-row,
        .form-two-col .form-col .edit-user-row {
          display: grid !important;
          grid-template-columns: 150px 1fr !important;
          gap: 14px 16px !important;
          align-items: start !important;
          margin-bottom: 0 !important;
        }
        .form-two-col .edit-user-row label,
        .form-two-col .form-col .edit-user-row label {
          padding-top: 10px !important;
          font-size: 0.9rem !important;
          line-height: 1.4 !important;
          min-width: 0 !important;
          width: auto !important;
          color: rgba(255, 255, 255, 0.7) !important;
        }
        [data-bg="light"] .form-two-col .edit-user-row label,
        [data-bg="light"] .form-two-col .form-col .edit-user-row label {
          color: #0f172a !important;
          font-weight: 600 !important;
        }
        .form-two-col .edit-user-row textarea,
        .form-two-col .edit-user-row input,
        .form-two-col .edit-user-row select,
        .form-two-col .form-col .edit-user-row textarea,
        .form-two-col .form-col .edit-user-row input,
        .form-two-col .form-col .edit-user-row select {
          padding: 10px 14px !important;
          font-size: 0.9rem !important;
        }
        .form-two-col .edit-user-row input,
        .form-two-col .edit-user-row select,
        .form-two-col .form-col .edit-user-row input,
        .form-two-col .form-col .edit-user-row select {
          height: 40px !important;
        }
        .form-two-col .edit-user-row textarea,
        .form-two-col .form-col .edit-user-row textarea {
          min-height: 72px !important;
        }
        .form-two-col .form-full-width {
          grid-column: 1 / -1 !important;
          margin-top: 4px !important;
        }
        .form-two-col .form-actions-row {
          grid-column: 1 / -1 !important;
          margin-top: 16px !important;
          padding-top: 8px !important;
        }
        @media (max-width: 768px) {
          .form-two-col {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .form-two-col .edit-user-row,
          .form-two-col .form-col .edit-user-row {
            grid-template-columns: 1fr !important;
            gap: 6px !important;
          }
          .form-two-col .edit-user-row label,
          .form-two-col .form-col .edit-user-row label {
            padding-top: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
