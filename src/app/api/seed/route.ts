import { NextResponse } from "next/server";
import { runPitchSeed } from "@/lib/seed-service";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const clear = searchParams.get("clear") === "true";
    const result = await runPitchSeed({ clear });
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Seed API GET error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to seed pitch data" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    let clear = false;
    try {
      const body = await req.json();
      clear = body?.clear === true;
    } catch {
      const { searchParams } = new URL(req.url);
      clear = searchParams.get("clear") === "true";
    }

    const result = await runPitchSeed({ clear });
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Seed API POST error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to seed pitch data" },
      { status: 500 }
    );
  }
}
