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
  const [showTimeline, setShowTimeline] = useState(false);

  function toggleCat(cat) {
    setActiveCats(prev => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  }

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"#0f1117" }}>
      <div style={{ width:32, height:32, border:"3px solid #2a2d3a", borderTopColor:"#f97316", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <>
      <Header
        onFilterChange={setActiveFilter}
        onCatToggle={toggleCat}
        activeCats={activeCats}
        activeView={activeView}
        onViewChange={setActiveView}
        showTimeline={showTimeline}
        onTimelineToggle={() => setShowTimeline(p => !p)}
      />
      {activeView === "Split" && (
        <>
          {showTimeline && <div className="desktopOnly"><Timeline /></div>}
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
