"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import styles from "./RoleManager.module.css";

export default function RoleManager({ onClose }) {
  const { user, refreshRole } = useAuth();
  const [rows, setRows]       = useState([]);
  const [email, setEmail]     = useState("");
  const [newRole, setNewRole] = useState("organizer");
  const [error, setError]     = useState("");
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    fetch("/api/roles").then(r => r.json()).then(setRows).catch(() => {});
  }, []);

  async function handleAssign(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setError(""); setSaving(true);
    try {
      const res = await fetch("/api/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callerEmail: user.email, targetEmail: email.trim(), role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      const updated = await fetch("/api/roles").then(r => r.json());
      setRows(updated);
      setEmail("");
      await refreshRole();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleChangeRole(targetEmail, role) {
    try {
      const res = await fetch("/api/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callerEmail: user.email, targetEmail, role }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setRows(prev => prev.map(r => r.email === targetEmail ? { ...r, role } : r));
      await refreshRole();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleRemove(targetEmail) {
    try {
      const res = await fetch("/api/role", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callerEmail: user.email, targetEmail }),
      });
      if (!res.ok) throw new Error("Failed to remove");
      setRows(prev => prev.filter(r => r.email !== targetEmail));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={e => e.stopPropagation()}>

        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Manage Roles</h2>
            <p className={styles.sub}>Assign access levels to users</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.body}>

          {/* Assign form — prominent */}
          <div className={styles.assignBox}>
            <p className={styles.assignLabel}>Enter a user's email and select their role, then click Assign.</p>
            <form className={styles.form} onSubmit={handleAssign}>
              <input
                className={styles.input}
                placeholder="user@iiitl.ac.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoFocus
              />
              <select className={styles.select} value={newRole} onChange={e => setNewRole(e.target.value)}>
                <option value="organizer">Organizer</option>
                <option value="admin">Admin</option>
                <option value="student">Student (remove access)</option>
              </select>
              <button className={styles.assignBtn} type="submit" disabled={saving}>
                {saving ? "Saving…" : "Assign Role"}
              </button>
            </form>
            {error && <p className={styles.error}>{error}</p>}
          </div>

          {/* Current assignments */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTitle}>Current Assignments</span>
              <span className={styles.badge}>{rows.length}</span>
            </div>
            <div className={styles.list}>
              {rows.length === 0 && <p className={styles.empty}>No roles assigned yet.</p>}
              {rows.map(r => (
                <div key={r.email} className={styles.row}>
                  <div className={styles.avatarCircle}>{r.email[0].toUpperCase()}</div>
                  <span className={styles.rowEmail}>{r.email}</span>
                  <select
                    className={`${styles.roleSelect} ${styles[r.role]}`}
                    value={r.role}
                    onChange={e => handleChangeRole(r.email, e.target.value)}
                  >
                    <option value="admin">Admin</option>
                    <option value="organizer">Organizer</option>
                    <option value="student">Student</option>
                  </select>
                  <button className={styles.removeBtn} onClick={() => handleRemove(r.email)} title="Remove">✕</button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
