"use client";

import React, { useState, useEffect } from "react";
import { Edit, Trash2, PlusSquare, CheckCircle, ArrowUpDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

type UserAccessPrivilege = {
  id: number;
  userType: string;
  userName: string;
  privilege: string;
  description: string;
  status: boolean;
};

const initialData: UserAccessPrivilege[] = [
  { id: 1, userType: "1 - Super", userName: "1 - Vamsi", privilege: "1 - SyllabusUpload", description: "User can upload Syllabus", status: true },
  { id: 2, userType: "1 - Super", userName: "1 - Vamsi", privilege: "2 - SyllabusReview", description: "User can review Syllabus", status: true },
  { id: 3, userType: "4 - Expert", userName: "4 - Venu", privilege: "3 - SyllabusApproval", description: "User can Approval Syllabus", status: true },
  { id: 4, userType: "3 - Associate", userName: "3 - Sameer", privilege: "4 - CourseUpload", description: "User can upload Course", status: true },
  { id: 5, userType: "3 - Associate", userName: "3 - Sameer", privilege: "5 - CourseReview", description: "User can review Course", status: true },
  { id: 6, userType: "4 - Expert", userName: "4 - Venu", privilege: "6 - SyllabusApproval", description: "User can Aoorive Course", status: true },
];

const storageKey = "transaction-user-access-privileges-v1";

export default function UserAccessPrivilegesListPage() {
  const router = useRouter();
  const [privileges, setPrivileges] = useState<UserAccessPrivilege[]>([]);

  useEffect(() => {
    const storedRows = localStorage.getItem(storageKey);
    if (storedRows) {
      setPrivileges(JSON.parse(storedRows));
    } else {
      setPrivileges(initialData);
      localStorage.setItem(storageKey, JSON.stringify(initialData));
    }
  }, []);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPrivilege, setSelectedPrivilege] = useState<UserAccessPrivilege | null>(null);

  const [search, setSearch] = useState("");

  const filteredPrivileges = privileges.filter((p) => {
    if (!search) return true;
    const lowerSearch = search.toLowerCase();
    return (
      p.id.toString().includes(lowerSearch) ||
      p.userType.toLowerCase().includes(lowerSearch) ||
      p.userName.toLowerCase().includes(lowerSearch) ||
      p.privilege.toLowerCase().includes(lowerSearch) ||
      p.description.toLowerCase().includes(lowerSearch) ||
      (p.status ? "true" : "false").includes(lowerSearch)
    );
  });

  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: "", show: false });

  const showToast = (message: string) => {
    setToast({ message, show: true });
    setTimeout(() => setToast({ message: "", show: false }), 3000);
  };

  const openDeleteModal = (privilege: UserAccessPrivilege) => {
    setSelectedPrivilege(privilege);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedPrivilege) {
      const nextPrivileges = privileges.filter((p) => p.id !== selectedPrivilege.id);
      setPrivileges(nextPrivileges);
      localStorage.setItem(storageKey, JSON.stringify(nextPrivileges));
      setIsDeleteModalOpen(false);
      setSelectedPrivilege(null);
      showToast("✓ Record deleted successfully");
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

      <div className="table-card" style={{ maxWidth: "1500px", width: "100%" }}>
        <div className="datatable-toolbar" style={{ justifyContent: "space-between" }}>
          <h1 className="text-2xl font-bold text-white">User Access Privileges List</h1>
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
              onClick={() => router.push('/transaction/user-access-privileges-list/add')}
            >
              <span className="btn-label">Add Privilege Access</span>
            </button>
          </div>
        </div>

        <div className="datatable-shell">
          <table className="premium-table">
            <colgroup>
              <col className="w-[12%]" />
              <col className="w-[16%]" />
              <col className="w-[16%]" />
              <col className="w-[18%]" />
              <col className="w-[20%]" />
              <col className="w-[8%]" />
              <col className="w-[10%]" />
            </colgroup>
            <thead>
              <tr>
                {[
                  "User Access Privilege ID", 
                  "User Type ID / User Type", 
                  "User ID / Name", 
                  "PrivilegeID / Privilege", 
                  "Description", 
                  "Status", 
                  "Action(s)"
                ].map((column) => (
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
              {filteredPrivileges.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    Not found in the list
                  </td>
                </tr>
              ) : (
                filteredPrivileges.map((p, index) => (
                  <tr
                    key={p.id}
                    className={index % 2 === 0 ? "bg-white/[0.01]" : ""}
                  >
                    <td><div className="datatable-cell text-center">{p.id}</div></td>
                    <td><div className="datatable-cell">{p.userType}</div></td>
                    <td><div className="datatable-cell">{p.userName}</div></td>
                    <td><div className="datatable-cell">{p.privilege}</div></td>
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
                          title="Edit"
                          onClick={() => router.push(`/transaction/user-access-privileges-list/${p.id}/edit`)}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="datatable-action danger"
                          type="button"
                          title="Remove"
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
                Are you sure you want to delete this record?
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
