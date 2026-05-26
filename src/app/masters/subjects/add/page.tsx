"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import API from "@/services/api";
import { mockSubjects, Subject } from "@/app/masters/subjects/mockData";

const storageKey = "edtech_subjects_v1";

type CourseOption = {
  id: string;
  name: string;
};

type BranchOption = {
  id: string;
  name: string;
  courseId: string;
};

export default function AddSubjectPage() {
  const router = useRouter();

  // Options states
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [branches, setBranches] = useState<BranchOption[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [branchesLoading, setBranchesLoading] = useState(true);

  // Form state
  const [courseId, setCourseId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [shortForm, setShortForm] = useState("");
  const [chaptersCount, setChaptersCount] = useState("10");
  const [internalMarks, setInternalMarks] = useState("");
  const [internalPassMark, setInternalPassMark] = useState("");
  const [externalMarks, setExternalMarks] = useState("");
  const [externalPassMark, setExternalPassMark] = useState("");
  const [description, setDescription] = useState("");

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState("");

  // Fetch Courses and Branches
  useEffect(() => {
    setCoursesLoading(true);
    API.get("/api/master/courses")
      .then((res) => {
        const rawData = res.data;
        const data = Array.isArray(rawData) ? rawData : (rawData && Array.isArray(rawData.data) ? rawData.data : []);
        const mapped = data.map((c: any, idx: number) => ({
          id: String(c.id ?? c.course_id ?? c.courseId ?? (idx + 1)),
          name: String(c.name ?? c.course ?? c.courseName ?? "N/A"),
        }));
        setCourses(mapped);
        setCoursesLoading(false);
      })
      .catch((err) => {
        console.warn("Error fetching courses, using fallback:", err);
        setCourses([
          { id: "1", name: "B. Tech." },
          { id: "2", name: "M. Tech." },
        ]);
        setCoursesLoading(false);
      });

    setBranchesLoading(true);
    API.get("/api/master/branches")
      .then((res) => {
        const rawData = res.data;
        const data = Array.isArray(rawData) ? rawData : (rawData && Array.isArray(rawData.data) ? rawData.data : []);
        const mapped = data.map((b: any, idx: number) => ({
          id: String(b.id ?? b.branch_id ?? b.branchId ?? (idx + 1)),
          name: String(b.name ?? b.branch ?? b.branchName ?? "N/A"),
          courseId: String(b.courseId ?? b.course_id ?? "1"),
        }));
        setBranches(mapped);
        setBranchesLoading(false);
      })
      .catch((err) => {
        console.warn("Error fetching branches, using fallback:", err);
        setBranches([
          { id: "1", name: "ECE", courseId: "1" },
          { id: "2", name: "EEE", courseId: "1" },
          { id: "3", name: "ME", courseId: "1" },
          { id: "4", name: "CE", courseId: "1" },
          { id: "5", name: "CSE", courseId: "1" },
          { id: "6", name: "CSE-DS", courseId: "2" },
        ]);
        setBranchesLoading(false);
      });
  }, []);

  // Filter branches based on selected course
  const filteredBranches = branches.filter((b) => !courseId || b.courseId === courseId);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    // 1. Mandatory Fields
    if (!courseId) newErrors.course = "Required";
    if (!branchId) newErrors.branch = "Required";
    if (!year.trim()) newErrors.year = "Required";
    if (!semester.trim()) newErrors.semester = "Required";
    if (!subjectName.trim()) newErrors.subjectName = "Required";
    if (!shortForm.trim()) newErrors.shortForm = "Required";
    if (!chaptersCount.trim()) newErrors.chaptersCount = "Required";
    if (!internalMarks.trim()) newErrors.internalMarks = "Required";
    if (!internalPassMark.trim()) newErrors.internalPassMark = "Required";
    if (!externalMarks.trim()) newErrors.externalMarks = "Required";
    if (!externalPassMark.trim()) newErrors.externalPassMark = "Required";

    // 2. Numeric Checks
    const numChapters = Number(chaptersCount);
    if (chaptersCount && (isNaN(numChapters) || numChapters < 0)) {
      newErrors.chaptersCount = "Must be positive";
    }
    const numIntMarks = Number(internalMarks);
    if (internalMarks && (isNaN(numIntMarks) || numIntMarks < 0)) {
      newErrors.internalMarks = "Must be positive";
    }
    const numIntPass = Number(internalPassMark);
    if (internalPassMark && (isNaN(numIntPass) || numIntPass < 0)) {
      newErrors.internalPassMark = "Must be positive";
    }
    const numExtMarks = Number(externalMarks);
    if (externalMarks && (isNaN(numExtMarks) || numExtMarks < 0)) {
      newErrors.externalMarks = "Must be positive";
    }
    const numExtPass = Number(externalPassMark);
    if (externalPassMark && (isNaN(numExtPass) || numExtPass < 0)) {
      newErrors.externalPassMark = "Must be positive";
    }

    // 3. Uniqueness check (Rule 2: within the specified branch only)
    if (branchId && subjectName.trim()) {
      const stored = localStorage.getItem(storageKey);
      const currentSubjects: Subject[] = stored ? JSON.parse(stored) : mockSubjects;
      const isDuplicate = currentSubjects.some(
        (sub) =>
          sub.branchId === branchId &&
          sub.name.toLowerCase().trim() === subjectName.toLowerCase().trim()
      );
      if (isDuplicate) {
        newErrors.subjectName = "Subject already exists in branch";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      setToast("✗ Please fix validation errors");
      window.setTimeout(() => setToast(""), 3000);
      return;
    }

    const selectedCourseObj = courses.find((c) => c.id === courseId);
    const selectedBranchObj = branches.find((b) => b.id === branchId);

    const stored = localStorage.getItem(storageKey);
    const currentSubjects: Subject[] = stored ? JSON.parse(stored) : mockSubjects;

    // Find next ID
    let maxId = 0;
    currentSubjects.forEach((s) => {
      const num = parseInt(s.id, 10);
      if (!isNaN(num) && num > maxId) maxId = num;
    });
    const newId = String(maxId + 1);

    const newSubject: Subject = {
      id: newId,
      courseId,
      courseName: selectedCourseObj ? selectedCourseObj.name : "N/A",
      branchId,
      branchName: selectedBranchObj ? selectedBranchObj.name : "N/A",
      year: year.trim(),
      semester: semester.trim(),
      name: subjectName.trim(),
      shortForm: shortForm.trim(),
      chaptersCount: Number(chaptersCount),
      internalMarks: Number(internalMarks),
      internalPassMark: Number(internalPassMark),
      externalMarks: Number(externalMarks),
      externalPassMark: Number(externalPassMark),
      description: description.trim(),
      status: true,
    };

    // Call POST API if available
    const payload = {
      CourseId: parseInt(courseId, 10),
      BranchId: parseInt(branchId, 10),
      Year: year.trim(),
      Semester: semester.trim(),
      SubjectName: subjectName.trim(),
      ShortForm: shortForm.trim(),
      ChaptersCount: Number(chaptersCount),
      InternalMarks: Number(internalMarks),
      InternalPassMark: Number(internalPassMark),
      ExternalMarks: Number(externalMarks),
      ExternalPassMark: Number(externalPassMark),
      Description: description.trim(),
      Status: true,
    };

    console.log("Saving subject payload to backend API:", payload);

    API.post("/api/master/subjects", payload)
      .then((res) => {
        console.log("Successfully created subject in backend DB:", res.data);
        setToast("✓ Subject created successfully");
      })
      .catch((err) => {
        console.warn("Backend POST /api/master/subjects failed, saved to local storage:", err);
        setToast("✓ Subject saved locally (backend offline)");
      })
      .finally(() => {
        // Save to local storage for UI consistency
        const updatedSubjects = [newSubject, ...currentSubjects];
        localStorage.setItem(storageKey, JSON.stringify(updatedSubjects));

        window.setTimeout(() => {
          router.push("/masters/subjects");
        }, 1200);
      });
  };

  const fieldClass = (field: string) =>
    errors[field] ? "edit-user-input edit-user-input-error" : "edit-user-input";

  return (
    <div className="edit-user-page">
      {toast && (
        <div className={`edit-user-toast ${toast.startsWith("✗") ? "bg-red-500/90" : "bg-emerald-500/90"}`} style={{
          position: "fixed",
          top: "24px",
          right: "24px",
          padding: "12px 24px",
          borderRadius: "8px",
          color: "#fff",
          zIndex: 9999,
          backdropFilter: "blur(8px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
        }}>
          {toast}
        </div>
      )}

      <section className="edit-user-card wide-card" style={{ maxWidth: "1200px", width: "100%" }}>
        <div className="edit-user-header">
          <h1>
            <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Plus size={24} /> Create Subject
            </span>
          </h1>
        </div>

        {/* 3-Column layout matching other edit/add pages in master module */}
        <form className="form-three-col" onSubmit={(e) => e.preventDefault()}>
          
          {/* Column 1 */}
          <div className="form-col">
            <div className="edit-user-row compact">
              <label htmlFor="course-select">Course *</label>
              <div className="edit-user-field">
                {coursesLoading ? (
                  <div className="edit-user-input" style={{ opacity: 0.7 }}>Loading...</div>
                ) : (
                  <select
                    id="course-select"
                    className={fieldClass("course")}
                    value={courseId}
                    onChange={(e) => {
                      setCourseId(e.target.value);
                      setBranchId(""); // Reset branch if course changes
                      if (errors.course) setErrors(prev => ({ ...prev, course: "" }));
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
              <label htmlFor="year-input">Year *</label>
              <div className="edit-user-field">
                <input
                  id="year-input"
                  type="text"
                  className={fieldClass("year")}
                  placeholder="<Enter Year>"
                  value={year}
                  onChange={(e) => {
                    setYear(e.target.value);
                    if (errors.year) setErrors(prev => ({ ...prev, year: "" }));
                  }}
                />
                {errors.year && <p className="edit-user-error">{errors.year}</p>}
              </div>
            </div>

            <div className="edit-user-row compact">
              <label htmlFor="subject-input">Subject *</label>
              <div className="edit-user-field">
                <input
                  id="subject-input"
                  type="text"
                  className={fieldClass("subjectName")}
                  placeholder="<Enter Subject Name>"
                  value={subjectName}
                  onChange={(e) => {
                    setSubjectName(e.target.value);
                    if (errors.subjectName) setErrors(prev => ({ ...prev, subjectName: "" }));
                  }}
                />
                {errors.subjectName && <p className="edit-user-error">{errors.subjectName}</p>}
              </div>
            </div>

            <div className="edit-user-row compact">
              <label htmlFor="chapters-input">Chapters *</label>
              <div className="edit-user-field">
                <input
                  id="chapters-input"
                  type="text"
                  className={fieldClass("chaptersCount")}
                  value={chaptersCount}
                  onChange={(e) => {
                    setChaptersCount(e.target.value.replace(/\D/g, ""));
                    if (errors.chaptersCount) setErrors(prev => ({ ...prev, chaptersCount: "" }));
                  }}
                />
                {errors.chaptersCount && <p className="edit-user-error">{errors.chaptersCount}</p>}
              </div>
            </div>
          </div>

          {/* Column 2 */}
          <div className="form-col">
            <div className="edit-user-row compact">
              <label htmlFor="branch-select">Branch *</label>
              <div className="edit-user-field">
                {branchesLoading ? (
                  <div className="edit-user-input" style={{ opacity: 0.7 }}>Loading...</div>
                ) : (
                  <select
                    id="branch-select"
                    className={fieldClass("branch")}
                    value={branchId}
                    onChange={(e) => {
                      setBranchId(e.target.value);
                      if (errors.branch) setErrors(prev => ({ ...prev, branch: "" }));
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
              <label htmlFor="semester-input">Semester *</label>
              <div className="edit-user-field">
                <input
                  id="semester-input"
                  type="text"
                  className={fieldClass("semester")}
                  placeholder="<Enter Semester>"
                  value={semester}
                  onChange={(e) => {
                    setSemester(e.target.value);
                    if (errors.semester) setErrors(prev => ({ ...prev, semester: "" }));
                  }}
                />
                {errors.semester && <p className="edit-user-error">{errors.semester}</p>}
              </div>
            </div>

            <div className="edit-user-row compact">
              <label htmlFor="short-form-input">Short Form *</label>
              <div className="edit-user-field">
                <input
                  id="short-form-input"
                  type="text"
                  className={fieldClass("shortForm")}
                  placeholder="<Enter Short Form>"
                  value={shortForm}
                  onChange={(e) => {
                    setShortForm(e.target.value);
                    if (errors.shortForm) setErrors(prev => ({ ...prev, shortForm: "" }));
                  }}
                />
                {errors.shortForm && <p className="edit-user-error">{errors.shortForm}</p>}
              </div>
            </div>

            <div className="edit-user-row compact">
              <label htmlFor="internal-marks-input">Internal *</label>
              <div className="edit-user-field">
                <input
                  id="internal-marks-input"
                  type="text"
                  className={fieldClass("internalMarks")}
                  placeholder="<Internal Marks>"
                  value={internalMarks}
                  onChange={(e) => {
                    setInternalMarks(e.target.value.replace(/\D/g, ""));
                    if (errors.internalMarks) setErrors(prev => ({ ...prev, internalMarks: "" }));
                  }}
                />
                {errors.internalMarks && <p className="edit-user-error">{errors.internalMarks}</p>}
              </div>
            </div>
          </div>

          {/* Column 3 */}
          <div className="form-col">
            <div className="edit-user-row compact">
              <label htmlFor="internal-pass-input">Int Pass *</label>
              <div className="edit-user-field">
                <input
                  id="internal-pass-input"
                  type="text"
                  className={fieldClass("internalPassMark")}
                  placeholder="<Pass Mark>"
                  value={internalPassMark}
                  onChange={(e) => {
                    setInternalPassMark(e.target.value.replace(/\D/g, ""));
                    if (errors.internalPassMark) setErrors(prev => ({ ...prev, internalPassMark: "" }));
                  }}
                />
                {errors.internalPassMark && <p className="edit-user-error">{errors.internalPassMark}</p>}
              </div>
            </div>

            <div className="edit-user-row compact">
              <label htmlFor="external-marks-input">External *</label>
              <div className="edit-user-field">
                <input
                  id="external-marks-input"
                  type="text"
                  className={fieldClass("externalMarks")}
                  placeholder="<External Marks>"
                  value={externalMarks}
                  onChange={(e) => {
                    setExternalMarks(e.target.value.replace(/\D/g, ""));
                    if (errors.externalMarks) setErrors(prev => ({ ...prev, externalMarks: "" }));
                  }}
                />
                {errors.externalMarks && <p className="edit-user-error">{errors.externalMarks}</p>}
              </div>
            </div>

            <div className="edit-user-row compact">
              <label htmlFor="external-pass-input">Ext Pass *</label>
              <div className="edit-user-field">
                <input
                  id="external-pass-input"
                  type="text"
                  className={fieldClass("externalPassMark")}
                  placeholder="<Pass Mark>"
                  value={externalPassMark}
                  onChange={(e) => {
                    setExternalPassMark(e.target.value.replace(/\D/g, ""));
                    if (errors.externalPassMark) setErrors(prev => ({ ...prev, externalPassMark: "" }));
                  }}
                />
                {errors.externalPassMark && <p className="edit-user-error">{errors.externalPassMark}</p>}
              </div>
            </div>

            <div className="edit-user-row compact">
              <label htmlFor="description-input">Description</label>
              <div className="edit-user-field">
                <textarea
                  id="description-input"
                  className="edit-user-input"
                  placeholder="<Description about Subject>"
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ minHeight: "40px", resize: "vertical" }}
                />
              </div>
            </div>
          </div>

          {/* Form Actions Row - Spans full width of three columns */}
          <div className="edit-user-actions form-actions-row">
            <Link href="/masters/subjects" className="edit-user-cancel">
              Cancel
            </Link>
            <button type="button" className="edit-user-update" onClick={handleSave}>
              Submit
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
