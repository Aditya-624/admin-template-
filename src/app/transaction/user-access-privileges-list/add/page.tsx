"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import API from "@/services/api";
import { Plus } from "lucide-react";

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

type UserTypeOption = {
  id: number;
  name: string;
};

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

  const [userTypeOptions, setUserTypeOptions] = useState<UserTypeOption[]>([]);
  const [userTypesLoading, setUserTypesLoading] = useState(true);

  const [userOptions, setUserOptions] = useState<{ id: number; name: string }[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const [privilegeOptions, setPrivilegeOptions] = useState<{ id: number; name: string }[]>([]);
  const [privilegesLoading, setPrivilegesLoading] = useState(true);
  const [selectedPrivileges, setSelectedPrivileges] = useState<string[]>([]);

  // 1. Fetch User Types and Privileges on mount
  useEffect(() => {
    // Determine max ID for new record
    const storedRows = localStorage.getItem(storageKey);
    const existingData = storedRows ? JSON.parse(storedRows) : initialData;
    let maxId = 0;
    if (existingData.length > 0) {
      existingData.forEach((p: UserAccessPrivilege) => {
        if (p.id > maxId) maxId = p.id;
      });
    }
    setForm(f => ({ ...f, id: maxId + 1 }));
    
    // Fetch User Types
    console.log("Fetching user types dropdown...");
    setUserTypesLoading(true);
    
    API.get("/api/user-access-privileges/user-types-dropdown")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        const opts: UserTypeOption[] = data.map((ut: any, idx: number) => ({
          id: typeof ut.id === "number" ? ut.id : parseInt(ut.id ?? ut.user_type_id ?? ut.userTypeId ?? (idx + 1), 10),
          name: String(ut.name ?? ut.user_type ?? ut.userType ?? ut.label ?? ut.value ?? "N/A"),
        }));
        setUserTypeOptions(opts);
        const defaultVal = opts.length > 0 ? `${opts[0].id} - ${opts[0].name}` : "";
        setForm(f => ({ ...f, userType: defaultVal }));
        setUserTypesLoading(false);
      })
      .catch((err) => {
        console.warn("User access privileges dropdown API failed, trying master endpoint:", err);
        API.get("/api/master/user-types")
          .then((res) => {
            const data = Array.isArray(res.data) ? res.data : [];
            const opts: UserTypeOption[] = data.map((ut: any, idx: number) => ({
              id: typeof ut.id === "number" ? ut.id : parseInt(ut.id ?? ut.user_type_id ?? (idx + 1), 10),
              name: String(ut.name ?? ut.user_type ?? ut.userType ?? "N/A"),
            }));
            setUserTypeOptions(opts);
            const defaultVal = opts.length > 0 ? `${opts[0].id} - ${opts[0].name}` : "";
            setForm(f => ({ ...f, userType: defaultVal }));
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
            const defaultVal = fallback.length > 0 ? `${fallback[0].id} - ${fallback[0].name}` : "";
            setForm(f => ({ ...f, userType: defaultVal }));
            setUserTypesLoading(false);
          });
      });

    // Fetch Privileges
    console.log("Fetching privileges dropdown...");
    setPrivilegesLoading(true);
    API.get("/api/user-access-privileges/access-privileges-dropdown")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        const opts = data.map((p: any, idx: number) => ({
          id: typeof p.id === "number" ? p.id : parseInt(p.id ?? p.privilege_id ?? p.privilegeId ?? (idx + 1), 10),
          name: String(p.name ?? p.privilege ?? p.label ?? "N/A")
        }));
        setPrivilegeOptions(opts);
        const defaultVal = opts.length > 0 ? `${opts[0].id} - ${opts[0].name}` : "";
        setSelectedPrivileges(defaultVal ? [defaultVal] : []);
        setPrivilegesLoading(false);
      })
      .catch((err) => {
        console.warn("Dedicated privileges dropdown failed, trying master endpoint:", err);
        API.get("/api/master/access-privileges")
          .then((res) => {
            const data = Array.isArray(res.data) ? res.data : [];
            const opts = data.map((p: any, idx: number) => ({
              id: typeof p.id === "number" ? p.id : parseInt(p.id ?? p.privilege_id ?? (idx + 1), 10),
              name: String(p.name ?? p.privilege ?? "N/A")
            }));
            setPrivilegeOptions(opts);
            const defaultVal = opts.length > 0 ? `${opts[0].id} - ${opts[0].name}` : "";
            setSelectedPrivileges(defaultVal ? [defaultVal] : []);
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
                  fallback = parsed.map((p: any) => ({
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
            const defaultVal = fallback.length > 0 ? `${fallback[0].id} - ${fallback[0].name}` : "";
            setSelectedPrivileges(defaultVal ? [defaultVal] : []);
            setPrivilegesLoading(false);
          });
      });
  }, []);

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
            const opts = data.map((u: any, idx: number) => ({
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
          const opts = data.map((u: any, idx: number) => ({
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
    
    let nextData = [...currentData];
    let maxId = 0;
    if (nextData.length > 0) {
      nextData.forEach((p) => {
        if (p.id > maxId) maxId = p.id;
      });
    }

    selectedPrivileges.forEach((privName, index) => {
      const newRecord: UserAccessPrivilege = {
        ...form,
        id: maxId + 1 + index,
        privilege: privName
      };
      nextData.push(newRecord);
    });

    localStorage.setItem(storageKey, JSON.stringify(nextData));
    setToast(`✓ ${selectedPrivileges.length} privilege access record(s) created successfully`);

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
          <h1><span style={{ display: "flex", alignItems: "center", gap: "10px" }}><Plus size={24} /> Add Privilege Access</span></h1>
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
                <div className="privilege-checkboxes-container">
                  {privilegeOptions.map((opt) => {
                    const optionVal = `${opt.id} - ${opt.name}`;
                    const isChecked = selectedPrivileges.includes(optionVal);
                    return (
                      <label
                        key={opt.id}
                        className={`privilege-checkbox-item ${isChecked ? "checked" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
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
                        <span className="privilege-checkbox-label">{optionVal}</span>
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
