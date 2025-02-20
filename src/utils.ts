import {
  BookStatusEnum,
  BookType,
  BookTypePlusUsersWhoRead,
  MyInfoBookPlusTitleAndNote,
} from "./types";

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

export const sortBookTypes = (
  books: BookTypePlusUsersWhoRead[],
  sortState: { [key in BookStatusEnum]: { criteria: string; order: string } }
): BookType[] => {
  console.log("sortBookTypes sortState", sortState);

  //const { criteria, order } = sortState;
  const { criteria, order } = sortState[BookStatusEnum.booksReadList];

  console.log("sortBookTypes criteria", criteria);
  console.log("sortBookTypes order", order);

  return books.sort((a, b) => {
    let comparison = 0;

    switch (criteria) {
      case "title":
        comparison = a.title.localeCompare(b.title);
        break;
      case "note":
        const ratingA = a.rating.count
          ? a.rating.totalRating / a.rating.count
          : 0;
        const ratingB = b.rating.count
          ? b.rating.totalRating / b.rating.count
          : 0;
        comparison = ratingA - ratingB;
        break;
    }
    return order === "asc" ? comparison : -comparison;
  });
};

// Ajout de la nouvelle fonction sortBookTypes pour trier les livres de type BookType
