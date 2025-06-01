import { BookStatusEnum, SortStateType } from "@/lib/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";

type BooksSortControlsType = {
  booksStatus: BookStatusEnum;
  sortState: SortStateType;
  setSortState: React.Dispatch<React.SetStateAction<SortStateType>>;
  withDateOption?: boolean;
};

const BooksSortControls = ({
  booksStatus = BookStatusEnum.booksReadList,
  sortState,
  setSortState,
  withDateOption = false,
}: BooksSortControlsType): JSX.Element => {
  const handleSort = (criteria: "title" | "date" | "note" | "reviews") => {
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

  return (
    <div className="flex w-full max-w-lg items-center justify-around rounded-md bg-secondary p-1 sm:gap-1">
      <Button
        onClick={() => handleSort("title")}
        className={`flex w-1/4 gap-1 border border-foreground text-foreground sm:gap-2 ${
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
          className={`flex w-1/4 gap-1 border border-foreground text-foreground sm:gap-2 ${
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
        className={`flex w-1/4 gap-1 border border-foreground text-foreground sm:gap-2 ${
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
  );
};

export default BooksSortControls;
