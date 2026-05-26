"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { ArrowUpDown, Edit, Trash2 } from "lucide-react";
import API from "@/services/api";

type UserItem = {
  id: string;
  type: string;
  name: string;
  mobile: string;
  email: string;
  loginId: string;
  description: string;
  status: string;
};

const placeholderData: UserItem[] = [];

const columns = [
  "User ID",
  "User Type",
  "User Name",
  "Mobile Number",
  "Email",
  "Status",
  "Action",
];

const storageKey = "masters-user-list-v4";

const getInitialRows = () => {
  if (typeof window === "undefined") return placeholderData.filter(row => row.status === "Active" || row.status === "active");

  const storedRows = localStorage.getItem(storageKey);
  if (!storedRows) return placeholderData.filter(row => row.status === "Active" || row.status === "active");

  try {
    return (JSON.parse(storedRows) as typeof placeholderData).filter(row => row.status === "Active" || row.status === "active");
  } catch {
    return placeholderData.filter(row => row.status === "Active" || row.status === "active");
  }
};

export default function UserListPage() {
  const [entries, setEntries] = useState("10");
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<typeof placeholderData>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Fetching users list from backend API /api/users...");
    setLoading(true);
    setError(null);
    API.get("/api/users")
      .then((res) => {
        console.log("Successfully fetched users from backend:", res.data);
        if (Array.isArray(res.data) && res.data.length > 0) {
          const activeOnly = res.data.filter((u: any) => u.status === true || u.status === "Active" || u.status === "active");
          const mapped = activeOnly.map((u: any, idx: number) => ({
            id: String(u.id ?? u.user_id ?? u.userId ?? (idx + 1)),
            type: String(u.type ?? u.user_type ?? u.usertype ?? u.userType ?? "Student"),
            name: String(u.name ?? u.user_name ?? u.username ?? "N/A"),
            mobile: String(u.mobile ?? u.mobile_number ?? u.phone ?? "N/A"),
            email: String(u.email ?? u.email_id ?? u.emailAddress ?? "N/A"),
            loginId: String(u.loginId ?? u.login_id ?? u.login ?? u.username ?? "N/A"),
            description: String(u.description ?? ""),
            status: u.status === true || u.status === "Active" || u.status === "active" ? "Active" : "Inactive"
          }));

          // Merge: combine backend rows with any locally-added rows not yet in backend
          const localRaw = localStorage.getItem(storageKey);
          const localRows: typeof placeholderData = localRaw ? JSON.parse(localRaw) : [];
          const backendIds = new Set(mapped.map(r => r.id));
          const localOnlyRows = localRows.filter(r => !backendIds.has(r.id) && (r.status === "Active" || r.status === "active"));
          setRows([...mapped, ...localOnlyRows]);
        } else {
          // Backend returned empty or no data — show localStorage fallback
          console.warn("Backend returned empty list, falling back to localStorage");
          setRows(getInitialRows());
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error calling GET /api/users:", err);
        setRows(getInitialRows());
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

  const filteredRows = rows.filter((row) => {
    if (!search) return true;
    const lowerSearch = search.toLowerCase();
    return (
      row.id.toLowerCase().includes(lowerSearch) ||
      row.type.toLowerCase().includes(lowerSearch) ||
      row.name.toLowerCase().includes(lowerSearch) ||
      row.mobile.toLowerCase().includes(lowerSearch) ||
      row.email.toLowerCase().includes(lowerSearch) ||
      row.status.toLowerCase().includes(lowerSearch)
    );
  });

  const sortedRows = React.useMemo(() => {
    const data = [...filteredRows];
    if (!sortColumn) return data;
    data.sort((a, b) => {
      let aVal = a[sortColumn as keyof typeof placeholderData[0]] ?? "";
      let bVal = b[sortColumn as keyof typeof placeholderData[0]] ?? "";
      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = String(bVal).toLowerCase();
      }
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return data;
  }, [filteredRows, sortColumn, sortDirection]);

  const removeRow = (id: string) => {
    if (window.confirm("Do you really want to delete this user?")) {
      console.log(`Sending PATCH request for user with ID: ${id} to soft-delete`);
      API.patch(`/api/users/${id}`, { Status: false })
        .then((res) => {
          console.log(`Successfully soft-deleted user ${id} on backend:`, res.data);
          setRows((currentRows) => {
            const nextRows = currentRows.filter((row) => row.id !== id);
            localStorage.setItem(storageKey, JSON.stringify(nextRows));
            return nextRows;
          });
        })
        .catch((err) => {
          console.error(`Error soft-deleting user ${id}:`, err);
          // Even if backend fails, remove locally so frontend remains consistent
          setRows((currentRows) => {
            const nextRows = currentRows.filter((row) => row.id !== id);
            localStorage.setItem(storageKey, JSON.stringify(nextRows));
            return nextRows;
          });
        });
    }
  };

  const headers = [
    { label: "User ID", key: "id" },
    { label: "User Type", key: "type" },
    { label: "User Name", key: "name" },
    { label: "Mobile Number", key: "mobile" },
    { label: "Email", key: "email" },
    { label: "Status", key: "status" },
    { label: "Action", key: null }
  ];

  return (
    <div className="datatable-page" style={{ display: "flex", justifyContent: "center", padding: "24px" }}>
      <div className="table-card" style={{ maxWidth: "1400px", width: "100%" }}>
        <div className="datatable-toolbar" style={{ justifyContent: "flex-end" }}>
          <div className="flex items-center gap-4">
            <div className="datatable-search">
              <span>Search:</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Link href="/masters/user-list/add" className="add-btn-card">
              <span className="btn-label">Add User</span>
            </Link>
          </div>
        </div>

        <div className="datatable-shell">
          <table className="premium-table">
            <colgroup>
              <col className="w-[12%]" />
              <col className="w-[12%]" />
              <col className="w-[20%]" />
              <col className="w-[18%]" />
              <col className="w-[20%]" />
              <col className="w-[8%]" />
              <col className="w-[10%]" />
            </colgroup>
            <thead>
              <tr>
                {headers.map((col) => (
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
                      Loading users...
                    </div>
                    <style jsx global>{`
                      @keyframes spin {
                        to { transform: rotate(360deg); }
                      }
                    `}</style>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-red-400" style={{ color: "#ef4444" }}>
                    {error}
                  </td>
                </tr>
              ) : sortedRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    Not found in the user list
                  </td>
                </tr>
              ) : (
                sortedRows.map((row, index) => (
                  <tr
                    key={row.id}
                    className={index % 2 === 0 ? "bg-white/[0.01]" : ""}
                  >
                    <td>
                      <div className="datatable-cell">{row.id}</div>
                    </td>
                    <td>
                      <div className="datatable-cell">{row.type}</div>
                    </td>
                    <td>
                      <div className="datatable-cell">{row.name}</div>
                    </td>
                    <td>
                      <div className="datatable-cell">{row.mobile}</div>
                    </td>
                    <td>
                      <div className="datatable-cell">{row.email}</div>
                    </td>
                    <td>
                      <span className="status-pill" data-status={row.status}>
                        {row.status}
                      </span>
                    </td>
                    <td>
                      <div className="datatable-actions">
                        <Link
                          href={`/masters/user-list/${row.id}/edit`}
                          className="datatable-action"
                          title="Edit user"
                          aria-label={`Edit ${row.name}`}
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          className="datatable-action danger"
                          type="button"
                          title="Remove user"
                          aria-label={`Remove ${row.name}`}
                          onClick={() => removeRow(row.id)}
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
    </div>
  );
}
