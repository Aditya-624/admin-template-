"use client";

import React, { useState, useEffect } from "react";
import { Edit, Trash2, CheckCircle, ArrowUpDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import API from "@/services/api";
import {
  Contact,
  CONTACTS_STORAGE_KEY,
  initialContacts,
  mapApiContact,
} from "@/lib/contacts-data";

const linkStyle: React.CSSProperties = {
  color: "#60a5fa",
  textDecoration: "underline",
  wordBreak: "break-all",
};

export default function ContactsListPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: "", show: false });

  const loadOfflineData = () => {
    const stored = localStorage.getItem(CONTACTS_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored) as Contact[];
      } catch {
        /* fall through */
      }
    }
    localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(initialContacts));
    return initialContacts;
  };

  useEffect(() => {
    const offline = loadOfflineData();
    setContacts(offline);
    setLoading(false);

    API.get("/api/master/contacts")
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((row: Record<string, unknown>, idx: number) =>
            mapApiContact(row, idx)
          );
          setContacts(mapped);
          localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(mapped));
          setError(null);
        }
      })
      .catch(() => {
        setError("Using offline demo data — API not connected.");
        setContacts(offline);
      });
  }, []);

  const filtered = contacts.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.id.toString().includes(q) ||
      c.clientId.toString().includes(q) ||
      c.client.toLowerCase().includes(q) ||
      c.mobile.includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.website.toLowerCase().includes(q) ||
      c.address.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.state.toLowerCase().includes(q) ||
      c.pinCode.includes(q) ||
      c.notes.toLowerCase().includes(q) ||
      (c.status ? "true" : "false").includes(q)
    );
  });

  const showToast = (message: string) => {
    setToast({ message, show: true });
    setTimeout(() => setToast({ message: "", show: false }), 3000);
  };

  const handleDeleteConfirm = () => {
    if (!selectedContact) return;
    API.delete(`/api/master/contacts/${selectedContact.id}`).catch(() => undefined);
    const next = contacts.filter((c) => c.id !== selectedContact.id);
    setContacts(next);
    localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(next));
    setIsDeleteModalOpen(false);
    setSelectedContact(null);
    showToast("✓ Contact deleted successfully");
  };

  return (
    <div className="datatable-page" style={{ display: "flex", justifyContent: "center", padding: "24px" }}>
      <style>{`
        .modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          z-index: 50;
          display: flex; align-items: center; justify-content: center;
        }
        .modal-content {
          background: rgba(30, 36, 54, 0.95);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 24px;
          width: 360px;
          max-width: 90vw;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        }
        .modal-actions { display: flex; justify-content: center; gap: 12px; margin-top: 20px; }
        .btn-cancel {
          background: rgba(255,255,255,0.1); color: white; border: none;
          padding: 8px 16px; border-radius: 8px; cursor: pointer;
        }
        .btn-confirm-delete {
          background: rgba(239,68,68,0.9); color: white; border: none;
          padding: 8px 16px; border-radius: 8px; cursor: pointer;
        }
        .toast {
          position: fixed; bottom: 24px; right: 24px;
          background: #22c55e; color: white; padding: 12px 24px;
          border-radius: 8px; z-index: 100;
          display: flex; align-items: center; gap: 8px;
          font-weight: 500;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .offline-banner {
          margin: 0 0 14px 0;
          padding: 10px 14px;
          border-radius: 10px;
          background: rgba(251, 191, 36, 0.12);
          border: 1px solid rgba(251, 191, 36, 0.35);
          color: #fbbf24;
          font-size: 13px;
        }
      `}</style>

      <div className="table-card" style={{ maxWidth: "100%", width: "100%" }}>
        <div className="datatable-toolbar" style={{ justifyContent: "space-between" }}>
          <h1 className="text-2xl font-bold text-white">Contacts List</h1>
          <div className="flex items-center gap-4">
            <div className="datatable-search">
              <span>Search:</span>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <button
              type="button"
              className="add-btn-card"
              onClick={() => router.push("/masters/contacts/add")}
            >
              <span className="btn-label">Add Contact</span>
            </button>
          </div>
        </div>

        {error && <div className="offline-banner">{error}</div>}

        <div className="datatable-shell" style={{ overflowX: "auto" }}>
          <table className="premium-table" style={{ minWidth: "1400px" }}>
            <thead>
              <tr>
                {[
                  "Client ID",
                  "Client",
                  "Mobile",
                  "Email",
                  "Website",
                  "Address",
                  "City",
                  "State",
                  "Pin Code",
                  "Notes",
                  "Status",
                  "Action(s)",
                ].map((col) => (
                  <th key={col}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate">{col}</span>
                      {col !== "Action(s)" && <ArrowUpDown className="sort-icon" />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={12} className="text-center py-8 text-slate-400">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          border: "2px solid rgba(255,255,255,0.2)",
                          borderTopColor: "#fff",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                        }}
                      />
                      Loading contacts...
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={12} className="text-center py-8 text-slate-400">
                    Not found in the list
                  </td>
                </tr>
              ) : (
                filtered.map((c, index) => (
                  <tr key={c.id} className={index % 2 === 0 ? "bg-white/[0.01]" : ""}>
                    <td>
                      <div className="datatable-cell text-center">{c.clientId}</div>
                    </td>
                    <td>
                      <div className="datatable-cell">{c.client}</div>
                    </td>
                    <td>
                      <div className="datatable-cell">{c.mobile}</div>
                    </td>
                    <td>
                      <div className="datatable-cell">
                        {c.email ? (
                          <a href={`mailto:${c.email}`} style={linkStyle}>
                            {c.email}
                          </a>
                        ) : (
                          "—"
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="datatable-cell">
                        {c.website ? (
                          <a
                            href={c.website.startsWith("http") ? c.website : `https://${c.website}`}
                            target="_blank"
                            rel="noreferrer"
                            style={linkStyle}
                          >
                            {c.website}
                          </a>
                        ) : (
                          ""
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="datatable-cell" style={{ whiteSpace: "normal" }}>
                        {c.address}
                      </div>
                    </td>
                    <td>
                      <div className="datatable-cell">{c.city}</div>
                    </td>
                    <td>
                      <div className="datatable-cell">{c.state}</div>
                    </td>
                    <td>
                      <div className="datatable-cell">{c.pinCode}</div>
                    </td>
                    <td>
                      <div className="datatable-cell">{c.notes || ""}</div>
                    </td>
                    <td>
                      <div className="flex justify-center">
                        <span
                          className="status-pill"
                          style={{
                            background: c.status ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                            borderColor: c.status ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)",
                            color: c.status ? "#4ade80" : "#f87171",
                          }}
                        >
                          {c.status ? "TRUE" : "FALSE"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="datatable-actions justify-center">
                        <button
                          type="button"
                          className="datatable-action"
                          title="Edit"
                          onClick={() => router.push(`/masters/contacts/${c.id}/edit`)}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          type="button"
                          className="datatable-action danger"
                          title="Delete"
                          onClick={() => {
                            setSelectedContact(c);
                            setIsDeleteModalOpen(true);
                          }}
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
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="modal-content"
            >
              <div style={{ marginBottom: 16, color: "#f87171" }}>
                <Trash2 size={48} style={{ margin: "0 auto" }} />
              </div>
              <p style={{ marginBottom: 24, color: "rgba(255,255,255,0.9)" }}>
                Do you really want to delete?
              </p>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsDeleteModalOpen(false)}>
                  No
                </button>
                <button type="button" className="btn-confirm-delete" onClick={handleDeleteConfirm}>
                  Yes
                </button>
              </div>
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

    </div>
  );
}
