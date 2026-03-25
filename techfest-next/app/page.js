"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AuthGate from "@/components/AuthGate";
import Header from "@/components/Header";
import Timeline from "@/components/Timeline";
import WeekGrid from "@/components/WeekGrid";

export default function Home() {
  const { user, loading } = useAuth();
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeCats, setActiveCats] = useState(new Set());

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
      {!user && <AuthGate />}
      <Header
        onFilterChange={setActiveFilter}
        onCatToggle={toggleCat}
        activeCats={activeCats}
      />
      <Timeline />
      <WeekGrid activeFilter={activeFilter} activeCats={activeCats} />
    </>
  );
}
