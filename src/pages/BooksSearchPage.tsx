import BookInfos from "@/components/BookInfos";
import BooksSortControls from "@/components/BooksSortControls";
import FeedbackMessage from "@/components/FeedbackMessage";
import BookSkeleton from "@/components/skeletons/BookSkeleton";
import Title from "@/components/Title";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GOOGLE_BOOKS_API_URL } from "@/constants";
import { getDocsByQueryFirebase } from "@/firebase/firestore";
import { BookAPIType, BookStatusEnum, BookType } from "@/types";
import { sortBookTypes } from "@/utils";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";

const MAX_RESULTS = 20; // jusqu'à 40

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
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, delay]);
};

const BooksSearchPage = (): JSX.Element => {
  const urlParam = useParams<{ author: string }>();

  // const [dbBooks, setDbBooks] = useState<BookType[]>();
  const [dbBooks, setDbBooks] = useState<BookType[] | null>(null); // Initialiser avec null

  console.log("%c 111+++++**books from BDD", "color: tomato", dbBooks);
  if (dbBooks) console.log("+++books[0] from BDD", dbBooks[0]?.title);

  const [booksApiUrl, setBooksApiUrl] = useState(
    `${GOOGLE_BOOKS_API_URL}?q=subject:general&maxResults=${MAX_RESULTS}`
  );
  console.log("fff booksApiUrl", booksApiUrl);

  const [bdAndApiBooks, setDbAndApiBooks] = useState<BookType[]>([]);
  console.log("333+++++**bdAndApiBooks", bdAndApiBooks);
  console.log("444+++++bdAndApiBooks[0]", bdAndApiBooks[0]?.title);

  const [titleInput, setTitleInput] = useState<string>(
    urlParam.author ? "" : localStorage.getItem("titleInput") || ""
  );
  const [authorInput, setAuthorInput] = useState<string>(
    urlParam.author || localStorage.getItem("authorInput") || ""
  );
  const [langInput, setLangInput] = useState<string>(
    urlParam.author ? "" : localStorage.getItem("langInput") || ""
  );

  console.log("langInput", langInput);

  console.log("Inputs", titleInput, authorInput, langInput);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const authorInputRef = useRef<HTMLInputElement>(null);

  console.log("authorInputRef", authorInputRef);
  // const [inFriendsLists, setInFriendsLists] = useState(true);
  // const [inApi, setInApi] = useState(true);

  const [sortState, setSortState] = useState<any>({
    [BookStatusEnum.booksReadList]: { criteria: "title", order: "asc" },
  });

  // DEBUT============================FAIRE HOOK PERSO !!!
  const fetchAPIBooks = (booksApiUrl: string): Promise<BookType[]> => {
    console.log("+++** FETCHER : dbBooks = ", dbBooks);
    // throw new Error(
    //   "Erreur simulée !"
    // );
    return fetch(booksApiUrl)
      .then((res: Response): Promise<{ items: BookAPIType[] }> => res.json())
      .then((data) => {
        if (!data.items) {
          return [];
          //throw new Error("No items found in the response");
        }
        return data.items;
      })
      .then((apiBooks) => {
        // on récupère les id des livres de la base de données pour ne pas ajouter les livres de l'API qui ont les mêmes id
        let dbBooksIds: string[] = [];
        if (dbBooks) {
          dbBooksIds = dbBooks.map((book) => book.id);
        }
        console.log("+++++-dbBooks", dbBooks);
        console.log("+++++-dbBooksIds", dbBooksIds);
        console.log("**32-apiBooks", apiBooks);

        const apiBooksIds = apiBooks.map((book) => book.id);
        const uniquesApiBooksIds = new Set(apiBooksIds);

        const objetsUniques = apiBooks.filter((apiBook) => {
          if (uniquesApiBooksIds.has(apiBook.id)) {
            uniquesApiBooksIds.delete(apiBook.id); // Supprimer l'id du Set pour éviter les doublons
            return true;
          }
          return false;
        });

        console.log("+++++++++++++++++", objetsUniques);

        const uniqueApiBooks: BookType[] = objetsUniques
          .filter((book: BookAPIType) => {
            console.log("+++++", book.volumeInfo.title, book.id, dbBooksIds);
            // console.log(
            //   "123456",
            //   !dbBooksIds.includes(book.id) && !uniqueBooks.has(book.id)
            // );
            // Vérifie si le livre est déjà dans la base de données ou dans le Set uniqueBooks
            //return !dbBooksIds.includes(book.id) && !uniqueBooks.has(book.id);
            return !dbBooksIds.includes(book.id);
          })
          .map((book: BookAPIType) => {
            //uniqueBooks.add(book.id);
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
              rating: {
                totalRating: 0,
                count: 0,
              },
            };
          });
        console.log("9+++++-uniqueApiBooks", uniqueApiBooks);
        return uniqueApiBooks;
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
        return [];
      });
  };

  const {
    data: apiBooks,
    error,
    isLoading,
  } = useSWR<BookType[]>(dbBooks !== null ? booksApiUrl : null, fetchAPIBooks);
  // FIN============================FAIRE HOOK PERSO !!!

  console.log("fff apiBooks", apiBooks);
  if (apiBooks && apiBooks.length > 0)
    console.log("212121+++++ apiBooks", apiBooks[0].title);

  // ici on utilise une constante et pas un state car les message ne change pas et s'affiche seulement si useSWR renvoie une erreur
  const message = `Un problème est survenu dans la récupération de livres de Google Books => ${error?.message}`;

  // Mis à jour de dbBooks au montage du composant
  useEffect(() => {
    console.log("+++ useEffect-1, dbBooks = ", dbBooks);
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }

    // getDocsByQueryFirebase<BookType>("books")
    //   .then((books) => {
    //     return filterBooks(books, titleInput, authorInput);
    //   })
    //   .then((books: BookType[]) => {
    //     console.log("++++** books from BDD dans USEEFFECT-1", books);
    //     setDbBooks(books);
    //   })
    //   .catch((error: Error) => {
    //     console.error("Error fetching books: ", error);
    //   });
    //////////////
    //////////////
    //////////////
    //////////////
    // getDocsByQueryFirebase<BookType>("books")
    //   .then((books) => {
    //     // if (!titleInput && !authorInput) {
    //     //   return books;
    //     // }
    //     // je vx filtrer les livres selon inputTitle et inputAuthor s'ils ne sont pas vides
    //     return books.filter((book: BookType) => {
    //       if (titleInput && authorInput) {
    //         return (
    //           book.title.toLowerCase().includes(titleInput.toLowerCase()) &&
    //           book.author.toLowerCase().includes(authorInput.toLowerCase())
    //         );
    //       } else if (titleInput) {
    //         return book.title.toLowerCase().includes(titleInput.toLowerCase());
    //       } else if (authorInput) {
    //         return book.author
    //           .toLowerCase()
    //           .includes(authorInput.toLowerCase());
    //       } else {
    //         return book;
    //       }
    //     });
    //   })
    //   .then((books: BookType[]) => {
    //     console.log("++++** books from BDD dans USEEFFECT-1", books);
    //     setDbBooks(books);
    //   })
    //   .catch((error: Error) => {
    //     console.error("Error fetching books: ", error);
    //   });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mise à jour de bdAndApiBooks
  useEffect(() => {
    console.log("+++*** useEffect-2, dbBooks = ", dbBooks);
    console.log("+++*** useEffect-2, apiBooks = ", apiBooks);
    // console.log(
    //   "+++*** useEffect-2, dbAndApiBooks = ",
    //   shuffle2ArraysPreserveOrder(dbBooks, apiBooks)
    // );

    if (apiBooks && dbBooks) {
      setDbAndApiBooks(shuffle2ArraysPreserveOrder(dbBooks, apiBooks));
    }
  }, [apiBooks, dbBooks]);

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

  // Mise à jour de booksApiUrl et dbBooks en fonction de la recherche avec délai
  // 3 arguments : fonction à exécuter, dépendances, délai
  useDebounceEffect(
    () => {
      console.log(
        "//////////////////++++** useDebounceEffect dbBooks = ",
        dbBooks
      );

      let queryApi = "";

      // impossible de mettre ensemble ces 2 blocs meme si on se répète (DRY) car sinon queryApi s'incrémente 12 fois à chaque modif du titre par ex !!!
      if (!titleInput && !authorInput && !langInput) {
        queryApi = getRandomChar(); // résultats aléatoires si pas de recherche
      } else {
        if (titleInput) {
          if (queryApi)
            queryApi += `+intitle:${encodeURIComponent(titleInput)}`;
          else queryApi = `intitle:${encodeURIComponent(titleInput)}`;
        }
        if (authorInput) {
          if (queryApi)
            queryApi += `+inauthor:${encodeURIComponent(authorInput)}`;
          else queryApi = `inauthor:${encodeURIComponent(authorInput)}`;
        }
        if (langInput) {
          if (queryApi) queryApi += `&langRestrict=${langInput}`;
          else queryApi = `books&langRestrict=${langInput}`;
        }
      }

      getDocsByQueryFirebase<BookType>("books")
        .then((books) => {
          return books.filter((book: BookType) => {
            let shouldIncludeBook = true;

            if (!titleInput && !authorInput && !langInput) {
              shouldIncludeBook = true;
            } else {
              if (titleInput) {
                shouldIncludeBook =
                  shouldIncludeBook &&
                  book.title.toLowerCase().includes(titleInput.toLowerCase());
              }
              if (authorInput) {
                shouldIncludeBook =
                  shouldIncludeBook &&
                  book.authors.some((author) =>
                    author.toLowerCase().includes(authorInput.toLowerCase())
                  );
              }
              if (langInput) {
                console.log(
                  "%c qqq",
                  "color: tomato",
                  langInput,
                  book.language,
                  book.title
                );
                shouldIncludeBook =
                  shouldIncludeBook && book.language === langInput;
                console.log("qqq shouldIncludeBook", shouldIncludeBook);
              }
            }

            return shouldIncludeBook;
          });
        })
        .then((books: BookType[]) => {
          console.log("++++** books from BDD dans USEEFFECT-1", books);
          setDbBooks(books);
        })
        .catch((error: Error) => {
          console.error("Error fetching books:", error);
        });

      setBooksApiUrl(
        `${GOOGLE_BOOKS_API_URL}?q=${queryApi}&maxResults=${MAX_RESULTS}`
      );

      console.log("useDebounceEffect Titre", titleInput);
      console.log("useDebounceEffect Auteur", authorInput);
      console.log("useDebounceEffect queryApi", queryApi);
    },
    [titleInput, authorInput, langInput],
    500
  );

  ////////////////////////////////////////////
  ////////////////////////////////////////////
  ////////////////////////////////////////////
  ////////////////////////////////////////////
  ////////////////////////////////////////////voir erreur plus bas : (e)
  // et voir pk si on choisi anglais on part et reviens => pas anglais ?????
  // utiliser un useCallback ???
  const handleChangeInput = (
    key: "titleInput" | "authorInput" | "langInput",
    value: string
  ) => {
    if (key === "titleInput") {
      setTitleInput(value);
    } else if (key === "authorInput") {
      setAuthorInput(value);
    } else if (key === "langInput") {
      setLangInput(value);
    }
    localStorage.setItem(key, value);
  };

  console.log("localStorage", localStorage);

  useEffect(() => {
    if (urlParam.author) {
      console.log("************************************");
      localStorage.setItem("titleInput", "");
      localStorage.setItem("authorInput", urlParam.author);
      localStorage.setItem("langInput", "");
      // localStorage.setItem("langInput", urlParam.langue);
    }
  }, [urlParam.author]);

  // console.log("LOCAL STORAGE TITLE", localStorage.getItem("titleInput"));
  // console.log("LOCAL STORAGE AUTHOR", localStorage.getItem("authorInput"));

  const handleClearInput = (
    key: string,
    setState: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setState("");
    localStorage.removeItem(key);
    if (key === "titleInput") {
      titleInputRef.current?.focus();
    } else if (key === "authorInput") {
      authorInputRef.current?.focus();
    }
  };

  useEffect(() => {
    console.log("*-*- useEffect sortBookTypes sortState = ", sortState);
    sortBookTypes(bdAndApiBooks, sortState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortState, bdAndApiBooks]);

  // mettre dans fic constantes !
  // ...existing code...
  const LANGUAGES = [
    { name: "Allemand", code: "de" },
    { name: "Anglais", code: "en" },
    //{ name: "Arabe", code: "ar" },
    //{ name: "Coréen", code: "ko" },
    { name: "Espagnol", code: "es" },
    { name: "Français", code: "fr" },
    //{ name: "Grec", code: "el" },
    //{ name: "Hindi", code: "hi" },
    { name: "Italien", code: "it" },
    //{ name: "Japonais", code: "ja" },
    { name: "Néerlandais", code: "nl" },
    { name: "Portugais", code: "pt" },
    //{ name: "Roumain", code: "ro" },
    //{ name: "Russe", code: "ru" },
    //{ name: "Turc", code: "tr" },
  ];
  // ...existing code...

  return (
    <div className="h-full min-h-screen max-w-3xl sm:p-2 md:m-auto md:mt-8">
      <p>Nombre de résultats : {bdAndApiBooks.length} </p>
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
          <div className="relative">
            <Input
              value={titleInput}
              ref={titleInputRef}
              placeholder="Titre"
              // onChange={(e) => setTitleInput(e.target.value)}
              onChange={(e) => handleChangeInput("titleInput", e.target.value)}
            />
            <X
              onClick={() => handleClearInput("titleInput", setTitleInput)}
              className="absolute right-2 top-2 cursor-pointer"
            />
          </div>

          <div className="relative">
            <Input
              value={authorInput}
              ref={authorInputRef}
              placeholder="Auteur(e)"
              onChange={(e) => handleChangeInput("authorInput", e.target.value)}
            />
            <X
              onClick={() => handleClearInput("authorInput", setAuthorInput)}
              className="absolute right-2 top-2 cursor-pointer"
            />
          </div>
          <div className="relative">
            <Select
              value={langInput}
              onValueChange={(e) => handleChangeInput("langInput", e)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Langue" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <X
              onClick={() => handleClearInput("langInput", setLangInput)}
              className="absolute right-2 top-2 cursor-pointer"
            />
          </div>
        </div>
        {/* <Button type="submit">Ajouter</Button> */}
        {/* <Search className="text-primary/60 drop-shadow-lg" size={40} /> */}
        <BooksSortControls
          booksStatus={BookStatusEnum.booksReadList}
          sortState={sortState}
          setSortState={setSortState}
        />
        {isLoading ? (
          <div>
            <BookSkeleton />
            <BookSkeleton />
            <BookSkeleton />
          </div>
        ) : error ? (
          <FeedbackMessage message={message} type="error" />
        ) : bdAndApiBooks?.length > 0 ? (
          <ul>
            {bdAndApiBooks.map((book: BookType) => (
              <li key={book.id} className="mb-4">
                {/* Ici on passe le book en props (et pas le bookId comme dans MyBooksPage) */}
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
