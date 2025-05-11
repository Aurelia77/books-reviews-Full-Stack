"use client";

import { BookStatusEnum, BookType, SortStateType } from "@/lib/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import BookInfos from "./BookInfos";
import { Button } from "./ui/button";
import { sortBook } from "@/lib/utils";

type BooksSortControlsType = {
  booksStatus: BookStatusEnum;
  //sortState: SortStateType;
  //setSortState: React.Dispatch<React.SetStateAction<SortStateType>>;
  books: BookType[];
  isUserConnected: boolean;
  withDateOption?: boolean;
};

const BooksSortControls = ({
  booksStatus = BookStatusEnum.booksReadList,
  // sortState,
  // setSortState,
  books,
  isUserConnected,
  withDateOption = false,
}: BooksSortControlsType) => {
  // console.log("booksStatus", booksStatus);

  // console.log("*-*-sortState", sortState);
  // console.log("*-*-sortState", sortState[booksStatus]);

  const [sortState, setSortState] = useState<any>({
    [BookStatusEnum.booksReadList]: { criteria: "title", order: "asc" },
  });

  const handleSort = (criteria: "title" | "date" | "note" | "reviews") => {
    //console.log("wwwx criteria", criteria);
    //console.log("wwwx activeTab", activeTab);

    setSortState((prevState: SortStateType) => ({
      ...prevState,
      [booksStatus]: {
        criteria,
        order:
          prevState[booksStatus].criteria === criteria
            ? prevState[booksStatus].order === "asc"
              ? "desc"
              : "asc"
            : "asc",
      },
    }));
  };

  useEffect(() => {
    console.log("*-*- useEffect sortBookTypes sortState = ", sortState);
    sortBook(books, sortState);
  }, [sortState, books]);

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="flex items-center justify-around rounded-md bg-secondary p-1 sm:gap-1 w-full max-w-lg">
        <Button
          onClick={() => handleSort("title")}
          className={`flex w-1/4 gap-1 sm:gap-2 border border-foreground text-foreground ${
            sortState[booksStatus].criteria === "title"
              ? "bg-background/90 hover:bg-background/80"
              : "bg-muted-foreground/20"
          }`}
        >
          Titre
          {sortState[booksStatus].criteria === "title" &&
            (sortState[booksStatus].order === "desc" ? (
              <ChevronUp />
            ) : (
              <ChevronDown />
            ))}
        </Button>
        {booksStatus === BookStatusEnum.booksReadList && withDateOption && (
          <Button
            onClick={() => handleSort("date")}
            className={`flex w-1/4 gap-1 sm:gap-2 border border-foreground text-foreground ${
              sortState[booksStatus].criteria === "date"
                ? "bg-background/90 hover:bg-background/80"
                : "bg-muted-foreground/20"
            }`}
          >
            Date
            {sortState[booksStatus].criteria === "date" &&
              (sortState[booksStatus].order === "asc" ? (
                <ChevronUp />
              ) : (
                <ChevronDown />
              ))}
          </Button>
        )}
        <Button
          onClick={() => handleSort("note")}
          className={`flex w-1/4 gap-1 sm:gap-2 border border-foreground text-foreground ${
            sortState[booksStatus].criteria === "note"
              ? "bg-background/90 hover:bg-background/80"
              : "bg-muted-foreground/20"
          }`}
        >
          Favoris
          {sortState[booksStatus].criteria === "note" &&
            (sortState[booksStatus].order === "asc" ? (
              <ChevronUp />
            ) : (
              <ChevronDown />
            ))}
        </Button>
        <Button
          onClick={() => handleSort("reviews")}
          className={`flex w-1/4 gap-2 border border-foreground text-foreground ${
            sortState[booksStatus].criteria === "reviews"
              ? "bg-background/90 hover:bg-background/80"
              : "bg-muted-foreground/20"
          }`}
        >
          Notés
          {sortState[booksStatus].criteria === "reviews" &&
            (sortState[booksStatus].order === "asc" ? (
              <ChevronUp />
            ) : (
              <ChevronDown />
            ))}
        </Button>
      </div>

      <ul>
        {books.map((book: BookType) => (
          <li key={book.id} className="mb-4 border-muted border-4 rounded-xl">
            {/* Ici on passe le book en props (et pas le bookId comme dans MyBooksPage) */}
            <Link
              href={isUserConnected ? `/books/${book.id}` : "/auth/signin"}
              // Créer un ClientLink pour pouvoir mettre le toast si non connecté
              //onClick={handleLinkClick}
            >
              <BookInfos book={book} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BooksSortControls;
