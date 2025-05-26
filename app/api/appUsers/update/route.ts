import { prisma } from "@/lib/prisma";
import { AccountFormType } from "@/lib/types";
import { NextResponse } from "next/server";

export type UpdateUserType = {
  currentUserId: string;
  data: AccountFormType;
};

export async function POST(req: Request) {
  try {
    const { currentUserId, data }: UpdateUserType = await req.json();

    console.log("💚💙💚 data", data);

    if (!data || !currentUserId) {
      return NextResponse.json(
        {
          success: false,
          error: "Paramètres manquants ou invalides",
          code: "MISSING_PARAMS",
        },
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
        {
          success: true,
          message: "Utilisateur mis à jour avec succès",
          data: appUser,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la mise à jour de l'utilisateur.",
        code: "INTERNAL_SERVER_ERROR",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
