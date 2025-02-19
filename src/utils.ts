import { BookStatusEnum, MyInfoBookPlusTitleAndNote } from "./types";

export const cleanDescription = (description: string) => {
  return (
    description
      // Supprimer toutes les balises HTML
      .replace(/<\/?[^>]+(>|$)/g, "")
      // Remplacer les balises <br> par des sauts de ligne
      .replace(/<br\s*\/?>\s*(<br\s*\/?>)*/g, "\n")
      // Supprimer les guillemets français et anglais en début et fin de texte
      .replace(/^[«"]+|[»"]+$/g, "")
  );
};

export const sortBooks = (
  books: MyInfoBookPlusTitleAndNote[],
  bookStatus: BookStatusEnum,
  sortState: { [key in BookStatusEnum]: { criteria: string; order: string } }
): MyInfoBookPlusTitleAndNote[] => {
  const { criteria, order } = sortState[bookStatus];

  return books.sort((a, b) => {
    let comparison = 0;
    let yearComparison = 0;

    switch (criteria) {
      case "title":
        comparison = a.bookTitle.localeCompare(b.bookTitle);
        break;
      case "date":
        yearComparison = (a.year ?? 0) - (b.year ?? 0);
        if (yearComparison !== 0) {
          comparison = yearComparison;
        } else {
          comparison = (a.month ?? 0) - (b.month ?? 0);
        }
        break;
      case "note":
        comparison = (a.bookNote ?? 0) - (b.bookNote ?? 0);
        break;
    }
    return order === "asc" ? comparison : -comparison;
  });
};
