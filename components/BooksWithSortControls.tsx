"use client";

import { BookStatusValues } from "@/lib/constants";
import {
  BookStatusType,
  BookType,
  BookTypePlusDate,
  SortStateType,
} from "@/lib/types";
import { sortBook } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import BookInfos from "./BookInfos";
import { Button } from "./ui/button";

type BooksSortControlsType =
  | {
      displayBookStatus: BookStatusType;
      books: BookType[];
      bookIds?: never;
      displayedAppUserId?: string | undefined;
      withDateOption?: boolean;
    }
  | {
      displayBookStatus: BookStatusType;
      books?: never;
      bookIds: string[];
      displayedAppUserId?: string | undefined;
      withDateOption?: boolean;
    };

const BooksWithSortControls = ({
  displayBookStatus,
  books,
  bookIds,
  displayedAppUserId,
  withDateOption = false,
}: BooksSortControlsType) => {
  const [sortState, setSortState] = useState<any>({
    [displayBookStatus]: { criteria: "title", order: "asc" },
  });
  const [booksStatuses, setBooksStatuses] = useState<
    Record<string, BookStatusType | null>
  >({});
  const [displayedBooks, setDisplayedBooks] = useState<
    BookType[] | BookTypePlusDate[]
  >(books || []);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(
    undefined
  );

  const handleSort = (criteria: "title" | "date" | "note" | "reviews") => {
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

  useEffect(() => {
    if (bookIds && bookIds.length > 0) {
      (async () => {
        try {
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
            setDisplayedBooks(json.data || []);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des livres :", error);
        }
      })();
    }
  }, [bookIds, displayedAppUserId]);

  // To refresh the component when books (i.e. the book search) changes
  useEffect(() => {
    setDisplayedBooks(books || []);
  }, [books]);

  useEffect(() => {
    const fetchBooksStatuses = async () => {
      try {
        const bookIds = displayedBooks.map((book) => book.id);

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

        const json = await response.json();

        if (json.data) {
          setBooksStatuses(json.data);
        }
      } catch (error) {
        console.error("Error fetching books statuses:", error);
      }
    };

    if (currentUserId) {
      fetchBooksStatuses();
    }
  }, [currentUserId, displayedBooks]);

  useEffect(() => {
    setDisplayedBooks(
      sortBook(
        displayedBooks,
        sortState[displayBookStatus].criteria,
        sortState[displayBookStatus].order,
        sortState
      )
    );
  }, [sortState, displayedBooks, displayBookStatus]);

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
        {displayBookStatus === BookStatusValues.READ && withDateOption && (
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
                <BookInfos
                  currentUserId={currentUserId}
                  book={book}
                  // Either we are on a user's account, or on the book search page (so displayAppUserId = undefined)
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
