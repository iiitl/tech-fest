"use server";

import clientPromise from "@/lib/mongodb";

export async function getEvents() {
  try {
    const client = await clientPromise;
    if (!client) return [];
    
    // Default to the connected database
    const db = client.db();
    const events = await db.collection("events").find({}).toArray();
    
    return events.map(e => ({
      ...e,
      _id: e._id.toString()
    }));
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

export async function saveEvent(eventId, eventData) {
  try {
    const client = await clientPromise;
    if (!client) throw new Error("Database not connected");
    
    const db = client.db();
    await db.collection("events").updateOne(
      { eventId: eventId },
      { $set: { description: eventData.description, comments: eventData.comments } },
      { upsert: true }
    );
    
    return { success: true };
  } catch (error) {
    console.error("Error saving event:", error);
    return { success: false, error: error.message };
  }
}
