"use server";

import clientPromise from "@/lib/mongodb";
import { getRole as getStaticRole } from "@/lib/firebase";

// DB is source of truth. Static ROLES map is fallback only.
export async function getRoleFromDb(email) {
  if (!email) return "student";
  try {
    const client = await clientPromise;
    if (!client) return getStaticRole(email);
    const db = client.db();
    const doc = await db.collection("roles").findOne({ email });
    if (doc?.role) return doc.role;
    // fall back to hardcoded map
    return getStaticRole(email);
  } catch {
    return getStaticRole(email);
  }
}

export async function setUserRole(callerEmail, targetEmail, newRole) {
  const callerRole = await getRoleFromDb(callerEmail);
  if (callerRole !== "admin") throw new Error("Unauthorized");
  if (!["admin", "organizer", "student"].includes(newRole)) throw new Error("Invalid role");

  const client = await clientPromise;
  const db = client.db();
  await db.collection("roles").updateOne(
    { email: targetEmail },
    { $set: { email: targetEmail, role: newRole } },
    { upsert: true }
  );
  return { success: true };
}

export async function listRoles() {
  try {
    const client = await clientPromise;
    if (!client) return [];
    const db = client.db();
    const docs = await db.collection("roles").find({}).toArray();
    return docs.map(d => ({ email: d.email, role: d.role }));
  } catch {
    return [];
  }
}
