import { EMPTY_BOOK } from "@/lib/constants";
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
  try {
    const {
      currentUserId,
      bookInfos,
      formData,
      previousNote,
    }: NewOrUpdateBookType = await req.json();
    //console.log("Données reçues💚💚💚 :", body);

    // const { currentUserId, bookInfos, formData, previousNote } = body;

    console.log("🤎 userId", currentUserId);
    console.log("💚 bookInfos", bookInfos);
    console.log("💚💙💚 formData", formData);

    if (!currentUserId || !formData) {
      return NextResponse.json(
        { message: "Paramètres manquants ou invalides" },
        { status: 400 }
      );
    } else {
      const existingBook = await prisma.book.findUnique({
        where: { id: bookInfos.id },
      });

      // Si le livre n'existe pas => on le crée
      if (!existingBook) {
        console.log("💛🤍 book NOT existe");

        await prisma.book.create({
          data: {
            ...EMPTY_BOOK,
            ...bookInfos,
            totalRating: formData.userNote || 0,
            countRating: 1,
          },
        });
        // return NextResponse.json(
        //   { message: "Livre créé avec succès", book: newBook },
        //   { status: 201 }
        // );
        // Sinon, si le livre existe => on met à jour les ratings en fonction de la note donnée par l'utilisateur qui ajoute le livre
      } else {
        console.log("💛❤️🤍 book existe");
        let newTotalRating = existingBook.totalRating;
        let newCountRating = existingBook.countRating;

        // Si on a une note => on l'ajoute
        if (formData.userNote && formData.userNote !== 0) {
          if (previousNote) {
            // On enlève la note précédente
            newTotalRating += formData.userNote - previousNote;
          } else {
            newTotalRating += formData.userNote;
            newCountRating += 1;
          }
          // Sinon si pas de note (donc note = 0) => on supprime la note précédente
        } else {
          if (previousNote) {
            // On enlève la note précédente si y'en a une
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

      const bookEntry = await prisma.userInfoBook.upsert({
        where: {
          userId_bookId: {
            userId: currentUserId,
            bookId: bookInfos.id,
          },
        },
        update: {
          year: formData.year,
          month: formData.month,
          note: formData.userNote,
          comments: formData.userComments,
          status: formData.bookStatus,
        },
        create: {
          userId: currentUserId,
          bookId: bookInfos.id,
          year: formData.year,
          month: formData.month,
          note: formData.userNote,
          comments: formData.userComments,
          status: formData.bookStatus,
        },
      });

      return NextResponse.json(
        {
          message: "Book et UserInfoBook créés ou mis à jour avec succès",
          bookEntry: bookEntry,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Erreur dans l'API :", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur", error },
      { status: 500 }
    );
  }
}
