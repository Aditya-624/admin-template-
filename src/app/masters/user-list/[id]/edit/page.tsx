"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useMemo, useState, useEffect } from "react";
import API from "@/services/api";

const users = [
  { id: "1", type: "Super Admin", name: "Airi Satou", mobile: "+1 (555) 010-1001", email: "airi.satou@example.com", loginId: "airi.satou", description: "Manages platform accounts", status: "Active" },
  { id: "2", type: "Associate", name: "Angelica Ramos", mobile: "+1 (555) 010-1002", email: "angelica.ramos@example.com", loginId: "angelica.ramos", description: "Creates course content", status: "Active" },
  { id: "3", type: "Expert", name: "Ashton Cox", mobile: "+1 (555) 010-1003", email: "ashton.cox@example.com", loginId: "ashton.cox", description: "Enrolled learner account", status: "Inactive" },
  { id: "4", type: "ClientAdmin", name: "Bradley Greer", mobile: "+1 (555) 010-1004", email: "bradley.greer@example.com", loginId: "bradley.greer", description: "Reviews quizzes and lessons", status: "Active" },
  { id: "5", type: "Evaluator", name: "Brenden Wagner", mobile: "+1 (555) 010-1005", email: "brenden.wagner@example.com", loginId: "brenden.wagner", description: "Handles user queries", status: "Pending" },
  { id: "6", type: "Student", name: "Brielle Williamson", mobile: "+1 (555) 010-1006", email: "brielle.williamson@example.com", loginId: "brielle.williamson", description: "Controls master data", status: "Active" },
  { id: "7", type: "Associate", name: "Bruno Nash", mobile: "+1 (555) 010-1007", email: "bruno.nash@example.com", loginId: "bruno.nash", description: "Premium learner account", status: "Active" },
  { id: "8", type: "Expert", name: "Caesar Vance", mobile: "+1 (555) 010-1008", email: "caesar.vance@example.com", loginId: "caesar.vance", description: "Assists onboarding", status: "Inactive" },
  { id: "9", type: "Evaluator", name: "Cara Stevens", mobile: "+1 (555) 010-1009", email: "cara.stevens@example.com", loginId: "cara.stevens", description: "Publishes assessments", status: "Active" },
  { id: "10", type: "Student", name: "Cedric Kelly", mobile: "+1 (555) 010-1010", email: "cedric.kelly@example.com", loginId: "cedric.kelly", description: "Trial learner account", status: "Pending" },
];

const storageKey = "masters-user-list-v4";

type User = typeof users[number];
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
        const data = Array.isArray(res.data) ? res.data : [];
        const opts: UserTypeOption[] = data.map((ut: any, idx: number) => ({
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
            const data = Array.isArray(res.data) ? res.data : [];
            const opts: UserTypeOption[] = data.map((ut: any, idx: number) => ({
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
                  fallback = parsed.map((ut: any) => ({
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

    const storedUsers = localStorage.getItem(storageKey);
    const currentUsers = storedUsers ? (JSON.parse(storedUsers) as User[]) : users;
    const nextUsers = currentUsers.map((user) => (user.id === form.id ? form : user));

    localStorage.setItem(storageKey, JSON.stringify(nextUsers));
    setToast("✓ User updated successfully");

    window.setTimeout(() => {
      router.push("/masters/user-list");
    }, 1000);
  };

  const fieldClass = (field: keyof ValidationErrors) =>
    errors[field] ? "edit-user-input edit-user-input-error" : "edit-user-input";

  return (
    <div className="edit-user-page">
      {toast && <div className="edit-user-toast">{toast}</div>}

      <section className="edit-user-card">
        <div className="edit-user-header">
          <h1>✏️ Edit User</h1>
        </div>

        <form className="edit-user-form">
          {/* ── User Type — dynamic dropdown from DB ── */}
          <div className="edit-user-row">
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
                  <option value="" disabled>-- Select User Type --</option>
                  {userTypeOptions.map((opt) => (
                    <option key={opt.id} value={opt.name}>
                      {opt.id} - {opt.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="edit-user-row">
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

          <div className="edit-user-row">
            <label htmlFor="mobile-number">Mobile *</label>
            <div className="edit-user-field">
              <input
                id="mobile-number"
                className={fieldClass("mobile")}
                type="tel"
                placeholder="<Enter Mobile #>"
                value={form.mobile}
                onChange={(event) => updateField("mobile", event.target.value)}
              />
              {errors.mobile && <p className="edit-user-error">{errors.mobile}</p>}
            </div>
          </div>

          <div className="edit-user-row">
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

          <div className="edit-user-row">
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

          <div className="edit-user-row">
            <label htmlFor="description">Description</label>
            <div className="edit-user-field">
              <textarea
                id="description"
                className="edit-user-input"
                placeholder="<Enter Description about User>"
                rows={3}
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
              />
            </div>
          </div>

          <div className="edit-user-row">
            <label htmlFor="status">Status</label>
            <div className="edit-user-field" style={{ display: "flex", alignItems: "center", height: "100%" }}>
              <label style={{ display: "flex", alignItems: "center", cursor: "pointer", gap: "10px" }}>
                <input
                  id="status"
                  type="checkbox"
                  className="edit-user-checkbox"
                  checked={form.status === "Active"}
                  onChange={(e) => updateField("status", e.target.checked ? "Active" : "Inactive")}
                />
                <span className="checkbox-text">
                  {form.status === "Active" ? "True (Active)" : "False (Inactive)"}
                </span>
              </label>
            </div>
          </div>

          <div className="edit-user-actions">
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
