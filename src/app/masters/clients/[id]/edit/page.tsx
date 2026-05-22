"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import API from "@/services/api";
import {
  Client,
  CLIENTS_STORAGE_KEY,
  initialClients,
  mapApiClient,
} from "@/lib/clients-data";

type FormErrors = Partial<
  Record<"clientName" | "mobile" | "email" | "address" | "city" | "state" | "pinCode", string>
>;

const emptyForm = {
  clientId: 0,
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
  status: true,
};

export default function EditClientPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = parseInt(params.id, 10);
    const stored = localStorage.getItem(CLIENTS_STORAGE_KEY);
    const list: Client[] = stored ? JSON.parse(stored) : initialClients;
    const existing = list.find((c) => c.id === id);

    if (existing) {
      setForm({
        clientId: existing.clientId,
        clientName: existing.clientName,
        mobile: existing.mobile,
        email: existing.email,
        website: existing.website,
        address: existing.address,
        city: existing.city,
        state: existing.state,
        pinCode: existing.pinCode,
        gstNumber: existing.gstNumber,
        notes: existing.notes,
        status: existing.status,
      });
      setLoading(false);
    } else {
      API.get(`/api/master/clients/${id}`)
        .then((res) => {
          if (res.data) {
            const mapped = mapApiClient(res.data, id);
            setForm({
              clientId: mapped.clientId,
              clientName: mapped.clientName,
              mobile: mapped.mobile,
              email: mapped.email,
              website: mapped.website,
              address: mapped.address,
              city: mapped.city,
              state: mapped.state,
              pinCode: mapped.pinCode,
              gstNumber: mapped.gstNumber,
              notes: mapped.notes,
              status: mapped.status,
            });
          }
        })
        .catch(() => undefined)
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  const update = (field: keyof typeof form, value: string | number | boolean) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (field in errors && String(value).trim()) {
      setErrors((e) => ({ ...e, [field as keyof FormErrors]: undefined }));
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
    const id = parseInt(params.id, 10);
    const stored = localStorage.getItem(CLIENTS_STORAGE_KEY);
    const list: Client[] = stored ? JSON.parse(stored) : initialClients;

    const idx = list.findIndex((c) => c.id === id);
    if (idx !== -1) {
      list[idx] = {
        ...list[idx],
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
        status: form.status,
      };
      localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(list));
      API.put(`/api/master/clients/${id}`, list[idx]).catch(() => undefined);
    }

    setToast("✓ Client updated successfully");
    window.setTimeout(() => router.push("/masters/clients"), 900);
  };

  const fieldClass = (field: keyof FormErrors) =>
    errors[field] ? "edit-user-input edit-user-input-error" : "edit-user-input";

  if (loading) {
    return <div style={{ padding: 24, color: "#fff" }}>Loading client data...</div>;
  }

  return (
    <div className="edit-user-page contact-form-page">
      {toast && <div className="edit-user-toast">{toast}</div>}

      <section className="edit-user-card contact-form-card">
        <div className="edit-user-header">
          <h1>Edit Client</h1>
        </div>

        <form className="contact-form-two-col" onSubmit={(e) => e.preventDefault()}>
          <div className="contact-form-col">
            <div className="edit-user-row compact">
              <label htmlFor="clientId">Client ID</label>
              <div className="edit-user-field">
                <input
                  id="clientId"
                  className="edit-user-input"
                  style={{ opacity: 0.7, cursor: "not-allowed" }}
                  value={form.clientId}
                  disabled
                />
              </div>
            </div>

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

            <div className="edit-user-row compact">
              <label htmlFor="status">Status</label>
              <div className="edit-user-field" style={{ display: "flex", alignItems: "center", gap: "8px", paddingTop: "10px" }}>
                <input
                  type="checkbox"
                  id="status"
                  checked={form.status}
                  onChange={(e) => update("status", e.target.checked)}
                  style={{ width: "18px", height: "18px" }}
                />
                <span style={{ color: "#fff", fontSize: "0.9rem" }}>{form.status ? "Yes" : "No"}</span>
              </div>
            </div>
          </div>

          <div className="edit-user-row compact contact-form-full">
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

          <div className="edit-user-actions contact-form-actions">
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
