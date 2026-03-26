"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { CATEGORIES, CAT_COLOR } from "@/lib/data";
import RoleManager from "./RoleManager";
import styles from "./Header.module.css";

export default function Header({ onFilterChange, onCatToggle, activeCats, activeView, onViewChange }) {
  const { user, role, logout } = useAuth();
  const [activeFilter, setActiveFilter] = useState("all");
  const [showCats, setShowCats] = useState(false);
  const [showRoleManager, setShowRoleManager] = useState(false);

  function handleFilter(f) {
    setActiveFilter(f);
    onFilterChange(f);
  }

  const activeCatCount = activeCats.size;

  return (
    <>
      <header className={styles.header}>
        <div className={styles.topRow}>
          <div className={styles.logo}>
            <h1>Tech<span>Fest</span></h1>
            <p>April 2026 · IIIT Lucknow</p>
          </div>
          <div className={styles.right}>
            <div className={styles.viewToggle}>
              {["Split", "Timeline", "Board"].map(v => (
                <button key={v} className={`${styles.viewBtn} ${activeView === v ? styles.active : ""}`} onClick={() => onViewChange(v)}>{v}</button>
              ))}
            </div>
            {user && (
              <div className={styles.userChip}>
                {user.photoURL
                  ? <img className={styles.avatar} src={user.photoURL} alt="avatar" referrerPolicy="no-referrer" />
                  : <div className={styles.avatarPlaceholder}>{user.displayName?.[0] ?? "?"}</div>
                }
                <span className={styles.userName}>{user.displayName || user.email.split("@")[0]}</span>
                <span className={styles.roleBadge}>{role}</span>
                <button className={styles.signOutBtn} onClick={logout} title="Sign out">×</button>
              </div>
            )}
            {role === "admin" && (
              <button className={styles.manageRolesBtn} onClick={() => setShowRoleManager(true)}>
                Manage Roles
              </button>
            )}
          </div>
        </div>

        {/* Filter row — mode filters + category toggle */}
        <div className={styles.filterRow}>
          {["all", "online", "offline"].map(f => (
            <button
              key={f}
              className={`${styles.filterBtn} ${activeFilter === f ? styles.active : ""}`}
              onClick={() => handleFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
          <div className={styles.divider} />
          <button
            className={`${styles.filterBtn} ${showCats ? styles.active : ""}`}
            onClick={() => setShowCats(p => !p)}
          >
            Categories {activeCatCount > 0 ? `(${activeCatCount})` : ""}
          </button>
        </div>

        {/* Category pills — shown only when expanded */}
        {showCats && (
          <div className={styles.catRow}>
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
        )}
      </header>
      {showRoleManager && <RoleManager onClose={() => setShowRoleManager(false)} />}
    </>
  );
}
