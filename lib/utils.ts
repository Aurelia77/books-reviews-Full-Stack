import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { BookStatusEnum, BookType, BookTypePlusUsersWhoRead } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const cleanDescription = (description: string) => {
  return (
    description
      // Supprimer toutes les balises HTML
      .replace(/<\/?[^>]+(>|$)/g, "")
      // Supprimer les espaces en début et fin
      .trim()
      // Remplacer les balises <br> par des sauts de ligne
      .replace(/<br\s*\/?>\s*(<br\s*\/?>)*/g, "\n")
      // Supprimer les guillemets français et anglais en début et fin de texte
      .replace(/^[«"]+|[»"]+$/g, "")
  );
};

// export const sortBooksByStatus = (
//   books: MyInfoBookPlusTitleAndNote[],
//   bookStatus: BookStatusEnum,
//   sortState: { [key in BookStatusEnum]: { criteria: string; order: string } }
// ): MyInfoBookPlusTitleAndNote[] => {
//   console.log("sortBooksByStatus");

//   if (books.length <= 1) {
//     return books;
//   }

//   const { criteria, order } = sortState[bookStatus];

//   console.log("*-*-sortBooksByStatus criteria", criteria);
//   console.log("*-*-sortBooksByStatus order", order);

//   return books.sort((a, b) => {
//     let comparison = 0;
//     let yearComparison = 0;
//     const ratingA = a.bookNote ? a.bookNote.totalRating / a.bookNote.count : 0;
//     const ratingB = b.bookNote ? b.bookNote.totalRating / b.bookNote.count : 0;

//     switch (criteria) {
//       case "title":
//         comparison = b.bookTitle.localeCompare(a.bookTitle);
//         break;
//       case "date":
//         yearComparison = (a.year ?? 0) - (b.year ?? 0);
//         if (yearComparison !== 0) {
//           comparison = yearComparison;
//         } else {
//           comparison = (a.month ?? 0) - (b.month ?? 0);
//         }
//         break;
//       case "note":
//         comparison = ratingA - ratingB;
//         break;
//       case "reviews":
//         console.log("REVIEW", a.bookNote?.count, b.bookNote?.count);
//         comparison = (a.bookNote?.count ?? 0) - (b.bookNote?.count ?? 0);
//         break;
//     }
//     return order === "asc" ? comparison : -comparison;
//   });
// };

export const sortBook = <T extends BookTypePlusUsersWhoRead | BookType>(
  books: T[],
  sortState: { [key in BookStatusEnum]: { criteria: string; order: string } }
): T[] => {
  if (books.length <= 1) {
    return books;
  }

  console.log("sortBookTypes sortState", sortState);

  //const { criteria, order } = sortState;
  const { criteria, order } = sortState[BookStatusEnum.booksReadList];

  console.log("*-*-sortBook", books, criteria, order);

  const sortedBooks = books.sort((a, b) => {
    let comparison = 0;

    switch (criteria) {
      case "title":
        comparison = a.title.localeCompare(b.title);
        break;
      case "note": {
        const ratingA = a.countRating ? a.totalRating / a.countRating : 0;
        const ratingB = b.countRating ? b.totalRating / b.countRating : 0;
        comparison = ratingA - ratingB;
        break;
      }
      case "reviews":
        // console.log("REVIEW", a.rating?.count, b.rating?.count);
        comparison = (a.countRating ?? 0) - (b.countRating ?? 0);
        break;
    }

    return order === "asc" ? comparison : -comparison;
  });
  console.log("*-*- RETURN", sortedBooks);
  return sortedBooks;
};
