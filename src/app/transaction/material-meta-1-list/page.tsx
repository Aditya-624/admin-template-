"use client";

import React, { useState, useEffect } from "react";
import { Edit, Trash2, CheckCircle, ArrowUpDown, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import API from "@/services/api";
import { mockMaterialMeta1Records, MaterialMeta1 } from "./mockData";

const storageKey = "transaction-material-meta-1-v1";

export default function MaterialMeta1ListPage() {
  const router = useRouter();
  const [records, setRecords] = useState<MaterialMeta1[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MaterialMeta1 | null>(null);
  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: "", show: false });

  // Sorting state
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    setLoading(true);
    setError(null);
    API.get("/api/material-meta-1")
      .then((res) => {
        if (Array.isArray(res.data)) {
          const mapped = res.data.map((item: any, idx: number) => ({
            id: typeof item.id === "number" ? item.id : parseInt(String(item.id ?? item.material_meta_id ?? idx + 1), 10),
            courseId: String(item.courseId ?? item.course_id ?? "1"),
            courseName: String(item.courseName ?? item.course_name ?? "B. Tech."),
            branchId: String(item.branchId ?? item.branch_id ?? "5"),
            branchName: String(item.branchName ?? item.branch_name ?? "CSE"),
            subjectId: String(item.subjectId ?? item.subject_id ?? "1"),
            subjectName: String(item.subjectName ?? item.subject_name ?? "C Language"),
            subjectShortForm: String(item.subjectShortForm ?? item.subject_short_form ?? "C"),
            materialTypeId: String(item.materialTypeId ?? item.material_type_id ?? "3"),
            materialTypeName: String(item.materialTypeName ?? item.material_type_name ?? "Question Paper"),
            year: String(item.year ?? "1st Year"),
            semester: String(item.semester ?? "1"),
            chaptersCount: typeof item.chaptersCount === "number" ? item.chaptersCount : parseInt(String(item.chaptersCount ?? "5"), 10),
            description: String(item.description ?? ""),
            status: item.status === undefined || item.status === true || item.status === "Active" || item.status === 1 || String(item.status).toLowerCase() === "true",
          }));
          setRecords(mapped);
          localStorage.setItem(storageKey, JSON.stringify(mapped));
        } else {
          loadFromLocalStorage();
        }
        setLoading(false);
      })
      .catch(() => {
        loadFromLocalStorage();
        setLoading(false);
      });
  }, []);

  const loadFromLocalStorage = () => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        setRecords(JSON.parse(stored));
      } catch {
        setRecords(mockMaterialMeta1Records);
        localStorage.setItem(storageKey, JSON.stringify(mockMaterialMeta1Records));
      }
    } else {
      setRecords(mockMaterialMeta1Records);
      localStorage.setItem(storageKey, JSON.stringify(mockMaterialMeta1Records));
    }
  };

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const filteredRecords = records.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.id.toString().includes(q) ||
      `${r.materialTypeId} - ${r.materialTypeName}`.toLowerCase().includes(q) ||
      `${r.subjectId} - ${r.subjectName}`.toLowerCase().includes(q) ||
      `${r.courseId} - ${r.courseName}`.toLowerCase().includes(q) ||
      `${r.branchId} - ${r.branchName}`.toLowerCase().includes(q) ||
      r.year.toLowerCase().includes(q) ||
      r.semester.toLowerCase().includes(q) ||
      r.chaptersCount.toString().includes(q) ||
      (r.status ? "true" : "false").includes(q)
    );
  });

  const sortedRecords = React.useMemo(() => {
    const data = [...filteredRecords];
    if (!sortColumn) return data;
    data.sort((a, b) => {
      let aVal = a[sortColumn as keyof MaterialMeta1];
      let bVal = b[sortColumn as keyof MaterialMeta1];
      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string ?? "").toLowerCase();
      }
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return data;
  }, [filteredRecords, sortColumn, sortDirection]);

  const showToast = (message: string) => {
    setToast({ message, show: true });
    setTimeout(() => setToast({ message: "", show: false }), 3000);
  };

  const openDeleteModal = (record: MaterialMeta1) => {
    setSelectedRecord(record);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedRecord) return;

    API.delete(`/api/material-meta-1/${selectedRecord.id}`)
      .then(() => {
        const next = records.filter((r) => r.id !== selectedRecord.id);
        setRecords(next);
        localStorage.setItem(storageKey, JSON.stringify(next));
        setIsDeleteModalOpen(false);
        setSelectedRecord(null);
        showToast("✓ Record deleted successfully");
      })
      .catch(() => {
        const next = records.filter((r) => r.id !== selectedRecord.id);
        setRecords(next);
        localStorage.setItem(storageKey, JSON.stringify(next));
        setIsDeleteModalOpen(false);
        setSelectedRecord(null);
        showToast("✓ Record deleted locally");
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="datatable-page"
      style={{ display: "flex", justifyContent: "center", padding: "24px" }}
    >
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal-content {
          background: rgba(30, 36, 54, 0.95);
          backdrop-filter: blur(20px) saturate(150%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 24px;
          width: 400px;
          max-width: 90vw;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 20px;
        }
        .btn-cancel {
          background: rgba(255,255,255,0.1);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
        }
        .btn-cancel:hover { background: rgba(255,255,255,0.2); }
        .btn-confirm-delete {
          background: rgba(239, 68, 68, 0.9);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
        }
        .btn-confirm-delete:hover { background: #ef4444; }
        .toast {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background: #22c55e;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          font-weight: 500;
          z-index: 100;
          display: flex;
          align-items: center;
          gap: 8px;
        }

      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="table-card"
        style={{ maxWidth: "1500px", width: "100%" }}
      >
        <div className="datatable-toolbar" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <h1 className="text-2xl font-bold text-white">Material Meta List</h1>
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex items-center gap-4"
          >
            <motion.div
              className="datatable-search"
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <span>Search:</span>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
            </motion.div>
            
            <motion.button
              type="button"
              className="add-btn-card"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/transaction/material-meta-1-list/add")}
            >
              <span className="btn-label">Add Material Meta</span>
            </motion.button>
          </motion.div>
        </div>

        <div className="datatable-shell">
          <table className="premium-table">
            <colgroup>
              <col className="w-[10%]" />
              <col className="w-[15%]" />
              <col className="w-[15%]" />
              <col className="w-[12%]" />
              <col className="w-[12%]" />
              <col className="w-[8%]" />
              <col className="w-[8%]" />
              <col className="w-[10%]" />
              <col className="w-[8%]" />
              <col className="w-[12%]" />
            </colgroup>
            <thead>
              <tr>
                {[
                  { label: "Material Meta ID", key: "id" },
                  { label: "ID / Material Type", key: "materialTypeName" },
                  { label: "ID / Subject ID", key: "subjectName" },
                  { label: "ID / Course", key: "courseName" },
                  { label: "ID / Branch", key: "branchName" },
                  { label: "Semester", key: "semester" },
                  { label: "Year", key: "year" },
                  { label: "Chapters Count", key: "chaptersCount" },
                  { label: "Status", key: "status" },
                  { label: "Action(s)", key: null }
                ].map((col) => (
                  <th key={col.label} onClick={() => col.key && handleSort(col.key)} style={{ cursor: col.key ? "pointer" : "default", userSelect: "none" }}>
                    <motion.div
                      className="flex items-center justify-between gap-3"
                      whileHover={col.key ? { x: 2 } : undefined}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
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
                    </motion.div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="text-center py-8 text-slate-400">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        style={{
                          width: "16px",
                          height: "16px",
                          border: "2px solid rgba(255,255,255,0.2)",
                          borderTopColor: "#fff",
                          borderRadius: "50%",
                        }}
                      />
                      Loading material meta records...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={10} className="text-center py-8" style={{ color: "#fbbf24" }}>
                    {error}
                  </td>
                </tr>
              ) : sortedRecords.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-8 text-slate-400">
                    No material metadata found
                  </td>
                </tr>
              ) : (
                sortedRecords.map((r, index) => (
                  <motion.tr
                    key={r.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.03 }}
                    className={index % 2 === 0 ? "bg-white/[0.01]" : ""}
                  >
                    <td>
                      <div className="datatable-cell text-center font-bold">
                        {r.id}
                      </div>
                    </td>
                    <td>
                      <div className="datatable-cell">{r.materialTypeId} - {r.materialTypeName}</div>
                    </td>
                    <td>
                      <div className="datatable-cell">{r.subjectId} - {r.subjectName}</div>
                    </td>
                    <td>
                      <div className="datatable-cell">{r.courseId} - {r.courseName}</div>
                    </td>
                    <td>
                      <div className="datatable-cell">{r.branchId} - {r.branchName}</div>
                    </td>
                    <td>
                      <div className="datatable-cell text-center">{r.semester}</div>
                    </td>
                    <td>
                      <div className="datatable-cell text-center">{r.year}</div>
                    </td>
                    <td>
                      <div className="datatable-cell text-center">{r.chaptersCount}</div>
                    </td>
                    <td>
                      <div className="flex justify-center">
                        <span
                          className="status-pill"
                          style={{
                            background: r.status ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                            borderColor: r.status ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)",
                            color: r.status ? "#4ade80" : "#f87171",
                          }}
                        >
                          {r.status ? "TRUE" : "FALSE"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="datatable-actions justify-center">
                        <motion.button
                          className="datatable-action"
                          type="button"
                          title="Edit"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => router.push(`/transaction/material-meta-1-list/${r.id}/edit`)}
                        >
                          <Edit size={16} />
                        </motion.button>
                        <motion.button
                          className="datatable-action danger"
                          type="button"
                          title="Delete"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openDeleteModal(r)}
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="modal-content"
              style={{ width: "360px", textAlign: "center" }}
            >
              <div style={{ marginBottom: "16px", color: "#f87171" }}>
                <Trash2 size={48} style={{ margin: "0 auto" }} />
              </div>
              <p style={{ marginBottom: "24px", color: "rgba(255,255,255,0.9)" }}>
                Do you really want to delete?
              </p>
              <motion.div className="modal-actions" style={{ justifyContent: "center" }}>
                <motion.button className="btn-cancel" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setIsDeleteModalOpen(false)}>
                  No
                </motion.button>
                <motion.button className="btn-confirm-delete" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleDeleteConfirm}>
                  Yes
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
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
    </motion.div>
  );
}
