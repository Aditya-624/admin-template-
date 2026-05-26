"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import API from "@/services/api";
import { Plus } from "lucide-react";

type User = {
  id: string;
  type: string;
  name: string;
  mobile: string;
  email: string;
  loginId: string;
  description: string;
  status: string;
};

const users: User[] = [];
const storageKey = "masters-user-list-v4";
type ValidationErrors = Partial<Record<"name" | "mobile" | "email" | "loginId", string>>;

type UserTypeOption = {
  id: number;
  name: string;
};

const requiredFields: Array<keyof ValidationErrors> = ["name", "mobile", "email", "loginId"];

export default function AddUserPage() {
  const router = useRouter();

  // ── User Type Dropdown State (fetched from DB via API) ────────────────────
  const [userTypeOptions, setUserTypeOptions] = useState<UserTypeOption[]>([]);
  const [userTypesLoading, setUserTypesLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching user types dropdown from /api/users/user-types-dropdown...");
    setUserTypesLoading(true);

    // Try the dedicated dropdown endpoint first
    API.get("/api/users/user-types-dropdown")
      .then((res) => {
        console.log("User types dropdown response:", res.data);
        const rawData = res.data;
        const data = Array.isArray(rawData) ? rawData : (rawData && Array.isArray(rawData.data) ? rawData.data : []);
        const activeData = data.filter((ut: any) => ut.status === undefined || ut.status === true || ut.status === "Active" || ut.status === "active" || ut.status === 1 || String(ut.status).toLowerCase() === "true");
        const opts: UserTypeOption[] = activeData.map((ut: any, idx: number) => ({
          id: typeof ut.id === "number" ? ut.id : parseInt(ut.id ?? ut.user_type_id ?? ut.userTypeId ?? (idx + 1), 10),
          name: String(ut.name ?? ut.user_type ?? ut.userType ?? ut.label ?? ut.value ?? "N/A"),
        }));
        setUserTypeOptions(opts);
        setUserTypesLoading(false);
      })
      .catch((err) => {
        console.warn("Dedicated dropdown endpoint failed, falling back to /api/master/user-types:", err);
        // Fallback: use the full user types list
        API.get("/api/master/user-types")
          .then((res) => {
            console.log("Fallback user types response:", res.data);
            const rawData = res.data;
            const data = Array.isArray(rawData) ? rawData : (rawData && Array.isArray(rawData.data) ? rawData.data : []);
            const activeData = data.filter((ut: any) => ut.status === undefined || ut.status === true || ut.status === "Active" || ut.status === "active" || ut.status === 1 || String(ut.status).toLowerCase() === "true");
            const opts: UserTypeOption[] = activeData.map((ut: any, idx: number) => ({
              id: typeof ut.id === "number" ? ut.id : parseInt(ut.id ?? ut.user_type_id ?? (idx + 1), 10),
              name: String(ut.name ?? ut.user_type ?? ut.userType ?? "N/A"),
            }));
            setUserTypeOptions(opts);
            setUserTypesLoading(false);
          })
          .catch((err2) => {
            console.error("Both user type endpoints failed, using storage/hardcoded fallback:", err2);
            let fallback: UserTypeOption[] = [];
            const localData = typeof window !== "undefined" ? localStorage.getItem("masters-usertype-list-v1") : null;
            if (localData) {
              try {
                const parsed = JSON.parse(localData);
                if (Array.isArray(parsed)) {
                  fallback = parsed
                    .filter((ut: any) => ut.status === undefined || ut.status === true || ut.status === "Active" || ut.status === "active" || ut.status === 1 || String(ut.status).toLowerCase() === "true")
                    .map((ut: any) => ({
                      id: ut.id,
                      name: ut.name
                    }));
                }
              } catch (e) {
                console.error("Error parsing local storage user types:", e);
              }
            }
            if (fallback.length === 0) {
              fallback = [
                { id: 1, name: "Super" },
                { id: 2, name: "Admin" },
                { id: 3, name: "Associate" },
                { id: 4, name: "Expert" },
                { id: 5, name: "ClientAdmin" },
                { id: 6, name: "Evaluator" },
                { id: 7, name: "Student" },
              ];
            }
            setUserTypeOptions(fallback);
            setUserTypesLoading(false);
          });
      });
  }, []);

  // ── Form State ────────────────────────────────────────────────────────────
  const [form, setForm] = useState<User>({
    id: "",
    type: "",
    name: "",
    mobile: "",
    email: "",
    loginId: "",
    description: "",
    status: "Active"
  });

  // Set auto-incremented ID from existing users
  useEffect(() => {
    const storedRows = localStorage.getItem(storageKey);
    const existingUsers = storedRows ? JSON.parse(storedRows) : users;
    let maxId = 0;
    if (existingUsers.length > 0) {
      existingUsers.forEach((u: User) => {
        const num = parseInt(u.id, 10);
        if (!isNaN(num) && num > maxId) maxId = num;
      });
    }
    setForm((f) => ({ ...f, id: String(maxId + 1) }));
  }, []);

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [toast, setToast] = useState("");

  const updateField = (field: keyof User, value: string) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
    if (field in errors && value.trim()) {
      setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const nextErrors: ValidationErrors = {};
    requiredFields.forEach((field) => {
      if (!form[field].trim()) {
        nextErrors[field] = "This field is required";
      }
    });

    if (form.mobile.trim() && !/^\d{7,15}$/.test(form.mobile.trim())) {
      nextErrors.mobile = "Enter a valid mobile number (digits only, 7-15 digits)";
    }

    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Enter valid email address";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const saveUser = () => {
    if (!validateForm()) return;

    // Always save to localStorage immediately so the list page shows it
    const storedUsers = localStorage.getItem(storageKey);
    const currentUsers = storedUsers ? (JSON.parse(storedUsers) as User[]) : users;
    const nextUsers = [form, ...currentUsers];
    localStorage.setItem(storageKey, JSON.stringify(nextUsers));

    const payload = {
      UserTypeId: userTypeOptions.find(ut => ut.name === form.type)?.id ?? null,
      UserType: form.type,
      FullName: form.name,
      Mobile: form.mobile,
      Email: form.email,
      Login: form.loginId,
      Description: form.description,
      Status: true
    };

    console.log("Sending POST to /api/users with payload:", payload);
    API.post("/api/users", payload)
      .then((res) => {
        console.log("Successfully created user in backend DB:", res.data);
        setToast("✓ User created successfully");
      })
      .catch((err) => {
        console.error("Backend POST failed, user saved locally:", err);
        setToast("✓ User saved locally (backend unavailable)");
      })
      .finally(() => {
        window.setTimeout(() => {
          router.push("/masters/user-list");
        }, 1000);
      });
  };

  const fieldClass = (field: keyof ValidationErrors) =>
    errors[field] ? "edit-user-input edit-user-input-error" : "edit-user-input";

  return (
    <div className="edit-user-page">
      {toast && <div className="edit-user-toast">{toast}</div>}

      <section className="edit-user-card wide-card">
        <div className="edit-user-header">
          <h1><span style={{ display: "flex", alignItems: "center", gap: "10px" }}><Plus size={24} /> Create User</span></h1>
        </div>

        <form className="form-three-col" onSubmit={(e) => e.preventDefault()}>
          {/* Column 1 */}
          <div className="form-col">
            {/* ── User Type — dynamic dropdown from DB ── */}
            <div className="edit-user-row compact">
              <label htmlFor="user-type">User Type *</label>
              <div className="edit-user-field">
                {userTypesLoading ? (
                  <div
                    className="edit-user-input"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "rgba(255,255,255,0.5)",
                      cursor: "not-allowed",
                    }}
                  >
                    <div
                      style={{
                        width: "14px",
                        height: "14px",
                        border: "2px solid rgba(255,255,255,0.2)",
                        borderTopColor: "rgba(255,255,255,0.6)",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                        flexShrink: 0,
                      }}
                    ></div>
                    Loading user types...
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  </div>
                ) : (
                  <select
                    id="user-type"
                    className="edit-user-input"
                    value={form.type}
                    onChange={(e) => updateField("type", e.target.value)}
                  >
                    <option value="">Select</option>
                    {userTypeOptions.map((opt) => (
                      <option key={opt.id} value={opt.name}>
                        {opt.id} - {opt.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="edit-user-row compact">
              <label htmlFor="user-name">Name of User *</label>
              <div className="edit-user-field">
                <input
                  id="user-name"
                  className={fieldClass("name")}
                  type="text"
                  placeholder="<Enter Name>"
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                />
                {errors.name && <p className="edit-user-error">{errors.name}</p>}
              </div>
            </div>
          </div>

          {/* Column 2 */}
          <div className="form-col">
            <div className="edit-user-row compact">
              <label htmlFor="mobile-number">Mobile *</label>
              <div className="edit-user-field">
                <input
                  id="mobile-number"
                  className={`${fieldClass("mobile")} no-spinner`}
                  type="number"
                  placeholder="<Enter Mobile #>"
                  value={form.mobile}
                  onChange={(event) => updateField("mobile", event.target.value.replace(/\D/g, '').slice(0, 10))}
                />
                {errors.mobile && <p className="edit-user-error">{errors.mobile}</p>}
              </div>
            </div>

            <div className="edit-user-row compact">
              <label htmlFor="email-address">Email *</label>
              <div className="edit-user-field">
                <input
                  id="email-address"
                  className={fieldClass("email")}
                  type="email"
                  placeholder="<Enter Email>"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                />
                {errors.email && <p className="edit-user-error">{errors.email}</p>}
              </div>
            </div>
          </div>

          {/* Column 3 */}
          <div className="form-col">
            <div className="edit-user-row compact">
              <label htmlFor="login-id">Login ID *</label>
              <div className="edit-user-field">
                <input
                  id="login-id"
                  className={fieldClass("loginId")}
                  type="text"
                  placeholder="Email ID"
                  value={form.loginId}
                  onChange={(event) => updateField("loginId", event.target.value)}
                />
                {errors.loginId && <p className="edit-user-error">{errors.loginId}</p>}
              </div>
            </div>

            <div className="edit-user-row compact">
              <label htmlFor="description">Description</label>
              <div className="edit-user-field">
                <textarea
                  id="description"
                  className="edit-user-input"
                  placeholder="<Enter Description about User>"
                  rows={2}
                  value={form.description}
                  onChange={(event) => updateField("description", event.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="edit-user-actions form-actions-row">
            <Link href="/masters/user-list" className="edit-user-cancel">
              Cancel
            </Link>
            <button type="button" className="edit-user-update" onClick={saveUser}>
              Submit
            </button>
          </div>
        </form>
      </section>

      <style>{`
        .no-spinner::-webkit-inner-spin-button, 
        .no-spinner::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
        .no-spinner {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}
