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
  }

  export type UserType = {
    id: string;
    email: string;
    username: string;
    password: string;
    booksRead: string[];
    booksInProgress: string[];
    booksToRead: string[];
  }