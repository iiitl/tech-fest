import { CAT_CLASS, CAT_COLOR } from "@/lib/data";
import styles from "./EventCard.module.css";

export default function EventCard({ event, onClick }) {
  const { name, time, cat, mode } = event;
  return (
    <div className={`${styles.card} ${styles[CAT_CLASS[cat] || ""]}`} onClick={onClick}>
      <div className={styles.name}>{name}</div>
      <div className={styles.time}>{time}</div>
      <div className={styles.footer}>
        <span className={styles.cat} style={{ color: CAT_COLOR[cat] }}>{cat}</span>
        <span className={`${styles.mode} ${mode === "online" ? styles.online : styles.offline}`}>{mode}</span>
      </div>
    </div>
  );
}
