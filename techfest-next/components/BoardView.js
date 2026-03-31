"use client";
import { useState, useEffect } from "react";
import { week1, week2, CAT_COLOR } from "@/lib/data";
import { sortEvents } from "@/lib/eventTime";
import { getEvents, saveEvent, deleteEvent } from "@/app/actions/events";
import EventCard from "./EventCard";
import EventModal from "./EventModal";
import styles from "./BoardView.module.css";

function buildAllEvents(weeksData) {
  const all = [];
  weeksData.forEach((week, wi) =>
    week.forEach((day, di) =>
      day.events.forEach((ev, ei) =>
        all.push({ ...ev, _day: `${day.day}, ${day.date}` })
      )
    )
  );
  return all;
}

export default function BoardView({ activeFilter, activeCats }) {
  const [weeksData, setWeeksData] = useState(() =>
    [week1, week2].map((week, wIdx) =>
      week.map((day, dIdx) => ({
        day: day.day, date: day.date, badge: day.badge,
        events: day.events.map((ev, eIdx) => ({
          ...ev, id: `${wIdx}-${dIdx}-${eIdx}`,
          description: ev.description || "Join us and participate! No detailed description provided yet.",
          comments: ev.comments || [],
        }))
      }))
    )
  );
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const dbEvents = await getEvents();
        if (!dbEvents.length) return;
        setWeeksData(prev =>
          prev.map((week, wIdx) =>
            week.map((day, dIdx) => ({
              ...day,
              events: dbEvents
                .filter(e => e.weekIdx === wIdx && e.dayIdx === dIdx)
                .map(e => ({ id: e.eventId, name: e.name, time: e.time, cat: e.cat, mode: e.mode, description: e.description || "Join us and participate! No detailed description provided yet.", comments: e.comments || [], poc: e.poc })),
            }))
          )
        );
      } catch (e) { console.error(e); }
    }
    load();
  }, []);

  async function handleSave(updatedEvent) {
    setWeeksData(prev =>
      prev.map(week =>
        week.map(day => ({
          ...day,
          events: day.events.map(ev => (ev.id === updatedEvent.id ? updatedEvent : ev)),
        }))
      )
    );
    setSelectedEvent(updatedEvent);
    try {
      await saveEvent(updatedEvent.id, {
        description: updatedEvent.description,
        comments: updatedEvent.comments,
        name: updatedEvent.name,
        time: updatedEvent.time,
        cat:  updatedEvent.cat,
        mode: updatedEvent.mode,
        poc:  updatedEvent.poc,
      });
    } catch (e) {
      console.error(e);
    }
  }

  async function handleDelete(eventId) {
    setWeeksData(prev =>
      prev.map(week =>
        week.map(day => ({ ...day, events: day.events.filter(e => e.id !== eventId) }))
      )
    );
    setSelectedEvent(null);
    try { await deleteEvent(eventId); } catch (e) { console.error(e); }
  }

  let events = buildAllEvents(weeksData);

  if (activeFilter === "online") events = events.filter(e => e.mode === "online");
  else if (activeFilter === "offline") events = events.filter(e => e.mode === "offline");
  if (activeCats.size > 0) events = events.filter(e => activeCats.has(e.cat));

  // Group by day
  const dayGroups = {};
  events.forEach(ev => {
    if (!dayGroups[ev._day]) dayGroups[ev._day] = [];
    dayGroups[ev._day].push(ev);
  });
  // Sort within each day: online first, then by time, no-time last
  Object.keys(dayGroups).forEach(day => { dayGroups[day] = sortEvents(dayGroups[day]); });

  // Group by category
  const groups = {};
  events.forEach(ev => {
    if (!groups[ev.cat]) groups[ev.cat] = [];
    groups[ev.cat].push(ev);
  });
  Object.keys(groups).forEach(cat => { groups[cat] = sortEvents(groups[cat]); });

  return (
    <>
      <div className={styles.board}>
        {Object.entries(groups).map(([cat, evs]) => (
          <div key={cat} className={styles.column}>
            <div className={styles.colHeader} style={{ borderColor: CAT_COLOR[cat] }}>
              <span className={styles.colDot} style={{ background: CAT_COLOR[cat] }} />
              <span className={styles.colName} style={{ color: CAT_COLOR[cat] }}>{cat}</span>
              <span className={styles.colCount}>{evs.length}</span>
            </div>
            <div className={styles.cards}>
              {evs.map(ev => (
                <div key={ev.id} className={styles.cardWrap}>
                  <EventCard event={ev} onClick={() => setSelectedEvent(ev)} />
                  <div className={styles.dayTag}>{ev._day}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {Object.keys(groups).length === 0 && (
          <p className={styles.empty}>No events match the current filters.</p>
        )}
      </div>
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
