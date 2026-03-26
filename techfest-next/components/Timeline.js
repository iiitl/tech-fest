"use client";
import { timelineBars, week1, week2, CAT_COLOR } from "@/lib/data";
import styles from "./Timeline.module.css";

const DATES = ["Apr 6","Apr 7","Apr 8","Apr 9","Apr 10","Apr 11","Apr 12","Apr 13","Apr 14","Apr 15","Apr 16","Apr 17","Apr 18"];
const allDays = [...week1, ...week2].filter(d => d.events.length > 0);

export default function Timeline() {
  return (
    <>
      <div className={styles.section}>
        <div className={styles.legend}>
          <span><span className={styles.line} style={{ background: "#34d399" }} /><span style={{ color: "#34d399" }}>Online</span></span>
          <span><span className={styles.line} style={{ background: "#f87171" }} /><span style={{ color: "#f87171" }}>Offline</span></span>
          <span><span className={styles.line} style={{ background: "#fbbf24" }} /><span style={{ color: "#fbbf24" }}>Hybrid</span></span>
        </div>
        <div className={styles.dates}>
          {DATES.map((d, i) => <span key={d} className={i === 4 ? styles.today : ""}>{d}</span>)}
        </div>
        <div className={styles.bars}>
          {timelineBars.map((bar) => {
            const pct = (n) => `${(n / 13) * 100}%`;
            return (
              <div key={bar.label} className={styles.row}>
                <span className={styles.label} style={{ borderColor: bar.color, color: bar.color, left: pct(bar.start) }}>{bar.label}</span>
                <span className={styles.bar} style={{ background: bar.color, left: `calc(${pct(bar.start)} + 90px)`, width: `calc(${pct(bar.end - bar.start)} - 90px)` }} />
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.mobileList}>
        {allDays.map(day => (
          <div key={day.date} className={styles.dayGroup}>
            <div className={styles.dayLabel}>{day.day} · {day.date}</div>
            {day.events.map((ev, i) => (
              <div key={i} className={styles.eventRow} style={{ borderLeftColor: CAT_COLOR[ev.cat] }}>
                <div className={styles.eventName}>{ev.name}</div>
                <div className={styles.eventMeta}>
                  <span style={{ color: CAT_COLOR[ev.cat] }}>{ev.cat}</span>
                  <span className={styles.dot}>·</span>
                  <span>{ev.time}</span>
                  <span className={`${styles.modeBadge} ${ev.mode === "online" ? styles.online : styles.offline}`}>{ev.mode}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
