"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import API from "@/services/api";

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

export default function EditUserModulePage() {
  const router = useRouter();
  const params = useParams();
  const idStr = Array.isArray(params.id) ? params.id[0] : params.id;
  const targetId = parseInt(idStr || "0", 10);

  const [userType, setUserType] = useState("");
  const [userName, setUserName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(true);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [userTypeOptions, setUserTypeOptions] = useState<DropdownOption[]>([]);
  const [userOptions, setUserOptions] = useState<DropdownOption[]>([]);
  const [moduleOptions, setModuleOptions] = useState<DropdownOption[]>([]);
  const [userTypesLoading, setUserTypesLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [modulesLoading, setModulesLoading] = useState(true);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [toast, setToast] = useState("");

  useEffect(() => {
    const storedRows = localStorage.getItem(storageKey);
    const existingData = storedRows ? JSON.parse(storedRows) : initialData;
    const found = existingData.find((row: UserModule) => row.id === targetId);

    if (found) {
      setUserType(found.userType);
      setUserName(found.userName);
      setDescription(found.description);
      setStatus(found.status);
      setSelectedModules([found.module]);
    } else {
      router.push("/transaction/user-modules-list");
    }
    setLoading(false);

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
      .catch(() => setUserTypeOptions(fallbackUserTypes))
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
      .catch(() => setModuleOptions(fallbackModules))
      .finally(() => setModulesLoading(false));
  }, [targetId, router]);

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
    const firstModule = selectedModules[0];

    const updatedRecord: UserModule = {
      id: targetId,
      userType,
      userName,
      module: firstModule,
      description: description.trim() || `${firstModule.split(" - ")[1] ?? firstModule} Module Access`,
      status,
    };

    let nextData = currentData.map((row) => (row.id === targetId ? updatedRecord : row));

    if (selectedModules.length > 1) {
      let maxId = 0;
      nextData.forEach((row) => {
        if (row.id > maxId) maxId = row.id;
      });
      for (let i = 1; i < selectedModules.length; i++) {
        nextData.push({
          id: maxId + i,
          userType,
          userName,
          module: selectedModules[i],
          description: description.trim() || `${selectedModules[i].split(" - ")[1] ?? selectedModules[i]} Module Access`,
          status,
        });
      }
    }

    localStorage.setItem(storageKey, JSON.stringify(nextData));
    API.put(`/api/user-modules/${targetId}`, updatedRecord).catch(() => undefined);

    setToast("✓ User module updated successfully");
    window.setTimeout(() => router.push("/transaction/user-modules-list"), 1000);
  };

  if (loading) return null;

  return (
    <div className="edit-user-page">
      {toast && <div className="edit-user-toast">{toast}</div>}

      <section className="edit-user-card">
        <div className="edit-user-header">
          <h1>Update User Module(s)</h1>
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
                    if (errors.userType) setErrors((p) => ({ ...p, userType: undefined }));
                  }}
                >
                  <option value="" disabled>
                    -- Select User Type --
                  </option>
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
                  <option value="" disabled>
                    -- Select User --
                  </option>
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
                <div className="privilege-checkboxes-container module-checkboxes-grid">
                  {moduleOptions.map((opt) => {
                    const optionVal = `${opt.id} - ${opt.name}`;
                    const isChecked = selectedModules.includes(optionVal);
                    return (
                      <label
                        key={opt.id}
                        className={`privilege-checkbox-item ${isChecked ? "checked" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
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
                        <span className="privilege-checkbox-label">{opt.name}</span>
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
                className="edit-user-input"
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
            <div className="edit-user-field">
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", width: "fit-content" }}>
                <input
                  type="checkbox"
                  id="status"
                  checked={status}
                  onChange={(e) => setStatus(e.target.checked)}
                  style={{ width: "16px", height: "16px", accentColor: "#8b5cf6" }}
                />
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>
                  {status ? "True (Active)" : "False (Inactive)"}
                </span>
              </label>
            </div>
          </div>

          <div className="edit-user-actions">
            <Link href="/transaction/user-modules-list" className="edit-user-cancel">
              Cancel
            </Link>
            <button type="button" className="edit-user-update" onClick={saveRecord}>
              Update
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
