"use client";

import { BookType, BookTypePlusDate, SortStateType } from "@/lib/types";
import { sortBook } from "@/lib/utils";
import { BookStatus } from "@prisma/client";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import BookInfos from "./BookInfos";
import { Button } from "./ui/button";

type BooksSortControlsType =
  | {
      displayBookStatus: BookStatus;
      // sortState: SortStateType;
      // setSortState: React.Dispatch<React.SetStateAction<SortStateType>>;
      books: BookType[];
      bookIds?: never;
      displayedAppUserId?: string | undefined;
      withDateOption?: boolean;
    }
  | {
      displayBookStatus: BookStatus;
      //sortState: SortStateType;
      // setSortState: React.Dispatch<React.SetStateAction<SortStateType>>;
      books?: never;
      bookIds: string[];
      displayedAppUserId?: string | undefined;
      withDateOption?: boolean;
    };

const BooksWithSortControls = ({
  displayBookStatus,
  // sortState,
  // setSortState,
  books,
  bookIds,
  displayedAppUserId,
  withDateOption = false,
}: BooksSortControlsType) => {
  console.log("❤️🤍🤎 bookIds", bookIds);
  console.log("❤️🤍🤎 displayBookStatus", displayBookStatus);
  console.log("❤️🤍🤎 displayedAppUserId", displayedAppUserId);
  console.log("❤️🤍🤎 BooksWithSortControls books", books);

  // console.log("*-*-sortState", sortState);
  // console.log("*-*-sortState", sortState[displayBookStatus]);

  // const [sortState, setSortState] = useState<any>({
  //   [BookStatus.READ]: { criteria: "title", order: "asc" },
  // });

  // const [sortState, setSortState] = useState<SortStateType>({
  //   [BookStatus.READ]: { criteria: "date", order: "asc" },
  //   [BookStatus.IN_PROGRESS]: { criteria: "date", order: "asc" },
  //   [BookStatus.TO_READ]: { criteria: "date", order: "asc" },
  // });

  const [sortState, setSortState] = useState<any>({
    [displayBookStatus]: { criteria: "title", order: "asc" },
  });

  /////////////////////
  /////////////////////
  /////////////////////
  /////////////////////TRI ???????????????????
  /////////////////////
  /////////////////////
  // console.log("💛💚🤍 sortState", sortState);
  console.log(
    "💛💚🤍 sortState",
    displayBookStatus,
    sortState[displayBookStatus]
  );

  const [booksStatuses, setBooksStatuses] = useState<
    Record<string, BookStatus | null>
  >({});

  console.log("💛💙💚❤️🤍🤎 booksStatuses", booksStatuses);

  const [displayedBooks, setDisplayedBooks] = useState<
    BookType[] | BookTypePlusDate[]
  >(books || []);

  console.log("💛💙🤎 displayedBooks", displayedBooks);

  const [currentUserId, setCurrentUserId] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        setCurrentUserId(data.user?.id);
      } catch (error) {
        console.error("Erreur user :", error);
      }
    };
    fetchUser();
  }, []);
  // ...avant le return du composant
  useEffect(() => {
    if (bookIds && bookIds.length > 0) {
      (async () => {
        try {
          // const response = await fetch("/api/books/byIdsWithDate", {
          //   method: "POST",
          //   headers: {
          //     "Content-Type": "application/json",
          //   },
          //   body: JSON.stringify({
          //     bookIds,
          //     displayedAppUserId,
          //   }),
          // });
          const endpoint = displayedAppUserId
            ? "/api/books/byIdsWithDate"
            : "/api/books/byIds";
          const body = displayedAppUserId
            ? { bookIds, displayedAppUserId }
            : { bookIds };
          const response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });

          if (response.ok) {
            const json = await response.json();
            console.log("💛💙🤎 displayedBooks data books", json.data);
            setDisplayedBooks(json.data || []);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des livres :", error);
        }
      })();
    }
  }, [bookIds, displayedAppUserId]);

  // Pour actualiser le composant lorsque books (donc la recherche de livres) change
  useEffect(() => {
    setDisplayedBooks(books || []);
  }, [books]);

  useEffect(() => {
    const fetchBooksStatuses = async () => {
      try {
        // Création de bookIds à partir des livres
        const bookIds = displayedBooks.map((book) => book.id);

        console.log("💛xxx", currentUserId, bookIds);

        // Requête pour récupérer les statuts des livres
        const response = await fetch("/api/books/bookStatuses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUserId,
            bookIds,
          }),
        });

        const data = await response.json();
        if (data.statuses) {
          setBooksStatuses(data.statuses); // Mise à jour des statuts
        }
      } catch (error) {
        console.error("Error fetching books statuses:", error);
      }
    };

    if (currentUserId) {
      fetchBooksStatuses();
    }
  }, [currentUserId, displayedBooks]);

  const handleSort = (criteria: "title" | "date" | "note" | "reviews") => {
    console.log("💛SortState💙 handleSort ❤️🤍🤎", criteria);
    //console.log("wwwx criteria", criteria);
    //console.log("wwwx activeTab", activeTab);

    setSortState((prevState: SortStateType) => ({
      ...prevState,
      [displayBookStatus]: {
        criteria,
        order:
          prevState[displayBookStatus].criteria === criteria
            ? prevState[displayBookStatus].order === "asc"
              ? "desc"
              : "asc"
            : "asc",
      },
    }));
  };

  useEffect(() => {
    console.log("useEffect sortBook displayedBooks");
    //sortBook(displayedBooks, sortState);
    // Pas boucle infinie...Bizarre ???
    setDisplayedBooks(
      sortBook(
        displayedBooks,
        sortState[displayBookStatus].criteria,
        sortState[displayBookStatus].order,
        sortState
      )
    );
  }, [sortState, displayedBooks]);

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="flex items-center justify-around rounded-md bg-secondary p-1 sm:gap-1 w-full max-w-lg">
        <Button
          onClick={() => handleSort("title")}
          className={`flex w-1/4 gap-1 sm:gap-2 border border-foreground text-foreground ${
            sortState[displayBookStatus].criteria === "title"
              ? "bg-background/90 hover:bg-background/80"
              : "bg-muted-foreground/20"
          }`}
        >
          Titre
          {sortState[displayBookStatus].criteria === "title" &&
            (sortState[displayBookStatus].order === "desc" ? (
              <ChevronUp />
            ) : (
              <ChevronDown />
            ))}
        </Button>
        {displayBookStatus === BookStatus.READ && withDateOption && (
          <Button
            onClick={() => handleSort("date")}
            className={`flex w-1/4 gap-1 sm:gap-2 border border-foreground text-foreground ${
              sortState[displayBookStatus].criteria === "date"
                ? "bg-background/90 hover:bg-background/80"
                : "bg-muted-foreground/20"
            }`}
          >
            Date
            {sortState[displayBookStatus].criteria === "date" &&
              (sortState[displayBookStatus].order === "asc" ? (
                <ChevronUp />
              ) : (
                <ChevronDown />
              ))}
          </Button>
        )}
        <Button
          onClick={() => handleSort("note")}
          className={`flex w-1/4 gap-1 sm:gap-2 border border-foreground text-foreground ${
            sortState[displayBookStatus].criteria === "note"
              ? "bg-background/90 hover:bg-background/80"
              : "bg-muted-foreground/20"
          }`}
        >
          Favoris
          {sortState[displayBookStatus].criteria === "note" &&
            (sortState[displayBookStatus].order === "asc" ? (
              <ChevronUp />
            ) : (
              <ChevronDown />
            ))}
        </Button>
        <Button
          onClick={() => handleSort("reviews")}
          className={`flex w-1/4 gap-2 border border-foreground text-foreground ${
            sortState[displayBookStatus].criteria === "reviews"
              ? "bg-background/90 hover:bg-background/80"
              : "bg-muted-foreground/20"
          }`}
        >
          Notés
          {sortState[displayBookStatus].criteria === "reviews" &&
            (sortState[displayBookStatus].order === "asc" ? (
              <ChevronUp />
            ) : (
              <ChevronDown />
            ))}
        </Button>
      </div>

      <ul>
        {displayedBooks &&
          displayedBooks.map((book: BookType) => {
            const bookStatus = booksStatuses[book.id] || "";

            return (
              <li
                key={book.id}
                className="mb-4 border-muted border-4 rounded-xl"
              >
                <p>
                  Status du livre {book.title} = {bookStatus}
                </p>
                <BookInfos
                  currentUserId={currentUserId}
                  book={book}
                  // Soit on est sur le compte d'un user, soit sur la page de recherche du livre (donc displayAppUserId = undefined)
                  userViewId={displayedAppUserId || currentUserId}
                  bookConnectedUserStatus={bookStatus}
                />
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default BooksWithSortControls;
