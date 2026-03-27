"use client";
import { useEffect } from "react";

const isBrowserExtensionError = (msg) =>
  typeof msg === "string" &&
  (msg.includes("removeChild") ||
    msg.includes("NotFoundError") ||
    msg.includes("insertBefore") ||
    msg.includes("Hydration"));

export default function HydrationFix() {
  useEffect(() => {
    // Suppress console errors from extensions
    const originalError = console.error;
    console.error = (...args) => {
      if (isBrowserExtensionError(args[0]?.toString?.())) return;
      originalError(...args);
    };

    // Suppress window error events
    const onError = (event) => {
      if (isBrowserExtensionError(event?.message) || isBrowserExtensionError(event?.error?.message)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return true;
      }
    };

    // Suppress unhandled promise rejections
    const onUnhandled = (event) => {
      if (isBrowserExtensionError(event?.reason?.message)) {
        event.preventDefault();
      }
    };

    window.addEventListener("error", onError, true);
    window.addEventListener("unhandledrejection", onUnhandled, true);

    return () => {
      window.removeEventListener("error", onError, true);
      window.removeEventListener("unhandledrejection", onUnhandled, true);
      console.error = originalError;
    };
  }, []);

  return null;
}
