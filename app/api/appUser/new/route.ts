import { EMPTY_USER } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { id, email, userName } = body;

  console.log("💛💙 id", id);
  console.log("💛💙 email", email);
  console.log("💛💙 userName", userName);

  try {
    // Vérification des données
    if (!email || !userName) {
      return NextResponse.json(
        { error: "Tous les champs sont requis." },
        { status: 400 }
      );
    }

    // Création de l'utilisateur dans la base de données
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
    console.error("Erreur lors de la création de l'utilisateur :", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
