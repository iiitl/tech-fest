"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { listRoles, setUserRole } from "@/app/actions/roles";
import styles from "./RoleManager.module.css";

export default function RoleManager({ onClose }) {
  const { user } = useAuth();
  const [rows, setRows]       = useState([]);
  const [email, setEmail]     = useState("");
  const [newRole, setNewRole] = useState("organizer");
  const [error, setError]     = useState("");
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    listRoles().then(setRows);
  }, []);

  async function handleAssign(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setError(""); setSaving(true);
    try {
      await setUserRole(user.email, email.trim(), newRole);
      const updated = await listRoles();
      setRows(updated);
      setEmail("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(target) {
    setError("");
    try {
      await setUserRole(user.email, target, "student");
      setRows(prev => prev.filter(r => r.email !== target));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Manage Roles</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.body}>
          <form className={styles.form} onSubmit={handleAssign}>
            <input
              className={styles.input}
              placeholder="user@iiitl.ac.in"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <select
              className={styles.select}
              value={newRole}
              onChange={e => setNewRole(e.target.value)}
            >
              <option value="organizer">Organizer</option>
              <option value="admin">Admin</option>
              <option value="student">Student</option>
            </select>
            <button className={styles.assignBtn} type="submit" disabled={saving}>
              {saving ? "Saving…" : "Assign"}
            </button>
          </form>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.list}>
            {rows.length === 0 && (
              <p className={styles.empty}>No roles assigned yet.</p>
            )}
            {rows.map(r => (
              <div key={r.email} className={styles.row}>
                <span className={styles.rowEmail}>{r.email}</span>
                <span className={`${styles.rolePill} ${styles[r.role]}`}>{r.role}</span>
                <button className={styles.removeBtn} onClick={() => handleRemove(r.email)}>✕</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
