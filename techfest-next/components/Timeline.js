"use client";
import { useState, useEffect } from "react";
import { week1, week2, CAT_COLOR } from "@/lib/data";
import { getEvents } from "@/app/actions/events";
import styles from "./Timeline.module.css";

const DATES = ["Apr 6","Apr 7","Apr 8","Apr 9","Apr 10","Apr 11","Apr 12","Apr 13","Apr 14","Apr 15","Apr 16","Apr 17","Apr 18"];
const TOTAL = DATES.length; // 13

// "Apr 6" -> index 0..12, null if not found
function dateToIdx(label) {
  return DATES.indexOf(label);
}

// "2026-04-06" -> "Apr 6"
function isoToLabel(iso) {
  if (!iso) return null;
  const [, , d] = iso.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const date = new Date(iso + "T00:00:00");
  return `${months[date.getMonth()]} ${parseInt(d, 10)}`;
}

// Parse start/end day indices from a legacy time string like:
//   "Apr 6 · 48 hrs"  -> start=0, end=2
//   "Apr 10-12 · 72 hrs" -> start=4, end=6
//   "6:00 PM – 8:30 PM · 2.5 hrs" -> single-day, start=end=dayIdx
//   "All fest · Apr 6-17" -> start=0, end=11
function parseLegacyTime(timeStr, dayIdx) {
  if (!timeStr) return { start: dayIdx, end: dayIdx };

  // "All fest · Apr 6-17"
  let m = timeStr.match(/Apr\s+(\d+)-(\d+)/);
  if (m) {
    const s = dateToIdx(`Apr ${m[1]}`);
    const e = dateToIdx(`Apr ${m[2]}`);
    return { start: s >= 0 ? s : dayIdx, end: e >= 0 ? e : dayIdx };
  }

  // "Apr 6 · 48 hrs" or "Apr 6 · 7 days"
  m = timeStr.match(/^Apr\s+(\d+)\s*·\s*([\d.]+)\s*(hrs|days)/i);
  if (m) {
    const s = dateToIdx(`Apr ${m[1]}`);
    const duration = parseFloat(m[2]);
    const unit = m[3].toLowerCase();
    const days = unit === "days" ? duration : duration / 24;
    return { start: s >= 0 ? s : dayIdx, end: Math.min(TOTAL - 1, (s >= 0 ? s : dayIdx) + Math.round(days)) };
  }

  // "Apr 7 · 3 hrs online" or "Apr 7 · 72 hrs"
  m = timeStr.match(/^Apr\s+(\d+)\s*·/);
  if (m) {
    const s = dateToIdx(`Apr ${m[1]}`);
    return { start: s >= 0 ? s : dayIdx, end: s >= 0 ? s : dayIdx };
  }

  // single-day offline event (has time like "6:00 PM")
  return { start: dayIdx, end: dayIdx };
}

function eventToBar(ev, dayIdx) {
  let start, end;

  if (ev.startDate) {
    const s = dateToIdx(isoToLabel(ev.startDate));
    const e = ev.endDate ? dateToIdx(isoToLabel(ev.endDate)) : s;
    start = s >= 0 ? s : dayIdx;
    end   = e >= 0 ? e : start;
  } else {
    ({ start, end } = parseLegacyTime(ev.time, dayIdx));
  }

  const color = ev.mode === "online" ? "#34d399" : ev.mode === "offline" ? "#f87171" : "#fbbf24";
  return { label: ev.name, start, end, color };
}

function buildBarsFromStatic() {
  const bars = [];
  [...week1, ...week2].forEach((day, dayIdx) => {
    day.events.forEach(ev => bars.push(eventToBar(ev, dayIdx)));
  });
  return bars;
}

export default function Timeline() {
  const [bars, setBars] = useState(buildBarsFromStatic);

  useEffect(() => {
    getEvents().then(dbEvents => {
      if (!dbEvents.length) return;
      // build a dayIdx lookup from weekIdx+dayIdx
      const toBars = dbEvents.map(e => {
        const dayIdx = e.weekIdx * 7 + e.dayIdx;
        return eventToBar(e, dayIdx);
      });
      setBars(toBars);
    }).catch(() => {});
  }, []);

  const pct = n => `${(n / TOTAL) * 100}%`;

  return (
    <div className={styles.section}>
      <div className={styles.legend}>
        <span><span className={styles.line} style={{ background: "#34d399" }} /><span style={{ color: "#34d399" }}>Online</span></span>
        <span><span className={styles.line} style={{ background: "#f87171" }} /><span style={{ color: "#f87171" }}>Offline</span></span>
        <span><span className={styles.line} style={{ background: "#fbbf24" }} /><span style={{ color: "#fbbf24" }}>Hybrid</span></span>
      </div>
      <div className={styles.dates}>
        {DATES.map(d => <span key={d}>{d}</span>)}
      </div>
      <div className={styles.bars}>
        {bars.map((bar, i) => (
          <div key={i} className={styles.row}>
            <span className={styles.label} style={{ borderColor: bar.color, color: bar.color, left: pct(bar.start) }}>{bar.label}</span>
            <span className={styles.bar} style={{ background: bar.color, left: `calc(${pct(bar.start)} + 90px)`, width: `calc(${pct(bar.end - bar.start + 1)} - 90px)` }} />
          </div>
        ))}
      </div>
    </div>
  );
}
