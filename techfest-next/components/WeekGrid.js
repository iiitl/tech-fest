"use client";
import { useState } from "react";
import EventCard from "./EventCard";
import { week1, week2 } from "@/lib/data";
import styles from "./WeekGrid.module.css";

export default function WeekGrid({ activeFilter, activeCats }) {
  const [currentWeek, setCurrentWeek] = useState(0);
  const weeks = [week1, week2];
  const data = weeks[currentWeek];
  const labels = ["Apr 6 – Apr 12", "Apr 13 – Apr 18"];

  function filterEvents(events) {
    let result = events;
    if (activeFilter === "online") result = result.filter(e => e.mode === "online");
    else if (activeFilter === "offline") result = result.filter(e => e.mode === "offline");
    if (activeCats.size > 0) result = result.filter(e => activeCats.has(e.cat));
    return result;
  }

  return (
    <>
      <div className={styles.weekNav}>
        <button
          className={styles.navBtn}
          onClick={() => setCurrentWeek(0)}
          disabled={currentWeek === 0}
        >← Prev</button>
        <span className={styles.weekLabel}>{labels[currentWeek]}</span>
        <button
          className={styles.navBtn}
          onClick={() => setCurrentWeek(1)}
          disabled={currentWeek === 1}
        >Next →</button>
      </div>

      <div className={styles.grid}>
        {data.map((dayData) => {
          const filtered = filterEvents(dayData.events);
          return (
            <div key={dayData.date} className={styles.dayCol}>
              <div className={styles.dayHeader}>
                <h3><span>{dayData.day} · </span>{dayData.date}</h3>
                {dayData.badge && <div className={styles.badge}>{dayData.badge}</div>}
              </div>
              <div className={styles.dayEvents}>
                {filtered.map((ev, i) => <EventCard key={i} event={ev} />)}
                <button className={styles.addBtn}>+ add</button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
