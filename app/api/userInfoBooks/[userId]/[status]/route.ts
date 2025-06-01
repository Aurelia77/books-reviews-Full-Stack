import { prisma } from "@/lib/prisma";
import { BookStatusType } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export type UserStatusParams = {
  userId: string;
  status: BookStatusType;
};

export async function GET(
  req: NextRequest,
  context: { params: Promise<UserStatusParams> }
) {
  const { userId, status } = await context.params;

  if (!userId || !status) {
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
    const books = await prisma.userInfoBook.findMany({
      where: {
        userId: userId,
        status: status as BookStatusType,
      },
      select: {
        bookId: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Livres récupérés avec succès",
        data: books.map((b: any) => b.bookId),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des info du livre de l'utilisateur (UserInfoBook) :",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Erreur lors de la récupération des info du livre de l'utilisateur.",
        code: "INTERNAL_SERVER_ERROR",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
