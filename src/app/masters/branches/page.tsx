"use client";

import React, { useState, useEffect } from "react";
import { Edit, Trash2, ArrowUpDown, CheckCircle, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
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

export default function BranchListPage() {
  const router = useRouter();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: "", show: false });

  useEffect(() => {
    setLoading(true);
    
    // Fetch Courses (the source of truth for Course Dropdowns/Labels)
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

    // Fetch Branches
    const storedBranches = localStorage.getItem(BRANCHES_STORAGE_KEY);
    if (storedBranches) {
      try {
        setBranches(JSON.parse(storedBranches));
      } catch {
        setBranches(initialBranches);
      }
    } else {
      setBranches(initialBranches);
      localStorage.setItem(BRANCHES_STORAGE_KEY, JSON.stringify(initialBranches));
    }
    
    setLoading(false);
  }, []);

  const getCourseLabel = (courseId: number) => {
    const found = courses.find((c) => c.id === courseId);
    return found ? `${found.id} - ${found.name}` : `${courseId} - Unknown`;
  };

  const filteredBranches = branches.filter((b) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const courseLabel = getCourseLabel(b.courseId).toLowerCase();
    return (
      b.id.toString().includes(q) ||
      courseLabel.includes(q) ||
      b.name.toLowerCase().includes(q) ||
      b.shortForm.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q) ||
      (b.status ? "true" : "false").includes(q)
    );
  });

  const showToast = (message: string) => {
    setToast({ message, show: true });
    setTimeout(() => setToast({ message: "", show: false }), 3000);
  };

  const openDeleteModal = (branchItem: Branch) => {
    setSelectedBranch(branchItem);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedBranch) {
      const nextBranches = branches.filter((b) => b.id !== selectedBranch.id);
      setBranches(nextBranches);
      localStorage.setItem(BRANCHES_STORAGE_KEY, JSON.stringify(nextBranches));
      setIsDeleteModalOpen(false);
      setSelectedBranch(null);
      showToast("✓ Branch deleted successfully");
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
        .plus-btn-circular {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #70ad47, #5a8d38);
          border: none;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(112,173,71,0.3);
          transition: all 0.25s ease;
        }
        .plus-btn-circular:hover {
          transform: scale(1.08);
          box-shadow: 0 6px 16px rgba(112,173,71,0.45);
          background: linear-gradient(135deg, #7ec250, #619a3b);
        }
      `}</style>

      <div className="table-card" style={{ maxWidth: "1400px", width: "100%" }}>
        <div className="datatable-toolbar" style={{ justifyContent: "space-between" }}>
          <h1 className="text-2xl font-bold text-white">Branches List</h1>
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
              onClick={() => router.push('/masters/branches/add')}
            >
              <span className="btn-label">Add Branch</span>
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
                {["Branch ID", "ID / Course", "Branch", "ShortForm", "Description", "Status", "Action(s)"].map((column) => (
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
                      Loading branches...
                    </div>
                  </td>
                </tr>
              ) : filteredBranches.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    Not found in the branches list
                  </td>
                </tr>
              ) : (
                filteredBranches.map((b, index) => (
                  <tr key={b.id} className={index % 2 === 0 ? "bg-white/[0.01]" : ""}>
                    <td><div className="datatable-cell text-center">{b.id}</div></td>
                    <td><div className="datatable-cell font-semibold text-white">{getCourseLabel(b.courseId)}</div></td>
                    <td><div className="datatable-cell font-semibold text-white">{b.name}</div></td>
                    <td><div className="datatable-cell text-center text-white">{b.shortForm}</div></td>
                    <td><div className="datatable-cell text-slate-300" style={{ whiteSpace: "normal" }}>{b.description || "-"}</div></td>
                    <td>
                      <div className="flex justify-center">
                        <span className="status-pill" style={{
                          background: b.status ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                          borderColor: b.status ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)",
                          color: b.status ? "#4ade80" : "#f87171"
                        }}>
                          {b.status ? "TRUE" : "FALSE"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="datatable-actions justify-center">
                        <button
                          className="datatable-action"
                          type="button"
                          title="Edit Branch"
                          onClick={() => router.push(`/masters/branches/${b.id}/edit`)}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="datatable-action danger"
                          type="button"
                          title="Remove Branch"
                          onClick={() => openDeleteModal(b)}
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
                Are you sure you want to delete this branch?
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
