import { prisma } from "@/lib/prisma";
import { BookTypePlusDate } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Récupère les données du body
  const { bookIds, displayedAppUserId } = await req.json();

  console.log("💛🤎 bookIds, displayedAppUserId", bookIds, displayedAppUserId);

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

    return NextResponse.json({ books: booksWithDate }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
