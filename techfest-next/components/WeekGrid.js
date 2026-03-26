"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import EventCard from "./EventCard";
import EventModal from "./EventModal";
import AddEventModal from "./AddEventModal";
import { week1, week2, CAT_CLASS } from "@/lib/data";
import { getEvents, saveEvent, createEvent } from "@/app/actions/events";
import styles from "./WeekGrid.module.css";

export default function WeekGrid({ activeFilter, activeCats }) {
  const { role } = useAuth();
  const isAuthorized = role === "admin" || role === "organizer";

  const [currentWeek, setCurrentWeek] = useState(0);
  const [activeDay, setActiveDay] = useState(0); // mobile: which day is shown
  const [weeksData, setWeeksData] = useState(() => {
    return [week1, week2].map((week, wIdx) =>
      week.map((day, dIdx) => ({
        ...day,
        events: day.events.map((ev, eIdx) => ({
          ...ev,
          id: `${wIdx}-${dIdx}-${eIdx}`,
          description: ev.description || "Join us and participate! No detailed description provided yet.",
          comments: ev.comments || []
        }))
      }))
    );
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [addTarget, setAddTarget] = useState(null);

  useEffect(() => {
    async function loadMongoData() {
      try {
        const eventsFromDb = await getEvents();
        const dbEventsMap = {};
        eventsFromDb.forEach(e => { dbEventsMap[e.eventId] = e; });
        if (eventsFromDb.length > 0) {
          setWeeksData(prev => prev.map(week => week.map(day => ({
            ...day,
            events: day.events.map(ev => ({
              ...ev,
              description: dbEventsMap[ev.id]?.description || ev.description,
              comments: dbEventsMap[ev.id]?.comments || ev.comments
            }))
          }))));
        }
      } catch (err) {
        console.error("Failed to load events:", err);
      }
    }
    loadMongoData();
  }, []);

  const data = weeksData[currentWeek];
  const labels = ["Apr 6 – Apr 12", "Apr 13 – Apr 18"];

  function handleWeekChange(idx) {
    setCurrentWeek(idx);
    setActiveDay(0);
  }

  async function handleSaveEvent(updatedEvent) {
    setWeeksData(prev =>
      prev.map(week =>
        week.map(day => ({
          ...day,
          events: day.events.map(ev => ev.id === updatedEvent.id ? updatedEvent : ev)
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
    } catch (err) {
      console.error("Failed to save event:", err);
    }
  }

  async function handleAddEvent(form) {
    const { weekIdx, dayIdx } = addTarget;
    const newEvent = {
      ...form,
      id: `custom-${Date.now()}`,
      description: form.description || "No description provided.",
      comments: [],
    };
    setWeeksData(prev =>
      prev.map((week, wi) =>
        week.map((day, di) =>
          wi === weekIdx && di === dayIdx
            ? { ...day, events: [...day.events, newEvent] }
            : day
        )
      )
    );
    setAddTarget(null);
    try {
      await createEvent(newEvent.id, {
        name: newEvent.name, time: newEvent.time,
        cat: newEvent.cat, mode: newEvent.mode,
        description: newEvent.description, comments: [],
      });
    } catch (err) {
      console.error("Failed to persist new event:", err);
    }
  }

  function filterEvents(events) {
    let result = events;
    if (activeFilter === "online") result = result.filter(e => e.mode === "online");
    else if (activeFilter === "offline") result = result.filter(e => e.mode === "offline");
    if (activeCats.size > 0) result = result.filter(e => activeCats.has(e.cat));
    return result;
  }

  return (
    <>
      {/* Week navigation */}
      <div className={styles.weekNav}>
        <button className={styles.navBtn} onClick={() => handleWeekChange(0)} disabled={currentWeek === 0}>← Prev</button>
        <span className={styles.weekLabel}>{labels[currentWeek]}</span>
        <button className={styles.navBtn} onClick={() => handleWeekChange(1)} disabled={currentWeek === 1}>Next →</button>
      </div>

      {/* Mobile day picker */}
      <div className={styles.dayPicker}>
        {data.map((dayData, i) => (
          <button
            key={dayData.date}
            className={`${styles.dayTab} ${activeDay === i ? styles.dayTabActive : ""}`}
            onClick={() => setActiveDay(i)}
          >
            <span className={styles.dayTabDay}>{dayData.day}</span>
            <span className={styles.dayTabDate}>{dayData.date.replace("Apr ", "")}</span>
          </button>
        ))}
      </div>

      <div className={styles.gridWrapper}>
        <div className={styles.grid}>
          {data.map((dayData, dayIdx) => {
            const filtered = filterEvents(dayData.events);
            return (
              <div
                key={dayData.date}
                className={`${styles.dayCol} ${activeDay === dayIdx ? styles.active : ""}`}
              >
                <div className={styles.dayHeader}>
                  <h3><span>{dayData.day} · </span>{dayData.date}</h3>
                  {dayData.badge && <div className={styles.badge}>{dayData.badge}</div>}
                </div>
                <div className={styles.dayEvents}>
                  {filtered.length === 0 && (
                    <p className={styles.noEvents}>No events</p>
                  )}
                  {filtered.map((ev, i) => (
                    <EventCard key={ev.id || i} event={ev} onClick={() => setSelectedEvent(ev)} />
                  ))}
                  {isAuthorized && (
                    <button
                      className={styles.addBtn}
                      onClick={() => setAddTarget({ weekIdx: currentWeek, dayIdx, date: `${dayData.day}, ${dayData.date}` })}
                    >+ add</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} onSave={handleSaveEvent} />
      )}
      {addTarget && (
        <AddEventModal dayDate={addTarget.date} onClose={() => setAddTarget(null)} onAdd={handleAddEvent} />
      )}
    </>
  );
}
