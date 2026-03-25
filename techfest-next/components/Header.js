"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { CATEGORIES, CAT_COLOR } from "@/lib/data";
import styles from "./Header.module.css";

export default function Header({ onFilterChange, onCatToggle, activeCats }) {
  const { user, role, logout } = useAuth();
  const [activeFilter, setActiveFilter] = useState("all");

  function handleFilter(f) {
    setActiveFilter(f);
    onFilterChange(f);
  }

  const filters = ["all", "online", "offline", "hybrid"];

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <h1>Tech<span>Fest</span></h1>
          <p>April 2026 · IIIT Lucknow</p>
        </div>
        <div className={styles.filters}>
          {filters.map(f => (
            <button
              key={f}
              className={`${styles.filterBtn} ${activeFilter === f ? styles.active : ""}`}
              onClick={() => handleFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
          <div className={styles.divider} />
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`${styles.catPill} ${activeCats.has(cat) ? styles.catActive : ""}`}
              onClick={() => onCatToggle(cat)}
            >
              <span className={styles.catDot} style={{ background: CAT_COLOR[cat] }} />
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.right}>
        <span className={styles.eventCount}>31 events</span>
        <div className={styles.viewToggle}>
          {["Split", "Timeline", "Board"].map((v, i) => (
            <button key={v} className={`${styles.viewBtn} ${i === 0 ? styles.active : ""}`}>{v}</button>
          ))}
        </div>
        {user ? (
          <div className={styles.userChip}>
            {user.photoURL
              ? <img className={styles.avatar} src={user.photoURL} alt="avatar" referrerPolicy="no-referrer" />
              : <div className={styles.avatarPlaceholder}>{user.displayName?.[0] ?? "?"}</div>
            }
            <span className={styles.userName}>{user.displayName || user.email.split("@")[0]}</span>
            <span className={styles.roleBadge}>{role}</span>
            <button className={styles.signOutBtn} onClick={logout} title="Sign out">×</button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
