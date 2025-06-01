import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type BookStatusesType = {
  userId: string;
  bookIds: string[];
};

export async function POST(req: Request) {
  const { userId, bookIds }: BookStatusesType = await req.json();

  if (!userId || !bookIds || !Array.isArray(bookIds)) {
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
    const userBooks = await prisma.userInfoBook.findMany({
      where: {
        userId,
        bookId: { in: bookIds },
      },
    });

    // Transform the results into a key-value object
    const statuses: Record<string, string | null> = userBooks.reduce(
      (
        acc: Record<string, string | null>,
        userBook: { bookId: string; status: string | null }
      ) => {
        acc[userBook.bookId] = userBook.status;
        return acc;
      },
      {} as Record<string, string | null>
    );

    return NextResponse.json(
      {
        success: true,
        message: "Statuts récupérés avec succès",
        data: statuses,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des statuts des livres (dans UserInfoBook) :",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la récupération des statuts des livres.",
        code: "INTERNAL_SERVER_ERROR",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
