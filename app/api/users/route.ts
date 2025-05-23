import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth-session";

export async function GET() {
  const user = await getUser();
  return NextResponse.json({ user });
}
