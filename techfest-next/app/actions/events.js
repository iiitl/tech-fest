"use server";

import clientPromise from "@/lib/mongodb";

export async function getEvents() {
  try {
    const client = await clientPromise;
    if (!client) return [];
    
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
      { $set: { 
          description: eventData.description, 
          comments: eventData.comments,
          ...(eventData.name    !== undefined && { name: eventData.name }),
          ...(eventData.time    !== undefined && { time: eventData.time }),
          ...(eventData.cat     !== undefined && { cat: eventData.cat }),
          ...(eventData.mode    !== undefined && { mode: eventData.mode }),
          ...(eventData.poc     !== undefined && { poc: eventData.poc }),
        } 
      },
      { upsert: true }
    );
    
    return { success: true };
  } catch (error) {
    console.error("Error saving event:", error);
    return { success: false, error: error.message };
  }
}

export async function createEvent(eventId, eventData) {
  try {
    const client = await clientPromise;
    if (!client) throw new Error("Database not connected");

    const db = client.db();
    await db.collection("events").updateOne(
      { eventId },
      { $set: { eventId, ...eventData } },
      { upsert: true }
    );

    return { success: true };
  } catch (error) {
    console.error("Error creating event:", error);
    return { success: false, error: error.message };
  }
}
