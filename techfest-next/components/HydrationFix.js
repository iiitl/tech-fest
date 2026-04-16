"use client";
import { useEffect } from "react";

const isHydrationError = (msg) => {
  if (typeof msg !== "string") return false;
  return (
    msg.includes("removeChild") ||
    msg.includes("NotFoundError") ||
    msg.includes("insertBefore") ||
    msg.includes("Hydration") ||
    msg.includes("hydrat") ||
    msg.includes("did not match") ||
    msg.includes("Text content does not match")
  );
};

export default function HydrationFix() {
  useEffect(() => {
    // Patch Node.prototype.removeChild to guard against null-parent errors
    // caused by browser extensions (password managers, ad blockers, etc.)
    // injecting DOM nodes that confuse React's reconciler.
    const originalRemoveChild = Node.prototype.removeChild;
    Node.prototype.removeChild = function (child) {
      if (child && child.parentNode === this) {
        return originalRemoveChild.call(this, child);
      }
      // Child is already detached — silently ignore instead of throwing.
      return child;
    };

    const originalInsertBefore = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function (newNode, referenceNode) {
      if (referenceNode && referenceNode.parentNode !== this) {
        return this.appendChild(newNode);
      }
      return originalInsertBefore.call(this, newNode, referenceNode);
    };

    // Suppress console.error for hydration noise
    const originalError = console.error;
    console.error = (...args) => {
      if (isHydrationError(args[0]?.toString?.())) return;
      originalError(...args);
    };

    const onError = (event) => {
      if (
        isHydrationError(event?.message) ||
        isHydrationError(event?.error?.message)
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return true;
      }
    };

    const onUnhandled = (event) => {
      if (isHydrationError(event?.reason?.message)) {
        event.preventDefault();
      }
    };

    window.addEventListener("error", onError, true);
    window.addEventListener("unhandledrejection", onUnhandled, true);

    return () => {
      Node.prototype.removeChild = originalRemoveChild;
      Node.prototype.insertBefore = originalInsertBefore;
      window.removeEventListener("error", onError, true);
      window.removeEventListener("unhandledrejection", onUnhandled, true);
      console.error = originalError;
    };
  }, []);

  return null;
}
