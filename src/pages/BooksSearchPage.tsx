import BookInfos from "@/components/BookInfos";
import BookSkeleton from "@/components/BookSkeleton";
import FeedbackMessage from "@/components/FeedbackMessage";
import Title from "@/components/Title";
import { Input } from "@/components/ui/input";
import { getDocsByQueryFirebase } from "@/firebase/firestore";
//import { books } from "@/data";
import { BookType } from "@/types";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";

const MAX_RESULTS = 10; // jusqu'à 40
const GOOGLE_BOOKS_API_BASE_URL = "https://www.googleapis.com/books/v1/volumes";

type BookAPIType = {
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

// const useDebounce = <T extends string[]>(
//   callback: (...args: T) => void,
//   delay: number
// ) => {
//   const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

//   const onDebounce = (...args: T) => {
//     if (timeout.current) {
//       clearTimeout(timeout.current);
//     }
//     timeout.current = setTimeout(() => {
//       callback(...args);
//     }, delay);
//   };

//   return onDebounce;
// };

const useDebounceEffect = (
  effect: () => void,
  deps: (string | boolean)[],
  delay: number
) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      effect();
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [...deps, delay]);
};

const BooksSearchPage = (): JSX.Element => {
  const [dbBooks, setDbBooks] = useState<BookType[]>([]);
  //console.log("**1-books from BDD", dbBooks.length);
  const [booksApiUrl, setBooksApiUrl] = useState(
    `https://www.googleapis.com/books/v1/volumes?q=subject:general&maxResults=${MAX_RESULTS}`
  );
  const [bdAndApiBooks, setDbAndApiBooks] = useState<BookType[]>([]);
  console.log("ALL-books from BDD and API", bdAndApiBooks.length);

  const [titleInput, setTitleInput] = useState<string>(
    localStorage.getItem("titleInput") || ""
  );
  //console.log("titleInput", titleInput);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [authorInput, setAuthorInput] = useState<string>("");
  // const [inFriendsLists, setInFriendsLists] = useState(true);
  // const [inApi, setInApi] = useState(true);

  // APPEL API (hook perso ?)
  const fetchAPIBooks = (booksApiUrl: string): Promise<BookType[]> => {
    // throw new Error(
    //   "Erreur simulée !"
    // );
    return (
      fetch(booksApiUrl)
        //.then((res) => res.json())    // idem sans TS
        .then((res: Response): Promise<{ items: BookAPIType[] }> => res.json())
        //.then((data) => data.items)
        // Gérer erreur ci-dessous ???
        .then((data) => {
          //console.log("DATA", data);
          if (!data.items) {
            return [];
            //throw new Error("No items found in the response");
          }
          return data.items;
        })
        .then((items) => {
          const booksFromAPI: BookType[] = items.map((book: BookAPIType) => {
            return {
              bookId: book.id,
              bookTitle: book.volumeInfo.title,
              bookAuthor: book.volumeInfo?.authors?.[0] ?? "Auteur inconnu",
              bookDescription: book.volumeInfo.description,
              bookCategories: book.volumeInfo.categories,
              bookPageCount: book.volumeInfo.pageCount,
              bookPublishedDate: book.volumeInfo.publishedDate,
              bookPublisher: book.volumeInfo.publisher,
              bookImageLink: book.volumeInfo.imageLinks?.thumbnail,
              bookLanguage: book.volumeInfo.language,
              bookIsFromAPI: true,
            };
          });
          return booksFromAPI;
        })
        .catch((error) => {
          console.error("Error fetching books:", error);
          return [];
        })
    );
  };

  // // Utiliser useDebounce pour retarder la mise à jour de l'URL de l'API
  // const debounceUpdateUrl = useDebounce((title: string, author: string) => {
  //   let query = "";
  //   if (title) {
  //     query += `+intitle:${encodeURIComponent(title)}`;
  //   }
  //   if (author) {
  //     query += `+inauthor:${encodeURIComponent(author)}`;
  //   }
  //   if (query) {
  //     setBooksApiUrl(
  //       `${GOOGLE_BOOKS_API_BASE_URL}?q=${query}&maxResults=${MAX_RESULTS}`
  //     );
  //   }
  // }, 300);

  // // Mettre à jour l'URL de l'API lorsque les entrées changent
  // useEffect(() => {
  //   debounceUpdateUrl(titleInput, authorInput);
  // }, [titleInput, authorInput, debounceUpdateUrl]);

  const {
    data: apiBooks,
    error,
    isLoading,
  } = useSWR<BookType[]>(booksApiUrl, fetchAPIBooks);
  //console.log("2-booksFromAPI", apiBooks?.length);

  // ici on utilise une constante et pas un state car les message ne change pas et s'affiche seulement si useSWR renvoie une erreur
  const message = `Un problème est survenu dans la récupération de livres de Google Books => ${error?.message}`;

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
      [combinedArray[i], combinedArray[j]] = [
        combinedArray[j],
        combinedArray[i],
      ];
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

  // Mis à jour de dbBooks au montage du composant
  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }

    getDocsByQueryFirebase<BookType>("books", "bookIsFromAPI", true)
      .then((books) => {
        setDbBooks(books);
      })
      .catch((error: Error) => {
        console.error("Error fetching books: ", error);
      });
  }, []);

  // // Mise à jour de booksApiUrl et dbBooks en fonction de la recherche
  // useEffect(() => {
  //   let queryApi = "";
  //   let dbSearchBooks: BookType[] = [];

  //   if (!titleInput && !authorInput) {
  //     queryApi = getRandomChar(); // pour résultats alléatoires si pas de recherche

  //     // REVOIR CETTE FONCTION !!!!!!!!
  //     getDocsByQueryFirebase("books", "bookIsFromAPI", true)
  //       .then((books: BookType[]) => {
  //         //console.log("books from BDD", books);
  //         dbSearchBooks = books;
  //         //setDbBooks(books);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching books: ", error);
  //       });
  //   } else {
  //     if (titleInput) {
  //       queryApi += `+intitle:${encodeURIComponent(titleInput)}`;
  //       dbSearchBooks = dbBooks.filter((book: BookType) =>
  //         book.bookTitle.toLowerCase().includes(titleInput.toLowerCase())
  //       );
  //     }
  //     if (authorInput) {
  //       queryApi += `+inauthor:${encodeURIComponent(authorInput)}`;
  //       dbSearchBooks = dbBooks.filter((book: BookType) =>
  //         book.bookAuthor.toLowerCase().includes(authorInput.toLowerCase())
  //       );
  //     }

  //     if (titleInput && authorInput) {
  //       dbSearchBooks = dbBooks.filter(
  //         (book: BookType) =>
  //           book.bookTitle.toLowerCase().includes(titleInput.toLowerCase()) &&
  //           book.bookAuthor.toLowerCase().includes(authorInput.toLowerCase())
  //       );
  //     }
  //   }

  //   // console.log("query", query);
  //   console.log(
  //     "url",
  //     `${GOOGLE_BOOKS_API_BASE_URL}?q=${queryApi}&maxResults=${MAX_RESULTS}`
  //   );
  //   //console.log("dbSearchBooks", dbSearchBooks);

  //   setBooksApiUrl(
  //     `${GOOGLE_BOOKS_API_BASE_URL}?q=${queryApi}&maxResults=${MAX_RESULTS}`
  //   );
  //   setDbBooks(dbSearchBooks);

  //   // `https://www.googleapis.com/books/v1/volumes?q=${title}+inauthor:${author}&maxResults=${MAX_RESULTS}`;
  // }, [titleInput, authorInput]);

  // Mise à jour de booksApiUrl et dbBooks en fonction de la recherche avec délai
  // 3 arguments : fonction à exécuter, dépendances, délai
  useDebounceEffect(
    () => {
      let queryApi = "";
      let dbSearchBooks: BookType[] = [];

      if (!titleInput && !authorInput) {
        queryApi = getRandomChar(); // pour résultats alléatoires si pas de recherche

        // REVOIR CETTE FONCTION !!!!!!!!
        getDocsByQueryFirebase<BookType>("books", "bookIsFromAPI", true)
          .then((books) => {
            //console.log("**books from BDD", books);
            setDbBooks(books);
            //dbSearchBooks = books;
            //console.log("**1/dbSearchBooks", dbSearchBooks);
          })
          .catch((error) => {
            console.error("Error fetching books: ", error);
          });
      } else {
        if (titleInput) {
          queryApi += `+intitle:${encodeURIComponent(titleInput)}`;
          dbSearchBooks = dbBooks.filter((book: BookType) =>
            book.bookTitle.toLowerCase().includes(titleInput.toLowerCase())
          );
        }
        if (authorInput) {
          queryApi += `+inauthor:${encodeURIComponent(authorInput)}`;
          dbSearchBooks = dbBooks.filter((book: BookType) =>
            book.bookAuthor.toLowerCase().includes(authorInput.toLowerCase())
          );
        }
        // if (titleInput && authorInput) {
        //   dbSearchBooks = dbBooks.filter(
        //     (book: BookType) =>
        //       book.bookTitle.toLowerCase().includes(titleInput.toLowerCase()) &&
        //       book.bookAuthor.toLowerCase().includes(authorInput.toLowerCase())
        //   );
        // }

        setDbBooks(dbSearchBooks);
      }

      // console.log("**query", queryApi);
      // console.log(
      //   "url",
      //   `${GOOGLE_BOOKS_API_BASE_URL}?q=${queryApi}&maxResults=${MAX_RESULTS}`
      // );
      // console.log("**2/dbSearchBooks", dbSearchBooks);

      setBooksApiUrl(
        `${GOOGLE_BOOKS_API_BASE_URL}?q=${queryApi}&maxResults=${MAX_RESULTS}`
      );

      // Pk opérateur ternaire ne marche pas !!!!???
      //inFriendsLists ? setDbBooks(dbSearchBooks) : setDbBooks([]);
      // if (inFriendsLists) {
      //   console.log("/////////////");
      //setDbBooks(dbSearchBooks);
      // } else {
      //   setDbBooks([]);
      // }

      // `https://www.googleapis.com/books/v1/volumes?q=${title}+inauthor:${author}&maxResults=${MAX_RESULTS}`;
    },
    [
      titleInput,
      authorInput,
      //inFriendsLists
    ],
    500
  );

  // Mise à jour de bdAndApiBooks
  useEffect(() => {
    if (
      apiBooks
      // && inApi
    ) {
      setDbAndApiBooks(shuffle2ArraysPreserveOrder(dbBooks, apiBooks));
    }
  }, [
    apiBooks,
    dbBooks,
    //inApi
  ]);

  const formRef = useRef<HTMLDivElement>(null);

  // Au montage du composant, on ajoute un écouteur d'événement sur la fenêtre pour ajouter une classe sur le formulaire qui le diminue lors du scroll
  useEffect(() => {
    // console.log("useEffect");
    const handleScroll = () => {
      if (formRef.current) {
        // console.log("formRef.current", formRef.current.offsetHeight);
        // console.log("formRef.current", formRef.current.offsetTop);
        // console.log("window.scrollY", window.scrollY);
        if (window.scrollY > formRef.current.offsetHeight) {
          formRef.current.classList.add("form-sticky-active");
          formRef.current.querySelectorAll("*").forEach((child) => {
            child.classList.add("form-sticky-active");
          });
          // console.log("ADD CLASS");
        } else {
          formRef.current.classList.remove("form-sticky-active");
          formRef.current.querySelectorAll("*").forEach((child) => {
            child.classList.remove("form-sticky-active");
          });
          // console.log("REMOVE CLASS");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // utiliser un useCallback ???
  const handleChangeInput = (
    key: "titleInput" | "authorInput",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (key === "titleInput") {
      setTitleInput(value);
    } else if (key === "authorInput") {
      setAuthorInput(value);
    }
    localStorage.setItem(key, value);
  };

  // console.log("LOCAL STORAGE TITLE", localStorage.getItem("titleInput"));
  // console.log("LOCAL STORAGE AUTHOR", localStorage.getItem("authorInput"));

  const handleClearInput = (
    key: string,
    setState: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setState("");
    localStorage.removeItem(key);
  };

  return (
    <div className="h-full min-h-screen sm:p-2">
      <div className="flex h-full flex-col gap-6">
        {/* <Form {...form}>
          <form
            ref={formRef}
            className="sticky top-10 z-10 flex flex-col gap-3 bg-background/70 duration-500"
            onSubmit={form.handleSubmit(onSubmit)}
          > */}
        <div
          ref={formRef}
          className="sticky top-10 z-10 flex flex-col gap-3 bg-background/70 duration-500"
        >
          <Title>Recherche de livre</Title>
          {/* <div className="flex justify-around">
            <div className="flex items-center gap-3">
              <Switch
                checked={inFriendsLists}
                onCheckedChange={(e) => setInFriendsLists(e)}
                id="inFriendsLists"
              />
              <Label htmlFor="inFriendsLists">Listes de mes amis</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={inApi}
                onCheckedChange={(e) => setInApi(e)}
                id="inFriendsLists"
              />
              <Label htmlFor="inFriendsLists">En ligne</Label>
            </div>
          </div> */}
          {/* <FormField
              control={form.control}
              name="bookTitle"
              render={({ field }) => (
                <FormItem>
                  <FormControl> */}
          <div className="relative">
            <Input
              value={titleInput}
              ref={titleInputRef}
              placeholder="Titre"
              // onChange={(e) => setTitleInput(e.target.value)}
              onChange={(e) => handleChangeInput("titleInput", e)}
            />
            <X
              onClick={() => handleClearInput("titleInput", setTitleInput)}
              className="absolute right-2 top-2 cursor-pointer"
            />
          </div>
          {/* <Input placeholder="Titre" {...field} /> */}
          {/* </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          {/* <FormField
              control={form.control}
              name="bookAuthors"
              render={({ field }) => (
                <FormItem>
                  <FormControl> */}
          <div className="relative">
            <Input
              value={authorInput}
              placeholder="Auteur(e)"
              onChange={(e) => handleChangeInput("authorInput", e)}
            />
            <X
              onClick={() => handleClearInput("authorInput", setAuthorInput)}
              className="absolute right-2 top-2 cursor-pointer"
            />
          </div>
          {/* <Input placeholder="Auteur(e)" {...field} /> */}
          {/* </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
        </div>
        {/* <Button type="submit">Ajouter</Button> */}
        {/* <Search className="text-primary/60 drop-shadow-lg" size={40} /> */}
        {isLoading ? (
          <div>
            <BookSkeleton />
            <BookSkeleton />
            <BookSkeleton />
          </div>
        ) : error ? (
          <FeedbackMessage message={message} type="error" />
        ) : bdAndApiBooks?.length > 0 ? (
          <ul className="pb-40">
            {bdAndApiBooks.map((book: BookType) => (
              <li key={book.bookId}>
                {/* Ici on passe le book en props (et pas le bookId comme dans MyReadBooksPage) */}
                <BookInfos
                  book={book}
                  //friendsWhoReadBook={friendsWhoReadBook(book.bookId)}
                />
              </li>
            ))}
          </ul>
        ) : (
          <FeedbackMessage message="Aucun livre trouvé" type="info" />
        )}
      </div>
    </div>
  );
};

export default BooksSearchPage;
