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
import { getDocsByQueryFirebase } from "@/firebase/firestore";
import { GOOGLE_BOOKS_API_URL, LANGUAGES } from "@/lib/constants";
import { BookAPIType, BookStatusEnum, BookType } from "@/lib/types";
import { sortBook } from "@/utils";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";

const MAX_RESULTS = 40; // until 40

const shuffle2ArraysPreserveOrder = <T, U>(
  array1: T[],
  array2: U[]
): (T | U)[] => {
  const combinedArray = [
    ...array1.map((item) => ({ item, from: "array1" })),
    ...array2.map((item) => ({ item, from: "array2" })),
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

  const [dbBooks, setDbBooks] = useState<BookType[] | null>(null);

  const [booksApiUrl, setBooksApiUrl] = useState(
    `${GOOGLE_BOOKS_API_URL}?q=subject:general&maxResults=${MAX_RESULTS}`
  );

  const [bdAndApiBooks, setDbAndApiBooks] = useState<BookType[]>([]);

  const [titleInput, setTitleInput] = useState<string>(
    urlParam.author ? "" : localStorage.getItem("titleInput") || ""
  );
  const [authorInput, setAuthorInput] = useState<string>(
    urlParam.author || localStorage.getItem("authorInput") || ""
  );
  const [langInput, setLangInput] = useState<string>(
    urlParam.author ? "" : localStorage.getItem("langInput") || ""
  );

  const titleInputRef = useRef<HTMLInputElement>(null);
  const authorInputRef = useRef<HTMLInputElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sortState, setSortState] = useState<any>({
    [BookStatusEnum.booksReadList]: { criteria: "title", order: "asc" },
  });

  const fetchAPIBooks = (booksApiUrl: string): Promise<BookType[]> => {
    return fetch(booksApiUrl)
      .then((res: Response): Promise<{ items: BookAPIType[] }> => res.json())
      .then((data) => {
        if (!data.items) {
          return [];
        }
        return data.items;
      })
      .then((apiBooks) => {
        // Retrieve the ids of the books from the database to avoid adding API books with the same ids
        let dbBooksIds: string[] = [];
        if (dbBooks) {
          dbBooksIds = dbBooks.map((book) => book.id);
        }

        const apiBooksIds = apiBooks.map((book) => book.id);
        const uniquesApiBooksIds = new Set(apiBooksIds);

        const objetsUniques = apiBooks.filter((apiBook) => {
          if (uniquesApiBooksIds.has(apiBook.id)) {
            uniquesApiBooksIds.delete(apiBook.id); // Remove the id from the Set to avoid duplicates
            return true;
          }
          return false;
        });

        const uniqueApiBooks: BookType[] = objetsUniques
          .filter((book: BookAPIType) => {
            return !dbBooksIds.includes(book.id);
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
              rating: {
                totalRating: 0,
                count: 0,
              },
            };
          });
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

  const message = `Un problème est survenu dans la récupération de livres de Google Books => ${error?.message}`;

  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (apiBooks && dbBooks) {
      setDbAndApiBooks(shuffle2ArraysPreserveOrder(dbBooks, apiBooks));
    }
  }, [apiBooks, dbBooks]);

  const formRef = useRef<HTMLDivElement>(null);

  // On component mount, add a window event listener to add a class to the form that shrinks it on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (formRef.current) {
        if (window.scrollY > formRef.current.offsetHeight) {
          formRef.current.classList.add("form-sticky-active");
          formRef.current.querySelectorAll("*").forEach((child) => {
            child.classList.add("form-sticky-active");
          });
        } else {
          formRef.current.classList.remove("form-sticky-active");
          formRef.current.querySelectorAll("*").forEach((child) => {
            child.classList.remove("form-sticky-active");
          });
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Update booksApiUrl and dbBooks based on the search, with a delay.
  // 3 arguments: function to execute, dependencies, delay
  useDebounceEffect(
    () => {
      let queryApi = "";

      // Impossible to combine these 2 blocks even if it means repeating code (not DRY), because otherwise queryApi increments 12 times on each title change!
      if (!titleInput && !authorInput && !langInput) {
        queryApi = getRandomChar(); // random results if no search
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
                shouldIncludeBook =
                  shouldIncludeBook && book.language === langInput;
              }
            }

            return shouldIncludeBook;
          });
        })
        .then((books: BookType[]) => {
          setDbBooks(books);
        })
        .catch((error: Error) => {
          console.error("Error fetching books:", error);
        });

      setBooksApiUrl(
        `${GOOGLE_BOOKS_API_URL}?q=${queryApi}&maxResults=${MAX_RESULTS}`
      );
    },
    [titleInput, authorInput, langInput],
    500
  );

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

  useEffect(() => {
    if (urlParam.author) {
      localStorage.setItem("titleInput", "");
      localStorage.setItem("authorInput", urlParam.author);
      localStorage.setItem("langInput", "");
    }
  }, [urlParam.author]);

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
    sortBook(bdAndApiBooks, sortState);
  }, [sortState, bdAndApiBooks]);

  return (
    <div className="h-full min-h-screen max-w-3xl sm:p-2 md:m-auto md:mt-8">
      <div className="flex h-full flex-col gap-6">
        <div
          ref={formRef}
          className="bg-background/70 sticky top-10 z-10 flex flex-col gap-3 duration-500"
        >
          <Title>Recherche de livres</Title>
          <div className="relative">
            <Input
              value={titleInput}
              ref={titleInputRef}
              placeholder="Titre"
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

        {isLoading ? (
          <div>
            <BookSkeleton />
            <BookSkeleton />
            <BookSkeleton />
          </div>
        ) : error ? (
          <FeedbackMessage message={message} type="error" />
        ) : bdAndApiBooks?.length > 0 ? (
          <div className="flex flex-col items-center gap-4">
            <BooksSortControls
              booksStatus={BookStatusEnum.booksReadList}
              sortState={sortState}
              setSortState={setSortState}
            />
            {(titleInput || authorInput || langInput) && (
              <p>{bdAndApiBooks.length} livres trouvés</p>
            )}
            <ul>
              {bdAndApiBooks.map((book: BookType) => (
                <li
                  key={book.id}
                  className="border-muted mb-4 rounded-xl border-4"
                >
                  {/* Here we pass the book as a prop (and not the bookId as in MyBooksPage or..) */}
                  <BookInfos book={book} />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <FeedbackMessage message="Aucun livre trouvé" type="info" />
        )}
      </div>
    </div>
  );
};

export default BooksSearchPage;
