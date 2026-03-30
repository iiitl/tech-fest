"use client";
import { useState } from "react";
import { CATEGORIES } from "@/lib/data";
import DateTimePicker, { formatDisplay } from "./DateTimePicker";
import styles from "./AddEventModal.module.css";

export default function AddEventModal({ dayDate, onClose, onAdd }) {
  // Pre-select the date from dayDate e.g. "Mon, Apr 6" -> 6
  const defaultDate = (() => {
    const m = dayDate?.match(/Apr (\d+)/);
    return m ? parseInt(m[1]) : null;
  })();

  const [form, setForm] = useState({
    name: "",
    cat: CATEGORIES[0],
    mode: "offline",
    description: "",
  });
  const [dt, setDt] = useState({ startDate: defaultDate ? `2025-04-${String(defaultDate).padStart(2,"0")}` : "", startTime: "", endDate: "", endTime: "" });
  const [error, setError] = useState("");

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return setError("Event name is required.");
    if (!dt.startDate) return setError("Date is required.");
    setError("");
    const time = formatDisplay(dt.startDate, dt.startTime, dt.endDate, dt.endTime);
    onAdd({ ...form, time, startDate: dt.startDate, startTime: dt.startTime, endDate: dt.endDate, endTime: dt.endTime });
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Add Event</h2>
            <p className={styles.sub}>{dayDate}</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <form className={styles.body} onSubmit={handleSubmit}>
          <label className={styles.label}>
            Event Name
            <input
              className={styles.input}
              placeholder="e.g. Hackathon Finals"
              value={form.name}
              onChange={e => set("name", e.target.value)}
              autoFocus
            />
          </label>

          <div className={styles.label}>
            Date & Time
            <DateTimePicker value={dt} onChange={setDt} />
          </div>

          <div className={styles.row}>
            <label className={styles.label}>
              Category
              <select className={styles.input} value={form.cat} onChange={e => set("cat", e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label className={styles.label}>
              Mode
              <select className={styles.input} value={form.mode} onChange={e => set("mode", e.target.value)}>
                <option value="offline">Offline</option>
                <option value="online">Online</option>
              </select>
            </label>
          </div>

          <label className={styles.label}>
            Description <span className={styles.optional}>(optional)</span>
            <textarea
              className={styles.textarea}
              placeholder="Brief description of the event..."
              value={form.description}
              onChange={e => set("description", e.target.value)}
            />
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.submitBtn}>Add Event</button>
          </div>
        </form>
      </div>
    </div>
  );
}
