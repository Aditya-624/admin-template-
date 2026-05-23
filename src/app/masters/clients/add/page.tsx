"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import API from "@/services/api";
import { Plus } from "lucide-react";
import {
  Client,
  CLIENTS_STORAGE_KEY,
  initialClients,
} from "@/lib/clients-data";

type FormErrors = Partial<
  Record<"clientName" | "mobile" | "email" | "address" | "city" | "state" | "pinCode", string>
>;

const emptyForm = {
  clientName: "",
  mobile: "",
  email: "",
  website: "",
  address: "",
  city: "",
  state: "",
  pinCode: "",
  gstNumber: "",
  notes: "",
};

export default function AddClientPage() {
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

  const validate = () => {
    const next: FormErrors = {};
    if (!form.clientName.trim()) next.clientName = "This field is required";
    if (!form.mobile.trim()) next.mobile = "This field is required";
    if (!form.email.trim()) next.email = "This field is required";
    if (!form.address.trim()) next.address = "This field is required";
    if (!form.city.trim()) next.city = "This field is required";
    if (!form.state.trim()) next.state = "This field is required";
    if (!form.pinCode.trim()) next.pinCode = "This field is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const save = () => {
    if (!validate()) return;

    const stored = localStorage.getItem(CLIENTS_STORAGE_KEY);
    const list: Client[] = stored ? JSON.parse(stored) : initialClients;
    let maxId = 0;
    list.forEach((c) => {
      if (c.id > maxId) maxId = c.id;
    });

    const record: Client = {
      id: maxId + 1,
      clientId: maxId + 1,
      clientName: form.clientName.trim(),
      mobile: form.mobile.trim(),
      email: form.email.trim(),
      website: form.website.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      pinCode: form.pinCode.trim(),
      gstNumber: form.gstNumber.trim(),
      notes: form.notes.trim(),
      status: true,
    };

    const next = [...list, record];
    localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(next));
    API.post("/api/master/clients", record).catch(() => undefined);

    setToast("✓ Client created successfully");
    window.setTimeout(() => router.push("/masters/clients"), 900);
  };

  const fieldClass = (field: keyof FormErrors) =>
    errors[field] ? "edit-user-input edit-user-input-error" : "edit-user-input";

  return (
    <div className="edit-user-page contact-form-page">
      {toast && <div className="edit-user-toast">{toast}</div>}

      <section className="edit-user-card contact-form-card wide-card">
        <div className="edit-user-header">
          <h1><span style={{ display: "flex", alignItems: "center", gap: "10px" }}><Plus size={24} /> New Client</span></h1>
        </div>

        <form className="form-three-col" onSubmit={(e) => e.preventDefault()}>
          {/* Row 1 */}
          <div className="edit-user-row compact">
            <label htmlFor="clientName">Client *</label>
            <div className="edit-user-field">
              <input
                id="clientName"
                className={fieldClass("clientName")}
                placeholder="<Enter Client Name>"
                value={form.clientName}
                onChange={(e) => update("clientName", e.target.value)}
              />
              {errors.clientName && <p className="edit-user-error">{errors.clientName}</p>}
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

          {/* Row 2 */}
          <div className="edit-user-row compact">
            <label htmlFor="website">Website</label>
            <div className="edit-user-field">
              <input
                id="website"
                className="edit-user-input"
                placeholder="<Enter Website>"
                value={form.website}
                onChange={(e) => update("website", e.target.value)}
              />
            </div>
          </div>

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
            <label htmlFor="pinCode">Pin Code *</label>
            <div className="edit-user-field">
              <input
                id="pinCode"
                className={fieldClass("pinCode")}
                placeholder="<Enter Pin Code>"
                value={form.pinCode}
                onChange={(e) => update("pinCode", e.target.value)}
              />
              {errors.pinCode && <p className="edit-user-error">{errors.pinCode}</p>}
            </div>
          </div>

          {/* Row 3 */}
          <div className="edit-user-row compact">
            <label htmlFor="city">City *</label>
            <div className="edit-user-field">
              <input
                id="city"
                className={fieldClass("city")}
                placeholder="<Enter City>"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
              />
              {errors.city && <p className="edit-user-error">{errors.city}</p>}
            </div>
          </div>

          <div className="edit-user-row compact">
            <label htmlFor="state">State *</label>
            <div className="edit-user-field">
              <input
                id="state"
                className={fieldClass("state")}
                placeholder="<Enter State>"
                value={form.state}
                onChange={(e) => update("state", e.target.value)}
              />
              {errors.state && <p className="edit-user-error">{errors.state}</p>}
            </div>
          </div>

          <div className="edit-user-row compact">
            <label htmlFor="gstNumber">GST Number</label>
            <div className="edit-user-field">
              <input
                id="gstNumber"
                className="edit-user-input"
                placeholder="<Enter GST Number>"
                value={form.gstNumber}
                onChange={(e) => update("gstNumber", e.target.value)}
              />
            </div>
          </div>

          {/* Full Width Notes */}
          <div className="edit-user-row compact form-full-width">
            <label htmlFor="notes">Notes</label>
            <div className="edit-user-field">
              <textarea
                id="notes"
                className="edit-user-input"
                placeholder="<Enter Additional Notes>"
                rows={2}
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="edit-user-actions form-actions-row">
            <Link href="/masters/clients" className="edit-user-cancel">
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
        .contact-form-card .edit-user-header {
          margin-bottom: 20px !important;
          padding-bottom: 14px !important;
        }
      `}</style>
    </div>
  );
}
