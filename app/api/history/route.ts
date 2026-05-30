import { NextResponse } from "next/server";
import { getShuzoHistoryLast30Days } from "@/lib/temperature";

export async function GET() {
  try {
    const result = await getShuzoHistoryLast30Days();
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
