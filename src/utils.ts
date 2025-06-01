import {
  BookStatusEnum,
  BookType,
  BookTypePlusUsersWhoRead,
  MyInfoBookPlusTitleAndNote,
} from "./lib/types";

export const cleanDescription = (description: string) => {
  return (
    description
      // Remove all HTML tags
      .replace(/<\/?[^>]+(>|$)/g, "")
      // Remove leading and trailing spaces
      .trim()
      // Replace <br> tags with line breaks
      .replace(/<br\s*\/?>\s*(<br\s*\/?>)*/g, "\n")
      // Remove French and English quotation marks at the beginning and end of the text
      .replace(/^[«"]+|[»"]+$/g, "")
  );
};

export const sortBooksByStatus = (
  books: MyInfoBookPlusTitleAndNote[],
  bookStatus: BookStatusEnum,
  sortState: { [key in BookStatusEnum]: { criteria: string; order: string } }
): MyInfoBookPlusTitleAndNote[] => {
  if (books.length <= 1) {
    return books;
  }

  const { criteria, order } = sortState[bookStatus];

  return books.sort((a, b) => {
    let comparison = 0;
    let yearComparison = 0;
    const ratingA = a.bookNote ? a.bookNote.totalRating / a.bookNote.count : 0;
    const ratingB = b.bookNote ? b.bookNote.totalRating / b.bookNote.count : 0;

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
        comparison = (a.bookNote?.count ?? 0) - (b.bookNote?.count ?? 0);
        break;
    }
    return order === "asc" ? comparison : -comparison;
  });
};

export const sortBook = <T extends BookTypePlusUsersWhoRead | BookType>(
  books: T[],
  sortState: { [key in BookStatusEnum]: { criteria: string; order: string } }
): T[] => {
  if (books.length <= 1) {
    return books;
  }

  const { criteria, order } = sortState[BookStatusEnum.booksReadList];

  const sortedBooks = books.sort((a, b) => {
    let comparison = 0;

    switch (criteria) {
      case "title":
        comparison = a.title.localeCompare(b.title);
        break;
      case "note": {
        const ratingA = a.rating.count
          ? a.rating.totalRating / a.rating.count
          : 0;
        const ratingB = b.rating.count
          ? b.rating.totalRating / b.rating.count
          : 0;
        comparison = ratingA - ratingB;
        break;
      }
      case "reviews":
        comparison = (a.rating?.count ?? 0) - (b.rating?.count ?? 0);
        break;
    }

    return order === "asc" ? comparison : -comparison;
  });

  return sortedBooks;
};
