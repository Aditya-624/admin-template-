"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Edit, Trash2, ArrowUpDown, Plus } from "lucide-react";
import { mockMaterialTypes, MaterialType } from "@/app/masters/materials/material-types/mockData";
import API from "@/services/api";

const storageKey = "edtech_material_types_v1";

export default function MaterialTypesListPage() {
  const [materialTypes, setMaterialTypes] = useState<MaterialType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof MaterialType | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Load data
  useEffect(() => {
    setLoading(true);
    setError(null);

    API.get("/api/master/material-types")
      .then((res) => {
        console.log("Successfully fetched material types from API:", res.data);
        const rawData = res.data;
        const data = Array.isArray(rawData) ? rawData : (rawData && Array.isArray(rawData.data) ? rawData.data : []);
        if (data.length > 0) {
          const mapped = data.map((t: any, idx: number) => ({
            id: String(t.id ?? t.material_type_id ?? t.materialTypeId ?? (idx + 1)),
            name: String(t.name ?? t.materialType ?? t.material_type ?? "N/A"),
            description: String(t.description ?? ""),
            status: t.status === undefined || t.status === true || t.status === "Active" || t.status === "active" || t.status === "TRUE" || t.status === 1 || String(t.status).toLowerCase() === "true",
          }));
          setMaterialTypes(mapped);
          localStorage.setItem(storageKey, JSON.stringify(mapped));
        } else {
          loadFallbackData();
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Backend API /api/master/material-types failed. Falling back to local storage.", err);
        loadFallbackData();
        setLoading(false);
      });
  }, []);

  const loadFallbackData = () => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        setMaterialTypes(JSON.parse(stored));
      } catch (e) {
        setMaterialTypes(mockMaterialTypes);
        localStorage.setItem(storageKey, JSON.stringify(mockMaterialTypes));
      }
    } else {
      setMaterialTypes(mockMaterialTypes);
      localStorage.setItem(storageKey, JSON.stringify(mockMaterialTypes));
    }
  };

  const handleSort = (columnKey: keyof MaterialType) => {
    if (sortColumn === columnKey) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const removeMaterialType = (id: string) => {
    if (!window.confirm("Do you really want to delete this material type?")) return;

    API.delete(`/api/master/material-types/${id}`)
      .then(() => {
        console.log(`Successfully deleted material type ${id} on backend API`);
      })
      .catch((err) => {
        console.warn(`Backend delete failed for material type ${id}, removing locally.`, err);
      })
      .finally(() => {
        setMaterialTypes((prev) => {
          const next = prev.filter((t) => t.id !== id);
          localStorage.setItem(storageKey, JSON.stringify(next));
          return next;
        });
      });
  };

  // Filtering
  const filteredTypes = materialTypes.filter((t) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      t.id.toLowerCase().includes(q) ||
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    );
  });

  // Sorting
  const sortedTypes = React.useMemo(() => {
    const data = [...filteredTypes];
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
  }, [filteredTypes, sortColumn, sortDirection]);

  return (
    <div className="datatable-page" style={{ display: "flex", justifyContent: "center", padding: "24px" }}>
      <div className="table-card" style={{ maxWidth: "1400px", width: "100%" }}>
        
        {/* Toolbar */}
        <div className="datatable-toolbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div className="datatable-search">
            <span>Search:</span>
            <input
              type="text"
              placeholder="Search material types..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <Link href="/masters/materials/material-types/add" className="add-btn-card">
            <Plus size={16} style={{ marginRight: "6px" }} />
            <span className="btn-label">Add Material Type</span>
          </Link>
        </div>

        <div className="datatable-shell">
          <table className="premium-table" style={{ width: "100%" }}>
            <thead>
              <tr>
                {[
                  { label: "Material Type ID", key: "id" },
                  { label: "Material Type", key: "name" },
                  { label: "Description", key: "description" },
                  { label: "Status", key: "status" },
                  { label: "Action(s)", key: null }
                ].map((col) => (
                  <th
                    key={col.label}
                    onClick={() => col.key && handleSort(col.key as keyof MaterialType)}
                    style={{ cursor: col.key ? "pointer" : "default" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span>{col.label}</span>
                      {col.key && (
                        <ArrowUpDown
                          size={12}
                          style={{
                            color: sortColumn === col.key ? "var(--table-accent)" : "rgba(255,255,255,0.3)",
                            opacity: sortColumn === col.key ? 1 : 0.6,
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
                  <td colSpan={5} className="text-center py-8 text-slate-400">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                      <div className="spinner" style={{
                        width: "16px",
                        height: "16px",
                        border: "2px solid rgba(255,255,255,0.2)",
                        borderTopColor: "#fff",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite"
                      }} />
                      Loading material types...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-red-400">{error}</td>
                </tr>
              ) : sortedTypes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400">No material types found</td>
                </tr>
              ) : (
                sortedTypes.map((t, idx) => (
                  <tr key={t.id} className={idx % 2 === 0 ? "bg-white/[0.01]" : ""}>
                    <td><div className="datatable-cell">{t.id}</div></td>
                    <td><div className="datatable-cell" style={{ fontWeight: 600 }}>{t.name}</div></td>
                    <td><div className="datatable-cell">{t.description}</div></td>
                    <td>
                      <div className="datatable-cell">
                        <span className="status-pill" data-status={t.status ? "Active" : "Inactive"}>
                          {t.status ? "TRUE" : "FALSE"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="datatable-actions">
                        <Link href={`/masters/materials/material-types/${t.id}/edit`} className="datatable-action" title="Edit Material Type">
                          <Edit size={14} />
                        </Link>
                        <button className="datatable-action danger" type="button" title="Delete Material Type" onClick={() => removeMaterialType(t.id)}>
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
      
      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
