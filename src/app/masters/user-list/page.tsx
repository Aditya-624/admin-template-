"use client";

import Link from "next/link";
import React, { useState } from "react";
import { ArrowUpDown } from "lucide-react";

const placeholderData = [
  { id: "USR-001", type: "Super Admin", name: "Airi Satou", mobile: "+1 (555) 010-1001", email: "airi.satou@example.com", loginId: "airi.satou", description: "Manages platform accounts", status: "Active" },
  { id: "USR-002", type: "Associate", name: "Angelica Ramos", mobile: "+1 (555) 010-1002", email: "angelica.ramos@example.com", loginId: "angelica.ramos", description: "Creates course content", status: "Active" },
  { id: "USR-003", type: "Expert", name: "Ashton Cox", mobile: "+1 (555) 010-1003", email: "ashton.cox@example.com", loginId: "ashton.cox", description: "Enrolled learner account", status: "Inactive" },
  { id: "USR-004", type: "ClientAdmin", name: "Bradley Greer", mobile: "+1 (555) 010-1004", email: "bradley.greer@example.com", loginId: "bradley.greer", description: "Reviews quizzes and lessons", status: "Active" },
  { id: "USR-005", type: "Evaluator", name: "Brenden Wagner", mobile: "+1 (555) 010-1005", email: "brenden.wagner@example.com", loginId: "brenden.wagner", description: "Handles user queries", status: "Pending" },
  { id: "USR-006", type: "Student", name: "Brielle Williamson", mobile: "+1 (555) 010-1006", email: "brielle.williamson@example.com", loginId: "brielle.williamson", description: "Controls master data", status: "Active" },
  { id: "USR-007", type: "Associate", name: "Bruno Nash", mobile: "+1 (555) 010-1007", email: "bruno.nash@example.com", loginId: "bruno.nash", description: "Premium learner account", status: "Active" },
  { id: "USR-008", type: "Expert", name: "Caesar Vance", mobile: "+1 (555) 010-1008", email: "caesar.vance@example.com", loginId: "caesar.vance", description: "Assists onboarding", status: "Inactive" },
  { id: "USR-009", type: "Evaluator", name: "Cara Stevens", mobile: "+1 (555) 010-1009", email: "cara.stevens@example.com", loginId: "cara.stevens", description: "Publishes assessments", status: "Active" },
  { id: "USR-010", type: "Student", name: "Cedric Kelly", mobile: "+1 (555) 010-1010", email: "cedric.kelly@example.com", loginId: "cedric.kelly", description: "Trial learner account", status: "Pending" },
];

const columns = [
  "User ID",
  "User Type",
  "User Name",
  "Mobile Number",
  "Email",
  "Description",
  "Status",
  "Action",
];

const storageKey = "masters-user-list-v3";

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

  const removeRow = (id: string) => {
    setRows((currentRows) => {
      const nextRows = currentRows.filter((row) => row.id !== id);
      localStorage.setItem(storageKey, JSON.stringify(nextRows));
      return nextRows;
    });
  };

  return (
    <div className="datatable-page">
      <div className="table-card">
        <div className="datatable-toolbar">
          <div className="datatable-length">
            <span>Show</span>
            <div className="relative">
              <select
                value={entries}
                onChange={(e) => setEntries(e.target.value)}
                className="appearance-none pr-10"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <span>entries</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="datatable-search">
              <span>Search:</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Link href="/masters/user-list/add" className="edit-user-update py-2 px-5 text-sm">
              + Add User
            </Link>
          </div>
        </div>

        <div className="datatable-shell">
          <table className="premium-table">
            <colgroup>
              <col className="w-[10%]" />
              <col className="w-[11%]" />
              <col className="w-[15%]" />
              <col className="w-[14%]" />
              <col className="w-[18%]" />
              <col className="w-[15%]" />
              <col className="w-[8%]" />
              <col className="w-[9%]" />
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
              {rows.map((row, index) => (
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
                  <td title={row.description}>
                    <div className="datatable-cell">{row.description}</div>
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
                        ✏️
                      </Link>
                      <button
                        className="datatable-action danger"
                        type="button"
                        title="Remove user"
                        aria-label={`Remove ${row.name}`}
                        onClick={() => removeRow(row.id)}
                      >
                        ❌
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                {columns.map((column) => (
                  <th key={column}>
                    {column}
                  </th>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="datatable-footer">
          <div className="datatable-info">
            Showing 1 to {rows.length} of {rows.length} entries
          </div>
          <div className="pagination">
            <button>Prev</button>
            <button className="active">1</button>
            <button>2</button>
            <button>3</button>
            <button>4</button>
            <button>5</button>
            <button>6</button>
            <button>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
