import BooksSearch from "@/components/BooksSearch";
import BooksWithSortControls from "@/components/BooksWithSortControls";
import FeedbackMessage from "@/components/FeedbackMessage";
import { BookStatusValues, GOOGLE_BOOKS_API_URL } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { BookAPIType, BooksSearchQueryType, BookType } from "@/lib/types";

const MAX_RESULTS = 7; // until 40

const shuffle2ArraysPreserveOrder = <T, U>(
  array1: T[],
  array2: U[]
): (T | U)[] => {
  const combinedArray = [
    ...array1.map((item: any) => ({ item, from: "array1" })),
    ...array2.map((item: any) => ({ item, from: "array2" })),
  ];

  // Shuffle the combined array
  for (let i = combinedArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combinedArray[i], combinedArray[j]] = [combinedArray[j], combinedArray[i]];
  }

  // Extract the shuffled elements while preserving the relative order
  const shuffledArray: (T | U)[] = [];
  let array1Index = 0;
  let array2Index = 0;

  for (const element of combinedArray) {
    if (element.from === "array1") {
      shuffledArray.push(array1[array1Index++]);
    } else {
      shuffledArray.push(array2[array2Index++]);
    }
  }

  return shuffledArray;
};

const getRandomChar = (): string => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const randomIndex = Math.floor(Math.random() * chars.length);
  return chars[randomIndex];
};

const SearchBooksPage = async (props: {
  searchParams: Promise<Record<string, string>>;
}) => {
  const searchParams = await props.searchParams;

  const query: BooksSearchQueryType = {
    title: searchParams.title ?? "",
    author: searchParams.author ?? "",
    lang: searchParams.lang ?? "",
  };

  // 1- First, we fetch the books from the DB
  const dbBooks: BookType[] = await prisma.book.findMany();

  const filteredDbBooks: BookType[] = dbBooks.filter((book) => {
    const matchesTitle = query.title
      ? book.title.toLowerCase().includes(query.title.toLowerCase())
      : true;
    const matchesAuthor = query.author
      ? book.authors?.some((author) =>
          author.toLowerCase().includes(query.author.toLowerCase())
        )
      : true;
    const matchesLang = query.lang
      ? book.language?.toLowerCase() === query.lang.toLowerCase()
      : true;
    return matchesTitle && matchesAuthor && matchesLang;
  });

  // 2-Then we fetch the books from the Google Books API
  let queryApi = "";

  if (!query.title && !query.author && !query.lang) {
    queryApi = getRandomChar(); // random results if no search
  } else {
    if (query.title) {
      if (queryApi) queryApi += `+intitle:${encodeURIComponent(query.title)}`;
      else queryApi = `intitle:${encodeURIComponent(query.title)}`;
    }
    if (query.author) {
      if (queryApi) queryApi += `+inauthor:${encodeURIComponent(query.author)}`;
      else queryApi = `inauthor:${encodeURIComponent(query.author)}`;
    }
    if (query.lang) {
      if (queryApi) queryApi += `&langRestrict=${query.lang}`;
      else queryApi = `books&langRestrict=${query.lang}`;
    }
  }

  const booksApiUrl = `${GOOGLE_BOOKS_API_URL}?q=${queryApi}&maxResults=${MAX_RESULTS}`;

  const filteredApiBooks: BookType[] = await fetch(booksApiUrl)
    .then((res) => res.json())
    .then((data: any) => {
      if (!data.items) {
        return [];
      }
      return data.items;
    })
    .then((apiBooks: any) => {
      return (
        apiBooks
          // we don't want books that are already in the DB
          .filter((book: BookAPIType) => {
            return !filteredDbBooks.some((dbBook) => {
              return dbBook.id === book.id;
            });
          })
          .map((book: BookAPIType) => {
            return {
              id: book.id,
              title: book.volumeInfo.title,
              authors: book.volumeInfo?.authors,
              description: book.volumeInfo.description,
              categories: book.volumeInfo.categories,
              pageCount: book.volumeInfo.pageCount,
              publishedDate: book.volumeInfo.publishedDate,
              publisher: book.volumeInfo.publisher,
              imageLink: book.volumeInfo.imageLinks?.thumbnail,
              language: book.volumeInfo.language,
              isFromAPI: true,
              totalRating: 0,
              countRating: 0,
            };
          })
      );
    })
    .catch((error) => {
      console.error(
        "Erreur lors de la récupération des livres depuis l'API Google Books :",
        error
      );
      return [];
    });

  const filteredDbAndApiBooks = shuffle2ArraysPreserveOrder(
    filteredDbBooks,
    filteredApiBooks
  );

  return (
    <div className="flex flex-col gap-6">
      <BooksSearch query={query} />
      {(query.title || query.author || query.lang) && (
        <p className="text-right">
          {filteredDbAndApiBooks.length} livres trouvés
        </p>
      )}
      {filteredDbAndApiBooks?.length > 0 ? (
        <BooksWithSortControls
          displayBookStatus={BookStatusValues.READ}
          books={filteredDbAndApiBooks}
        />
      ) : (
        <FeedbackMessage message="Aucun livre trouvé" type="info" />
      )}
    </div>
  );
};

export default SearchBooksPage;
