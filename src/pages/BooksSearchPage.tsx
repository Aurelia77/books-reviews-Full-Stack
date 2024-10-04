import BookInfos from "@/components/BookInfos";
import FeedbackMessage from "@/components/FeedbackMessage";
import Title from "@/components/Title";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getDocsByQueryFirebase } from "@/firebase";
import { friendsWhoReadBook } from "@/lib/utils";
//import { books } from "@/data";
import { BookType } from "@/types";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";

const MAX_RESULTS = 5; // jusqu'à 40
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

const BooksSearchPage = (): JSX.Element => {
  const [dbBooks, setDbBooks] = useState<BookType[]>([]);
  //console.log("books from BDD", databaseBooks);
  const [booksApiUrl, setBooksApiUrl] = useState(
    `https://www.googleapis.com/books/v1/volumes?q=subject:general&maxResults=${MAX_RESULTS}`
  );
  const [bdAndApiBooks, setDbAndApiBooks] = useState<BookType[]>([]);
  //console.log("books from BDD and API", allSearchBooks);

  const [titleInput, setTitleInput] = useState("");
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [authorInput, setAuthorInput] = useState("");

  // APPEL API (hook perso ?)
  const fetchAPIBooks = (booksApiUrl: string): Promise<BookType[]> => {
    // throw new Error(
    //   "Erreur simulée !"
    // );
    return (
      fetch(booksApiUrl)
        .then((res: Response): Promise<{ items: BookAPIType[] }> => res.json())
        //.then((res) => res.json())    // idem sans TS
        .then((data) => data.items)
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

  const {
    data: apiBooks,
    error,
    isLoading,
  } = useSWR<BookType[]>(booksApiUrl, fetchAPIBooks);
  //console.log("booksFromAPI", apiBooks);

  const message = `Un problème est survenu dans la récupération du livre => ${error?.message}`;

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

  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }

    getDocsByQueryFirebase("books", "bookIsFromAPI", true)
      .then((books) => {
        setDbBooks(books);
      })
      .catch((error) => {
        console.error("Error fetching books: ", error);
      });
  }, []);

  useEffect(() => {
    let query = "";
    let dbSearchBooks: BookType[] = [];

    if (!titleInput && !authorInput) {
      query = getRandomChar(); // pour résultats alléatoires si pas de recherche

      // REVOIR CETTE FONCTION !!!!!!!!
      getDocsByQueryFirebase("books", "bookIsFromAPI", true)
        .then((books: BookType[]) => {
          //console.log("books from BDD", books);
          dbSearchBooks = books;
          //setDbBooks(books);
        })
        .catch((error) => {
          console.error("Error fetching books: ", error);
        });
    } else {
      if (titleInput) {
        query += `+intitle:${encodeURIComponent(titleInput)}`;
      }
      if (authorInput) {
        query += `+inauthor:${encodeURIComponent(authorInput)}`;
      }

      dbSearchBooks = dbBooks.filter((book: BookType) =>
        book.bookTitle.toLowerCase().includes(titleInput.toLowerCase())
      );

      //setDbBooks(dbBooks123)
    }

    // console.log("query", query);
    console.log(
      "url",
      `${GOOGLE_BOOKS_API_BASE_URL}?q=${query}&maxResults=${MAX_RESULTS}`
    );
    console.log("dbBooks123", dbSearchBooks);

    setBooksApiUrl(
      `${GOOGLE_BOOKS_API_BASE_URL}?q=${query}&maxResults=${MAX_RESULTS}`
    );
    setDbBooks(dbSearchBooks);

    // `https://www.googleapis.com/books/v1/volumes?q=${title}+inauthor:${author}&maxResults=${MAX_RESULTS}`;
  }, [titleInput, authorInput]);

  useEffect(() => {
    if (apiBooks) {
      setDbAndApiBooks(shuffle2ArraysPreserveOrder(dbBooks, apiBooks));
    }
  }, [apiBooks, dbBooks]);

  const formRef = useRef<HTMLDivElement>(null);

  // Au montage du composant, on ajoute un écouteur d'événement sur la fenêtre pour gérer le scroll
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
          {/* <FormField
              control={form.control}
              name="bookTitle"
              render={({ field }) => (
                <FormItem>
                  <FormControl> */}
          <Input
            ref={titleInputRef}
            placeholder="Titre"
            onChange={(e) => setTitleInput(e.target.value)}
          />
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
          <Input
            placeholder="Auteur(e)"
            onChange={(e) => setAuthorInput(e.target.value)}
          />
          {/* <Input placeholder="Auteur(e)" {...field} /> */}
          {/* </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
        </div>
        {/* <Button type="submit">Ajouter</Button> */}
        {/* <Search className="text-primary/60 drop-shadow-lg" size={40} /> */}
        {isLoading && (
          // <ClipLoader
          //   className="m-auto mt-16"
          //   color="#09f"
          //   loading={isLoading}
          //   size={70}
          // />
          <div>
            <div className="flex gap-4 p-5 pt-10">
              <Skeleton className="h-48 w-32 rounded-md" />
              <div className="grow space-y-7">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-2 w-[100px]" />
                <Skeleton className="h-2 w-[80px]" />
              </div>
            </div>
            <div className="flex gap-4 p-5 pt-10">
              <Skeleton className="h-48 w-32 rounded-md" />
              <div className="grow space-y-7">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-2 w-[100px]" />
                <Skeleton className="h-2 w-[80px]" />
              </div>
            </div>
            <div className="flex gap-4 p-5 pt-10">
              <Skeleton className="h-48 w-32 rounded-md" />
              <div className="grow space-y-7">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-2 w-[100px]" />
                <Skeleton className="h-2 w-[80px]" />
              </div>
            </div>
          </div>
        )}
        {error && <FeedbackMessage message={message} type="error" />}
        {bdAndApiBooks && (
          <ul className="pb-40">
            {bdAndApiBooks.map((book: BookType) => (
              <li key={book.bookId}>
                <BookInfos
                  book={book}
                  friendsWhoReadBook={friendsWhoReadBook(book.bookId)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BooksSearchPage;
