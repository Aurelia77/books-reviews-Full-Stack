import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type BookStatusesType = {
  userId: string;
  bookIds: string[];
};

export async function POST(req: Request) {
  const { userId, bookIds }: BookStatusesType = await req.json(); // Remplace la récupération de req.body
  // Remplacez cette ligne pour récupérer un tableau d'IDs
  // const { userId, bookIds } = body; // Avant : const { userId, bookId } = body;

  console.log("💛💙💚 userId bookIds", userId, bookIds);

  // Ajoutez une vérification pour bookIds
  if (!userId || !bookIds || !Array.isArray(bookIds)) {
    return NextResponse.json(
      { error: "Missing userId or bookIds" },
      { status: 400 }
    );
  }

  const userBooks = await prisma.userInfoBook.findMany({
    where: {
      userId,
      bookId: { in: bookIds }, // Recherche pour plusieurs IDs
    },
  });

  // Transformez les résultats en un objet clé-valeur
  const statuses: Record<string, string | null> = userBooks.reduce(
    (acc: Record<string, string | null>, userBook) => {
      acc[userBook.bookId] = userBook.status;
      return acc;
    },
    {} as Record<string, string | null> // Typage explicite ici
  );

  // Retournez les statuts pour chaque livre
  return NextResponse.json({ statuses }, { status: 200 });
}
