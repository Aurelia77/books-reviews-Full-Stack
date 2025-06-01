import { getConnectedUser } from "@/lib/auth-session";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getConnectedUser();
  return NextResponse.json({ user });
}
