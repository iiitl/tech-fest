"use client";
import { useEffect, useState } from "react";
import { getEvents } from "@/app/actions/events";
import { CAT_COLOR } from "@/lib/data";
import styles from "./Timeline.module.css";

const DATES = ["Apr 6","Apr 7","Apr 8","Apr 9","Apr 10","Apr 11","Apr 12","Apr 13","Apr 14","Apr 15","Apr 16","Apr 17","Apr 18"];
const TOTAL = 13; // days

function dateToIdx(iso) {
  if (!iso) return null;
  const day = parseInt(iso.split("-")[2], 10);
  return day - 6; // Apr 6 = 0, Apr 18 = 12
}

export default function Timeline() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getEvents().then(evs => {
      // Only events with a startDate
      const filtered = evs
        .filter(e => e.startDate)
        .map(e => ({
          name: e.name,
          color: CAT_COLOR[e.cat] || "#888",
          mode: e.mode,
          start: dateToIdx(e.startDate),
          end: dateToIdx(e.endDate || e.startDate),
        }))
        .filter(e => e.start !== null && e.start >= 0 && e.start <= 12)
        .sort((a, b) => a.start - b.start);
      setEvents(filtered);
    }).catch(() => {});
  }, []);

  return (
    <div className={styles.section}>
      {/* Date header */}
      <div className={styles.dates}>
        {DATES.map(d => <span key={d}>{d}</span>)}
      </div>

      {/* Grid lines */}
      <div className={styles.gridLines}>
        {DATES.map((_, i) => <div key={i} className={styles.gridLine} />)}
      </div>

      {/* Bars */}
      <div className={styles.bars}>
        {events.map((ev, i) => {
          const startPct = (ev.start / TOTAL) * 100;
          const spanPct  = ((ev.end - ev.start + 1) / TOTAL) * 100;
          return (
            <div key={i} className={styles.row}>
              <div
                className={styles.bar}
                style={{
                  left:    `${startPct}%`,
                  width:   `${spanPct}%`,
                  background: ev.color,
                  opacity: ev.mode === "online" ? 0.85 : 1,
                  borderLeft: ev.mode === "offline" ? `3px solid ${ev.color}` : "none",
                }}
                title={`${ev.name} (${ev.mode})`}
              >
                <span className={styles.barLabel}>{ev.name}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <span><span className={styles.dot} style={{ background:"#888", opacity:0.85 }} />Online</span>
        <span><span className={styles.dot} style={{ background:"#888" }} />Offline (solid border)</span>
      </div>
    </div>
  );
}
