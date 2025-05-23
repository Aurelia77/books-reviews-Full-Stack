import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email } = await req.json();
  try {
    await authClient.forgetPassword({
      email,
      redirectTo: "/resetpassword/newpassword",
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: "Erreur lors de la demande." },
      { status: 400 }
    );
  }
}
