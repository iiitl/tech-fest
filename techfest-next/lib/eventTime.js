// Maps "Apr 6" style dates to 2025 Date objects
const MONTH_MAP = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 };

export function labelToIso(label) {
  // "Apr 6" -> "2025-04-06"
  const [mon, day] = label.split(" ");
  const m = MONTH_MAP[mon];
  if (m === undefined) return null;
  return `2025-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function isoToLabel(iso) {
  // "2025-04-06" -> "Apr 6"
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatEventTime(event) {
  // If event has structured fields, format them
  if (event.startDate) {
    const dateLabel = isoToLabel(event.startDate);
    if (event.startTime && event.endTime) {
      const dur = calcDuration(event.startTime, event.endTime);
      return `${dateLabel} · ${fmt12(event.startTime)} – ${fmt12(event.endTime)}${dur ? ` · ${dur}` : ""}`;
    }
    if (event.startTime) return `${dateLabel} · ${fmt12(event.startTime)}`;
    return dateLabel;
  }
  // fallback to legacy string
  return event.time || "";
}

export function calcDuration(startTime, endTime) {
  // "14:00" "17:30" -> "3.5 hrs" or "30 min"
  if (!startTime || !endTime) return "";
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  let mins = (eh * 60 + em) - (sh * 60 + sm);
  if (mins <= 0) mins += 24 * 60; // overnight
  if (mins < 60) return `${mins} min`;
  const hrs = mins / 60;
  return `${Number.isInteger(hrs) ? hrs : hrs.toFixed(1)} hrs`;
}

function fmt12(time24) {
  // "14:30" -> "2:30 PM"
  if (!time24) return "";
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}
