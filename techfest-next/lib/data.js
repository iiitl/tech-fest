export const CAT_CLASS = {
  FOSS: "cat-foss", Blockchain: "cat-blockchain", App: "cat-app",
  "GDG Web": "cat-gdgweb", Web: "cat-web", CP: "cat-cp",
  InfoSec: "cat-infosec", Design: "cat-design", ML: "cat-ml",
  "GDG FoSS": "cat-gdgfoss", GDG: "cat-gdg", "GDG ML Wing": "cat-gdgml",
};

export const CAT_COLOR = {
  FOSS: "#2d8a4e", Blockchain: "#3b6eda", App: "#e8a030",
  "GDG Web": "#e85830", Web: "#c44a2f", CP: "#d4772c",
  InfoSec: "#b83a5e", Design: "#8b5cf6", ML: "#2196F3",
  "GDG FoSS": "#0d9488", GDG: "#e85830", "GDG ML Wing": "#2196F3",
};

export const CATEGORIES = Object.keys(CAT_COLOR);

export const week1 = [
  {
    day: "Mon", date: "Apr 6", badge: "",
    events: [
      { name: "RiceFest", time: "All fest · Apr 6-17", cat: "FOSS", mode: "online" },
      { name: "Contract Battle", time: "Apr 6 · 48 hrs", cat: "Blockchain", mode: "online" },
      { name: "Appophilia", time: "Apr 6 · 7 days", cat: "App", mode: "online" },
      { name: "GDG UserRush", time: "Apr 6 · 7 days", cat: "GDG Web", mode: "online" },
      { name: "Dev Stakes", time: "Apr 6 · 84 hrs", cat: "Web", mode: "online" },
      { name: "SpeedForces", time: "6:00 PM – 8:30 PM · 2.5 hrs", cat: "CP", mode: "offline" },
      { name: "Comazotz – Day 1", time: "9:30 PM – 12:30 PM · 3 hrs", cat: "App", mode: "offline" },
    ],
  },
  {
    day: "Tue", date: "Apr 7", badge: "",
    events: [
      { name: "CodeULapk – App UI Sprint", time: "Apr 7 · 72 hrs", cat: "App", mode: "online" },
      { name: "Freshers Cup – R1", time: "Apr 7 · 3 hrs online", cat: "CP", mode: "online" },
      { name: "Design Finish", time: "10:30 PM – 11:30 PM · 1 hr", cat: "Design", mode: "offline" },
    ],
  },
  {
    day: "Wed", date: "Apr 8", badge: "",
    events: [
      { name: "Incognito 7.0", time: "Apr 8 · 48 hrs", cat: "InfoSec", mode: "online" },
      { name: "Silent Poster", time: "10:00 PM – 11:00 PM · 1 hr", cat: "Design", mode: "offline" },
      { name: "Comazotz – Day 2", time: "6:00 PM – 9:00 PM · 3 hrs", cat: "App", mode: "offline" },
    ],
  },
  {
    day: "Thu", date: "Apr 9", badge: "",
    events: [
      { name: "Freshers Cup – R2", time: "6:00 PM – 11:00 PM · 5 hrs", cat: "CP", mode: "offline" },
      { name: "PixelForge", time: "11:30 PM – 12:30 AM · 1 hr", cat: "Design", mode: "offline" },
    ],
  },
  {
    day: "Fri", date: "Apr 10", badge: "FOSS WKND",
    events: [
      { name: "FOSS Weekend", time: "Apr 10-12 · 72 hrs", cat: "FOSS", mode: "online" },
    ],
  },
  { day: "Sat", date: "Apr 11", badge: "FOSS WKND", events: [] },
  { day: "Sun", date: "Apr 12", badge: "FOSS WKND", events: [] },
];

export const week2 = [
  {
    day: "Mon", date: "Apr 13", badge: "",
    events: [
      { name: "Kaggle Cup", time: "Apr 13 · 72 hrs", cat: "ML", mode: "online" },
      { name: "GDG Fossology", time: "Apr 13 · 36 hrs online", cat: "GDG FoSS", mode: "online" },
      { name: "Code Arena", time: "6:00 PM – 9:00 PM · 3 hrs", cat: "CP", mode: "offline" },
      { name: "Frontend Sprint", time: "10:00 PM – 11:00 PM", cat: "Web", mode: "offline" },
    ],
  },
  {
    day: "Tue", date: "Apr 14", badge: "",
    events: [
      { name: "Language Wars – Session 1", time: "5:30 PM – 8:30 PM · 3 hrs", cat: "FOSS", mode: "offline" },
      { name: "GDG DevSphere", time: "9:30 PM – 12:30 AM · 3 hrs", cat: "GDG", mode: "offline" },
    ],
  },
  {
    day: "Wed", date: "Apr 15", badge: "",
    events: [
      { name: "PersonaLLM", time: "Apr 15 · 36 hrs", cat: "ML", mode: "online" },
      { name: "Language Wars – Session 2", time: "6:00 PM – 9:00 PM · 3 hrs", cat: "FOSS", mode: "offline" },
      { name: "Debug Duels", time: "10:00 PM – 11:30 PM · 1.5 hrs", cat: "Web", mode: "offline" },
    ],
  },
  {
    day: "Thu", date: "Apr 16", badge: "",
    events: [
      { name: "Speed CTF", time: "6:00 PM – 11:00 PM · 5 hrs", cat: "InfoSec", mode: "offline" },
    ],
  },
  {
    day: "Fri", date: "Apr 17", badge: "",
    events: [
      { name: "Global Contest", time: "Evening · 3 hrs", cat: "CP", mode: "online" },
      { name: "GDG Fossology – Round 2", time: "10:00 PM – 12:00 AM", cat: "GDG FoSS", mode: "offline" },
    ],
  },
  {
    day: "Sat", date: "Apr 18", badge: "FINALE",
    events: [
      { name: "Code Surgery", time: "11:00 AM – 2:00 PM · 3 hrs", cat: "Web", mode: "offline" },
      { name: "Debug Dash", time: "4:00 PM – 6:00 PM · 2 hrs", cat: "CP", mode: "offline" },
      { name: "Hackofiesta", time: "Starts 9:00 PM · 36 hrs · Team of 4", cat: "Blockchain", mode: "offline" },
    ],
  },
];

export const timelineBars = [
  { label: "RiceFest", start: 0, end: 12, color: "#34d399" },
  { label: "Contract Battle", start: 0, end: 2, color: "#34d399" },
  { label: "Appophilia", start: 0, end: 6.5, color: "#34d399" },
  { label: "GDG UserRush", start: 0, end: 6.5, color: "#34d399" },
  { label: "Dev Stakes", start: 0, end: 3.5, color: "#fbbf24" },
  { label: "S", start: 0, end: 1, color: "#f87171" },
];
