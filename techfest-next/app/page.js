"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Timeline from "@/components/Timeline";
import WeekGrid from "@/components/WeekGrid";
import BoardView from "@/components/BoardView";

export default function Home() {
  const { loading } = useAuth();
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeCats, setActiveCats] = useState(new Set());
  const [activeView, setActiveView] = useState("Split");

  function toggleCat(cat) {
    setActiveCats(prev => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  }

  if (loading) return null;

  return (
    <>
      <Header
        onFilterChange={setActiveFilter}
        onCatToggle={toggleCat}
        activeCats={activeCats}
        activeView={activeView}
        onViewChange={setActiveView}
      />
      {activeView === "Split" && (
        <>
          <Timeline />
          <WeekGrid activeFilter={activeFilter} activeCats={activeCats} />
        </>
      )}
      {activeView === "Timeline" && <Timeline />}
      {activeView === "Board" && (
        <BoardView activeFilter={activeFilter} activeCats={activeCats} />
      )}
    </>
  );
}
