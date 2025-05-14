"use client";

import { BookType, SortStateType } from "@/lib/types";
import { sortBook } from "@/lib/utils";
import { BookStatus } from "@prisma/client";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import BookInfos from "./BookInfos";
import { Button } from "./ui/button";

type BooksSortControlsType = {
  displayBookStatus: BookStatus;
  //sortState: SortStateType;
  //setSortState: React.Dispatch<React.SetStateAction<SortStateType>>;
  books: BookType[];
  userId: string | undefined;
  withDateOption?: boolean;
};

const BooksWithSortControls = ({
  displayBookStatus = BookStatus.READ,
  // sortState,
  // setSortState,
  books,
  userId,
  withDateOption = false,
}: BooksSortControlsType) => {
  // console.log("displayBookStatus", displayBookStatus);

  // console.log("*-*-sortState", sortState);
  // console.log("*-*-sortState", sortState[displayBookStatus]);

  const [sortState, setSortState] = useState<any>({
    [BookStatus.READ]: { criteria: "title", order: "asc" },
  });

  const [booksStatuses, setBooksStatuses] = useState<
    Record<string, BookStatus | null>
  >({});

  useEffect(() => {
    const fetchBooksStatuses = async () => {
      try {
        // Création de bookIds à partir des livres
        const bookIds = books.map((book) => book.id);

        // Requête pour récupérer les statuts des livres
        const response = await fetch("/api/book/bookStatuses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            bookIds, // Utilisation de bookIds
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

    if (userId) {
      fetchBooksStatuses();
    }
  }, [userId, books]);

  const handleSort = (criteria: "title" | "date" | "note" | "reviews") => {
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
    sortBook(books, sortState);
  }, [sortState, books]);

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
        {books.map((book: BookType) => {
          const bookStatus = booksStatuses[book.id] || null;

          return (
            <li key={book.id} className="mb-4 border-muted border-4 rounded-xl">
              <Link
                href={userId ? `/books/${book.id}` : "/auth/signin"}
                // Créer un ClientLink pour pouvoir mettre le toast si non connecté ???
                //onClick={handleLinkClick}
              >
                <p>
                  Status du livre {book.title} = {bookStatus}{" "}
                </p>
                <BookInfos
                  book={book}
                  userId={userId}
                  bookUserStatus={bookStatus}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default BooksWithSortControls;
