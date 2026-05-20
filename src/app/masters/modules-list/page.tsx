"use client";

import React, { useState, useEffect } from "react";
import { Edit, Trash2, PlusSquare, CheckCircle, ArrowUpDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import API from "@/services/api";

type Module = {
  id: number;
  name: string;
  description: string;
  shortForm: string;
  status: boolean;
};

const initialData: Module[] = [
  { id: 1, name: "Learn", description: "Saral Vidhya", shortForm: "LRN", status: true },
  { id: 2, name: "Evaluate", description: "Saral Nirnayah", shortForm: "EVL", status: true },
  { id: 3, name: "Teach", description: "Saral Bhodhana", shortForm: "TCH", status: true },
  { id: 4, name: "Train", description: "Saral Shikshana", shortForm: "TRN", status: true },
  { id: 5, name: "Compete", description: "Saral Pratiyogita", shortForm: "CMP", status: true },
];

const storageKey = "masters-modules-list-v1";

export default function ModulesListPage() {
  const router = useRouter();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    console.log("Fetching modules from backend API /api/master/modules...");
    setLoading(true);
    setError(null);
    API.get("/api/master/modules")
      .then((res) => {
        console.log("Successfully fetched modules from backend:", res.data);
        if (Array.isArray(res.data)) {
          const mapped = res.data.map((m: any, idx: number) => ({
            id: typeof m.id === "number" ? m.id : parseInt(m.id ?? m.module_id ?? m.moduleId ?? (idx + 1), 10),
            name: String(m.name ?? m.module ?? "N/A"),
            description: String(m.description ?? ""),
            shortForm: String(m.shortForm ?? m.short_form ?? m.shortform ?? "N/A"),
            status: m.status === true || m.status === "Active" || m.status === "active" || m.status === 1 || String(m.status).toLowerCase() === "true"
          }));
          setModules(mapped);
        } else {
          console.warn("Unexpected modules response format, using local storage/placeholder fallback");
          const storedRows = localStorage.getItem(storageKey);
          setModules(storedRows ? JSON.parse(storedRows) : initialData);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Error fetching modules from backend, trying secondary endpoint /api/modules...", err);
        API.get("/api/modules")
          .then((res) => {
            if (Array.isArray(res.data)) {
              const mapped = res.data.map((m: any, idx: number) => ({
                id: typeof m.id === "number" ? m.id : parseInt(m.id ?? m.module_id ?? (idx + 1), 10),
                name: String(m.name ?? m.module ?? "N/A"),
                description: String(m.description ?? ""),
                shortForm: String(m.shortForm ?? m.short_form ?? "N/A"),
                status: m.status === true || m.status === "Active" || m.status === 1
              }));
              setModules(mapped);
              setLoading(false);
            } else {
              throw new Error("Invalid response format");
            }
          })
          .catch((err2) => {
            console.error("All module endpoints failed, using localStorage fallback:", err2);
            setError("Failed to load modules from backend API. Displaying offline data.");
            const storedRows = localStorage.getItem(storageKey);
            if (storedRows) {
              setModules(JSON.parse(storedRows));
            } else {
              setModules(initialData);
              localStorage.setItem(storageKey, JSON.stringify(initialData));
            }
            setLoading(false);
          });
      });
  }, []);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  const filteredModules = modules.filter((m) => {
    if (!search) return true;
    const lowerSearch = search.toLowerCase();
    return (
      m.id.toString().includes(lowerSearch) ||
      m.name.toLowerCase().includes(lowerSearch) ||
      m.description.toLowerCase().includes(lowerSearch) ||
      m.shortForm.toLowerCase().includes(lowerSearch) ||
      (m.status ? "true" : "false").includes(lowerSearch)
    );
  });

  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: "", show: false });

  const showToast = (message: string) => {
    setToast({ message, show: true });
    setTimeout(() => setToast({ message: "", show: false }), 3000);
  };

  const openDeleteModal = (module: Module) => {
    setSelectedModule(module);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedModule) {
      console.log(`Sending DELETE request for module ID: ${selectedModule.id}`);
      API.delete(`/api/master/modules/${selectedModule.id}`)
        .then((res) => {
          console.log(`Successfully deleted module ${selectedModule.id}:`, res.data);
          const nextModules = modules.filter((m) => m.id !== selectedModule.id);
          setModules(nextModules);
          localStorage.setItem(storageKey, JSON.stringify(nextModules));
          setIsDeleteModalOpen(false);
          setSelectedModule(null);
          showToast("✓ Module deleted successfully");
        })
        .catch((err) => {
          console.warn(`Failed to delete module on backend, trying /api/modules/${selectedModule.id}...`, err);
          API.delete(`/api/modules/${selectedModule.id}`)
            .then(() => {
              const nextModules = modules.filter((m) => m.id !== selectedModule.id);
              setModules(nextModules);
              localStorage.setItem(storageKey, JSON.stringify(nextModules));
              setIsDeleteModalOpen(false);
              setSelectedModule(null);
              showToast("✓ Module deleted successfully");
            })
            .catch((err2) => {
              console.error("Delete failed on both endpoints. Deleting locally.", err2);
              const nextModules = modules.filter((m) => m.id !== selectedModule.id);
              setModules(nextModules);
              localStorage.setItem(storageKey, JSON.stringify(nextModules));
              setIsDeleteModalOpen(false);
              setSelectedModule(null);
              showToast("✓ Module deleted locally");
            });
        });
    }
  };

  return (
    <div className="datatable-page" style={{ display: "flex", justifyContent: "center", padding: "24px" }}>
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
        
        .btn-cancel:hover {
          background: rgba(255,255,255,0.2);
        }

        .btn-confirm-delete {
          background: rgba(239, 68, 68, 0.9);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
        }

        .btn-confirm-delete:hover {
          background: #ef4444;
        }

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

      <div className="table-card" style={{ maxWidth: "1400px", width: "100%" }}>
        <div className="datatable-toolbar" style={{ justifyContent: "space-between" }}>
          <h1 className="text-2xl font-bold text-white">Modules List</h1>
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
              onClick={() => router.push('/masters/modules-list/add')}
            >
              <span className="btn-label">Add Modules</span>
            </button>
          </div>
        </div>

        <div className="datatable-shell">
          <table className="premium-table">
            <colgroup>
              <col className="w-[12%]" />
              <col className="w-[20%]" />
              <col className="w-[35%]" />
              <col className="w-[13%]" />
              <col className="w-[10%]" />
              <col className="w-[10%]" />
            </colgroup>
            <thead>
              <tr>
                {["ModuleID", "Module", "Description", "Short Form", "Status", "Action(s)"].map((column) => (
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
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                      <div className="spinner" style={{
                        width: "16px",
                        height: "16px",
                        border: "2px solid rgba(255,255,255,0.2)",
                        borderTopColor: "#fff",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite"
                      }}></div>
                      Loading modules...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-red-400" style={{ color: "#ef4444" }}>
                    {error}
                  </td>
                </tr>
              ) : filteredModules.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    Not found in the modules list
                  </td>
                </tr>
              ) : (
                filteredModules.map((m, index) => (
                  <tr
                    key={m.id}
                    className={index % 2 === 0 ? "bg-white/[0.01]" : ""}
                  >
                    <td><div className="datatable-cell text-center">{m.id}</div></td>
                    <td><div className="datatable-cell">{m.name}</div></td>
                    <td><div className="datatable-cell" style={{ whiteSpace: "normal" }}>{m.description}</div></td>
                    <td><div className="datatable-cell text-center">{m.shortForm}</div></td>
                    <td>
                      <div className="flex justify-center">
                        <span className="status-pill" data-status={m.status ? "Active" : "Inactive"} style={{
                          background: m.status ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                          borderColor: m.status ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)",
                          color: m.status ? "#4ade80" : "#f87171"
                        }}>
                          {m.status ? "TRUE" : "FALSE"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="datatable-actions justify-center">
                        <button
                          className="datatable-action"
                          type="button"
                          title="Edit module"
                          onClick={() => router.push(`/masters/modules-list/${m.id}/edit`)}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="datatable-action danger"
                          type="button"
                          title="Remove module"
                          onClick={() => openDeleteModal(m)}
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
                Are you sure you want to delete this module?
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
