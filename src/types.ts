export type BookType = {
  id: string;
  title: string;
  author: string;
  description: string;
  categories: string[];
  pageCount: number;
  publishedDate: string;
  publisher: string;
  imageLink: string;
  language: string;
  isFromAPI: boolean;
};

export type MyInfoBookType = {
  id: string;
  year?: number | null;
  note?: number | null;
  description: string | null;
};

export type UserType = {
  id: string;
  email: string;
  userName: string;
  imgURL: string;
  description: string;
  booksRead: MyInfoBookType[];
  booksInProgress: MyInfoBookType[];
  booksToRead: MyInfoBookType[];
  friends: string[];
  isMyFriend?: boolean;
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

export type BookAPIType = {
  id: string;
  volumeInfo: {
    title: string;
    authors: string[];
    imageLinks: {
      thumbnail: string;
      smallThumbnail: string;
    };
    language: string;
    description: string;
    categories: string[];
    pageCount: number;
    publishedDate: string;
    publisher: string;
  };
};

export enum BookStatusEnum {
  booksRead = "booksRead",
  booksInProgress = "booksInProgress",
  booksToRead = "booksToRead",
}
