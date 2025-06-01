import { BookStatusValues, EMPTY_BOOK } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { BookType, MyInfoBookFormType } from "@/lib/types";
import { NextResponse } from "next/server";

type NewOrUpdateBookType = {
  currentUserId: string;
  bookInfos: BookType;
  formData: MyInfoBookFormType;
  previousNote: number;
};

export async function POST(req: Request) {
  const {
    currentUserId,
    bookInfos,
    formData,
    previousNote,
  }: NewOrUpdateBookType = await req.json();

  if (!currentUserId || !formData) {
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
    const existingBook = await prisma.book.findUnique({
      where: { id: bookInfos.id },
    });

    if (!existingBook) {
      await prisma.book.create({
        data: {
          ...EMPTY_BOOK,
          ...bookInfos,
          ...(formData.bookStatus === BookStatusValues.READ
            ? {
                totalRating: formData.userNote,
                countRating: 1,
              }
            : {}),
        },
      });
      // if the book exists => update ratings based on the rating given by the user who adds the book
    } else {
      // If the book is added as "read" (otherwise we don't save date or rating)
      if (formData.bookStatus === BookStatusValues.READ) {
        let newTotalRating = existingBook.totalRating;
        let newCountRating = existingBook.countRating;

        // If there is a rating => add it
        if (formData.userNote && formData.userNote !== 0) {
          if (previousNote) {
            // remove the previous rating before adding the new one
            newTotalRating += formData.userNote - previousNote;
          } else {
            newTotalRating += formData.userNote;
            newCountRating += 1;
          }
          // Sinon si pas de note (donc note = 0) => on supprime la note précédente
        } else {
          if (previousNote) {
            // remove the previous rating if there is one
            newTotalRating -= previousNote;
            newCountRating -= 1;
          }
        }

        await prisma.book.update({
          where: { id: bookInfos.id },
          data: {
            totalRating: newTotalRating,
            countRating: newCountRating,
          },
        });
      }
    }

    const userInfoBookEntry = await prisma.userInfoBook.upsert({
      where: {
        userId_bookId: {
          userId: currentUserId,
          bookId: bookInfos.id,
        },
      },
      // Add the date and the rating only if the book status is "READ"
      update: {
        year: formData.bookStatus === BookStatusValues.READ ? formData.year : 0,
        month:
          formData.bookStatus === BookStatusValues.READ ? formData.month : 0,
        note:
          formData.bookStatus === BookStatusValues.READ ? formData.userNote : 0,
        comments: formData.userComments,
        status: formData.bookStatus,
      },
      create: {
        userId: currentUserId,
        bookId: bookInfos.id,
        year: formData.bookStatus === BookStatusValues.READ ? formData.year : 0,
        month:
          formData.bookStatus === BookStatusValues.READ ? formData.month : 0,
        note:
          formData.bookStatus === BookStatusValues.READ ? formData.userNote : 0,
        comments: formData.userComments,
        status: formData.bookStatus,
      },
    });

    return NextResponse.json(
      {
        message: "Book et UserInfoBook créés ou mis à jour avec succès",
        bookEntry: userInfoBookEntry,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur dans l'API :", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur", error },
      { status: 500 }
    );
  }
}
