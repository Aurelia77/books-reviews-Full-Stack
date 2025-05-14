import BooksSearch from "@/components/BooksSearch";
import BooksWithSortControls from "@/components/BooksWithSortControls";
import FeedbackMessage from "@/components/FeedbackMessage";
import { getUser } from "@/lib/auth-session";
import { GOOGLE_BOOKS_API_URL } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { BookAPIType, BooksSearchQueryType, BookType } from "@/lib/types";
import { BookStatus } from "@prisma/client";

const MAX_RESULTS = 4; // jusqu'à 40

const shuffle2ArraysPreserveOrder = <T, U>(
  array1: T[],
  array2: U[]
): (T | U)[] => {
  const combinedArray = [
    ...array1.map((item) => ({ item, from: "array1" })),
    ...array2.map((item) => ({ item, from: "array2" })),
  ];

  // Mélanger le tableau combiné
  for (let i = combinedArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combinedArray[i], combinedArray[j]] = [combinedArray[j], combinedArray[i]];
  }

  // Extraire les éléments mélangés tout en conservant l'ordre relatif
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

const Page = async (props: {
  searchParams: Promise<Record<string, string>>;
}) => {
  //const books = await prisma.book.findMany(); // Récupération des données côté serveur

  const searchParams = await props.searchParams;
  const currentUser = await getUser();

  // Simulation pour loading / error
  // const delay = (ms: number) =>
  //   new Promise((resolve) => setTimeout(resolve, ms));
  // await delay(3000);

  // throw new Error("Erreur simulée pour tester le fichier error.tsx");

  // const searchParams = useSearchParams();
  const query: BooksSearchQueryType = {
    title: searchParams.title ?? "",
    author: searchParams.author ?? "",
    lang: searchParams.lang ?? "",
  };
  //const searchTerm = searchParams.get("search") || "";

  //let booksApiUrl = `${GOOGLE_BOOKS_API_URL}?q=subject:general&maxResults=${MAX_RESULTS}`;
  //console.log("💛💙💚❤️🤍🤎", booksApiUrl);

  // console.log("🤎🤎🤎🤎query", query);

  // 1- On va d'abord chercher les livres de la BDD
  const filteredDbBooks: BookType[] = await prisma.book
    .findMany()
    .then((books) => {
      if (books.length > 0) {
        if (!query.title && !query.author && !query.lang) {
          return books;
        }
        return books.filter((book) => {
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
      } else {
        return [];
      }
    });

  console.log("💛💙💚 filteredDbBooks", filteredDbBooks);

  // 2- Puis on va chercher les livres de l'API Google Books

  // console.log(
  //   "🤍🤍🤍🤍🤍🤍",
  //   `${GOOGLE_BOOKS_API_URL}?q=${query.title}&maxResults=${MAX_RESULTS}`
  // );

  let queryApi = "";

  // impossible de mettre ensemble ces 2 blocs meme si on se répète (DRY) car sinon queryApi s'incrémente 12 fois à chaque modif du titre par ex !!!
  // BESOIN ???????????????????? 1ere ligne condition pas necessaire ?????
  // BESOIN ????????????????????
  if (!query.title && !query.author && !query.lang) {
    queryApi = getRandomChar(); // résultats aléatoires si pas de recherche
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

  // console.log("💚💚💚", queryApi);
  // console.log("💛💛💛", booksApiUrl);

  const filteredApiBooks: BookType[] = await fetch(booksApiUrl)
    .then((res) => res.json())
    .then((data) => {
      if (!data.items) {
        return [];
        //throw new Error("No items found in the response");
      }
      return data.items;
    })
    .then((apiBooks) => {
      // console.log("💛", apiBooks);
      // // on récupère les id des livres de la base de données pour ne pas ajouter les livres de l'API qui ont les mêmes id
      // let dbBooksIds: string[] = [];
      // if (dbBooks) {
      //   dbBooksIds = dbBooks.map((book) => book.id);
      // }
      // console.log("+++++-dbBooks", dbBooks);
      // console.log("+++++-dbBooksIds", dbBooksIds);
      // console.log("**32-apiBooks", apiBooks);

      // const apiBooksIds = apiBooks.map((book) => book.id);
      // const uniquesApiBooksIds = new Set(apiBooksIds);

      // const objetsUniques = apiBooks.filter((apiBook) => {
      //   if (uniquesApiBooksIds.has(apiBook.id)) {
      //     uniquesApiBooksIds.delete(apiBook.id); // Supprimer l'id du Set pour éviter les doublons
      //     return true;
      //   }
      //   return false;
      // });

      // console.log("+++++++++++++++++", objetsUniques);

      // const uniqueApiBooks: BookType[] = objetsUniques
      //   .filter((book: BookAPIType) => {
      //     console.log("+++++", book.volumeInfo.title, book.id, dbBooksIds);
      //     // console.log(
      //     //   "123456",
      //     //   !dbBooksIds.includes(book.id) && !uniqueBooks.has(book.id)
      //     // );
      //     // Vérifie si le livre est déjà dans la base de données ou dans le Set uniqueBooks
      //     //return !dbBooksIds.includes(book.id) && !uniqueBooks.has(book.id);
      //     return !dbBooksIds.includes(book.id);
      //   })
      //   .map((book: BookAPIType) => {
      //     //uniqueBooks.add(book.id);
      //     return {
      //       id: book.id,
      //       title: book.volumeInfo.title,
      //       authors: book.volumeInfo?.authors, //?.[0] ?? "Auteur inconnu",
      //       description: book.volumeInfo.description,
      //       categories: book.volumeInfo.categories,
      //       pageCount: book.volumeInfo.pageCount,
      //       publishedDate: book.volumeInfo.publishedDate,
      //       publisher: book.volumeInfo.publisher,
      //       imageLink: book.volumeInfo.imageLinks?.thumbnail,
      //       language: book.volumeInfo.language,
      //       isFromAPI: true,
      //       rating: {
      //         totalRating: 0,
      //         count: 0,
      //       },
      //     };
      //   });
      // console.log("9+++++-uniqueApiBooks", uniqueApiBooks);
      // return uniqueApiBooks;

      console.log("💛1");
      return (
        apiBooks
          // on ne veut pas les livres qui sont déjà dans la BDD
          .filter((book: BookAPIType) => {
            console.log("💛2");
            return !filteredDbBooks.some((dbBook) => {
              console.log("💛3", dbBook.title, dbBook.id === book.id);
              console.log("💛💙💚❤️🤍🤎 == ??", dbBook.id, book.id);

              return dbBook.id === book.id;
            });
          })
          .map((book: BookAPIType) => {
            return {
              id: book.id,
              title: book.volumeInfo.title,
              authors: book.volumeInfo?.authors, //?.[0] ?? "Auteur inconnu",
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
    // .then((apiBooks) => {
    //   console.log("❤️🤍", apiBooks);
    // })
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
      {/* {isLoading ? (
      <div>
        <BookSkeleton />
        <BookSkeleton />
        <BookSkeleton />
      </div>
    ) : error ? (
      <FeedbackMessage message={message} type="error" />
    ) : */}
      {/*  */}
      {/*  */}
      {/*  */}
      {/* kkkkkkkkkkkkk ce paragraphe à mettre en dessous car juste si y'a une recherche !!!!!!!!!!!!!!! */}
      {/* kkkkkkkkkkkkk */}
      {/* kkkkkkkkkkkkk */}
      {(query.title || query.author || query.lang) && (
        <p className="text-right">
          {filteredDbAndApiBooks.length} livres trouvés
        </p>
      )}
      {filteredDbAndApiBooks?.length > 0 ? (
        <BooksWithSortControls
          displayBookStatus={BookStatus.READ}
          userId={currentUser?.id}
          books={filteredDbAndApiBooks}
        />
      ) : (
        <FeedbackMessage message="Aucun livre trouvé" type="info" />
      )}
    </div>
  );
};

export default Page;
