import { authClient } from "@/lib/auth-client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email }: { email: string } = await req.json();

  if (!email) {
    return NextResponse.json(
      {
        success: false,
        error: "Paramètres manquants ou invalides",
        code: "MISSING_PARAMS",
      },
      { status: 400 }
    );
  }

  try {
    await authClient.forgetPassword({
      email,
      redirectTo: "/resetpassword/newpassword",
    });
    return NextResponse.json(
      {
        success: true,
        message: "Demande envoyée avec succès",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Erreur lors de la réinitialisation du mot de passe :",
      error
    );
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la demande de réinitialisation du mot de passe.",
        code: "INTERNAL_SERVER_ERROR",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
