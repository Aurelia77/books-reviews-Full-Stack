import { prisma } from "@/lib/prisma";
import { BookStatusType } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export type DeleteBookParams = {
  userId: string;
  bookId: string;
  bookStatus: BookStatusType;
};

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<DeleteBookParams> }
) {
  const { userId, bookId, bookStatus } = await context.params;

  if (!userId || !bookId || !bookStatus) {
    return NextResponse.json(
      {
        success: false,
        error: "Paramètres manquants ou invalides",
        code: "MISSING_PARAMS",
      },
      { status: 400 }
    );
  }

  let userInfoBook;

  try {
    userInfoBook = await prisma.userInfoBook.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
        status: bookStatus,
      },
      select: { note: true },
    });

    if (!userInfoBook) {
      return NextResponse.json(
        {
          success: false,
          error: "userInfoBook introuvable.",
          code: "NOT_FOUND",
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de userInfoBook :", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la récupération de userInfoBook.",
        code: "INTERNAL_SERVER_ERROR",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }

  try {
    await prisma.userInfoBook.delete({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
        status: bookStatus,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du userInfoBook :", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la suppression du userInfoBook.",
        code: "DELETE_ERROR",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }

  try {
    await prisma.book.update({
      where: { id: bookId },
      data: {
        totalRating: {
          decrement: userInfoBook.note || 0,
        },
        countRating: {
          decrement: 1,
        },
      },
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la note du livre :", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la mise à jour de la note du livre.",
        code: "BOOK_UPDATE_ERROR",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: "Livre supprimé de UserInfoBook et note mise à jour dans Book.",
    },
    { status: 200 }
  );
}
