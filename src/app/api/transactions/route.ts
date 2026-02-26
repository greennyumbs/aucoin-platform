import { NextResponse } from "next/server";
import { getTransactions } from "@/lib/store";

export async function GET() {
  try {
    return NextResponse.json(await getTransactions());
  } catch {
    return NextResponse.json([]);
  }
}
