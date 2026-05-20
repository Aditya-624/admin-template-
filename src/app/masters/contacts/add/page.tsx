"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import API from "@/services/api";
import {
  Contact,
  CONTACTS_STORAGE_KEY,
  clientOptions,
  initialContacts,
} from "@/lib/contacts-data";

type FormErrors = Partial<
  Record<"client" | "mobile" | "email" | "address" | "city" | "state" | "pinCode", string>
>;

const emptyForm = {
  clientId: 1,
  client: "ABC University",
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
    const opt = clientOptions.find((c) => String(c.id) === val);
    if (opt) {
      setForm((f) => ({ ...f, clientId: opt.id, client: opt.name }));
      if (errors.client) setErrors((e) => ({ ...e, client: undefined }));
    }
  };

  const validate = () => {
    const next: FormErrors = {};
    if (!form.client.trim()) next.client = "This field is required";
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

      <section className="edit-user-card contact-form-card">
        <div className="edit-user-header">
          <h1>New Contact</h1>
        </div>

        <form className="contact-form-two-col" onSubmit={(e) => e.preventDefault()}>
          <div className="contact-form-col">
            <div className="edit-user-row compact">
              <label htmlFor="client">Client *</label>
              <div className="edit-user-field">
                <select
                  id="client"
                  className={fieldClass("client")}
                  value={String(form.clientId)}
                  onChange={(e) => onClientChange(e.target.value)}
                >
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
          </div>

          <div className="contact-form-col">
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
          </div>

          <div className="edit-user-row compact contact-form-full">
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

          <div className="edit-user-actions contact-form-actions">
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
          max-width: 960px;
          margin: 0 auto;
          padding: 28px 32px !important;
        }
        .contact-form-card .edit-user-header {
          margin-bottom: 20px !important;
          padding-bottom: 14px !important;
        }
        .contact-form-two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px 48px;
          align-items: start;
        }
        .contact-form-col {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .contact-form-full { grid-column: 1 / -1; margin-top: 4px; }
        .contact-form-actions {
          grid-column: 1 / -1;
          margin-top: 16px;
          padding-top: 8px;
        }
        .contact-form-page .edit-user-row.compact {
          display: grid;
          grid-template-columns: minmax(110px, 32%) 1fr;
          gap: 14px 16px !important;
          align-items: start;
          margin-bottom: 0 !important;
        }
        .contact-form-page .edit-user-row.compact label {
          padding-top: 10px;
          font-size: 0.9rem !important;
          line-height: 1.4;
        }
        .contact-form-page .edit-user-row.compact textarea,
        .contact-form-page .edit-user-row.compact input,
        .contact-form-page .edit-user-row.compact select {
          padding: 10px 14px !important;
          font-size: 0.9rem !important;
        }
        .contact-form-page .edit-user-row.compact textarea {
          min-height: 72px;
        }
        @media (max-width: 768px) {
          .contact-form-two-col { grid-template-columns: 1fr; gap: 16px; }
        }
      `}</style>
    </div>
  );
}
