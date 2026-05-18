"use client";

import Link from "next/link";
import React, { useState } from "react";
import { ArrowUpDown, Edit, Trash2, PlusSquare } from "lucide-react";

const placeholderData = [
  { id: "1", type: "Super Admin", name: "Airi Satou", mobile: "+1 (555) 010-1001", email: "airi.satou@example.com", loginId: "airi.satou", description: "Manages platform accounts", status: "Active" },
  { id: "2", type: "Associate", name: "Angelica Ramos", mobile: "+1 (555) 010-1002", email: "angelica.ramos@example.com", loginId: "angelica.ramos", description: "Creates course content", status: "Active" },
  { id: "3", type: "Expert", name: "Ashton Cox", mobile: "+1 (555) 010-1003", email: "ashton.cox@example.com", loginId: "ashton.cox", description: "Enrolled learner account", status: "Inactive" },
  { id: "4", type: "ClientAdmin", name: "Bradley Greer", mobile: "+1 (555) 010-1004", email: "bradley.greer@example.com", loginId: "bradley.greer", description: "Reviews quizzes and lessons", status: "Active" },
  { id: "5", type: "Evaluator", name: "Brenden Wagner", mobile: "+1 (555) 010-1005", email: "brenden.wagner@example.com", loginId: "brenden.wagner", description: "Handles user queries", status: "Pending" },
  { id: "6", type: "Student", name: "Brielle Williamson", mobile: "+1 (555) 010-1006", email: "brielle.williamson@example.com", loginId: "brielle.williamson", description: "Controls master data", status: "Active" },
  { id: "7", type: "Associate", name: "Bruno Nash", mobile: "+1 (555) 010-1007", email: "bruno.nash@example.com", loginId: "bruno.nash", description: "Premium learner account", status: "Active" },
  { id: "8", type: "Expert", name: "Caesar Vance", mobile: "+1 (555) 010-1008", email: "caesar.vance@example.com", loginId: "caesar.vance", description: "Assists onboarding", status: "Inactive" },
  { id: "9", type: "Evaluator", name: "Cara Stevens", mobile: "+1 (555) 010-1009", email: "cara.stevens@example.com", loginId: "cara.stevens", description: "Publishes assessments", status: "Active" },
  { id: "10", type: "Student", name: "Cedric Kelly", mobile: "+1 (555) 010-1010", email: "cedric.kelly@example.com", loginId: "cedric.kelly", description: "Trial learner account", status: "Pending" },
];

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
  if (typeof window === "undefined") return placeholderData;

  const storedRows = localStorage.getItem(storageKey);
  if (!storedRows) return placeholderData;

  try {
    return JSON.parse(storedRows) as typeof placeholderData;
  } catch {
    return placeholderData;
  }
};

export default function UserListPage() {
  const [entries, setEntries] = useState("10");
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState(getInitialRows);

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

  const removeRow = (id: string) => {
    if (window.confirm("Do you really want to delete this user?")) {
      setRows((currentRows) => {
        const nextRows = currentRows.filter((row) => row.id !== id);
        localStorage.setItem(storageKey, JSON.stringify(nextRows));
        return nextRows;
      });
    }
  };

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
                {columns.map((column) => (
                  <th key={column}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate">{column}</span>
                      {column !== "Action" && <ArrowUpDown className="sort-icon" />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    Not found in the user list
                  </td>
                </tr>
              ) : (
                filteredRows.map((row, index) => (
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
              )))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
