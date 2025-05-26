import { prisma } from "@/lib/prisma";
import { BookStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export type UserStatusParams = {
  userId: string;
  status: BookStatus;
};

export async function GET(
  req: NextRequest,
  context: { params: Promise<UserStatusParams> }
) {
  const { userId, status } = await context.params;

  console.log("💛💙💚❤️🤍🤎 userId, status", userId, status);

  if (!userId || !status) {
    return NextResponse.json(
      {
        success: false,
        error: "Données manquantes ou invalides",
        code: "MISSING_PARAMS",
      },
      { status: 400 }
    );
  }

  console.log("💛💙💚❤️🤍🤎 userId, status", userId, status);

  try {
    const books = await prisma.userInfoBook.findMany({
      where: {
        userId: userId,
        status: status as BookStatus,
      },
      select: {
        bookId: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Livres récupérés avec succès",
        data: books.map((b) => b.bookId),
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
