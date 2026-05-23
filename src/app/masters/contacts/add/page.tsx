"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import API from "@/services/api";
import { Plus } from "lucide-react";
import {
  Contact,
  CONTACTS_STORAGE_KEY,
  clientOptions,
  initialContacts,
} from "@/lib/contacts-data";

type FormErrors = Partial<
  Record<"client" | "contact" | "designation" | "department" | "mobile" | "email" | "address" | "city" | "state" | "pinCode", string>
>;

const emptyForm = {
  clientId: 0,
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
};

export default function AddContactPage() {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [toast, setToast] = useState("");

  const update = (field: keyof typeof form, value: string | number) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (field in errors && String(value).trim()) {
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
    let maxId = 0;
    list.forEach((c) => {
      if (c.id > maxId) maxId = c.id;
    });

    const record: Contact = {
      id: maxId + 1,
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
      status: true,
    };

    const next = [...list, record];
    localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(next));
    API.post("/api/master/contacts", record).catch(() => undefined);

    setToast("✓ Contact created successfully");
    window.setTimeout(() => router.push("/masters/contacts"), 900);
  };

  const fieldClass = (field: keyof FormErrors) =>
    errors[field] ? "edit-user-input edit-user-input-error" : "edit-user-input";

  return (
    <div className="edit-user-page contact-form-page">
      {toast && <div className="edit-user-toast">{toast}</div>}

      <section className="edit-user-card contact-form-card wide-card">
        <div className="edit-user-header">
          <h1><span style={{ display: "flex", alignItems: "center", gap: "10px" }}><Plus size={24} /> New Contact</span></h1>
        </div>

        <form className="form-three-col" onSubmit={(e) => e.preventDefault()}>
          {/* Column 1 */}
          <div className="form-col">
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
                  placeholder="<Enter Contact Name>"
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
                  placeholder="<Enter Designation>"
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
                  placeholder="<Enter Department>"
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
                  placeholder="<Enter Mobile #>"
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
                  placeholder="<Enter Email>"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                />
                {errors.email && <p className="edit-user-error">{errors.email}</p>}
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
                  placeholder="<Enter Address>"
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
                  placeholder="<Enter Additional Notes about Client>"
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
              Submit
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
