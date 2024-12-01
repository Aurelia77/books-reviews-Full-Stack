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

export type FriendType = {
  id: string;
  userName: string;
  isMyFriend?: boolean;
};

// Mettre USER devant ??? ou enlever Book devant les données de BookType ???
export type UserType = {
  id: string;
  email: string;
  userName: string;
  imgURL: string;
  description: string;
  booksRead: MyInfoBookType[];
  booksInProgress: MyInfoBookType[];
  booksToRead: MyInfoBookType[];
  friends: FriendType[];
};

export type AccountFormType = {
  userName: string;
  imgURL: string;
  description: string;
};

export type SearchBooksFormType = {
  bookStatus: BookStatusEnum;
  year?: number;
  note?: number;
  description?: string;
};

//export type BookStatus = "read" | "toRead" | "inProgress";

export enum BookStatusEnum {
  booksRead = "booksRead",
  booksInProgress = "booksInProgress",
  booksToRead = "booksToRead",
}
