"use client";

import React, { useState, useEffect } from "react";
import { Edit, Trash2, PlusSquare, CheckCircle, ArrowUpDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import API from "@/services/api";

type UserTypeItem = {
  id: number;
  name: string;
  description: string;
  status: boolean;
};

const initialData: UserTypeItem[] = [
  { id: 1, name: "Super", description: "User can upload Syllabus", status: true },
  { id: 2, name: "Admin", description: "User can review Syllabus", status: true },
  { id: 3, name: "Associate", description: "User can Approval Syllabus", status: true },
  { id: 4, name: "Expert", description: "User can upload Course", status: true },
  { id: 5, name: "ClientAdmin", description: "User can review Course", status: true },
  { id: 6, name: "Evaluator", description: "User can Aoorive Course", status: true },
  { id: 7, name: "Student", description: "User can Aoorive Course", status: true },
];

const storageKey = "masters-usertype-list-v1";

export default function UserTypeListPage() {
  const router = useRouter();
  const [userTypes, setUserTypes] = useState<UserTypeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Fetching user types from backend API /api/master/user-types...");
    setLoading(true);
    setError(null);
    API.get("/api/master/user-types")
      .then((res) => {
        console.log("Successfully fetched user types from backend:", res.data);
        if (Array.isArray(res.data)) {
          const mapped = res.data.map((ut: any, idx: number) => ({
            id: typeof ut.id === "number" ? ut.id : parseInt(ut.id ?? ut.user_type_id ?? ut.userTypeId ?? (idx + 1), 10),
            name: String(ut.name ?? ut.user_type ?? ut.userType ?? "N/A"),
            description: String(ut.description ?? ""),
            status: ut.status === true || ut.status === "Active" || ut.status === "active" || ut.status === 1 || String(ut.status).toLowerCase() === "true"
          }));
          setUserTypes(mapped);
        } else {
          console.warn("Unexpected user types response format, using local storage/placeholder fallback");
          const storedRows = localStorage.getItem(storageKey);
          setUserTypes(storedRows ? JSON.parse(storedRows) : initialData);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user types from backend:", err);
        setError("Failed to load user types from backend API. Displaying offline data.");
        const storedRows = localStorage.getItem(storageKey);
        setUserTypes(storedRows ? JSON.parse(storedRows) : initialData);
        setLoading(false);
      });
  }, []);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState<UserTypeItem | null>(null);

  const [search, setSearch] = useState("");

  const filteredUserTypes = userTypes.filter((p) => {
    if (!search) return true;
    const lowerSearch = search.toLowerCase();
    return (
      p.id.toString().includes(lowerSearch) ||
      p.name.toLowerCase().includes(lowerSearch) ||
      p.description.toLowerCase().includes(lowerSearch) ||
      (p.status ? "true" : "false").includes(lowerSearch)
    );
  });

  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: "", show: false });

  const showToast = (message: string) => {
    setToast({ message, show: true });
    setTimeout(() => setToast({ message: "", show: false }), 3000);
  };

  const openDeleteModal = (userType: UserTypeItem) => {
    setSelectedUserType(userType);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedUserType) {
      console.log(`Sending DELETE request for user type ID: ${selectedUserType.id}`);
      API.delete(`/api/master/user-types/${selectedUserType.id}`)
        .then((res) => {
          console.log(`Successfully deleted user type ${selectedUserType.id}:`, res.data);
          const nextTypes = userTypes.filter((p) => p.id !== selectedUserType.id);
          setUserTypes(nextTypes);
          localStorage.setItem(storageKey, JSON.stringify(nextTypes));
          setIsDeleteModalOpen(false);
          setSelectedUserType(null);
          showToast("✓ User Type deleted successfully");
        })
        .catch((err) => {
          console.error(`Error deleting user type ${selectedUserType.id}:`, err);
          alert("Failed to delete user type on backend. Deleting from offline list.");
          const nextTypes = userTypes.filter((p) => p.id !== selectedUserType.id);
          setUserTypes(nextTypes);
          localStorage.setItem(storageKey, JSON.stringify(nextTypes));
          setIsDeleteModalOpen(false);
          setSelectedUserType(null);
          showToast("✓ User Type deleted locally");
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
          <h1 className="text-2xl font-bold text-white">User Types List</h1>
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
              onClick={() => router.push('/masters/usertype-list/add')}
            >
              <span className="btn-label">Add User Type</span>
            </button>
          </div>
        </div>

        <div className="datatable-shell">
          <table className="premium-table">
            <colgroup>
              <col className="w-[12%]" />
              <col className="w-[20%]" />
              <col className="w-[45%]" />
              <col className="w-[13%]" />
              <col className="w-[10%]" />
            </colgroup>
            <thead>
              <tr>
                {["UserTypeID", "UserType", "Description", "Status", "Action(s)"].map((column) => (
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
                  <td colSpan={5} className="text-center py-8 text-slate-400">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                      <div className="spinner" style={{
                        width: "16px",
                        height: "16px",
                        border: "2px solid rgba(255,255,255,0.2)",
                        borderTopColor: "#fff",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite"
                      }}></div>
                      Loading user types...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-red-400" style={{ color: "#ef4444" }}>
                    {error}
                  </td>
                </tr>
              ) : filteredUserTypes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400">
                    Not found in the user type list
                  </td>
                </tr>
              ) : (
                filteredUserTypes.map((p, index) => (
                  <tr
                    key={p.id}
                    className={index % 2 === 0 ? "bg-white/[0.01]" : ""}
                  >
                    <td><div className="datatable-cell text-center">{p.id}</div></td>
                    <td><div className="datatable-cell">{p.name}</div></td>
                    <td><div className="datatable-cell" style={{ whiteSpace: "normal" }}>{p.description}</div></td>
                    <td>
                      <div className="flex justify-center">
                        <span className="status-pill" data-status={p.status ? "Active" : "Inactive"} style={{
                          background: p.status ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                          borderColor: p.status ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)",
                          color: p.status ? "#4ade80" : "#f87171"
                        }}>
                          {p.status ? "TRUE" : "FALSE"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="datatable-actions justify-center">
                        <button
                          className="datatable-action"
                          type="button"
                          title="Edit User Type"
                          onClick={() => router.push(`/masters/usertype-list/${p.id}/edit`)}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="datatable-action danger"
                          type="button"
                          title="Remove User Type"
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
                Are you sure you want to delete this user type?
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
