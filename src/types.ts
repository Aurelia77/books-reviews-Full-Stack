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

export type MyInfoBookType = {
  bookId: string;
  bookYear: number | null;
  bookNote: number | null;
  bookDescription: string | null;
};

// Mettre USER devant ??? ou enlever Book devant les données de BookType ???
export type UserType = {
  id: string;
  email: string;
  username: string;
  imgURL: string;
  booksRead: MyInfoBookType[];
  booksInProgress: MyInfoBookType[];
  booksToRead: MyInfoBookType[];
  friends: string[];
};

export type AccountFormType = {
  username: string;
  imgURL: string;
  //description: string;
  //password: string;                                               // plus tard
};

export type SearchBooksFormType = {
  bookStatus: BookStatusEnum;
  year?: number;
  note?: number;
  description?: string;
};

//export type BookStatus = "read" | "toRead" | "inProgress";

export enum BookStatusEnum {
  read = "read",
  inProgress = "inProgress",
  toRead = "toRead",
}
