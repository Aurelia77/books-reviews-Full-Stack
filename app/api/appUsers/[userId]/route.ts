import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  if (!userId) {
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
    const appUser = await prisma.appUser.findUnique({
      where: {
        id: userId,
      },
    });

    if (!appUser) {
      return NextResponse.json(
        {
          success: false,
          error: "Utilisateur introuvable.",
          code: "USER_NOT_FOUND",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Utilisateur récupéré avec succès",
        data: appUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'utilisateur (AppUser) :",
      error
    );
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la récupération de l'utilisateur.",
        code: "INTERNAL_SERVER_ERROR",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
