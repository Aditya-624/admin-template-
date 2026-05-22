"use client";

import React, { useState, useEffect } from "react";
import { Edit, Trash2, ArrowUpDown, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Course,
  CourseType,
  COURSE_STORAGE_KEY,
  COURSE_TYPE_STORAGE_KEY,
  initialCourses,
  initialCourseTypes,
} from "@/lib/courses-data";

export default function CourseListPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseTypes, setCourseTypes] = useState<CourseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: "", show: false });

  useEffect(() => {
    setLoading(true);
    
    // Fetch Course Types
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

    // Fetch Courses
    const storedCourses = localStorage.getItem(COURSE_STORAGE_KEY);
    if (storedCourses) {
      try {
        setCourses(JSON.parse(storedCourses));
      } catch {
        setCourses(initialCourses);
      }
    } else {
      setCourses(initialCourses);
      localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(initialCourses));
    }
    
    setLoading(false);
  }, []);

  const getCourseTypeLabel = (typeId: number) => {
    const found = courseTypes.find((t) => t.id === typeId);
    return found ? `${found.id} - ${found.name}` : `${typeId} - Unknown`;
  };

  const filteredCourses = courses.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const typeLabel = getCourseTypeLabel(c.courseTypeId).toLowerCase();
    return (
      c.id.toString().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      typeLabel.includes(q) ||
      c.externals.toString().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      (c.status ? "true" : "false").includes(q)
    );
  });

  const showToast = (message: string) => {
    setToast({ message, show: true });
    setTimeout(() => setToast({ message: "", show: false }), 3000);
  };

  const openDeleteModal = (courseItem: Course) => {
    setSelectedCourse(courseItem);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedCourse) {
      const nextCourses = courses.filter((c) => c.id !== selectedCourse.id);
      setCourses(nextCourses);
      localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(nextCourses));
      setIsDeleteModalOpen(false);
      setSelectedCourse(null);
      showToast("✓ Course deleted successfully");
    }
  };

  return (
    <div className="datatable-page" style={{ display: "flex", justifyContent: "center", padding: "24px" }}>
      <style>{`
        .modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
          z-index: 50; display: flex; align-items: center; justify-content: center;
        }
        .modal-content {
          background: rgba(30, 36, 54, 0.95);
          backdrop-filter: blur(20px) saturate(150%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px; padding: 24px;
          width: 400px; max-width: 90vw;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        }
        .modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px; }
        .btn-cancel {
          background: rgba(255,255,255,0.1); color: white; border: none;
          padding: 8px 16px; border-radius: 8px; cursor: pointer;
        }
        .btn-cancel:hover { background: rgba(255,255,255,0.2); }
        .btn-confirm-delete {
          background: rgba(239, 68, 68, 0.9); color: white; border: none;
          padding: 8px 16px; border-radius: 8px; cursor: pointer;
        }
        .btn-confirm-delete:hover { background: #ef4444; }
        .toast {
          position: fixed; bottom: 24px; right: 24px;
          background: #22c55e; color: white; padding: 12px 24px;
          border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          font-weight: 500; z-index: 100;
          display: flex; align-items: center; gap: 8px;
        }
      `}</style>

      <div className="table-card" style={{ maxWidth: "1400px", width: "100%" }}>
        <div className="datatable-toolbar" style={{ justifyContent: "space-between" }}>
          <h1 className="text-2xl font-bold text-white">Course List</h1>
          <div className="flex items-center gap-4">
            <div className="datatable-search">
              <span>Search:</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button 
              className="add-btn-card" 
              onClick={() => router.push('/masters/courses/course/add')}
            >
              <span className="btn-label">Add Course</span>
            </button>
          </div>
        </div>

        <div className="datatable-shell">
          <table className="premium-table">
            <colgroup>
              <col className="w-[10%]" />
              <col className="w-[20%]" />
              <col className="w-[20%]" />
              <col className="w-[15%]" />
              <col className="w-[20%]" />
              <col className="w-[8%]" />
              <col className="w-[7%]" />
            </colgroup>
            <thead>
              <tr>
                {["Course ID", "ID / Course Type", "Course", "Number of Externals", "Description", "Status", "Action(s)"].map((column) => (
                  <th key={column}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate">{column}</span>
                      {column !== "Action(s)" && <ArrowUpDown className="sort-icon" />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    <div style={{ display: "flex", alignItems: "center", justifyItems: "center", gap: "8px", justifyContent: "center" }}>
                      <div style={{
                        width: "16px", height: "16px",
                        border: "2px solid rgba(255,255,255,0.2)", borderTopColor: "#fff",
                        borderRadius: "50%", animation: "spin 1s linear infinite"
                      }}></div>
                      Loading courses...
                    </div>
                  </td>
                </tr>
              ) : filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    Not found in the courses list
                  </td>
                </tr>
              ) : (
                filteredCourses.map((c, index) => (
                  <tr key={c.id} className={index % 2 === 0 ? "bg-white/[0.01]" : ""}>
                    <td><div className="datatable-cell text-center">{c.id}</div></td>
                    <td><div className="datatable-cell font-semibold text-white">{getCourseTypeLabel(c.courseTypeId)}</div></td>
                    <td><div className="datatable-cell font-semibold text-white">{c.name}</div></td>
                    <td><div className="datatable-cell text-center text-white">{c.externals}</div></td>
                    <td><div className="datatable-cell text-slate-300" style={{ whiteSpace: "normal" }}>{c.description}</div></td>
                    <td>
                      <div className="flex justify-center">
                        <span className="status-pill" style={{
                          background: c.status ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                          borderColor: c.status ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)",
                          color: c.status ? "#4ade80" : "#f87171"
                        }}>
                          {c.status ? "TRUE" : "FALSE"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="datatable-actions justify-center">
                        <button
                          className="datatable-action"
                          type="button"
                          title="Edit Course"
                          onClick={() => router.push(`/masters/courses/course/${c.id}/edit`)}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="datatable-action danger"
                          type="button"
                          title="Remove Course"
                          onClick={() => openDeleteModal(c)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="modal-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="modal-content"
              style={{ width: "320px", textAlign: "center" }}
            >
              <div style={{ marginBottom: "16px", color: "#f87171" }}>
                <Trash2 size={48} style={{ margin: "0 auto" }} />
              </div>
              <p style={{ marginBottom: "24px", color: "rgba(255,255,255,0.9)" }}>
                Are you sure you want to delete this course?
              </p>
              <div className="modal-actions" style={{ justifyItems: "center", justifyContent: "center" }}>
                <button className="btn-cancel" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                <button className="btn-confirm-delete" onClick={handleDeleteConfirm}>Confirm</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="toast"
          >
            <CheckCircle size={20} />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
