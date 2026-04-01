"use client";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import EventCard from "./EventCard";
import EventModal from "./EventModal";
import AddEventModal from "./AddEventModal";
import { week1, week2, DATE_TO_IDX } from "@/lib/data";
import { getEvents, saveEvent, createEvent, deleteEvent } from "@/app/actions/events";
import styles from "./WeekGrid.module.css";

export default function WeekGrid({ activeFilter, activeCats }) {
  const { role } = useAuth();
  const isAuthorized = role === "admin" || role === "organizer";

  const [activeDay, setActiveDay] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [weeksData, setWeeksData] = useState(() =>
    [week1, week2].map((week, wIdx) =>
      week.map((day, dIdx) => ({
        day: day.day, date: day.date, badge: day.badge,
        events: day.events.map((ev, eIdx) => ({
          ...ev, id: `${wIdx}-${dIdx}-${eIdx}`,
          description: ev.description || "Join us and participate! No detailed description provided yet.",
          comments: ev.comments || []
        }))
      }))
    )
  );
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [addTarget, setAddTarget] = useState(null);

  // drag
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [pendingSave, setPendingSave] = useState(null);
  const colRefs = useRef([]);
  const weeksRef = useRef(weeksData);
  const dragOverRef = useRef(null);
  weeksRef.current = weeksData;

  // flat list of all days across both weeks
  const allDays = [...weeksData[0], ...weeksData[1]];

  useEffect(() => {
    async function load() {
      try {
        const eventsFromDb = await getEvents();
        if (!eventsFromDb.length) { setLoaded(true); return; }
        setWeeksData(prev =>
          prev.map((week, wIdx) =>
            week.map((day, dIdx) => ({
              ...day,
              events: eventsFromDb
                .filter(e => e.weekIdx === wIdx && e.dayIdx === dIdx)
                .map(e => ({ id: e.eventId, name: e.name, time: e.time, cat: e.cat, mode: e.mode, description: e.description || "Join us and participate! No detailed description provided yet.", comments: e.comments || [], poc: e.poc, startDate: e.startDate, startTime: e.startTime, endDate: e.endDate, endTime: e.endTime, driveLink: e.driveLink || "", rulebook: e.rulebook || "" })),
            }))
          )
        );
        setLoaded(true);
      } catch (err) { console.error(err); setLoaded(true); }
    }
    load();
  }, []);

  // drag/touch handlers
  function onCardPointerDown(e, eventId, wIdx, dIdx) {
    if (!isAuthorized) return;
    e.preventDefault();
    setDragging({ eventId, fromWIdx: wIdx, fromDIdx: dIdx });
  }

  useEffect(() => {
    if (!dragging) return;

    function getTarget(clientX, clientY) {
      let found = null;
      colRefs.current.forEach(entry => {
        if (!entry?.el) return;
        const r = entry.el.getBoundingClientRect();
        if (clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom)
          found = { wIdx: entry.wIdx, dIdx: entry.dIdx };
      });
      return found;
    }

    function onMove(e) {
      const { clientX, clientY } = e.touches ? e.touches[0] : e;
      const found = getTarget(clientX, clientY);
      dragOverRef.current = found;
      setDragOver(found ? `${found.wIdx}-${found.dIdx}` : null);
    }

    function onUp(e) {
      const target = dragOverRef.current;
      const { eventId, fromWIdx, fromDIdx } = dragging;
      setDragging(null);
      setDragOver(null);
      dragOverRef.current = null;

      if (!target) return;
      const { wIdx: toWIdx, dIdx: toDIdx } = target;
      if (toWIdx === fromWIdx && toDIdx === fromDIdx) return;

      const targetDate = weeksRef.current[toWIdx][toDIdx].date;
      const current = weeksRef.current;
      let movedEvent = null;
      const next = current.map((week, wi) =>
        week.map((day, di) => {
          if (wi === fromWIdx && di === fromDIdx) {
            const found = day.events.find(ev => ev.id === eventId);
            if (found) movedEvent = { ...found }
            ;
            return { ...day, events: day.events.filter(ev => ev.id !== eventId) };
          }
          return day;
        })
      );
      if (!movedEvent) return;

      const targetDay = weeksRef.current[toWIdx][toDIdx];
      const targetDateISO = `2025-04-${String(targetDay.date.replace('Apr ', '')).padStart(2, '0')}`;
      const newEndDate = movedEvent.endDate && targetDateISO > movedEvent.endDate ? targetDateISO : movedEvent.endDate;
      const updatedEvent = { ...movedEvent, startDate: targetDateISO, endDate: newEndDate };

      next[toWIdx][toDIdx] = {
        ...next[toWIdx][toDIdx],
        events: [...next[toWIdx][toDIdx].events, updatedEvent]
      };
      setWeeksData(next);
      setPendingSave({ eventId, movedEvent: updatedEvent, toWIdx, toDIdx });
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [dragging]);

  // save drag to DB from React context (server actions can't be called from raw DOM listeners)
  useEffect(() => {
    if (!pendingSave) return;
    const { eventId, movedEvent, toWIdx, toDIdx } = pendingSave;
    setPendingSave(null);
    saveEvent(eventId, {
      startDate: movedEvent.startDate,
      endDate:   movedEvent.endDate,
      weekIdx:   toWIdx,
      dayIdx:    toDIdx,
    }).then(r => {
      if (r?.success) console.log(`[DB] Saved ${eventId} -> week${toWIdx} day${toDIdx}`);
      else console.error(`[DB] Failed to save ${eventId}:`, r?.error);
    }).catch(err => console.error(`[DB] Error saving ${eventId}:`, err));
  }, [pendingSave]);

  async function handleDeleteEvent(eventId) {
    setWeeksData(prev => prev.map(week => week.map(day => ({ ...day, events: day.events.filter(e => e.id !== eventId) }))));
    setSelectedEvent(null);
    try { await deleteEvent(eventId); } catch (err) { console.error(err); }
  }

  async function handleSaveEvent(updatedEvent) {
    const newPos = updatedEvent.startDate ? DATE_TO_IDX[updatedEvent.startDate] : null;
    setWeeksData(prev => {
      // remove from current position
      let next = prev.map(week => week.map(day => ({ ...day, events: day.events.filter(ev => ev.id !== updatedEvent.id) })));
      // find target position: use newPos if startDate changed and valid, else put back in original
      let toWIdx, toDIdx;
      if (newPos) {
        toWIdx = newPos.weekIdx; toDIdx = newPos.dayIdx;
      } else {
        // fallback: find where it currently is
        prev.forEach((week, wi) => week.forEach((day, di) => { if (day.events.find(e => e.id === updatedEvent.id)) { toWIdx = wi; toDIdx = di; } }));
      }
      if (toWIdx !== undefined) next[toWIdx][toDIdx] = { ...next[toWIdx][toDIdx], events: [...next[toWIdx][toDIdx].events, updatedEvent] };
      return next;
    });
    setSelectedEvent(updatedEvent);
    try {
      await saveEvent(updatedEvent.id, {
        description: updatedEvent.description,
        comments:    updatedEvent.comments,
        name:        updatedEvent.name,
        time:        updatedEvent.time,
        cat:         updatedEvent.cat,
        mode:        updatedEvent.mode,
        poc:         updatedEvent.poc,
        startDate:   updatedEvent.startDate,
        startTime:   updatedEvent.startTime,
        endDate:     updatedEvent.endDate,
        endTime:     updatedEvent.endTime,
        driveLink:   updatedEvent.driveLink,
        rulebook:    updatedEvent.rulebook,
        ...(newPos && { weekIdx: newPos.weekIdx, dayIdx: newPos.dayIdx }),
      });
      console.log(`[DB] Saved event ${updatedEvent.id}`);
    } catch (err) { console.error(`[DB] Failed to save event ${updatedEvent.id}:`, err); }
  }

  async function handleAddEvent(form) {
    const { weekIdx, dayIdx } = addTarget;
    const newEvent = { ...form, id: `custom-${Date.now()}`, description: form.description || "No description provided.", comments: [] };
    setWeeksData(prev => prev.map((week, wi) => week.map((day, di) => wi === weekIdx && di === dayIdx ? { ...day, events: [...day.events, newEvent] } : day)));
    setAddTarget(null);
    try { await createEvent(newEvent.id, { name: newEvent.name, time: newEvent.time, cat: newEvent.cat, mode: newEvent.mode, description: newEvent.description, comments: [], weekIdx, dayIdx }); }
    catch (err) { console.error(err); }
  }

  function filterEvents(events) {
    let r = events;
    if (activeFilter === "online") r = r.filter(e => e.mode === "online");
    else if (activeFilter === "offline") r = r.filter(e => e.mode === "offline");
    if (activeCats.size > 0) r = r.filter(e => activeCats.has(e.cat));
    return r;
  }

  return (
    <>
      {/* Mobile day picker — all days */}
      <div className={styles.dayPicker}>
        {allDays.map((dayData, i) => (
          <button key={dayData.date} className={`${styles.dayTab} ${activeDay === i ? styles.dayTabActive : ""}`} onClick={() => setActiveDay(i)}>
            <span className={styles.dayTabDay}>{dayData.day}</span>
            <span className={styles.dayTabDate}>{dayData.date.replace("Apr ", "")}</span>
          </button>
        ))}
      </div>

      <div className={styles.gridWrapper}>
        <div className={styles.grid} style={dragging ? { userSelect: "none", cursor: "grabbing" } : {}}>
          {allDays.map((dayData, flatIdx) => {
            const wIdx = flatIdx < 7 ? 0 : 1;
            const dIdx = flatIdx < 7 ? flatIdx : flatIdx - 7;
            const isOver = dragging && dragOver === `${wIdx}-${dIdx}`;
            const filtered = filterEvents(dayData.events);
            return (
              <div
                key={dayData.date}
                ref={el => { colRefs.current[flatIdx] = { el, wIdx, dIdx }; }}
                className={`${styles.dayCol} ${activeDay === flatIdx ? styles.active : ""} ${isOver ? styles.dragOver : ""}`}
              >
                <div className={styles.dayHeader}>
                  <h3><span>{dayData.day} · </span>{dayData.date}</h3>
                  {dayData.badge && <div className={styles.badge}>{dayData.badge}</div>}
                </div>
                <div className={styles.dayEvents}>
                  {filtered.length === 0 && <p className={styles.noEvents}>No events</p>}
                  {filtered.map((ev, i) => (
                    <EventCard
                      key={ev.id || i}
                      event={ev}
                      onClick={() => !dragging && setSelectedEvent(ev)}
                      draggable={isAuthorized}
                      onPointerDown={isAuthorized ? e => onCardPointerDown(e, ev.id, wIdx, dIdx) : undefined}
                    />
                  ))}
                  {isAuthorized && (
                    <button className={styles.addBtn} onClick={() => setAddTarget({ weekIdx: wIdx, dayIdx: dIdx, date: `${dayData.day}, ${dayData.date}` })}>+ add</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} onSave={handleSaveEvent} onDelete={handleDeleteEvent} />}
      {addTarget && <AddEventModal dayDate={addTarget.date} onClose={() => setAddTarget(null)} onAdd={handleAddEvent} />}
    </>
  );
}
