"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const initialData = [
  { id: 1, userType: "1 - Super", userName: "1 - Vamsi", privilege: "1 - SyllabusUpload", description: "User can upload Syllabus", status: true },
  { id: 2, userType: "1 - Super", userName: "1 - Vamsi", privilege: "2 - SyllabusReview", description: "User can review Syllabus", status: true },
  { id: 3, userType: "4 - Expert", userName: "4 - Venu", privilege: "3 - SyllabusApproval", description: "User can Approval Syllabus", status: true },
  { id: 4, userType: "3 - Associate", userName: "3 - Sameer", privilege: "4 - CourseUpload", description: "User can upload Course", status: true },
  { id: 5, userType: "3 - Associate", userName: "3 - Sameer", privilege: "5 - CourseReview", description: "User can review Course", status: true },
  { id: 6, userType: "4 - Expert", userName: "4 - Venu", privilege: "6 - SyllabusApproval", description: "User can Aoorive Course", status: true },
];

const storageKey = "transaction-user-access-privileges-v1";

type UserAccessPrivilege = {
  id: number;
  userType: string;
  userName: string;
  privilege: string;
  description: string;
  status: boolean;
};

type ValidationErrors = Partial<Record<"userType" | "userName" | "privilege" | "description", string>>;
const requiredFields: Array<keyof ValidationErrors> = ["userType", "userName", "privilege", "description"];

export default function AddUserAccessPrivilegePage() {
  const router = useRouter();
  
  const [form, setForm] = useState<UserAccessPrivilege>({
    id: 0,
    userType: "",
    userName: "",
    privilege: "",
    description: "",
    status: true
  });

  useEffect(() => {
    const storedRows = localStorage.getItem(storageKey);
    const existingData = storedRows ? JSON.parse(storedRows) : initialData;
    let maxId = 0;
    if (existingData.length > 0) {
      existingData.forEach((p: UserAccessPrivilege) => {
        if (p.id > maxId) maxId = p.id;
      });
    }
    setForm(f => ({ ...f, id: maxId + 1 }));
  }, []);

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [toast, setToast] = useState("");

  const updateField = (field: keyof UserAccessPrivilege, value: any) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
    if (field in errors && typeof value === 'string' && value.trim()) {
      setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const nextErrors: ValidationErrors = {};
    requiredFields.forEach((field) => {
      if (!(form[field as keyof UserAccessPrivilege] as string).trim()) {
        nextErrors[field] = "This field is required";
      }
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const saveRecord = () => {
    if (!validateForm()) return;

    const storedData = localStorage.getItem(storageKey);
    const currentData = storedData ? JSON.parse(storedData) as UserAccessPrivilege[] : initialData;
    
    const nextData = [...currentData, form];
    localStorage.setItem(storageKey, JSON.stringify(nextData));
    setToast("✓ Record created successfully");

    window.setTimeout(() => {
      router.push("/transaction/user-access-privileges-list");
    }, 1000);
  };

  const fieldClass = (field: keyof ValidationErrors) =>
    errors[field] ? "edit-user-input edit-user-input-error" : "edit-user-input";

  return (
    <div className="edit-user-page">
      {toast && (
        <div className="edit-user-toast">
          {toast}
        </div>
      )}

      <section className="edit-user-card">
        <div className="edit-user-header">
          <h1>🛡️ Add Privilege Access</h1>
        </div>

        <form className="edit-user-form">
          <div className="edit-user-row">
            <label htmlFor="userType">User Type ID / User Type *</label>
            <div className="edit-user-field">
              <input
                id="userType"
                className={fieldClass("userType")}
                type="text"
                placeholder="e.g. 1 - Super"
                value={form.userType}
                onChange={(event) => updateField("userType", event.target.value)}
              />
              {errors.userType && <p className="edit-user-error">{errors.userType}</p>}
            </div>
          </div>
          
          <div className="edit-user-row">
            <label htmlFor="userName">User ID / Name *</label>
            <div className="edit-user-field">
              <input
                id="userName"
                className={fieldClass("userName")}
                type="text"
                placeholder="e.g. 1 - Vamsi"
                value={form.userName}
                onChange={(event) => updateField("userName", event.target.value)}
              />
              {errors.userName && <p className="edit-user-error">{errors.userName}</p>}
            </div>
          </div>
          
          <div className="edit-user-row">
            <label htmlFor="privilege">PrivilegeID / Privilege *</label>
            <div className="edit-user-field">
              <input
                id="privilege"
                className={fieldClass("privilege")}
                type="text"
                placeholder="e.g. 1 - SyllabusUpload"
                value={form.privilege}
                onChange={(event) => updateField("privilege", event.target.value)}
              />
              {errors.privilege && <p className="edit-user-error">{errors.privilege}</p>}
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
            <div className="edit-user-field">
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", width: "fit-content" }}>
                <input
                  type="checkbox"
                  id="status"
                  checked={form.status}
                  onChange={(e) => updateField("status", e.target.checked)}
                  style={{ width: "16px", height: "16px", accentColor: "#8b5cf6" }}
                />
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>
                  {form.status ? "True (Active)" : "False (Inactive)"}
                </span>
              </label>
            </div>
          </div>

          <div className="edit-user-actions">
            <Link href="/transaction/user-access-privileges-list" className="edit-user-cancel">
              Cancel
            </Link>
            <button type="button" className="edit-user-update" onClick={saveRecord}>
              Submit
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
