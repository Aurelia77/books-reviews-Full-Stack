"use client";

import { BookType, BookTypePlusDate, SortStateType } from "@/lib/types";
import { BookStatus } from "@prisma/client";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import BookInfos from "./BookInfos";
import { Button } from "./ui/button";
import { sortBook } from "@/lib/utils";

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
  console.log("❤️🤍🤎 displayBookStatus", displayBookStatus);

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
        const res = await fetch("/api/user");
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
    if (bookIds && bookIds.length > 0 && displayedAppUserId) {
      (async () => {
        try {
          const response = await fetch("/api/book/byIdsWithDate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              bookIds,
              displayedAppUserId,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            setDisplayedBooks(data);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des livres :", error);
        }
      })();
    }
  }, [bookIds, displayedAppUserId]);

  useEffect(() => {
    const fetchBooksStatuses = async () => {
      try {
        // Création de bookIds à partir des livres
        const bookIds = displayedBooks.map((book) => book.id);

        console.log("💛xxx", currentUserId, bookIds);

        // Requête pour récupérer les statuts des livres
        const response = await fetch("/api/book/bookStatuses", {
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
    //console.log("*-*- useEffect sortBookTypes sortState = ", sortState);
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
        {displayedBooks.map((book: BookType) => {
          const bookStatus = booksStatuses[book.id] || "";

          return (
            <li key={book.id} className="mb-4 border-muted border-4 rounded-xl">
              <p>
                Status du livre {book.title} = {bookStatus}
              </p>
              <BookInfos
                book={book}
                userViewId={displayedAppUserId}
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
