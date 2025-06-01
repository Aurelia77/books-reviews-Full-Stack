import { EMPTY_USER } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export type NewUserType = {
  id: string;
  email: string;
  userName: string;
};

export async function POST(req: Request) {
  const { id, email, userName }: NewUserType = await req.json();

  if (!email || !userName) {
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
    const newUser = await prisma.appUser.create({
      data: {
        ...EMPTY_USER,
        id,
        email,
        userName,
        isAdmin: email === "aurelia.h@hotmail.fr",
      },
    });

    return NextResponse.json(
      { message: "Utilisateur créé avec succès", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Erreur lors de la création de l'utilisateur (AppUser) :",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la création de l'utilisateur.",
        code: "INTERNAL_SERVER_ERROR",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
