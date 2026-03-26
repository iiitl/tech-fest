import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getRole as getStaticRole } from "@/lib/firebase";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) return NextResponse.json({ role: "student" });

  try {
    const client = await clientPromise;
    if (!client) return NextResponse.json({ role: getStaticRole(email) });
    const db = client.db();
    const doc = await db.collection("roles").findOne({ email });
    // DB role takes priority; fall back to static map
    const role = doc?.role || getStaticRole(email);
    return NextResponse.json({ role });
  } catch {
    return NextResponse.json({ role: getStaticRole(email) });
  }
}

export async function POST(request) {
  try {
    const { callerEmail, targetEmail, role: newRole } = await request.json();

    if (!callerEmail || !targetEmail || !newRole)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    if (!["admin", "organizer", "student"].includes(newRole))
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });

    // verify caller is admin
    const client = await clientPromise;
    if (!client) return NextResponse.json({ error: "DB unavailable" }, { status: 500 });
    const db = client.db();

    const callerDoc = await db.collection("roles").findOne({ email: callerEmail });
    const callerRole = callerDoc?.role || getStaticRole(callerEmail);
    if (callerRole !== "admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    await db.collection("roles").updateOne(
      { email: targetEmail },
      { $set: { email: targetEmail, role: newRole } },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { callerEmail, targetEmail } = await request.json();

    const client = await clientPromise;
    if (!client) return NextResponse.json({ error: "DB unavailable" }, { status: 500 });
    const db = client.db();

    const callerDoc = await db.collection("roles").findOne({ email: callerEmail });
    const callerRole = callerDoc?.role || getStaticRole(callerEmail);
    if (callerRole !== "admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    await db.collection("roles").deleteOne({ email: targetEmail });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
