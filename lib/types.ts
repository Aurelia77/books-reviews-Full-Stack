import { BookStatusValues } from "./constants";

export type BookStatusType =
  (typeof BookStatusValues)[keyof typeof BookStatusValues];

export type BookType = {
  id: string;
  title: string;
  authors: string[];
  description: string;
  categories: string[];
  pageCount: number;
  publishedDate: string;
  publisher: string;
  imageLink: string;
  language: string;
  isFromAPI: boolean;
  //rating: BookRatingType;
  totalRating: number;
  countRating: number;
};

export type BookTypePlusDate = BookType & {
  year?: number | null;
  month?: number | null;
};

// export type BookRatingType = {
//   totalRating: number;
//   count: number;
// };

export type BooksSearchQueryType = {
  title: string;
  author: string;
  lang: string;
};

// export type UserInfoBookType = {
//   id: string;
//   year?: number | null;
//   month?: number | null;
//   userNote?: number | null;
//   userComments: string;
// };
export type UserInfoBookType = {
  id: string; // Ajout de l'identifiant unique
  userId: string; // Ajout de la clé étrangère vers l'utilisateur
  bookId: string; // Ajout de la clé étrangère vers le livre
  year?: number | null;
  month?: number | null;
  note?: number | null;
  comments?: string | null;
  status: BookStatusType;
};

export type MyInfoBookPlusTitleAndNote = UserInfoBookType & {
  bookTitle: string;
  //bookNote?: BookRatingType;
  totalRating: number;
  countRating: number;
};

export type MyInfoBookFormType = {
  bookStatus: BookStatusType;
  // bookStatus: BookStatusEnum;
  year?: number;
  month?: number;
  // month?: number | null;
  userNote?: number;
  userComments: string;
};

export type AppUserType = {
  id: string;
  email: string;
  userName: string;
  imgURL: string;
  description: string;
  friends: string[];
  isAdmin: boolean;
};

export type UserTypePlusIsMyFriend = AppUserType & {
  isMyFriend: boolean;
};

export type UserTypePlusBooksTitleAndNote = AppUserType & {
  booksRead: MyInfoBookPlusTitleAndNote[];
  booksInProgress: MyInfoBookPlusTitleAndNote[];
  booksToRead: MyInfoBookPlusTitleAndNote[];
};

export type UserBookInfoType = {
  userName: string;
  imgURL: string;
  userId: string;
  userComments: string;
  userNote?: number;
};

export type AccountFormType = {
  userName: string;
  imgURL: string;
  description: string;
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

export type UsersWhoReadBookType = {
  userId: string;
  userInfoYear?: number | null;
  userInfoMonth?: number | null;
  userInfoNote?: number | null;
  userInfoComments: string;
};

export type UsersBooksReadType = {
  bookId: string;
  usersWhoReadBook: UsersWhoReadBookType[];
};

// pas utilisé ???
export type BookTypePlusUsersWhoRead = BookType & {
  usersWhoRead: UsersWhoReadBookType[];
};

// export enum BookStatusEnum {
//   bookRead = "lu",
//   bookInProgress = "en cours",
//   bookToRead = "à lire",
// }
// export enum BookStatusEnum {
//   booksReadList = "booksRead",
//   booksInProgressList = "booksInProgress",
//   booksToReadList = "booksToRead",
// }
// export enum BookStatusEnum {
//   booksReadList = "READ",
//   booksInProgressList = "IN_PROGRESS",
//   booksToReadList = "TO_READ",
// }

// export type SortStateType = {
//   criteria: "title" | "date" | "note";
//   order: "asc" | "desc";
// };
export type SortStateType = {
  // eslint-disable-next-line no-unused-vars
  [key in BookStatusType]: {
    criteria: "title" | "date" | "note" | "reviews";
    order: "asc" | "desc";
  };
};
