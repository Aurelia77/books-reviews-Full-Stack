import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { bookIds }: { bookIds: string[] } = await req.json();

    if (!Array.isArray(bookIds) || bookIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Paramètres manquants ou invalides",
          code: "MISSING_PARAMS",
        },
        { status: 400 }
      );
    }

    const books = await prisma.book.findMany({
      where: {
        id: {
          in: bookIds,
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Livres récupérés avec succès",
        data: books,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des livres :", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la récupération d'un utilisateur.",
        code: "INTERNAL_SERVER_ERROR",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
