export type BookType = {
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookDescription: string;
  bookCategories: string[];
  bookPageCount: number;
  bookPublishedDate: string;
  bookPublisher: string;
  bookImageLink: string;
  bookLanguage: string;
  bookIsFromAPI: boolean;
};

// Mettre USER devant !
export type UserType = {
  id: string;
  email: string;
  username: string;
  password: string;
  booksRead: string[];
  booksInProgress: string[];
  booksToRead: string[];
};
