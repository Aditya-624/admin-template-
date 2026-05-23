"use client";

import React, { useState, useEffect } from "react";
import { Edit, Trash2, PlusSquare, CheckCircle, ArrowUpDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import API from "@/services/api";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Fetching user access privileges from backend API /api/user-access-privileges...");
    setLoading(true);
    setError(null);
    API.get("/api/user-access-privileges")
      .then((res) => {
        console.log("Successfully fetched user access privileges from backend:", res.data);
        if (Array.isArray(res.data)) {
          const mapped = res.data.map((uap: any, idx: number) => ({
            id: typeof uap.id === "number" ? uap.id : parseInt(uap.id ?? uap.uap_id ?? uap.userAccessPrivilegeId ?? (idx + 1), 10),
            userType: String(uap.userType ?? uap.user_type ?? uap.usertype ?? "N/A"),
            userName: String(uap.userName ?? uap.user_name ?? uap.username ?? "N/A"),
            privilege: String(uap.privilege ?? uap.access_privilege ?? uap.privilege_name ?? "N/A"),
            description: String(uap.description ?? ""),
            status: uap.status === true || uap.status === "Active" || uap.status === "active" || uap.status === 1 || String(uap.status).toLowerCase() === "true"
          }));
          setPrivileges(mapped);
        } else {
          console.warn("Unexpected privileges response format, using local storage/placeholder fallback");
          const storedRows = localStorage.getItem(storageKey);
          setPrivileges(storedRows ? JSON.parse(storedRows) : initialData);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user access privileges from backend:", err);
        const storedRows = localStorage.getItem(storageKey);
        setPrivileges(storedRows ? JSON.parse(storedRows) : initialData);
        setLoading(false);
      });
  }, []);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPrivilege, setSelectedPrivilege] = useState<UserAccessPrivilege | null>(null);

  const [search, setSearch] = useState("");
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

  const filteredPrivileges = privileges.filter((p) => {
    if (!search) return true;
    const lowerSearch = search.toLowerCase();
    return (
      p.id.toString().includes(lowerSearch) ||
      p.userType.toLowerCase().includes(lowerSearch) ||
      p.userName.toLowerCase().includes(lowerSearch) ||
      p.privilege.toLowerCase().includes(lowerSearch) ||
      p.description.toLowerCase().includes(lowerSearch) ||
      (p.status ? "active" : "inactive").includes(lowerSearch)
    );
  });

  const sortedPrivileges = React.useMemo(() => {
    const data = [...filteredPrivileges];
    if (!sortColumn) return data;
    data.sort((a, b) => {
      let aVal = a[sortColumn as keyof UserAccessPrivilege];
      let bVal = b[sortColumn as keyof UserAccessPrivilege];
      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string ?? "").toLowerCase();
      }
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return data;
  }, [filteredPrivileges, sortColumn, sortDirection]);

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
      console.log(`Sending DELETE request for user access privilege ID: ${selectedPrivilege.id}`);
      API.delete(`/api/user-access-privileges/${selectedPrivilege.id}`)
        .then((res) => {
          console.log(`Successfully deleted user access privilege ${selectedPrivilege.id}:`, res.data);
          const nextPrivileges = privileges.filter((p) => p.id !== selectedPrivilege.id);
          setPrivileges(nextPrivileges);
          localStorage.setItem(storageKey, JSON.stringify(nextPrivileges));
          setIsDeleteModalOpen(false);
          setSelectedPrivilege(null);
          showToast("✓ Record deleted successfully");
        })
        .catch((err) => {
          console.error(`Error deleting user access privilege ${selectedPrivilege.id}:`, err);
          alert("Failed to delete record on backend. Deleting from offline list.");
          const nextPrivileges = privileges.filter((p) => p.id !== selectedPrivilege.id);
          setPrivileges(nextPrivileges);
          localStorage.setItem(storageKey, JSON.stringify(nextPrivileges));
          setIsDeleteModalOpen(false);
          setSelectedPrivilege(null);
          showToast("✓ Record deleted locally");
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
                  { label: "User Access Privilege ID", key: "id" },
                  { label: "User Type ID / User Type", key: "userType" },
                  { label: "User ID / Name", key: "userName" },
                  { label: "PrivilegeID / Privilege", key: "privilege" },
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
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                      <div className="spinner" style={{
                        width: "16px",
                        height: "16px",
                        border: "2px solid rgba(255,255,255,0.2)",
                        borderTopColor: "#fff",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite"
                      }}></div>
                      Loading privileges...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-red-400" style={{ color: "#ef4444" }}>
                    {error}
                  </td>
                </tr>
              ) : sortedPrivileges.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    Not found in the list
                  </td>
                </tr>
              ) : (
                sortedPrivileges.map((p, index) => (
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
                          {p.status ? "Active" : "Inactive"}
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
