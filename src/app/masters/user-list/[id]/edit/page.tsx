"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useMemo, useState, useEffect } from "react";
import API from "@/services/api";
import { Edit } from "lucide-react";

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

const getStoredUser = (userId: string, fallbackUser: User) => {
  if (typeof window === "undefined") return fallbackUser;
  const storedUsers = localStorage.getItem(storageKey);
  if (!storedUsers) return fallbackUser;
  try {
    const parsedUsers = JSON.parse(storedUsers) as User[];
    return parsedUsers.find((user) => user.id === userId) ?? fallbackUser;
  } catch {
    return fallbackUser;
  }
};

export default function EditUserPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const userId = decodeURIComponent(params.id);

  const selectedUser = useMemo(
    () => users.find((user) => user.id === userId) ?? users[0],
    [userId],
  );

  const [form, setForm] = useState(() => getStoredUser(userId, selectedUser));
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    console.log(`Fetching user details for ID: ${userId}...`);
    setLoadingUser(true);
    API.get(`/api/users/${userId}`)
      .then((res) => {
        if (res.data) {
          console.log("Successfully fetched user details:", res.data);
          const u = res.data;
          setForm({
            id: String(u.id ?? u.user_id ?? u.userId ?? userId),
            type: String(u.type ?? u.user_type ?? u.usertype ?? u.userType ?? ""),
            name: String(u.name ?? u.user_name ?? u.username ?? u.fullName ?? u.userFullName ?? ""),
            mobile: String(u.mobile ?? u.mobile_number ?? u.phone ?? ""),
            email: String(u.email ?? u.email_id ?? u.emailAddress ?? ""),
            loginId: String(u.loginId ?? u.login_id ?? u.username ?? u.login ?? ""),
            description: String(u.description ?? ""),
            status: u.status === true || u.status === "Active" || u.status === "active" || u.status === 1 || String(u.status).toLowerCase() === "true" ? "Active" : "Inactive"
          });
        }
        setLoadingUser(false);
      })
      .catch((err) => {
        console.warn("Backend fetch user failed, using localStorage fallback:", err);
        setForm(getStoredUser(userId, selectedUser));
        setLoadingUser(false);
      });
  }, [userId, selectedUser]);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [toast, setToast] = useState("");

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
        console.warn("Dedicated dropdown failed, falling back to /api/master/user-types:", err);
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
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const saveUser = () => {
    if (!validateForm()) return;

    const payload = {
      UserType: form.type,
      FullName: form.name,
      Mobile: form.mobile,
      Email: form.email,
      LoginID: form.loginId,
      Description: form.description,
      Status: form.status === "Active"
    };

    console.log("Sending PATCH to /api/users/" + userId + " with payload:", payload);
    API.patch(`/api/users/${userId}`, payload)
      .then((res) => {
        console.log("Successfully updated user in backend:", res.data);
        const storedUsers = localStorage.getItem(storageKey);
        const currentUsers = storedUsers ? (JSON.parse(storedUsers) as User[]) : users;
        const nextUsers = currentUsers.map((user) => (user.id === form.id ? form : user));
        localStorage.setItem(storageKey, JSON.stringify(nextUsers));
        setToast("✓ User updated successfully");
        window.setTimeout(() => {
          router.push("/masters/user-list");
        }, 1000);
      })
      .catch((err) => {
        console.error("Failed to update user in backend, saving locally:", err);
        const storedUsers = localStorage.getItem(storageKey);
        const currentUsers = storedUsers ? (JSON.parse(storedUsers) as User[]) : users;
        const nextUsers = currentUsers.map((user) => (user.id === form.id ? form : user));
        localStorage.setItem(storageKey, JSON.stringify(nextUsers));
        setToast("✓ User updated locally");
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
          <h1><span style={{ display: "flex", alignItems: "center", gap: "10px" }}><Edit size={24} /> Edit User</span></h1>
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

            <div className="edit-user-row compact">
              <label htmlFor="status">Status</label>
            <div className="edit-user-field" style={{ display: "flex", alignItems: "center", minHeight: "42px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button
                  type="button"
                  id="status"
                  onClick={() => updateField("status", form.status === "Active" ? "Inactive" : "Active")}
                  className={`status-toggle ${form.status === "Active" ? "active" : ""}`}
                  aria-pressed={form.status === "Active"}
                  style={{
                    position: "relative",
                    width: "48px",
                    height: "24px",
                    borderRadius: "9999px",
                    background: form.status === "Active" ? "#34c759" : "#4b5563",
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
                      left: form.status === "Active" ? "27px" : "3px",
                      transition: "left 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                    }}
                  />
                </button>
                <span
                  style={{
                    color: form.status === "Active" ? "#34c759" : "#9ca3af",
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    transition: "color 0.2s ease"
                  }}
                >
                  {form.status === "Active" ? "Active" : "Inactive"}
                </span>
              </div>
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
                  className={fieldClass("mobile")}
                  type="tel"
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
              Update
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
