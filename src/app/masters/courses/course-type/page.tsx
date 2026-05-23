"use client";

import React, { useState, useEffect } from "react";
import { Edit, Trash2, ArrowUpDown, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  CourseType,
  COURSE_TYPE_STORAGE_KEY,
  initialCourseTypes,
} from "@/lib/courses-data";

export default function CourseTypeListPage() {
  const router = useRouter();
  const [courseTypes, setCourseTypes] = useState<CourseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<CourseType | null>(null);
  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: "", show: false });

  useEffect(() => {
    setLoading(true);
    const stored = localStorage.getItem(COURSE_TYPE_STORAGE_KEY);
    if (stored) {
      try {
        setCourseTypes(JSON.parse(stored));
      } catch {
        setCourseTypes(initialCourseTypes);
      }
    } else {
      setCourseTypes(initialCourseTypes);
      localStorage.setItem(COURSE_TYPE_STORAGE_KEY, JSON.stringify(initialCourseTypes));
    }
    setLoading(false);
  }, []);

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const filteredTypes = courseTypes.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.id.toString().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      (p.shortForm || "").toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.status ? "true" : "false").includes(q)
    );
  });

  const sortedTypes = React.useMemo(() => {
    const data = [...filteredTypes];
    if (!sortColumn) return data;
    data.sort((a, b) => {
      let aVal = a[sortColumn as keyof CourseType];
      let bVal = b[sortColumn as keyof CourseType];
      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string ?? "").toLowerCase();
      }
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return data;
  }, [filteredTypes, sortColumn, sortDirection]);

  const showToast = (message: string) => {
    setToast({ message, show: true });
    setTimeout(() => setToast({ message: "", show: false }), 3000);
  };

  const openDeleteModal = (typeItem: CourseType) => {
    setSelectedType(typeItem);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedType) {
      const nextTypes = courseTypes.filter((p) => p.id !== selectedType.id);
      setCourseTypes(nextTypes);
      localStorage.setItem(COURSE_TYPE_STORAGE_KEY, JSON.stringify(nextTypes));
      setIsDeleteModalOpen(false);
      setSelectedType(null);
      showToast("✓ Course Type deleted successfully");
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
          <h1 className="text-2xl font-bold text-white">Course Types List</h1>
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
              onClick={() => router.push('/masters/courses/course-type/add')}
            >
              <span className="btn-label">Add Course Type</span>
            </button>
          </div>
        </div>

        <div className="datatable-shell">
          <table className="premium-table">
            <colgroup>
              <col className="w-[12%]" />
              <col className="w-[20%]" />
              <col className="w-[15%]" />
              <col className="w-[33%]" />
              <col className="w-[10%]" />
              <col className="w-[10%]" />
            </colgroup>
            <thead>
              <tr>
                {[
                  { label: "Course Type ID", key: "id" },
                  { label: "Course Type", key: "name" },
                  { label: "Short Form", key: "shortForm" },
                  { label: "Description", key: "description" },
                  { label: "Status", key: "status" },
                  { label: "Action(s)", key: null }
                ].map((col) => (
                  <th
                    key={col.label}
                    onClick={() => col.key && handleSort(col.key)}
                    style={{ cursor: col.key ? "pointer" : "default", userSelect: "none" }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate">{col.label}</span>
                      {col.key && (
                        <ArrowUpDown
                          className="sort-icon"
                          style={{
                            color: sortColumn === col.key ? "var(--table-accent)" : "rgba(255,255,255,0.3)",
                            opacity: sortColumn === col.key ? 1 : 0.6,
                            transition: "all 0.2s"
                          }}
                          size={14}
                        />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    <div style={{ display: "flex", alignItems: "center", justifyItems: "center", gap: "8px", justifyContent: "center" }}>
                      <div style={{
                        width: "16px", height: "16px",
                        border: "2px solid rgba(255,255,255,0.2)", borderTopColor: "#fff",
                        borderRadius: "50%", animation: "spin 1s linear infinite"
                      }}></div>
                      Loading course types...
                    </div>
                  </td>
                </tr>
              ) : sortedTypes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    Not found in the course types list
                  </td>
                </tr>
              ) : (
                sortedTypes.map((p, index) => (
                  <tr 
                    key={p.id} 
                    className={index % 2 === 0 ? "bg-white/[0.01]" : ""}
                    style={!p.status ? { opacity: 0.5, filter: "grayscale(100%)" } : undefined}
                  >
                    <td><div className="datatable-cell text-center">{p.id}</div></td>
                    <td><div className="datatable-cell font-semibold text-white">{p.name}</div></td>
                    <td><div className="datatable-cell font-semibold text-white">{p.shortForm}</div></td>
                    <td><div className="datatable-cell text-slate-300" style={{ whiteSpace: "normal" }}>{p.description}</div></td>
                    <td>
                      <div className="flex justify-center">
                        <span className="status-pill" style={{
                          background: p.status ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                          borderColor: p.status ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)",
                          color: p.status ? "#4ade80" : "#f87171"
                        }}>
                          {p.status ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="datatable-actions justify-center">
                        <button
                          className="datatable-action"
                          type="button"
                          title="Edit Course Type"
                          onClick={() => router.push(`/masters/courses/course-type/${p.id}/edit`)}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="datatable-action danger"
                          type="button"
                          title="Remove Course Type"
                          onClick={() => openDeleteModal(p)}
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
                Are you sure you want to delete this course type?
              </p>
              <div className="modal-actions" style={{ justifyContent: "center" }}>
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
