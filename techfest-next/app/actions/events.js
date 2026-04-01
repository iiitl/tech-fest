"use server";

import clientPromise from "@/lib/mongodb";

const COL = "events_v2";

export async function getEvents() {
  try {
    const client = await clientPromise;
    if (!client) return [];
    const db = client.db();
    const events = await db.collection(COL).find({}).toArray();
    return events.map(e => ({ ...e, _id: e._id.toString() }));
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
    await db.collection(COL).updateOne(
      { eventId },
      { $set: {
          eventId,
          ...(eventData.description !== undefined && { description: eventData.description }),
          ...(eventData.comments    !== undefined && { comments:    eventData.comments }),
          ...(eventData.name        !== undefined && { name:        eventData.name }),
          ...(eventData.time        !== undefined && { time:        eventData.time }),
          ...(eventData.cat         !== undefined && { cat:         eventData.cat }),
          ...(eventData.mode        !== undefined && { mode:        eventData.mode }),
          ...(eventData.poc         !== undefined && { poc:         eventData.poc }),
          ...(eventData.startDate   !== undefined && { startDate:   eventData.startDate }),
          ...(eventData.startTime   !== undefined && { startTime:   eventData.startTime }),
          ...(eventData.endDate     !== undefined && { endDate:     eventData.endDate }),
          ...(eventData.endTime     !== undefined && { endTime:     eventData.endTime }),
          ...(eventData.weekIdx     !== undefined && { weekIdx:     eventData.weekIdx }),
          ...(eventData.dayIdx      !== undefined && { dayIdx:      eventData.dayIdx }),
          ...(eventData.driveLink   !== undefined && { driveLink:   eventData.driveLink }),
          ...(eventData.rulebook     !== undefined && { rulebook:    eventData.rulebook }),
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

export async function deleteEvent(eventId) {
  try {
    const client = await clientPromise;
    if (!client) throw new Error("Database not connected");
    const db = client.db();
    await db.collection(COL).deleteOne({ eventId });
    return { success: true };
  } catch (error) {
    console.error("Error deleting event:", error);
    return { success: false, error: error.message };
  }
}

export async function createEvent(eventId, eventData) {
  try {
    const client = await clientPromise;
    if (!client) throw new Error("Database not connected");
    const db = client.db();
    await db.collection(COL).updateOne(
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
