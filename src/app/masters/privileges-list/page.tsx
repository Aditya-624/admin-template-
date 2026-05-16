"use client";

import React, { useState } from "react";
import { Edit2, Trash2, Plus, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Privilege = {
  id: number;
  name: string;
  description: string;
  status: boolean;
};

const initialData: Privilege[] = [
  { id: 1, name: "SyllabusUpload", description: "User can upload Syllabus", status: true },
  { id: 2, name: "SyllabusReview", description: "User can review Syllabus", status: true },
  { id: 3, name: "SyllabusApproval", description: "User can Approval Syllabus", status: true },
  { id: 4, name: "CourseUpload", description: "User can upload Course", status: true },
  { id: 5, name: "CourseReview", description: "User can review Course", status: true },
  { id: 6, name: "CourseApproval", description: "User can Approve Course", status: true },
];

export default function PrivilegesListPage() {
  const [privileges, setPrivileges] = useState<Privilege[]>(initialData);
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Current selection state
  const [selectedPrivilege, setSelectedPrivilege] = useState<Privilege | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({ name: "", description: "", status: true });
  
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
    const newId = privileges.length > 0 ? Math.max(...privileges.map((p) => p.id)) + 1 : 1;
    setPrivileges([...privileges, { id: newId, ...formData }]);
    setIsAddModalOpen(false);
    showToast("✓ Privilege added successfully");
  };

  const openEditModal = (privilege: Privilege) => {
    setSelectedPrivilege(privilege);
    setFormData({ name: privilege.name, description: privilege.description, status: privilege.status });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPrivilege) return;
    setPrivileges(
      privileges.map((p) =>
        p.id === selectedPrivilege.id ? { ...p, ...formData } : p
      )
    );
    setIsEditModalOpen(false);
    showToast("✓ Privilege updated successfully");
  };

  const openDeleteModal = (privilege: Privilege) => {
    setSelectedPrivilege(privilege);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedPrivilege) return;
    setPrivileges(privileges.filter((p) => p.id !== selectedPrivilege.id));
    setIsDeleteModalOpen(false);
    showToast("✓ Privilege deleted successfully");
  };

  return (
    <div className="privileges-page">
      <style>{`
        .privileges-page {
          background: linear-gradient(135deg, #1a1f2e 0%, #1e2436 40%, #1a1f2e 100%);
          min-height: 100vh;
          padding: 32px;
          color: white;
        }

        .header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .page-title {
          font-size: 1.6rem;
          font-weight: 700;
          color: white;
          text-align: left;
        }

        .btn-add {
          background: #22c55e;
          border-radius: 50%;
          width: 44px;
          height: 44px;
          font-size: 1.5rem;
          color: white;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(34, 197, 94, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .btn-add:hover {
          background: #4ade80;
          transform: scale(1.1);
        }

        .table-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px) saturate(150%);
          -webkit-backdrop-filter: blur(20px) saturate(150%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 0;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          margin: 24px auto;
          width: 100%;
          max-width: 800px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead tr {
          background: rgba(255, 255, 255, 0.07);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        thead th {
          color: rgba(255, 255, 255, 0.95);
          font-weight: 700;
          font-size: 0.95rem;
          padding: 16px 20px;
          text-align: left;
          letter-spacing: 0.02em;
        }

        tbody tr {
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          transition: background 0.2s ease;
        }

        tbody tr:hover {
          background: rgba(255, 255, 255, 0.06);
        }

        tbody td {
          color: rgba(255, 255, 255, 0.85);
          font-size: 0.95rem;
          padding: 16px 20px;
          vertical-align: middle;
        }

        td:first-child {
          color: rgba(255, 255, 255, 0.6);
          font-weight: 600;
          text-align: center;
          width: 80px;
        }

        .col-status, .col-actions {
          text-align: center;
        }

        .badge-true {
          background: rgba(34, 197, 94, 0.15);
          color: #4ade80;
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 20px;
          padding: 4px 14px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .badge-false {
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 20px;
          padding: 4px 14px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .btn-edit {
          background: rgba(139, 92, 246, 0.15);
          border: 1px solid rgba(139, 92, 246, 0.3);
          color: #a78bfa;
          border-radius: 8px;
          padding: 6px 10px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.2s ease;
          margin-right: 8px;
          display: inline-flex;
          align-items: center;
        }

        .btn-edit:hover {
          background: rgba(139, 92, 246, 0.3);
          transform: scale(1.1);
        }

        .btn-delete {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
          border-radius: 8px;
          padding: 6px 10px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
        }

        .btn-delete:hover {
          background: rgba(239, 68, 68, 0.3);
          transform: scale(1.1);
        }

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

      <div className="header-row">
        <h1 className="page-title">Privileges List</h1>
        <button className="btn-add" onClick={openAddModal}>
          <Plus size={24} />
        </button>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th style={{ width: "80px", textAlign: "center" }}>PrivilegeID</th>
              <th>Privilege</th>
              <th style={{ width: "40%" }}>Description</th>
              <th style={{ textAlign: "center" }}>Status</th>
              <th style={{ textAlign: "center" }}>Action(s)</th>
            </tr>
          </thead>
          <tbody>
            {privileges.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.description}</td>
                <td className="col-status">
                  <span className={p.status ? "badge-true" : "badge-false"}>
                    {p.status ? "TRUE" : "FALSE"}
                  </span>
                </td>
                <td className="col-actions">
                  <button className="btn-edit" onClick={() => openEditModal(p)}>
                    <Edit2 size={16} />
                  </button>
                  <button className="btn-delete" onClick={() => openDeleteModal(p)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
                <Plus size={20} className="text-green-500" />
                Add Privilege
              </div>
              <form onSubmit={handleAddSubmit}>
                <div className="form-group">
                  <label className="form-label">Privilege Name</label>
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
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-input"
                    value={formData.status ? "true" : "false"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value === "true" })}
                  >
                    <option value="true">TRUE</option>
                    <option value="false">FALSE</option>
                  </select>
                </div>
                <div className="modal-actions" style={{ justifyContent: "space-between" }}>
                  <button type="button" className="btn-cancel" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-submit-add">Add Privilege</button>
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
                <Edit2 size={20} className="text-purple-500" />
                Edit Privilege
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="form-group">
                  <label className="form-label">Privilege Name</label>
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
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-input"
                    value={formData.status ? "true" : "false"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value === "true" })}
                  >
                    <option value="true">TRUE</option>
                    <option value="false">FALSE</option>
                  </select>
                </div>
                <div className="modal-actions" style={{ justifyContent: "space-between" }}>
                  <button type="button" className="btn-cancel" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-submit-edit">Update Privilege</button>
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
                Are you sure you want to delete this privilege?
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
