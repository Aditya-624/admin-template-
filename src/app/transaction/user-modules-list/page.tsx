"use client";

import React, { useState, useEffect } from "react";
import { Edit, Trash2, CheckCircle, ArrowUpDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import API from "@/services/api";

type UserModule = {
  id: number;
  userType: string;
  userName: string;
  module: string;
  description: string;
  status: boolean;
};

const initialData: UserModule[] = [
  { id: 1, userType: "1 - Super", userName: "1 - Vamsi", module: "1 - Learn", description: "Learn Module Access", status: true },
  { id: 2, userType: "1 - Super", userName: "1 - Vamsi", module: "2 - Evaluate", description: "Evaluate Module Access", status: true },
  { id: 3, userType: "4 - Expert", userName: "4 - KORA", module: "3 - Teach", description: "User can validate and approve course co", status: true },
  { id: 4, userType: "3 - Associate", userName: "5 - Raghu", module: "3 - Teach", description: "User can review Course Content", status: true },
  { id: 5, userType: "3 - Associate", userName: "6 - Mohan", module: "3 - Teach", description: "User can review Course Content", status: true },
  { id: 6, userType: "4 - Evaluator", userName: "7 - Krishna", module: "6 - Evaluate", description: "User can perform final evaluation", status: true },
];

const storageKey = "transaction-user-modules-list-v1";

export default function UserModulesListPage() {
  const router = useRouter();
  const [modules, setModules] = useState<UserModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<UserModule | null>(null);
  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: "", show: false });

  useEffect(() => {
    setLoading(true);
    setError(null);
    API.get("/api/user-modules")
      .then((res) => {
        if (Array.isArray(res.data)) {
          const mapped = res.data.map((um: Record<string, unknown>, idx: number) => ({
            id: typeof um.id === "number" ? um.id : parseInt(String(um.id ?? um.user_module_id ?? um.userModuleId ?? idx + 1), 10),
            userType: String(um.userType ?? um.user_type ?? "N/A"),
            userName: String(um.userName ?? um.user_name ?? "N/A"),
            module: String(um.module ?? um.module_name ?? "N/A"),
            description: String(um.description ?? ""),
            status:
              um.status === true ||
              um.status === "Active" ||
              um.status === 1 ||
              String(um.status).toLowerCase() === "true",
          }));
          setModules(mapped);
        } else {
          const storedRows = localStorage.getItem(storageKey);
          setModules(storedRows ? JSON.parse(storedRows) : initialData);
        }
        setLoading(false);
      })
      .catch(() => {
        const storedRows = localStorage.getItem(storageKey);
        setModules(storedRows ? JSON.parse(storedRows) : initialData);
        setLoading(false);
      });
  }, []);

  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const filteredModules = modules.filter((m) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      m.id.toString().includes(q) ||
      m.userType.toLowerCase().includes(q) ||
      m.userName.toLowerCase().includes(q) ||
      m.module.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      (m.status ? "true" : "false").includes(q)
    );
  });

  const sortedModules = React.useMemo(() => {
    const data = [...filteredModules];
    if (!sortColumn) return data;
    data.sort((a, b) => {
      let aVal = a[sortColumn as keyof UserModule];
      let bVal = b[sortColumn as keyof UserModule];
      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string ?? "").toLowerCase();
      }
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return data;
  }, [filteredModules, sortColumn, sortDirection]);

  const showToast = (message: string) => {
    setToast({ message, show: true });
    setTimeout(() => setToast({ message: "", show: false }), 3000);
  };

  const openDeleteModal = (record: UserModule) => {
    setSelectedModule(record);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedModule) return;

    API.delete(`/api/user-modules/${selectedModule.id}`)
      .then(() => {
        const next = modules.filter((m) => m.id !== selectedModule.id);
        setModules(next);
        localStorage.setItem(storageKey, JSON.stringify(next));
        setIsDeleteModalOpen(false);
        setSelectedModule(null);
        showToast("✓ Record deleted successfully");
      })
      .catch(() => {
        const next = modules.filter((m) => m.id !== selectedModule.id);
        setModules(next);
        localStorage.setItem(storageKey, JSON.stringify(next));
        setIsDeleteModalOpen(false);
        setSelectedModule(null);
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
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="table-card"
        style={{ maxWidth: "1500px", width: "100%" }}
      >
        <div className="datatable-toolbar" style={{ justifyContent: "space-between" }}>
          <h1 className="text-2xl font-bold text-white">User Modules List</h1>
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
              onClick={() => router.push("/transaction/user-modules-list/add")}
            >
              <span className="btn-label">Add User Module</span>
            </motion.button>
          </motion.div>
        </div>

        <div className="datatable-shell">
          <table className="premium-table">
            <colgroup>
              <col className="w-[10%]" />
              <col className="w-[16%]" />
              <col className="w-[16%]" />
              <col className="w-[16%]" />
              <col className="w-[22%]" />
              <col className="w-[8%]" />
              <col className="w-[12%]" />
            </colgroup>
            <thead>
              <tr>
                {[
                  { label: "User Module ID", key: "id" },
                  { label: "User Type ID / User Type", key: "userType" },
                  { label: "User ID / Name", key: "userName" },
                  { label: "Module ID / Module", key: "module" },
                  { label: "Description", key: "description" },
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
                  <td colSpan={7} className="text-center py-8 text-slate-400">
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
                      Loading user modules...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="text-center py-8" style={{ color: "#fbbf24" }}>
                    {error}
                  </td>
                </tr>
              ) : sortedModules.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    Not found in the list
                  </td>
                </tr>
              ) : (
                sortedModules.map((m, index) => (
                  <motion.tr
                    key={m.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.03 }}
                    className={index % 2 === 0 ? "bg-white/[0.01]" : ""}
                  >
                    <td>
                      <motion.div className="datatable-cell text-center" whileHover={{ scale: 1.02 }}>
                        {m.id}
                      </motion.div>
                    </td>
                    <td>
                      <div className="datatable-cell">{m.userType}</div>
                    </td>
                    <td>
                      <motion.div className="datatable-cell" whileHover={{ scale: 1.01 }}>
                        {m.userName}
                      </motion.div>
                    </td>
                    <td>
                      <div className="datatable-cell">{m.module}</div>
                    </td>
                    <td>
                      <motion.div className="datatable-cell" style={{ whiteSpace: "normal" }}>{m.description}</motion.div>
                    </td>
                    <td>
                      <div className="flex justify-center">
                        <motion.span
                          className="status-pill"
                          whileHover={{ scale: 1.05 }}
                          style={{
                            background: m.status ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                            borderColor: m.status ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)",
                            color: m.status ? "#4ade80" : "#f87171",
                          }}
                        >
                          {m.status ? "TRUE" : "FALSE"}
                        </motion.span>
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
                          onClick={() => router.push(`/transaction/user-modules-list/${m.id}/edit`)}
                        >
                          <Edit size={16} />
                        </motion.button>
                        <motion.button
                          className="datatable-action danger"
                          type="button"
                          title="Delete"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openDeleteModal(m)}
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
