import { BookStatus } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  BookType,
  BookTypePlusDate,
  MyInfoBookPlusTitleAndNote,
} from "./types";

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

// UTILISé ???????????????
export const sortBooksByStatus = (
  books: MyInfoBookPlusTitleAndNote[],
  bookStatus: BookStatus,
  sortState: { [key in BookStatus]: { criteria: string; order: string } }
): MyInfoBookPlusTitleAndNote[] => {
  console.log("sortBooksByStatus");

  if (books.length <= 1) {
    return books;
  }

  const { criteria, order } = sortState[bookStatus];

  console.log("*-*-sortBooksByStatus criteria", criteria);
  console.log("*-*-sortBooksByStatus order", order);

  return books.sort((a, b) => {
    let comparison = 0;
    let yearComparison = 0;
    const ratingA = a.totalRating > 0 ? a.totalRating / a.countRating : 0;
    const ratingB = b.totalRating > 0 ? b.totalRating / b.countRating : 0;

    switch (criteria) {
      case "title":
        comparison = b.bookTitle.localeCompare(a.bookTitle);
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
        comparison = ratingA - ratingB;
        break;
      case "reviews":
        // console.log("REVIEW", a.bookNote?.count, b.bookNote?.count);
        comparison = (a.countRating ?? 0) - (b.countRating ?? 0);
        break;
    }
    return order === "asc" ? comparison : -comparison;
  });
};

export const sortBook = (
  books: (BookType | BookTypePlusDate)[],
  criteria: string,
  order: string,
  sortState: { [key in BookStatus]: { criteria: string; order: string } }
  //withDateOption = false
): (BookType | BookTypePlusDate)[] => {
  if (books.length <= 1) {
    return books;
  }
  // export const sortBook = <T extends BookTypePlusUsersWhoRead | BookType>(
  //   books: T[],
  //   sortState: { [key in BookStatus]: { criteria: string; order: string } }
  //   //withDateOption = false
  // ): T[] => {
  //   if (books.length <= 1) {
  //     return books;
  //   }

  console.log("💙🤎 sortBook books", books);
  console.log("💙🤎 sortBook sortState", sortState);

  //const { criteria, order } = sortState;
  //const { criteria, order } = sortState[BookStatus.IN_PROGRESS];

  // console.log("*-*-sortBook", books, criteria, order);

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
      case "date":
        const aYear = "year" in a && typeof a.year === "number" ? a.year : 0;
        const bYear = "year" in b && typeof b.year === "number" ? b.year : 0;
        let yearComparison = aYear - bYear;
        if (yearComparison !== 0) {
          comparison = yearComparison;
        } else {
          const aMonth =
            "month" in a && typeof a.month === "number" ? a.month : 0;
          const bMonth =
            "month" in b && typeof b.month === "number" ? b.month : 0;
          comparison = aMonth - bMonth;
        }
        break;
    }

    return order === "asc" ? comparison : -comparison;
  });
  // console.log("*-*- RETURN", sortedBooks);
  return sortedBooks;
};
