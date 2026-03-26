"use client";
import { useEffect } from "react";

export default function HydrationFix() {
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      const msg = args[0]?.toString?.() ?? "";
      if (msg.includes("removeChild") || msg.includes("NotFoundError") || msg.includes("Hydration")) return;
      originalError(...args);
    };

    const handler = (event) => {
      const msg = event.message ?? "";
      if (msg.includes("removeChild") || msg.includes("NotFoundError")) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    window.addEventListener("error", handler);
    return () => {
      window.removeEventListener("error", handler);
      console.error = originalError;
    };
  }, []);

  return null;
}
