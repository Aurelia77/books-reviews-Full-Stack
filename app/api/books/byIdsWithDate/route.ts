import { prisma } from "@/lib/prisma";
import { BookTypePlusDate } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

type ByIdsWithDateType = {
  bookIds: string[];
  displayedAppUserId: string;
};

export async function POST(req: NextRequest) {
  const { bookIds, displayedAppUserId }: ByIdsWithDateType = await req.json();

  if (!bookIds || !Array.isArray(bookIds) || !displayedAppUserId) {
    return NextResponse.json(
      { error: "bookIds ou displayedAppUserId manquant" },
      { status: 400 }
    );
  }

  try {
    const books = await prisma.book.findMany({
      where: {
        id: {
          in: bookIds,
        },
      },
      include: {
        UserInfoBook: {
          where: {
            userId: displayedAppUserId,
          },
          select: {
            month: true,
            year: true,
          },
        },
      },
    });

    const booksWithDate: BookTypePlusDate[] = books.map((book: any) => {
      const info = book.UserInfoBook?.[0];

      return {
        ...book,
        year: info?.year ?? null,
        month: info?.month ?? null,
      };
    });

    return NextResponse.json(
      {
        success: true,
        message: "Livres récupérés avec succès",
        data: booksWithDate,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des livres :", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la récupération des livres.",
        code: "INTERNAL_SERVER_ERROR",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
