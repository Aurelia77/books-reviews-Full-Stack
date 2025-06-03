import { BookStatusValues } from "./constants";

// Types related to Books
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
  totalRating: number;
  countRating: number;
};

export type BookTypePlusDate = BookType & {
  year?: number | null;
  month?: number | null;
};

export type BooksSearchQueryType = {
  title: string;
  author: string;
  lang: string;
};

export type BookStatusType =
  (typeof BookStatusValues)[keyof typeof BookStatusValues];

// Types related to UserInfoBook
export type UserInfoBookType = {
  id: string;
  userId: string;
  bookId: string;
  year?: number | null;
  month?: number | null;
  note?: number | null;
  comments?: string | null;
  status: BookStatusType;
};

export type UserInfoBookWithoutUserIdAndId = Omit<
  UserInfoBookType,
  "userId" | "id"
>;

export type MyInfoBookPlusTitleAndNote = UserInfoBookType & {
  bookTitle: string;
  totalRating: number;
  countRating: number;
};

export type MyInfoBookFormType = {
  bookStatus: BookStatusType;
  year?: number;
  month?: number;
  userNote?: number;
  userComments: string;
};

// Types related to AppUser
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

// Other types
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

export type SortStateType = {
  // eslint-disable-next-line no-unused-vars
  [key in BookStatusType]: {
    criteria: "title" | "date" | "note" | "reviews";
    order: "asc" | "desc";
  };
};
