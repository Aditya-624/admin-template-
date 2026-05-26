"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import API from "@/services/api";
import { Edit } from "lucide-react";

const initialData: { id: number; userType: string; userName: string; privilege: string; description: string; status: boolean }[] = [];

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

type UserTypeOption = {
  id: number;
  name: string;
};

export default function EditUserAccessPrivilegePage() {
  const router = useRouter();
  const params = useParams();
  const idStr = Array.isArray(params.id) ? params.id[0] : params.id;
  const targetId = parseInt(idStr || "0", 10);

  const [form, setForm] = useState<UserAccessPrivilege>({
    id: 0,
    userType: "",
    userName: "",
    privilege: "",
    description: "",
    status: true
  });

  const [loading, setLoading] = useState(true);
  const [userTypeOptions, setUserTypeOptions] = useState<UserTypeOption[]>([]);
  const [userTypesLoading, setUserTypesLoading] = useState(true);

  const [userOptions, setUserOptions] = useState<{ id: number; name: string }[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const [privilegeOptions, setPrivilegeOptions] = useState<{ id: number; name: string }[]>([]);
  const [privilegesLoading, setPrivilegesLoading] = useState(true);
  const [selectedPrivileges, setSelectedPrivileges] = useState<string[]>([]);

  // 1. Fetch current record, User Types and Privileges on mount
  useEffect(() => {
    // Fetch transaction record
    const storedRows = localStorage.getItem(storageKey);
    const existingData = storedRows ? JSON.parse(storedRows) : initialData;
    
    const found = existingData.find((p: UserAccessPrivilege) => p.id === targetId);
    if (found) {
      setForm(found);
      setSelectedPrivileges([found.privilege]);
    } else {
      router.push("/transaction/user-access-privileges-list");
    }
    setLoading(false);

    // Fetch User Types Dropdown
    console.log("Fetching user types dropdown...");
    setUserTypesLoading(true);
    
    API.get("/api/user-access-privileges/user-types-dropdown")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        const activeData = data.filter((ut: any) => ut.status === undefined || ut.status === true || ut.status === "Active" || ut.status === "active" || ut.status === 1 || String(ut.status).toLowerCase() === "true");
        const opts: UserTypeOption[] = activeData.map((ut: any, idx: number) => ({
          id: typeof ut.id === "number" ? ut.id : parseInt(ut.id ?? ut.user_type_id ?? ut.userTypeId ?? (idx + 1), 10),
          name: String(ut.name ?? ut.user_type ?? ut.userType ?? ut.label ?? ut.value ?? "N/A"),
        }));
        setUserTypeOptions(opts);
        setUserTypesLoading(false);
      })
      .catch((err) => {
        console.warn("User access privileges dropdown API failed, trying master endpoint:", err);
        API.get("/api/master/user-types")
          .then((res) => {
            const data = Array.isArray(res.data) ? res.data : [];
            const activeData = data.filter((ut: any) => ut.status === undefined || ut.status === true || ut.status === "Active" || ut.status === "active" || ut.status === 1 || String(ut.status).toLowerCase() === "true");
            const opts: UserTypeOption[] = activeData.map((ut: any, idx: number) => ({
              id: typeof ut.id === "number" ? ut.id : parseInt(ut.id ?? ut.user_type_id ?? (idx + 1), 10),
              name: String(ut.name ?? ut.user_type ?? ut.userType ?? "N/A"),
            }));
            setUserTypeOptions(opts);
            setUserTypesLoading(false);
          })
          .catch((err2) => {
            console.error("Both user type APIs failed, checking localStorage/fallback:", err2);
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

    // Fetch Privileges
    console.log("Fetching privileges dropdown...");
    setPrivilegesLoading(true);
    API.get("/api/user-access-privileges/access-privileges-dropdown")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        const activeData = data.filter((p: any) => p.status === undefined || p.status === true || p.status === "Active" || p.status === "active" || p.status === 1 || String(p.status).toLowerCase() === "true");
        const opts = activeData.map((p: any, idx: number) => ({
          id: typeof p.id === "number" ? p.id : parseInt(p.id ?? p.privilege_id ?? p.privilegeId ?? (idx + 1), 10),
          name: String(p.name ?? p.privilege ?? p.label ?? "N/A")
        }));
        setPrivilegeOptions(opts);
        setPrivilegesLoading(false);
      })
      .catch((err) => {
        console.warn("Dedicated privileges dropdown failed, trying master endpoint:", err);
        API.get("/api/master/access-privileges")
          .then((res) => {
            const data = Array.isArray(res.data) ? res.data : [];
            const activeData = data.filter((p: any) => p.status === undefined || p.status === true || p.status === "Active" || p.status === "active" || p.status === 1 || String(p.status).toLowerCase() === "true");
            const opts = activeData.map((p: any, idx: number) => ({
              id: typeof p.id === "number" ? p.id : parseInt(p.id ?? p.privilege_id ?? (idx + 1), 10),
              name: String(p.name ?? p.privilege ?? "N/A")
            }));
            setPrivilegeOptions(opts);
            setPrivilegesLoading(false);
          })
          .catch((err2) => {
            console.error("Both privileges APIs failed, checking localStorage/fallback:", err2);
            let fallback: { id: number; name: string }[] = [];
            const localData = typeof window !== "undefined" ? localStorage.getItem("masters-privileges-list-v1") : null;
            if (localData) {
              try {
                const parsed = JSON.parse(localData);
                if (Array.isArray(parsed)) {
                  fallback = parsed
                    .filter((p: any) => p.status === undefined || p.status === true || p.status === "Active" || p.status === "active" || p.status === 1 || String(p.status).toLowerCase() === "true")
                    .map((p: any) => ({
                      id: p.id,
                      name: p.name
                    }));
                }
              } catch (e) {
                console.error("Error parsing local storage privileges:", e);
              }
            }
            if (fallback.length === 0) {
              fallback = [
                { id: 1, name: "SyllabusUpload" },
                { id: 2, name: "SyllabusReview" },
                { id: 3, name: "SyllabusApproval" },
                { id: 4, name: "CourseUpload" },
                { id: 5, name: "CourseReview" },
                { id: 6, name: "CourseApproval" }
              ];
            }
            setPrivilegeOptions(fallback);
            setPrivilegesLoading(false);
          });
      });
  }, [targetId, router]);

  // 2. Fetch Users reactively when userType changes
  useEffect(() => {
    if (!form.userType) {
      setUserOptions([]);
      return;
    }
    const match = form.userType.match(/^(\d+)/);
    const typeId = match ? parseInt(match[1], 10) : null;
    
    setUsersLoading(true);
    const fetchUsers = async () => {
      if (typeId !== null) {
        try {
          const res = await API.get(`/api/user-access-privileges/users-by-type-dropdown/${typeId}`);
          const data = Array.isArray(res.data) ? res.data : [];
          if (data.length > 0) {
            const activeData = data.filter((u: any) => u.status === undefined || u.status === true || u.status === "Active" || u.status === "active" || u.status === 1 || String(u.status).toLowerCase() === "true");
            const opts = activeData.map((u: any, idx: number) => ({
              id: typeof u.id === "number" ? u.id : parseInt(u.id ?? u.userId ?? u.user_id ?? (idx + 1), 10),
              name: String(u.name ?? u.userName ?? u.username ?? "N/A")
            }));
            setUserOptions(opts);
            const defaultVal = opts.length > 0 ? `${opts[0].id} - ${opts[0].name}` : "";
            setForm(f => {
              const hasExisting = opts.some(o => `${o.id} - ${o.name}` === f.userName || String(o.id) === f.userName || o.name === f.userName);
              if (f.userName && hasExisting) return f;
              return { ...f, userName: defaultVal };
            });
            setUsersLoading(false);
            return;
          }
        } catch (e) {
          console.warn("Failed fetching users by type, trying general user API...", e);
        }
      }
      
      // Fallback: general /api/users
      try {
        const res = await API.get("/api/users");
        const data = Array.isArray(res.data) ? res.data : [];
        if (data.length > 0) {
          const activeData = data.filter((u: any) => u.status === undefined || u.status === true || u.status === "Active" || u.status === "active" || u.status === 1 || String(u.status).toLowerCase() === "true");
          const opts = activeData.map((u: any, idx: number) => ({
            id: typeof u.id === "number" ? u.id : parseInt(u.id ?? u.userId ?? u.user_id ?? (idx + 1), 10),
            name: String(u.name ?? u.userName ?? u.username ?? "N/A")
          }));
          setUserOptions(opts);
          const defaultVal = opts.length > 0 ? `${opts[0].id} - ${opts[0].name}` : "";
          setForm(f => {
            const hasExisting = opts.some(o => `${o.id} - ${o.name}` === f.userName || String(o.id) === f.userName || o.name === f.userName);
            if (f.userName && hasExisting) return f;
            return { ...f, userName: defaultVal };
          });
          setUsersLoading(false);
          return;
        }
      } catch (e) {
        console.warn("General user API failed, using storage/hardcoded fallbacks:", e);
      }

      // Fallback: localStorage
      let fallback: { id: number; name: string }[] = [];
      const localData = typeof window !== "undefined" ? localStorage.getItem("masters-user-list-v4") : null;
      if (localData) {
        try {
          const parsed = JSON.parse(localData);
          if (Array.isArray(parsed)) {
            fallback = parsed.map((u: any, idx: number) => ({
              id: typeof u.id === "number" ? u.id : parseInt(u.id ?? (idx + 1), 10),
              name: String(u.name ?? "N/A")
            }));
          }
        } catch (err) {
          console.error("Error parsing localStorage user list:", err);
        }
      }

      // Fallback: hardcoded mock users
      if (fallback.length === 0) {
        fallback = [
          { id: 1, name: "Vamsi" },
          { id: 2, name: "Sameer" },
          { id: 3, name: "Venu" },
          { id: 4, name: "Airi Satou" },
          { id: 5, name: "Angelica Ramos" },
          { id: 6, name: "Ashton Cox" }
        ];
      }
      setUserOptions(fallback);
      const defaultVal = fallback.length > 0 ? `${fallback[0].id} - ${fallback[0].name}` : "";
      setForm(f => {
        const hasExisting = fallback.some(o => `${o.id} - ${o.name}` === f.userName || String(o.id) === f.userName || o.name === f.userName);
        if (f.userName && hasExisting) return f;
        return { ...f, userName: defaultVal };
      });
      setUsersLoading(false);
    };

    fetchUsers();
  }, [form.userType]);

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
    if (!form.userType.trim()) {
      nextErrors.userType = "This field is required";
    }
    if (!form.userName.trim()) {
      nextErrors.userName = "This field is required";
    }
    if (selectedPrivileges.length === 0) {
      nextErrors.privilege = "At least one privilege must be selected";
    }
    if (!form.description.trim()) {
      nextErrors.description = "This field is required";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const saveRecord = () => {
    if (!validateForm()) return;

    const storedData = localStorage.getItem(storageKey);
    const currentData = storedData ? JSON.parse(storedData) as UserAccessPrivilege[] : initialData;
    
    const firstPrivilege = selectedPrivileges[0];
    const updatedRecord = { ...form, privilege: firstPrivilege };
    
    let nextData = currentData.map((p) => (p.id === targetId ? updatedRecord : p));
    
    if (selectedPrivileges.length > 1) {
      let maxId = 0;
      nextData.forEach((p) => {
        if (p.id > maxId) maxId = p.id;
      });
      
      for (let i = 1; i < selectedPrivileges.length; i++) {
        const newRecord: UserAccessPrivilege = {
          ...form,
          id: maxId + i,
          privilege: selectedPrivileges[i]
        };
        nextData.push(newRecord);
      }
    }

    const userTypeId = parseInt(form.userType.split(" - ")[0], 10) || null;
    const userNameId = parseInt(form.userName.split(" - ")[0], 10) || null;
    const privId = parseInt(firstPrivilege.split(" - ")[0], 10) || null;

    const payload = {
      UserTypeId: userTypeId,
      UserId: userNameId,
      AccessPrivilegeId: privId,
      Description: form.description,
      Status: form.status
    };

    API.put(`/api/user-access-privileges/${targetId}`, payload).catch(() => undefined);
    localStorage.setItem(storageKey, JSON.stringify(nextData));
    setToast("✓ Privilege access updated successfully");

    window.setTimeout(() => {
      router.push("/transaction/user-access-privileges-list");
    }, 1000);
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
          <h1><span style={{ display: "flex", alignItems: "center", gap: "10px" }}><Edit size={24} /> Edit Privilege Access</span></h1>
        </div>

        <form className="edit-user-form">
          <div className="edit-user-row">
            <label htmlFor="userType">User Type *</label>
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
                  id="userType"
                  className="edit-user-input"
                  value={form.userType}
                  onChange={(e) => updateField("userType", e.target.value)}
                >
                  <option value="">Select</option>
                  {userTypeOptions.map((opt) => {
                    const optionVal = `${opt.id} - ${opt.name}`;
                    return (
                      <option key={opt.id} value={optionVal}>
                        {optionVal}
                      </option>
                    );
                  })}
                </select>
              )}
              {errors.userType && <p className="edit-user-error">{errors.userType}</p>}
            </div>
          </div>
          
          <div className="edit-user-row">
            <label htmlFor="userName">User *</label>
            <div className="edit-user-field">
              {usersLoading ? (
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
                  Loading users...
                </div>
              ) : (
                <select
                  id="userName"
                  className="edit-user-input"
                  value={form.userName}
                  onChange={(e) => updateField("userName", e.target.value)}
                >
                  <option value="">Select</option>
                  {userOptions.map((opt) => {
                    const optionVal = `${opt.id} - ${opt.name}`;
                    return (
                      <option key={opt.id} value={optionVal}>
                        {optionVal}
                      </option>
                    );
                  })}
                </select>
              )}
              {errors.userName && <p className="edit-user-error">{errors.userName}</p>}
            </div>
          </div>
          
          <div className="edit-user-row" style={{ alignItems: "flex-start" }}>
            <label htmlFor="privilege" style={{ marginTop: "8px" }}>Access Privilege *</label>
            <div className="edit-user-field">
              {privilegesLoading ? (
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
                  Loading privileges...
                </div>
              ) : (
                <div 
                  className="privilege-checkboxes-container"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: "12px",
                    marginTop: "8px",
                    width: "100%"
                  }}
                >
                  {privilegeOptions.map((opt) => {
                    const optionVal = `${opt.id} - ${opt.name}`;
                    const isChecked = selectedPrivileges.includes(optionVal);
                    return (
                      <label
                        key={opt.id}
                        className={`privilege-checkbox-item ${isChecked ? "checked" : ""}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "10px 14px",
                          borderRadius: "8px",
                          background: isChecked ? "rgba(139, 92, 246, 0.15)" : "rgba(255, 255, 255, 0.03)",
                          border: `1px solid ${isChecked ? "rgba(139, 92, 246, 0.5)" : "rgba(255, 255, 255, 0.1)"}`,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          width: "100%"
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          style={{
                            width: "18px",
                            height: "18px",
                            accentColor: "#8b5cf6",
                            cursor: "pointer",
                            flexShrink: 0
                          }}
                          onChange={() => {
                            setSelectedPrivileges((prev) => {
                              if (prev.includes(optionVal)) {
                                return prev.filter((p) => p !== optionVal);
                              } else {
                                return [...prev, optionVal];
                              }
                            });
                          }}
                        />
                        <span className="privilege-checkbox-label" style={{ 
                          color: isChecked ? "#c4b5fd" : "rgba(255, 255, 255, 0.7)", 
                          fontSize: "0.9rem", 
                          fontWeight: isChecked ? 500 : 400,
                          wordBreak: "break-word"
                        }}>
                          {optionVal}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
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
            <Link href="/transaction/user-access-privileges-list" className="edit-user-cancel">
              Cancel
            </Link>
            <button type="button" className="edit-user-update" onClick={saveRecord}>
              Update
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
