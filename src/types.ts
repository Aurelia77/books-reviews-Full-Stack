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
  rating: BookRatingType;
};

export type BookRatingType = {
  totalRating: number;
  count: number;
};

export type MyInfoBookType = {
  id: string;
  year?: number | null;
  month?: number | null;
  userNote?: number | null;
  userComments: string;
};

export type MyInfoBookPlusTitleAndNote = MyInfoBookType & {
  bookTitle: string;
  bookNote?: number | null;
};

export type MyInfoBookFormType = {
  bookStatus: BookStatusEnum;
  year?: number;
  month?: number | null;
  userNote?: number;
  userComments: string;
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

export type UserTypePlusBooksTitleAndNote = UserType & {
  booksRead: MyInfoBookPlusTitleAndNote[];
  booksInProgress: MyInfoBookPlusTitleAndNote[];
  booksToRead: MyInfoBookPlusTitleAndNote[];
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

export type FriendsWhoReadBookType = {
  userId: string;
  userInfoYear?: number | null;
  userInfoMonth?: number | null;
  userInfoNote?: number | null;
  userInfoComments: string;
};

export type FriendsBooksReadType = {
  bookId: string;
  friendsWhoReadBook: FriendsWhoReadBookType[];
};

// export enum BookStatusEnum {
//   bookRead = "lu",
//   bookInProgress = "en cours",
//   bookToRead = "à lire",
// }
export enum BookStatusEnum {
  booksReadList = "booksRead",
  booksInProgressList = "booksInProgress",
  booksToReadList = "booksToRead",
}

export type SortStateType = {
  criteria: "title" | "date" | "note";
  order: "asc" | "desc";
};
