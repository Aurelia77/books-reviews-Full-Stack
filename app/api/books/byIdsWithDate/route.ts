import { prisma } from "@/lib/prisma";
import { BookType, BookTypePlusDate } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

type ByIdsWithDateType = {
  bookIds: string[];
  displayedAppUserId: string;
};

export async function POST(req: NextRequest) {
  const { bookIds, displayedAppUserId }: ByIdsWithDateType = await req.json();

  console.log("💛🤎 bookIds, displayedAppUserId", bookIds, displayedAppUserId);

  if (!bookIds || !Array.isArray(bookIds) || !displayedAppUserId) {
    return NextResponse.json(
      { error: "bookIds ou displayedAppUserId manquant" },
      { status: 400 }
    );
  }

  try {
    const books: BookType[] = await prisma.book.findMany({
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
            // note: true,
            // comments: true,
            // status: true,
          },
        },
      },
    });

    const booksWithDate: BookTypePlusDate[] = books.map((book) => {
      const info = book.UserInfoBook?.[0];

      console.log("🤎🤎🤎🤎", {
        ...book,
        year: info?.year ?? null,
        month: info?.month ?? null,
      });

      return {
        ...book,
        year: info?.year ?? null,
        month: info?.month ?? null,
      };
    });

    console.log("💛💙💚❤️🤍🤎 booksWithDate", booksWithDate);

    return NextResponse.json(
      {
        success: true,
        message: "Livres récupérés avec succès",
        data: booksWithDate,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
