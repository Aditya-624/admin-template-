"use client";

import React, { useState } from "react";
import { Edit, Trash2, PlusSquare, CheckCircle, ArrowUpDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function UserTypeListPage() {
  const [userTypes, setUserTypes] = useState<UserTypeItem[]>(initialData);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Current selection state
  const [selectedUserType, setSelectedUserType] = useState<UserTypeItem | null>(null);

  // Form state
  const [formData, setFormData] = useState({ name: "", description: "", status: true });

  // Search state
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

  // Toast state
  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: "", show: false });

  const showToast = (message: string) => {
    setToast({ message, show: true });
    setTimeout(() => setToast({ message: "", show: false }), 3000);
  };

  const openAddModal = () => {
    setFormData({ name: "", description: "", status: true });
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = userTypes.length > 0 ? Math.max(...userTypes.map((p) => p.id)) + 1 : 1;
    setUserTypes([...userTypes, { id: newId, ...formData }]);
    setIsAddModalOpen(false);
    showToast("✓ User Type added successfully");
  };

  const openEditModal = (userType: UserTypeItem) => {
    setSelectedUserType(userType);
    setFormData({ name: userType.name, description: userType.description, status: userType.status });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserType) return;
    setUserTypes(
      userTypes.map((p) =>
        p.id === selectedUserType.id ? { ...p, ...formData } : p
      )
    );
    setIsEditModalOpen(false);
    showToast("✓ User Type updated successfully");
  };

  const openDeleteModal = (userType: UserTypeItem) => {
    setSelectedUserType(userType);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedUserType) {
      setUserTypes((current) => current.filter((p) => p.id !== selectedUserType.id));
      setIsDeleteModalOpen(false);
      setSelectedUserType(null);
      showToast("✓ User Type deleted successfully");
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

        .modal-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-label {
          display: block;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.7);
          margin-bottom: 6px;
        }

        .form-input {
          width: 100%;
          background: rgba(0,0,0,0.2);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 10px 12px;
          color: white;
          outline: none;
        }
        
        .form-input:focus {
          border-color: rgba(139, 92, 246, 0.5);
        }

        .btn-submit-add {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          width: 100%;
        }

        .btn-submit-edit {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          width: 100%;
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
            <button className="flex items-center gap-2 px-6 py-2.5 text-base font-medium text-white bg-white/5 border border-white/20 rounded-full hover:bg-white/10 transition-colors whitespace-nowrap flex-shrink-0" onClick={openAddModal}>
              <PlusSquare size={20} className="flex-shrink-0" />
              <span>Add User Type</span>
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
              {filteredUserTypes.length === 0 ? (
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
                          onClick={() => openEditModal(p)}
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
        {isAddModalOpen && (
          <div className="modal-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="modal-content"
            >
              <div className="modal-title">
                <PlusSquare size={20} className="text-green-500" />
                Add User Type
              </div>
              <form onSubmit={handleAddSubmit}>
                <div className="form-group">
                  <label className="form-label">User Type Name</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    required
                    className="form-input"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="modal-actions" style={{ justifyContent: "space-between" }}>
                  <button type="button" className="btn-cancel" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-submit-add">Add User Type</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {isEditModalOpen && (
          <div className="modal-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="modal-content"
            >
              <div className="modal-title">
                <Edit size={20} className="text-purple-500" />
                Edit User Type
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="form-group">
                  <label className="form-label">User Type Name</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    required
                    className="form-input"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "16px" }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>Status</label>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                      style={{ width: "16px", height: "16px", accentColor: "#8b5cf6" }}
                    />
                    <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>
                      {formData.status ? "True (Yes)" : "False (No)"}
                    </span>
                  </label>
                </div>

                <div className="modal-actions" style={{ justifyContent: "space-between" }}>
                  <button type="button" className="btn-cancel" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-submit-edit">Update User Type</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

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
