import { prisma } from "@/lib/prisma";
import { AccountFormType } from "@/lib/types";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    //console.log("Données reçues💚💚💚 :", body);
    const { currentUserId, data } = body;

    console.log("💚💙💚 data", data);

    if (!data) {
      return NextResponse.json(
        { message: "Données manquantes ou invalides" },
        { status: 400 }
      );
    } else {
      const appUser = await prisma.appUser.update({
        where: {
          id: currentUserId,
        },
        data: data,
      });

      return NextResponse.json(
        { message: "Utilisateur mis à jour avec succès", appUser },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
