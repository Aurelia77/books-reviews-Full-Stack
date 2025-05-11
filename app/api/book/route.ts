import { prisma } from "@/lib/prisma";
import { BookType } from "@/lib/types";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  //console.log("Données reçues💚💚💚 :", body);
  const { userId, bookInfos, formData } = body;

  //console.log("💛💙💛💙💛💙bookInfos", bookInfos);

  // Après l'extraction des données
  if (userId && formData) {
    // Remplacez cette section dans la condition `if (userId && formData)`
    switch (formData.bookStatus) {
      case "booksReadList": {
        await prisma.appUser.update({
          where: { id: userId },
          data: {
            booksRead: {
              push: {
                id: formData.bookId,
                year: formData.year ?? null,
                month: formData.month ?? null,
                userNote: formData.userNote ?? 0,
                userComments: formData.userComments,
              },
            },
            booksInProgress: {
              set: await prisma.$executeRaw`
                SELECT ARRAY_REMOVE(booksInProgress, ${formData.bookId})
              `,
            },
            booksToRead: {
              set: await prisma.$executeRaw`
                SELECT ARRAY_REMOVE(booksToRead, ${formData.bookId})
              `,
            },
          },
        });
        break;
      }
      case "booksInProgressList": {
        await prisma.appUser.update({
          where: { id: userId },
          data: {
            booksInProgress: {
              push: {
                id: formData.bookId,
                userComments: formData.userComments,
              },
            },
            booksRead: {
              set: await prisma.$executeRaw`
                SELECT ARRAY_REMOVE(booksRead, ${formData.bookId})
              `,
            },
            booksToRead: {
              set: await prisma.$executeRaw`
                SELECT ARRAY_REMOVE(booksToRead, ${formData.bookId})
              `,
            },
          },
        });
        break;
      }
      case "booksToReadList": {
        await prisma.appUser.update({
          where: { id: userId },
          data: {
            booksToRead: {
              push: {
                id: formData.bookId,
                userComments: formData.userComments,
              },
            },
            booksRead: {
              set: await prisma.$executeRaw`
                SELECT ARRAY_REMOVE(booksRead, ${formData.bookId})
              `,
            },
            booksInProgress: {
              set: await prisma.$executeRaw`
                SELECT ARRAY_REMOVE(booksInProgress, ${formData.bookId})
              `,
            },
          },
        });
        break;
      }
      default: {
        console.error("Invalid bookStatus type");
        return NextResponse.json(
          { error: "Invalid bookStatus type" },
          { status: 400 }
        );
      }
    }
  }

  try {
    const newBook: BookType = await prisma.book.create({
      data: {
        ...bookInfos,
      },
    });

    return NextResponse.json(
      { message: "Livre créé avec succès", book: newBook },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de la création du livre :", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
