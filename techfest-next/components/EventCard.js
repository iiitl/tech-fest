import { CAT_CLASS, CAT_COLOR } from "@/lib/data";
import { formatDisplay } from "./DateTimePicker";
import styles from "./EventCard.module.css";

export default function EventCard({ event, onClick, onPointerDown, draggable }) {
  const { name, time, cat, mode, startDate, startTime, endDate, endTime } = event;
  const displayTime = startDate
    ? formatDisplay(startDate, startTime, endDate, endTime)
    : time;
  return (
    <div
      className={`${styles.card} ${styles[CAT_CLASS[cat] || ""]} ${draggable ? styles.draggable : ""}`}
      onClick={onClick}
      onPointerDown={onPointerDown}
      style={{ touchAction: draggable ? "none" : "auto" }}
    >
      <div className={styles.name}>{name}</div>
      {displayTime && <div className={styles.time}>{displayTime}</div>}
      <div className={styles.footer}>
        <span className={styles.cat} style={{ color: CAT_COLOR[cat] }}>{cat}</span>
        <span className={`${styles.mode} ${mode === "online" ? styles.online : styles.offline}`}>{mode}</span>
      </div>
    </div>
  );
}
