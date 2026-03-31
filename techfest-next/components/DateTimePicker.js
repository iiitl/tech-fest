"use client";
import styles from "./DateTimePicker.module.css";

function isoToLabel(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatDisplay(startDate, startTime, endDate, endTime) {
  if (!startDate) return "";
  const sLabel = isoToLabel(startDate);
  const eLabel = endDate ? isoToLabel(endDate) : null;

  const fmt12 = t => {
    if (!t) return null;
    const [h, m] = t.split(":").map(Number);
    const p = h >= 12 ? "PM" : "AM";
    return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${p}`;
  };

  let str = sLabel;
  if (eLabel && eLabel !== sLabel) str += ` – ${eLabel}`;
  if (startTime) str += ` · ${fmt12(startTime)}`;
  if (endTime) {
    str += ` – ${fmt12(endTime)}`;
    // calc duration
    const s = new Date(`2026-${startDate.slice(5)}T${startTime || "00:00"}`);
    const eDate = endDate || startDate;
    const e = new Date(`2026-${eDate.slice(5)}T${endTime}`);
    let mins = Math.round((e - s) / 60000);
    if (mins <= 0) mins += 24 * 60;
    if (mins > 0) {
      const dur = mins < 60 ? `${mins} min`
        : `${Number.isInteger(mins/60) ? mins/60 : (mins/60).toFixed(1)} hrs`;
      str += ` · ${dur}`;
    }
  }
  return str;
}

export default function DateTimePicker({ value, onChange }) {
  const { startDate, startTime, endDate, endTime } = value;

  function set(field, val) {
    onChange({ ...value, [field]: val });
  }

  const preview = formatDisplay(startDate, startTime, endDate, endTime);

  return (
    <div className={styles.picker}>
      <div className={styles.row}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Start Date</span>
          <input
            type="date"
            className={styles.input}
            min="2026-04-06"
            max="2026-04-18"
            value={startDate || ""}
            onChange={e => set("startDate", e.target.value)}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>End Date</span>
          <input
            type="date"
            className={styles.input}
            min={startDate || "2026-04-06"}
            max="2026-04-18"
            value={endDate || ""}
            onChange={e => set("endDate", e.target.value)}
          />
        </label>
      </div>
      <div className={styles.row}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Start Time</span>
          <input
            type="time"
            className={styles.input}
            value={startTime || ""}
            onChange={e => set("startTime", e.target.value)}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>End Time</span>
          <input
            type="time"
            className={styles.input}
            value={endTime || ""}
            onChange={e => set("endTime", e.target.value)}
          />
        </label>
      </div>
      {preview && <div className={styles.preview}>{preview}</div>}
    </div>
  );
}
