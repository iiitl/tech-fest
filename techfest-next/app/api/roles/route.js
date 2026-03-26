import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    if (!client) return NextResponse.json([]);
    const db = client.db();
    const docs = await db.collection("roles").find({}).toArray();
    return NextResponse.json(docs.map(d => ({ email: d.email, role: d.role })));
  } catch {
    return NextResponse.json([]);
  }
}
