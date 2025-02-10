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
  commentaires: string;
};

export type MyInfoBookFormType = {
  bookStatus: BookStatusEnum;
  year?: number;
  note?: number;
  commentaires: string;
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

type FriendsWhoReadBookType = {
  userId: string;
  userInfoYear?: number | null;
  userInfoNote?: number | null;
  userInfoComment: string;
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
