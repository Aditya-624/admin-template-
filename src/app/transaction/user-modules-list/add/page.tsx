"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import API from "@/services/api";
import { Plus } from "lucide-react";

const initialData = [
  { id: 1, userType: "1 - Super", userName: "1 - Vamsi", module: "1 - Learn", description: "Learn Module Access", status: true },
  { id: 2, userType: "1 - Super", userName: "1 - Vamsi", module: "2 - Evaluate", description: "Evaluate Module Access", status: true },
  { id: 3, userType: "4 - Expert", userName: "4 - KORA", module: "3 - Teach", description: "User can validate and approve course co", status: true },
  { id: 4, userType: "3 - Associate", userName: "5 - Raghu", module: "3 - Teach", description: "User can review Course Content", status: true },
  { id: 5, userType: "3 - Associate", userName: "6 - Mohan", module: "3 - Teach", description: "User can review Course Content", status: true },
  { id: 6, userType: "4 - Evaluator", userName: "7 - Krishna", module: "6 - Evaluate", description: "User can perform final evaluation", status: true },
];

const storageKey = "transaction-user-modules-list-v1";

type UserModule = {
  id: number;
  userType: string;
  userName: string;
  module: string;
  description: string;
  status: boolean;
};

type ValidationErrors = Partial<Record<"userType" | "userName" | "module", string>>;
type DropdownOption = { id: number; name: string };

const fallbackUserTypes: DropdownOption[] = [
  { id: 1, name: "Super" },
  { id: 2, name: "Admin" },
  { id: 3, name: "Associate" },
  { id: 4, name: "Expert" },
  { id: 5, name: "ClientAdmin" },
  { id: 6, name: "Evaluator" },
  { id: 7, name: "Student" },
];

const fallbackModules: DropdownOption[] = [
  { id: 1, name: "Learn" },
  { id: 2, name: "Evaluate" },
  { id: 3, name: "Teach" },
  { id: 4, name: "Train" },
  { id: 5, name: "Compete" },
];

const fallbackUsers: DropdownOption[] = [
  { id: 1, name: "Vamsi" },
  { id: 3, name: "Venu" },
  { id: 4, name: "KORA" },
  { id: 5, name: "Raghu" },
  { id: 6, name: "Mohan" },
  { id: 7, name: "Krishna" },
];

export default function AddUserModulePage() {
  const router = useRouter();
  const [userType, setUserType] = useState("");
  const [userName, setUserName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(true);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [userTypeOptions, setUserTypeOptions] = useState<DropdownOption[]>([]);
  const [userOptions, setUserOptions] = useState<DropdownOption[]>([]);
  const [moduleOptions, setModuleOptions] = useState<DropdownOption[]>([]);
  const [userTypesLoading, setUserTypesLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [modulesLoading, setModulesLoading] = useState(true);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [toast, setToast] = useState("");

  useEffect(() => {
    setUserTypesLoading(true);
    API.get("/api/master/user-types")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        const opts = data.map((ut: Record<string, unknown>, idx: number) => ({
          id: typeof ut.id === "number" ? ut.id : parseInt(String(ut.id ?? idx + 1), 10),
          name: String(ut.name ?? ut.user_type ?? "N/A"),
        }));
        setUserTypeOptions(opts.length ? opts : fallbackUserTypes);
      })
      .catch(() => {
        const local = localStorage.getItem("masters-usertype-list-v1");
        if (local) {
          try {
            const parsed = JSON.parse(local);
            if (Array.isArray(parsed)) {
              setUserTypeOptions(parsed.map((ut: { id: number; name: string }) => ({ id: ut.id, name: ut.name })));
              return;
            }
          } catch {
            /* ignore */
          }
        }
        setUserTypeOptions(fallbackUserTypes);
      })
      .finally(() => setUserTypesLoading(false));

    setModulesLoading(true);
    API.get("/api/master/modules")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        const opts = data.map((m: Record<string, unknown>, idx: number) => ({
          id: typeof m.id === "number" ? m.id : parseInt(String(m.id ?? idx + 1), 10),
          name: String(m.name ?? m.module ?? "N/A"),
        }));
        const unique = opts.filter(
          (opt: DropdownOption, i: number, arr: DropdownOption[]) =>
            arr.findIndex((o) => o.name === opt.name) === i
        );
        setModuleOptions(unique.length ? unique : fallbackModules);
      })
      .catch(() => {
        const local = localStorage.getItem("masters-modules-list-v1");
        if (local) {
          try {
            const parsed = JSON.parse(local);
            if (Array.isArray(parsed)) {
              const opts = parsed.map((m: { id: number; name: string }) => ({ id: m.id, name: m.name }));
              const unique = opts.filter(
                (opt: DropdownOption, i: number, arr: DropdownOption[]) =>
                  arr.findIndex((o) => o.name === opt.name) === i
              );
              setModuleOptions(unique);
              return;
            }
          } catch {
            /* ignore */
          }
        }
        setModuleOptions(fallbackModules);
      })
      .finally(() => setModulesLoading(false));
  }, []);

  useEffect(() => {
    // Keep it empty by default to let user select freely
  }, [userTypeOptions]);

  useEffect(() => {
    if (!userType) {
      setUserOptions([]);
      return;
    }
    const match = userType.match(/^(\d+)/);
    const typeId = match ? parseInt(match[1], 10) : null;
    setUsersLoading(true);

    const loadUsers = async () => {
      try {
        if (typeId !== null) {
          const res = await API.get(`/api/user-access-privileges/users-by-type-dropdown/${typeId}`);
          const data = Array.isArray(res.data) ? res.data : [];
          if (data.length) {
            const opts = data.map((u: Record<string, unknown>, idx: number) => ({
              id: typeof u.id === "number" ? u.id : parseInt(String(u.id ?? idx + 1), 10),
              name: String(u.name ?? u.userName ?? "N/A"),
            }));
            setUserOptions(opts);
            setUsersLoading(false);
            return;
          }
        }
        const res = await API.get("/api/users");
        const data = Array.isArray(res.data) ? res.data : [];
        if (data.length) {
          const opts = data.map((u: Record<string, unknown>, idx: number) => ({
            id: typeof u.id === "number" ? u.id : parseInt(String(u.id ?? idx + 1), 10),
            name: String(u.name ?? u.userName ?? "N/A"),
          }));
          setUserOptions(opts);
        } else {
          setUserOptions(fallbackUsers);
        }
      } catch {
        setUserOptions(fallbackUsers);
      } finally {
        setUsersLoading(false);
      }
    };

    loadUsers();
  }, [userType]);

  const validateForm = () => {
    const nextErrors: ValidationErrors = {};
    if (!userType.trim()) nextErrors.userType = "This field is required";
    if (!userName.trim()) nextErrors.userName = "This field is required";
    if (selectedModules.length === 0) nextErrors.module = "At least one module must be selected";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const saveRecord = () => {
    if (!validateForm()) return;

    const storedData = localStorage.getItem(storageKey);
    const currentData = storedData ? (JSON.parse(storedData) as UserModule[]) : initialData;
    let maxId = 0;
    currentData.forEach((row) => {
      if (row.id > maxId) maxId = row.id;
    });

    const newRecords: UserModule[] = selectedModules.map((mod, index) => ({
      id: maxId + 1 + index,
      userType,
      userName,
      module: mod,
      description: description.trim() || `${mod.split(" - ")[1] ?? mod} Module Access`,
      status,
    }));

    const nextData = [...currentData, ...newRecords];
    localStorage.setItem(storageKey, JSON.stringify(nextData));
    newRecords.forEach((record) => API.post("/api/user-modules", record).catch(() => undefined));

    setToast(`✓ ${newRecords.length} user module record(s) created successfully`);
    window.setTimeout(() => router.push("/transaction/user-modules-list"), 1000);
  };

  const fieldClass = (field: keyof ValidationErrors) =>
    errors[field] ? "edit-user-input edit-user-input-error" : "edit-user-input";

  return (
    <div className="edit-user-page">
      {toast && <div className="edit-user-toast">{toast}</div>}

      <section className="edit-user-card">
        <div className="edit-user-header">
          <h1><span style={{ display: "flex", alignItems: "center", gap: "10px" }}><Plus size={24} /> New User Module(s)</span></h1>
        </div>

        <form className="edit-user-form">
          <div className="edit-user-row">
            <label htmlFor="userType">User Type *</label>
            <div className="edit-user-field">
              {userTypesLoading ? (
                <div className="edit-user-input" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Loading user types...
                </div>
              ) : (
                <select
                  id="userType"
                  className="edit-user-input"
                  value={userType}
                  onChange={(e) => {
                    setUserType(e.target.value);
                    setUserName("");
                    if (errors.userType) setErrors((p) => ({ ...p, userType: undefined }));
                  }}
                >
                  <option value="">Select</option>
                  {userTypeOptions.map((opt) => {
                    const val = `${opt.id} - ${opt.name}`;
                    return (
                      <option key={opt.id} value={val}>
                        {opt.name}
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
                <div className="edit-user-input" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Loading users...
                </div>
              ) : (
                <select
                  id="userName"
                  className="edit-user-input"
                  value={userName}
                  onChange={(e) => {
                    setUserName(e.target.value);
                    if (errors.userName) setErrors((p) => ({ ...p, userName: undefined }));
                  }}
                >
                  <option value="">Select</option>
                  {userOptions.map((opt) => {
                    const val = `${opt.id} - ${opt.name}`;
                    return (
                      <option key={opt.id} value={val}>
                        {opt.name}
                      </option>
                    );
                  })}
                </select>
              )}
              {errors.userName && <p className="edit-user-error">{errors.userName}</p>}
            </div>
          </div>

          <div className="edit-user-row" style={{ alignItems: "flex-start" }}>
            <label htmlFor="module" style={{ marginTop: "8px" }}>
              Module *
            </label>
            <div className="edit-user-field">
              {modulesLoading ? (
                <div className="edit-user-input" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Loading modules...
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
                  {moduleOptions.map((opt) => {
                    const optionVal = `${opt.id} - ${opt.name}`;
                    const isChecked = selectedModules.includes(optionVal);
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
                            setSelectedModules((prev) => {
                              const next = prev.includes(optionVal)
                                ? prev.filter((m) => m !== optionVal)
                                : [...prev, optionVal];
                              if (next.length && errors.module) {
                                setErrors((p) => ({ ...p, module: undefined }));
                              }
                              return next;
                            });
                          }}
                        />
                        <span className="privilege-checkbox-label" style={{ 
                          color: isChecked ? "#c4b5fd" : "rgba(255, 255, 255, 0.7)", 
                          fontSize: "0.9rem", 
                          fontWeight: isChecked ? 500 : 400,
                          wordBreak: "break-word"
                        }}>
                          {opt.name}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
              {errors.module && <p className="edit-user-error">{errors.module}</p>}
            </div>
          </div>

          <div className="edit-user-row">
            <label htmlFor="description">Description</label>
            <div className="edit-user-field">
              <textarea
                id="description"
                className={fieldClass("module")}
                placeholder="<Enter Description about User's Module(s)>"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="edit-user-row" style={{ alignItems: "center" }}>
            <label htmlFor="status" style={{ marginBottom: 0 }}>
              Status
            </label>
            <div className="edit-user-field" style={{ display: "flex", alignItems: "center", minHeight: "42px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button
                  type="button"
                  id="status"
                  onClick={() => setStatus(!status)}
                  className={`status-toggle ${status ? "active" : ""}`}
                  aria-pressed={status}
                  style={{
                    position: "relative",
                    width: "48px",
                    height: "24px",
                    borderRadius: "9999px",
                    background: status ? "#34c759" : "#4b5563",
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
                      left: status ? "27px" : "3px",
                      transition: "left 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                    }}
                  />
                </button>
                <span
                  style={{
                    color: status ? "#34c759" : "#9ca3af",
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    transition: "color 0.2s ease"
                  }}
                >
                  {status ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          <div className="edit-user-actions">
            <Link href="/transaction/user-modules-list" className="edit-user-cancel">
              Cancel
            </Link>
            <button type="button" className="edit-user-update" onClick={saveRecord}>
              Submit
            </button>
          </div>
        </form>
      </section>

      <style>{`
        .module-checkboxes-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(140px, 1fr));
          gap: 10px;
        }
      `}</style>
    </div>
  );
}
