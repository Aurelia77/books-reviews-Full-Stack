import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json(); // Remplace la récupération de req.body
  // Remplacez cette ligne pour récupérer un tableau d'IDs
  const { userId, bookIds } = body; // Avant : const { userId, bookId } = body;

  // Ajoutez une vérification pour bookIds
  if (!userId || !bookIds || !Array.isArray(bookIds)) {
    return new Response(
      JSON.stringify({ error: "Missing userId or bookIds" }),
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
  return new Response(JSON.stringify({ statuses }), { status: 200 });
}
