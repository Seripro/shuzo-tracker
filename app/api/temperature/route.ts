import { NextRequest, NextResponse } from "next/server";
import { getTemperatureRanking } from "@/lib/temperature";

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date") ?? undefined;

  try {
    const result = await getTemperatureRanking(date);
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
