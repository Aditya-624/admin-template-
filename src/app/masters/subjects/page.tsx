"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Edit, Trash2, ArrowUpDown, Plus } from "lucide-react";
import { mockSubjects, Subject } from "@/app/masters/subjects/mockData";
import API from "@/services/api";

const storageKey = "edtech_subjects_v1";

export default function SubjectsListPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof Subject | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Load data
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    // Attempt to call API if available, otherwise fallback to local storage / mock data
    API.get("/api/master/subjects")
      .then((res) => {
        console.log("Successfully fetched subjects from API:", res.data);
        const rawData = res.data;
        const data = Array.isArray(rawData) ? rawData : (rawData && Array.isArray(rawData.data) ? rawData.data : []);
        if (data.length > 0) {
          const mapped = data.map((s: any, idx: number) => ({
            id: String(s.id ?? s.subject_id ?? s.subjectId ?? (idx + 1)),
            courseId: String(s.courseId ?? s.course_id ?? "1"),
            courseName: String(s.courseName ?? s.course_name ?? s.course ?? "B. Tech."),
            branchId: String(s.branchId ?? s.branch_id ?? "5"),
            branchName: String(s.branchName ?? s.branch_name ?? s.branch ?? "CSE"),
            year: String(s.year ?? "1st Year"),
            semester: String(s.semester ?? "1"),
            name: String(s.name ?? s.subject ?? s.subjectName ?? "N/A"),
            shortForm: String(s.shortForm ?? s.short_form ?? s.shortName ?? "N/A"),
            chaptersCount: Number(s.chaptersCount ?? s.chapters_count ?? 10),
            internalMarks: Number(s.internalMarks ?? s.internal_marks ?? s.internalMark ?? 40),
            internalPassMark: Number(s.internalPassMark ?? s.internal_pass_mark ?? s.internalPassMark ?? 23),
            externalMarks: Number(s.externalMarks ?? s.external_marks ?? s.externalMark ?? 60),
            externalPassMark: Number(s.externalPassMark ?? s.external_pass_mark ?? s.externalPassMark ?? 37),
            description: String(s.description ?? ""),
            status: s.status === undefined || s.status === true || s.status === "Active" || s.status === "active" || s.status === "TRUE" || s.status === 1 || String(s.status).toLowerCase() === "true",
          }));
          setSubjects(mapped);
          localStorage.setItem(storageKey, JSON.stringify(mapped));
        } else {
          loadFallbackData();
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Backend API /api/master/subjects failed or unavailable. Falling back to local storage.", err);
        loadFallbackData();
        setLoading(false);
      });
  }, []);

  const loadFallbackData = () => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        setSubjects(JSON.parse(stored));
      } catch (e) {
        setSubjects(mockSubjects);
        localStorage.setItem(storageKey, JSON.stringify(mockSubjects));
      }
    } else {
      setSubjects(mockSubjects);
      localStorage.setItem(storageKey, JSON.stringify(mockSubjects));
    }
  };

  const handleSort = (columnKey: keyof Subject) => {
    if (sortColumn === columnKey) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const removeSubject = (id: string) => {
    if (!window.confirm("Do you really want to delete this subject?")) return;

    API.delete(`/api/master/subjects/${id}`)
      .then(() => {
        console.log(`Successfully deleted subject ${id} on backend API`);
      })
      .catch((err) => {
        console.warn(`Backend delete failed for subject ${id}, removing locally.`, err);
      })
      .finally(() => {
        setSubjects((prev) => {
          const next = prev.filter((s) => s.id !== id);
          localStorage.setItem(storageKey, JSON.stringify(next));
          return next;
        });
      });
  };

  // Filtering
  const filteredSubjects = subjects.filter((sub) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      sub.id.toLowerCase().includes(q) ||
      sub.name.toLowerCase().includes(q) ||
      sub.shortForm.toLowerCase().includes(q) ||
      sub.courseName.toLowerCase().includes(q) ||
      sub.branchName.toLowerCase().includes(q) ||
      sub.year.toLowerCase().includes(q)
    );
  });

  // Sorting
  const sortedSubjects = React.useMemo(() => {
    const data = [...filteredSubjects];
    if (!sortColumn) return data;
    data.sort((a, b) => {
      let aVal = a[sortColumn];
      let bVal = b[sortColumn];
      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = String(bVal).toLowerCase();
      }
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return data;
  }, [filteredSubjects, sortColumn, sortDirection]);

  return (
    <div className="datatable-page" style={{ display: "flex", justifyContent: "center", padding: "24px" }}>
      <div className="table-card" style={{ maxWidth: "1600px", width: "100%" }}>
        
        {/* Toolbar with Search and standard Add button */}
        <div className="datatable-toolbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div className="datatable-search">
            <span>Search:</span>
            <input
              type="text"
              placeholder="Search subjects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <Link href="/masters/subjects/add" className="add-btn-card">
            <Plus size={16} style={{ marginRight: "6px" }} />
            <span className="btn-label">Add Subject</span>
          </Link>
        </div>

        <div className="datatable-shell subjects-table-container">
          <table className="premium-table" style={{ width: "100%", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: "5%" }} />
              <col style={{ width: "9%" }} />
              <col style={{ width: "9%" }} />
              <col style={{ width: "7%" }} />
              <col style={{ width: "5%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "7%" }} />
              <col style={{ width: "6%" }} />
              <col style={{ width: "6%" }} />
              <col style={{ width: "7%" }} />
              <col style={{ width: "6%" }} />
              <col style={{ width: "7%" }} />
              <col style={{ width: "6%" }} />
              <col style={{ width: "5%" }} />
            </colgroup>
            <thead>
              <tr>
                {[
                  { label: "Sub ID", key: "id" },
                  { label: "ID / Course", key: "courseName" },
                  { label: "ID / Branch", key: "branchName" },
                  { label: "Year", key: "year" },
                  { label: "Sem", key: "semester" },
                  { label: "Subject", key: "name" },
                  { label: "Short Form", key: "shortForm" },
                  { label: "Chapters", key: "chaptersCount" },
                  { label: "Int Mark", key: "internalMarks" },
                  { label: "Int Pass", key: "internalPassMark" },
                  { label: "Ext Mark", key: "externalMarks" },
                  { label: "Ext Pass", key: "externalPassMark" },
                  { label: "Status", key: "status" },
                  { label: "Action(s)", key: null }
                ].map((col) => (
                  <th
                    key={col.label}
                    onClick={() => col.key && handleSort(col.key as keyof Subject)}
                    style={{ cursor: col.key ? "pointer" : "default" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2px" }}>
                      <span className="truncate">{col.label}</span>
                      {col.key && (
                        <ArrowUpDown
                          size={10}
                          style={{
                            color: sortColumn === col.key ? "var(--table-accent)" : "rgba(255,255,255,0.3)",
                            opacity: sortColumn === col.key ? 1 : 0.6,
                            flexShrink: 0
                          }}
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
                  <td colSpan={14} className="text-center py-8 text-slate-400">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                      <div className="spinner" style={{
                        width: "16px",
                        height: "16px",
                        border: "2px solid rgba(255,255,255,0.2)",
                        borderTopColor: "#fff",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite"
                      }} />
                      Loading subjects...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={14} className="text-center py-8 text-red-400">{error}</td>
                </tr>
              ) : sortedSubjects.length === 0 ? (
                <tr>
                  <td colSpan={14} className="text-center py-8 text-slate-400">No subjects found</td>
                </tr>
              ) : (
                sortedSubjects.map((sub, idx) => (
                  <tr key={sub.id} className={idx % 2 === 0 ? "bg-white/[0.01]" : ""}>
                    <td><div className="datatable-cell">{sub.id}</div></td>
                    <td><div className="datatable-cell">{sub.courseId} - {sub.courseName}</div></td>
                    <td><div className="datatable-cell">{sub.branchId} - {sub.branchName}</div></td>
                    <td><div className="datatable-cell">{sub.year}</div></td>
                    <td><div className="datatable-cell">{sub.semester}</div></td>
                    <td><div className="datatable-cell" style={{ fontWeight: 600 }}>{sub.name}</div></td>
                    <td><div className="datatable-cell">{sub.shortForm}</div></td>
                    <td><div className="datatable-cell">{sub.chaptersCount}</div></td>
                    <td><div className="datatable-cell">{sub.internalMarks}</div></td>
                    <td><div className="datatable-cell">{sub.internalPassMark}</div></td>
                    <td><div className="datatable-cell">{sub.externalMarks}</div></td>
                    <td><div className="datatable-cell">{sub.externalPassMark}</div></td>
                    <td>
                      <div className="datatable-cell">
                        <span className="status-pill" data-status={sub.status ? "Active" : "Inactive"}>
                          {sub.status ? "TRUE" : "FALSE"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="datatable-actions">
                        <Link href={`/masters/subjects/${sub.id}/edit`} className="datatable-action" title="Edit Subject">
                          <Edit size={14} />
                        </Link>
                        <button className="datatable-action danger" type="button" title="Delete Subject" onClick={() => removeSubject(sub.id)}>
                          <Trash2 size={14} />
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
      
      {/* Dynamic spinner and compact table styling */}
      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .subjects-table-container .premium-table {
          font-size: 11px !important;
          table-layout: fixed !important;
          width: 100% !important;
        }
        .subjects-table-container .premium-table th,
        .subjects-table-container .premium-table td {
          padding: 6px 4px !important;
          vertical-align: middle !important;
          overflow: hidden;
        }
        .subjects-table-container .premium-table th span {
          font-size: 11px !important;
          font-weight: 700 !important;
        }
        .subjects-table-container .premium-table .datatable-cell {
          font-size: 11px !important;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .subjects-table-container .premium-table .status-pill {
          padding: 1px 6px !important;
          font-size: 0.65rem !important;
        }
        .subjects-table-container .premium-table .datatable-actions {
          justify-content: flex-start;
          gap: 4px !important;
        }
      `}</style>
    </div>
  );
}
