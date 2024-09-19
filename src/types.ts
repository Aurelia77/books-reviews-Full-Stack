
export type BookData = {
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
      };
    //title: string;
    //bookStatus: BookStatusEnum;
    // authors: string[];
    // description: string;
    // categories: string[];
    // pageCount: number;
    // publishedDate: string;
    // publisher: string;
    // imageLinks: {
    //   thumbnail: string;
    // };
  }