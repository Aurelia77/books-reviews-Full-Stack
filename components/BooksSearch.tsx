"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LANGUAGES } from "@/lib/constants";
import { BooksSearchQueryType, BookType } from "@/lib/types";
import { X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Title from "./Title";
import { Input } from "./ui/input";
import { BookStatus } from "@prisma/client";

type BooksSearchProps = {
  bdAndApiBooks: BookType[];
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

const BooksSearch = (props: { query: BooksSearchQueryType }) => {
  const [search, setSearch] = useState<BooksSearchQueryType>(props.query);
  //console.log("💛💙 search Inputs", search);

  const router = useRouter();
  const pathname = usePathname();

  //const urlParam = useParams<{ author: string }>();

  // const [titleInput, setTitleInput] = useState<string>("");
  // const [authorInput, setAuthorInput] = useState<string>("");
  // const [langInput, setLangInput] = useState<string>("");

  // LocalStorage doit être côté client donc doit être exécuté après que le composant soit monté sinon on est encore côté serveur (même dans un RCC)
  // useEffect(() => {
  //   // Je sai splus pk j'ai mis ça !!!
  //   // if (typeof window !== "undefined") {
  //        title: urlParam.author ? "" : localStorage.getItem("titleInput") || "",
  //     author: urlParam.author || localStorage.getItem("authorInput") || "",
  //     lang: urlParam.author ? "" : localStorage.getItem("langInput") || "",
  //   });
  //   // }
  // }, [urlParam.author]);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const authorInputRef = useRef<HTMLInputElement>(null);

  //console.log("authorInputRef", authorInputRef);
  // const [inFriendsLists, setInFriendsLists] = useState(true);
  // const [inApi, setInApi] = useState(true);

  const [sortState, setSortState] = useState<any>({
    [BookStatus.READ]: { criteria: "title", order: "asc" },
  });

  // DEBUT============================FAIRE HOOK PERSO !!!
  // const fetchAPIBooks = (booksApiUrl: string): Promise<BookType[]> => {
  //   console.log("+++** FETCHER : dbBooks = ", dbBooks);
  //   // throw new Error(
  //   //   "Erreur simulée !"
  //   // );
  //   return fetch(booksApiUrl)
  //     .then((res: Response): Promise<{ items: BookAPIType[] }> => res.json())
  //     .then((data) => {
  //       if (!data.items) {
  //         return [];
  //         //throw new Error("No items found in the response");
  //       }
  //       return data.items;
  //     })
  //     .then((apiBooks) => {
  //       // on récupère les id des livres de la base de données pour ne pas ajouter les livres de l'API qui ont les mêmes id
  //       let dbBooksIds: string[] = [];
  //       if (dbBooks) {
  //         dbBooksIds = dbBooks.map((book) => book.id);
  //       }
  //       console.log("+++++-dbBooks", dbBooks);
  //       console.log("+++++-dbBooksIds", dbBooksIds);
  //       console.log("**32-apiBooks", apiBooks);

  //       const apiBooksIds = apiBooks.map((book) => book.id);
  //       const uniquesApiBooksIds = new Set(apiBooksIds);

  //       const objetsUniques = apiBooks.filter((apiBook) => {
  //         if (uniquesApiBooksIds.has(apiBook.id)) {
  //           uniquesApiBooksIds.delete(apiBook.id); // Supprimer l'id du Set pour éviter les doublons
  //           return true;
  //         }
  //         return false;
  //       });

  //       console.log("+++++++++++++++++", objetsUniques);

  //       const uniqueApiBooks: BookType[] = objetsUniques
  //         .filter((book: BookAPIType) => {
  //           console.log("+++++", book.volumeInfo.title, book.id, dbBooksIds);
  //           // console.log(
  //           //   "123456",
  //           //   !dbBooksIds.includes(book.id) && !uniqueBooks.has(book.id)
  //           // );
  //           // Vérifie si le livre est déjà dans la base de données ou dans le Set uniqueBooks
  //           //return !dbBooksIds.includes(book.id) && !uniqueBooks.has(book.id);
  //           return !dbBooksIds.includes(book.id);
  //         })
  //         .map((book: BookAPIType) => {
  //           //uniqueBooks.add(book.id);
  //           return {
  //             id: book.id,
  //             title: book.volumeInfo.title,
  //             authors: book.volumeInfo?.authors, //?.[0] ?? "Auteur inconnu",
  //             description: book.volumeInfo.description,
  //             categories: book.volumeInfo.categories,
  //             pageCount: book.volumeInfo.pageCount,
  //             publishedDate: book.volumeInfo.publishedDate,
  //             publisher: book.volumeInfo.publisher,
  //             imageLink: book.volumeInfo.imageLinks?.thumbnail,
  //             language: book.volumeInfo.language,
  //             isFromAPI: true,
  //             rating: {
  //               totalRating: 0,
  //               count: 0,
  //             },
  //           };
  //         });
  //       console.log("9+++++-uniqueApiBooks", uniqueApiBooks);
  //       return uniqueApiBooks;
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching books:", error);
  //       return [];
  //     });
  // };

  // const {
  //   data: apiBooks,
  //   error,
  //   isLoading,
  // } = useSWR<BookType[]>(dbBooks !== null ? booksApiUrl : null, fetchAPIBooks);
  // FIN============================FAIRE HOOK PERSO !!!

  // ici on utilise une constante et pas un state car les message ne change pas et s'affiche seulement si useSWR renvoie une erreur
  //const message = `Un problème est survenu dans la récupération de livres de Google Books => ${error?.message}`;

  // // Mis à jour de dbBooks au montage du composant
  // useEffect(() => {
  //   console.log("+++ useEffect-1, dbBooks = ", dbBooks);
  //   if (titleInputRef.current) {
  //     titleInputRef.current.focus();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // // Mise à jour de bdAndApiBooks
  // useEffect(() => {
  //   console.log("+++*** useEffect-2, dbBooks = ", dbBooks);
  //   console.log("+++*** useEffect-2, apiBooks = ", apiBooks);
  //   // console.log(
  //   //   "+++*** useEffect-2, dbAndApiBooks = ",
  //   //   shuffle2ArraysPreserveOrder(dbBooks, apiBooks)
  //   // );

  //   if (apiBooks && dbBooks) {
  //     setDbAndApiBooks(shuffle2ArraysPreserveOrder(dbBooks, apiBooks));
  //   }
  // }, [apiBooks, dbBooks]);

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
  // useDebounceEffect(
  //   () => {
  //     let queryApi = "";

  //     // impossible de mettre ensemble ces 2 blocs meme si on se répète (DRY) car sinon queryApi s'incrémente 12 fois à chaque modif du titre par ex !!!
  //     if (!titleInput && !authorInput && !langInput) {
  //       queryApi = getRandomChar(); // résultats aléatoires si pas de recherche
  //     } else {
  //       if (titleInput) {
  //         if (queryApi)
  //           queryApi += `+intitle:${encodeURIComponent(titleInput)}`;
  //         else queryApi = `intitle:${encodeURIComponent(titleInput)}`;
  //       }
  //       if (authorInput) {
  //         if (queryApi)
  //           queryApi += `+inauthor:${encodeURIComponent(authorInput)}`;
  //         else queryApi = `inauthor:${encodeURIComponent(authorInput)}`;
  //       }
  //       if (langInput) {
  //         if (queryApi) queryApi += `&langRestrict=${langInput}`;
  //         else queryApi = `books&langRestrict=${langInput}`;
  //       }
  //     }

  //     getDocsByQueryFirebase<BookType>("books")
  //       .then((books) => {
  //         return books.filter((book: BookType) => {
  //           let shouldIncludeBook = true;

  //           if (!titleInput && !authorInput && !langInput) {
  //             shouldIncludeBook = true;
  //           } else {
  //             if (titleInput) {
  //               shouldIncludeBook =
  //                 shouldIncludeBook &&
  //                 book.title.toLowerCase().includes(titleInput.toLowerCase());
  //             }
  //             if (authorInput) {
  //               shouldIncludeBook =
  //                 shouldIncludeBook &&
  //                 book.authors.some((author) =>
  //                   author.toLowerCase().includes(authorInput.toLowerCase())
  //                 );
  //             }
  //             if (langInput) {
  //               console.log(
  //                 "%c qqq",
  //                 "color: tomato",
  //                 langInput,
  //                 book.language,
  //                 book.title
  //               );
  //               shouldIncludeBook =
  //                 shouldIncludeBook && book.language === langInput;
  //               console.log("qqq shouldIncludeBook", shouldIncludeBook);
  //             }
  //           }

  //           return shouldIncludeBook;
  //         });
  //       })
  //       .then((books: BookType[]) => {
  //         console.log("++++** books from BDD dans USEEFFECT-1", books);
  //         setDbBooks(books);
  //       })
  //       .catch((error: Error) => {
  //         console.error("Error fetching books:", error);
  //       });

  //     setBooksApiUrl(
  //       `${GOOGLE_BOOKS_API_URL}?q=${queryApi}&maxResults=${MAX_RESULTS}`
  //     );

  //     console.log("useDebounceEffect Titre", titleInput);
  //     console.log("useDebounceEffect Auteur", authorInput);
  //     console.log("useDebounceEffect queryApi", queryApi);
  //   },
  //   [titleInput, authorInput, langInput],
  //   500
  // );

  ////////////////////////////////////////////
  ////////////////////////////////////////////
  ////////////////////////////////////////////
  ////////////////////////////////////////////
  ////////////////////////////////////////////voir erreur plus bas : (e)
  // et voir pk si on choisi anglais on part et reviens => pas anglais ?????
  // utiliser un useCallback ???
  // Modifiez la fonction `handleChangeInput` :
  const handleChangeInput = (
    key: keyof BooksSearchQueryType, // Utilisez les clés de `BooksSearchQueryType`
    value: string
  ) => {
    const updatedSearch = { ...search, [key]: value };

    setSearch(updatedSearch);

    const searchParams = new URLSearchParams(updatedSearch);
    router.replace(`${pathname}?${searchParams.toString()}`);

    // const newSearchParams = ;
    // router.replace(`${pathname}?${searchParams.toString()}`);
    //localStorage.setItem(key, value); // Sauvegarde dans localStorage
  };

  // console.log("localStorage", localStorage);

  // useEffect(() => {
  //   if (urlParam.author) {
  //     console.log("************************************");
  //     localStorage.setItem("titleInput", "");
  //     localStorage.setItem("authorInput", urlParam.author);
  //     localStorage.setItem("langInput", "");
  //     // localStorage.setItem("langInput", urlParam.langue);
  //   }
  // }, [urlParam.author]);

  // console.log("LOCAL STORAGE TITLE", localStorage.getItem("titleInput"));
  // console.log("LOCAL STORAGE AUTHOR", localStorage.getItem("authorInput"));

  const handleClearInput = (key: keyof BooksSearchQueryType) => {
    const updatedSearch = { ...search, [key]: "" }; // Vider la clé spécifiée
    setSearch(updatedSearch); // Mettre à jour l'état `search`
    //localStorage.removeItem(key); // Supprimer la valeur du localStorage

    const searchParams = new URLSearchParams(updatedSearch);
    router.replace(`${pathname}?${searchParams.toString()}`);

    // Restaurer le focus sur l'input correspondant
    if (key === "title" && titleInputRef.current) {
      titleInputRef.current.focus();
    } else if (key === "author" && authorInputRef.current) {
      authorInputRef.current.focus();
    }
  };
  // const handleClearInput = (
  //   key: string,
  //   setState: React.Dispatch<React.SetStateAction<string>>
  // ) => {
  //   setState("");
  //   localStorage.removeItem(key);
  //   if (key === "titleInput") {
  //     titleInputRef.current?.focus();
  //   } else if (key === "authorInput") {
  //     authorInputRef.current?.focus();
  //   }
  // };

  // useEffect(() => {
  //   console.log("*-*- useEffect sortBookTypes sortState = ", sortState);
  //   //sortBook(bdAndApiBooks, sortState);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [sortState, bdAndApiBooks]);

  return (
    <div
      ref={formRef}
      className="sticky top-10 z-10 flex flex-col gap-3 bg-background/70 duration-500"
    >
      <Title>Recherche de livres</Title>
      <div className="relative">
        <Input
          value={search.title}
          // value={titleInput}
          ref={titleInputRef}
          placeholder="Titre"
          onChange={(e) => handleChangeInput("title", e.target.value)}
        />
        <X
          onClick={() => handleClearInput("title")}
          className="absolute right-2 top-2 cursor-pointer"
        />
      </div>

      <div className="relative">
        <Input
          value={search.author}
          ref={authorInputRef}
          placeholder="Auteur(e)"
          onChange={(e) => handleChangeInput("author", e.target.value)}
        />
        <X
          onClick={() => handleClearInput("author")}
          className="absolute right-2 top-2 cursor-pointer"
        />
      </div>
      <div className="relative">
        <Select
          value={search.lang}
          onValueChange={(e) => handleChangeInput("lang", e)}
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
          onClick={() => handleClearInput("lang")}
          className="absolute right-2 top-2 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default BooksSearch;
