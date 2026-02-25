import { NextRequest, NextResponse } from "next/server";
import { executeTrade } from "@/lib/store";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { fromId, toId, amount, note } = body;

  if (!fromId || !toId) {
    return NextResponse.json({ error: "fromId and toId are required." }, { status: 400 });
  }

  if (typeof amount !== "number" || amount <= 0 || !Number.isFinite(amount)) {
    return NextResponse.json({ error: "Amount must be a positive number." }, { status: 400 });
  }

  const result = executeTrade(fromId, toId, Math.floor(amount), note ?? "");

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result.tx, { status: 201 });
}
