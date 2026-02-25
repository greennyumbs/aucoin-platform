import { NextRequest, NextResponse } from "next/server";
import { getUsers, createUser, getUserByName } from "@/lib/store";

export async function GET() {
  return NextResponse.json(getUsers());
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body || typeof body.name !== "string" || !body.name.trim()) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  const name = body.name.trim();

  if (name.length > 30) {
    return NextResponse.json({ error: "Name must be 30 characters or less." }, { status: 400 });
  }

  if (getUserByName(name)) {
    return NextResponse.json({ error: "That name is already taken." }, { status: 409 });
  }

  const initialBalance =
    typeof body.initialBalance === "number" && body.initialBalance >= 0
      ? Math.floor(body.initialBalance)
      : 0;

  const user = createUser(name, initialBalance);
  return NextResponse.json(user, { status: 201 });
}
