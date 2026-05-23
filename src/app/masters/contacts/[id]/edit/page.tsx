"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import API from "@/services/api";
import { Edit } from "lucide-react";
import {
  Contact,
  CONTACTS_STORAGE_KEY,
  clientOptions,
  initialContacts,
} from "@/lib/contacts-data";

type FormErrors = Partial<
  Record<"client" | "contact" | "designation" | "department" | "mobile" | "email" | "address" | "city" | "state" | "pinCode", string>
>;

export default function EditContactPage() {
  const router = useRouter();
  const params = useParams();
  const idStr = Array.isArray(params.id) ? params.id[0] : params.id;
  const targetId = parseInt(idStr || "0", 10);

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    id: 0,
    clientId: 1,
    client: "",
    contact: "",
    designation: "",
    department: "",
    mobile: "",
    email: "",
    website: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    notes: "",
    status: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [toast, setToast] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(CONTACTS_STORAGE_KEY);
    const list: Contact[] = stored ? JSON.parse(stored) : initialContacts;
    const found = list.find((c) => c.id === targetId);
    if (found) {
      setForm({
        ...found,
        contact: found.contact || "",
        designation: found.designation || "",
        department: found.department || "",
      });
    } else {
      router.push("/masters/contacts");
    }
    setLoading(false);
  }, [targetId, router]);

  const update = (field: keyof typeof form, value: string | number | boolean) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (typeof value === "string" && field in errors && value.trim()) {
      setErrors((e) => ({ ...e, [field]: undefined }));
    }
  };

  const onClientChange = (val: string) => {
    if (val === "0" || val === "") {
      setForm((f) => ({ ...f, clientId: 0, client: "" }));
      return;
    }
    const opt = clientOptions.find((c) => String(c.id) === val);
    if (opt) {
      setForm((f) => ({ ...f, clientId: opt.id, client: opt.name }));
      if (errors.client) setErrors((e) => ({ ...e, client: undefined }));
    }
  };

  const validate = () => {
    const next: FormErrors = {};
    if (!form.client.trim() || form.clientId === 0) next.client = "This field is required";
    if (!form.contact.trim()) next.contact = "This field is required";
    if (!form.designation.trim()) next.designation = "This field is required";
    if (!form.department.trim()) next.department = "This field is required";
    if (!form.mobile.trim()) next.mobile = "This field is required";
    if (!form.email.trim()) next.email = "This field is required";
    if (!form.address.trim()) next.address = "This field is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const save = () => {
    if (!validate()) return;

    const stored = localStorage.getItem(CONTACTS_STORAGE_KEY);
    const list: Contact[] = stored ? JSON.parse(stored) : initialContacts;
    const updated: Contact = {
      id: targetId,
      clientId: form.clientId,
      client: form.client,
      contact: form.contact.trim(),
      designation: form.designation.trim(),
      department: form.department.trim(),
      mobile: form.mobile.trim(),
      email: form.email.trim(),
      website: form.website.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      pinCode: form.pinCode.trim(),
      notes: form.notes.trim(),
      status: form.status,
    };

    const next = list.map((c) => (c.id === targetId ? updated : c));
    localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(next));
    API.put(`/api/master/contacts/${targetId}`, updated).catch(() => undefined);

    setToast("✓ Contact updated successfully");
    window.setTimeout(() => router.push("/masters/contacts"), 900);
  };

  const fieldClass = (field: keyof FormErrors) =>
    errors[field] ? "edit-user-input edit-user-input-error" : "edit-user-input";

  if (loading) return null;

  return (
    <div className="edit-user-page contact-form-page">
      {toast && <div className="edit-user-toast">{toast}</div>}

      <section className="edit-user-card contact-form-card wide-card">
        <div className="edit-user-header">
          <h1><span style={{ display: "flex", alignItems: "center", gap: "10px" }}><Edit size={24} /> Modify Contact</span></h1>
        </div>

        <form className="form-three-col" onSubmit={(e) => e.preventDefault()}>
          {/* Column 1 */}
          <div className="form-col">
            <div className="edit-user-row compact contact-id-row">
              <label htmlFor="contactId">Contact ID</label>
              <div className="edit-user-field">
                <input id="contactId" className="edit-user-input" value={form.id} readOnly disabled />
              </div>
            </div>

            <div className="edit-user-row compact">
              <label htmlFor="client">Client *</label>
              <div className="edit-user-field">
                <select
                  id="client"
                  className={fieldClass("client")}
                  value={String(form.clientId)}
                  onChange={(e) => onClientChange(e.target.value)}
                >
                  <option value="0">Select</option>
                  {clientOptions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.client && <p className="edit-user-error">{errors.client}</p>}
              </div>
            </div>

            <div className="edit-user-row compact">
              <label htmlFor="contact">Contact Name *</label>
              <div className="edit-user-field">
                <input
                  id="contact"
                  className={fieldClass("contact")}
                  placeholder="Contact Name"
                  value={form.contact}
                  onChange={(e) => update("contact", e.target.value)}
                />
                {errors.contact && <p className="edit-user-error">{errors.contact}</p>}
              </div>
            </div>

            <div className="edit-user-row compact">
              <label htmlFor="designation">Designation *</label>
              <div className="edit-user-field">
                <input
                  id="designation"
                  className={fieldClass("designation")}
                  placeholder="COE"
                  value={form.designation}
                  onChange={(e) => update("designation", e.target.value)}
                />
                {errors.designation && <p className="edit-user-error">{errors.designation}</p>}
              </div>
            </div>
          </div>

          {/* Column 2 */}
          <div className="form-col">
            <div className="edit-user-row compact">
              <label htmlFor="department">Department *</label>
              <div className="edit-user-field">
                <input
                  id="department"
                  className={fieldClass("department")}
                  placeholder="Examinations"
                  value={form.department}
                  onChange={(e) => update("department", e.target.value)}
                />
                {errors.department && <p className="edit-user-error">{errors.department}</p>}
              </div>
            </div>

            <div className="edit-user-row compact">
              <label htmlFor="mobile">Mobile *</label>
              <div className="edit-user-field">
                <input
                  id="mobile"
                  className={fieldClass("mobile")}
                  placeholder="Mobile #"
                  value={form.mobile}
                  onChange={(e) => update("mobile", e.target.value)}
                />
                {errors.mobile && <p className="edit-user-error">{errors.mobile}</p>}
              </div>
            </div>

            <div className="edit-user-row compact">
              <label htmlFor="email">Email *</label>
              <div className="edit-user-field">
                <input
                  id="email"
                  type="email"
                  className={fieldClass("email")}
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                />
                {errors.email && <p className="edit-user-error">{errors.email}</p>}
              </div>
            </div>

            <div className="edit-user-row compact">
              <label htmlFor="status">Status</label>
            <div className="edit-user-field" style={{ display: "flex", alignItems: "center", minHeight: "42px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button
                  type="button"
                  id="status"
                  onClick={() => update("status", !form.status)}
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
          </div>

          {/* Column 3 */}
          <div className="form-col">
            <div className="edit-user-row compact">
              <label htmlFor="address">Address *</label>
              <div className="edit-user-field">
                <textarea
                  id="address"
                  className={fieldClass("address")}
                  placeholder="<Address>"
                  rows={2}
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                />
                {errors.address && <p className="edit-user-error">{errors.address}</p>}
              </div>
            </div>

            <div className="edit-user-row compact">
              <label htmlFor="notes">Notes</label>
              <div className="edit-user-field">
                <textarea
                  id="notes"
                  className="edit-user-input"
                  placeholder="Additional Notes about Contact"
                  rows={2}
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="edit-user-actions contact-form-actions form-actions-row">
            <Link href="/masters/contacts" className="edit-user-cancel">
              Cancel
            </Link>
            <button type="button" className="edit-user-update" onClick={save}>
              Update
            </button>
          </div>
        </form>
      </section>

      <style>{`
        .contact-form-page { padding: 16px 24px 24px; }
        .contact-form-card {
          margin: 0 auto;
          padding: 28px 32px !important;
        }
        .contact-form-card .edit-user-header {
          margin-bottom: 24px !important;
          padding-bottom: 14px !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .contact-form-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        .contact-id-row { margin-bottom: 4px; }
        .contact-form-page .edit-user-row.compact input:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .contact-form-actions .edit-user-update {
          background: linear-gradient(135deg, #10b981, #047857) !important;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2) !important;
        }
        .contact-form-actions .edit-user-update:hover {
          box-shadow: 0 6px 18px rgba(16, 185, 129, 0.35) !important;
          transform: translateY(-1px) !important;
        }
      `}</style>
    </div>
  );
}
