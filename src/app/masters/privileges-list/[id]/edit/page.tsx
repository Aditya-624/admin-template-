"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import API from "@/services/api";
import { Edit } from "lucide-react";

const initialPrivileges: { id: number; name: string; description: string; status: boolean }[] = [];

const storageKey = "masters-privileges-list-v1";

type Privilege = {
  id: number;
  name: string;
  description: string;
  status: boolean;
};

type ValidationErrors = Partial<Record<"name" | "description", string>>;
const requiredFields: Array<keyof ValidationErrors> = ["name", "description"];

export default function EditPrivilegePage() {
  const router = useRouter();
  const params = useParams();
  const idStr = Array.isArray(params.id) ? params.id[0] : params.id;
  const targetId = parseInt(idStr || "0", 10);

  const [form, setForm] = useState<Privilege>({
    id: 0,
    name: "",
    description: "",
    status: true
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(`Fetching privilege details for ID: ${targetId}...`);
    setLoading(true);
    API.get(`/api/master/access-privileges/${targetId}`)
      .then((res) => {
        if (res.data) {
          console.log("Successfully fetched privilege details:", res.data);
          const p = res.data;
          setForm({
            id: typeof p.id === "number" ? p.id : targetId,
            name: String(p.name ?? p.privilege ?? p.accessPrivilege ?? p.access_privilege ?? ""),
            description: String(p.description ?? ""),
            status: p.status === true || p.status === "Active" || p.status === "active" || p.status === 1 || String(p.status).toLowerCase() === "true"
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Backend fetch failed, trying local storage/fallback:", err);
        const storedRows = localStorage.getItem(storageKey);
        const existingPrivileges = storedRows ? JSON.parse(storedRows) : initialPrivileges;
        const found = existingPrivileges.find((p: Privilege) => p.id === targetId);
        if (found) {
          setForm(found);
        } else {
          router.push("/masters/privileges-list");
        }
        setLoading(false);
      });
  }, [targetId, router]);

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [toast, setToast] = useState("");

  const updateField = (field: keyof Privilege, value: any) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
    if (field in errors && typeof value === 'string' && value.trim()) {
      setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const nextErrors: ValidationErrors = {};
    requiredFields.forEach((field) => {
      if (!(form[field as keyof Privilege] as string).trim()) {
        nextErrors[field] = "This field is required";
      }
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const savePrivilege = () => {
    if (!validateForm()) return;

    const payload = {
      AccessPrivilege: form.name,
      Description: form.description,
      Status: form.status
    };

    console.log("Sending PUT to /api/master/access-privileges/" + targetId + " with payload:", payload);
    API.put(`/api/master/access-privileges/${targetId}`, payload)
      .then((res) => {
        console.log("Successfully updated privilege in backend:", res.data);
        const storedPrivileges = localStorage.getItem(storageKey);
        const currentPrivileges = storedPrivileges ? JSON.parse(storedPrivileges) as Privilege[] : initialPrivileges;
        const nextPrivileges = currentPrivileges.map((p) => (p.id === targetId ? form : p));
        localStorage.setItem(storageKey, JSON.stringify(nextPrivileges));
        setToast("✓ Privilege updated successfully");
        window.setTimeout(() => {
          router.push("/masters/privileges-list");
        }, 1000);
      })
      .catch((err) => {
        console.error("Failed to update privilege in backend, saving locally:", err);
        const storedPrivileges = localStorage.getItem(storageKey);
        const currentPrivileges = storedPrivileges ? JSON.parse(storedPrivileges) as Privilege[] : initialPrivileges;
        const nextPrivileges = currentPrivileges.map((p) => (p.id === targetId ? form : p));
        localStorage.setItem(storageKey, JSON.stringify(nextPrivileges));
        setToast("✓ Privilege updated locally");
        window.setTimeout(() => {
          router.push("/masters/privileges-list");
        }, 1000);
      });
  };

  const fieldClass = (field: keyof ValidationErrors) =>
    errors[field] ? "edit-user-input edit-user-input-error" : "edit-user-input";

  if (loading) return null;

  return (
    <div className="edit-user-page">
      {toast && (
        <div className="edit-user-toast">
          {toast}
        </div>
      )}

      <section className="edit-user-card">
        <div className="edit-user-header">
          <h1><span style={{ display: "flex", alignItems: "center", gap: "10px" }}><Edit size={24} /> Edit Privilege</span></h1>
        </div>

        <form className="edit-user-form">
          <div className="edit-user-row">
            <label htmlFor="privilege-name">Privilege Name *</label>
            <div className="edit-user-field">
              <input
                id="privilege-name"
                className={fieldClass("name")}
                type="text"
                placeholder="<Enter Privilege Name>"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
              />
              {errors.name && <p className="edit-user-error">{errors.name}</p>}
            </div>
          </div>

          <div className="edit-user-row">
            <label htmlFor="description">Description *</label>
            <div className="edit-user-field">
              <textarea
                id="description"
                className={fieldClass("description")}
                placeholder="<Enter Description>"
                rows={3}
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
              />
              {errors.description && <p className="edit-user-error">{errors.description}</p>}
            </div>
          </div>

          <div className="edit-user-row" style={{ alignItems: "center" }}>
            <label htmlFor="status" style={{ marginBottom: 0 }}>Status</label>
            <div className="edit-user-field" style={{ display: "flex", alignItems: "center", minHeight: "42px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button
                  type="button"
                  id="status"
                  onClick={() => updateField("status", !form.status)}
                  className={`status-toggle ${form.status ? "active" : ""}`}
                  aria-pressed={form.status}
                  style={{
                    position: "relative",
                    width: "48px",
                    height: "24px",
                    borderRadius: "9999px",
                    background: form.status ? "#34c759" : "#4b5563",
                    border: "none",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease, transform 0.1s ease",
                    padding: "0"
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      background: "#ffffff",
                      position: "absolute",
                      top: "3px",
                      left: form.status ? "27px" : "3px",
                      transition: "left 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                    }}
                  />
                </button>
                <span
                  style={{
                    color: form.status ? "#34c759" : "#9ca3af",
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    transition: "color 0.2s ease"
                  }}
                >
                  {form.status ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          <div className="edit-user-actions">
            <Link href="/masters/privileges-list" className="edit-user-cancel">
              Cancel
            </Link>
            <button type="button" className="edit-user-update" onClick={savePrivilege}>
              Update
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
