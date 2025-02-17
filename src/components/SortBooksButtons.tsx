import { BookStatusEnum, SortStateType } from "@/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";

type SortBooksButtonsType = {
  booksStatus: BookStatusEnum;
  sortState: {
    [key in BookStatusEnum]: SortStateType;
  };
  handleSort: (criteria: "title" | "date" | "note") => void;
};

const SortBooksButtons = ({
  booksStatus,
  sortState,
  handleSort,
}: SortBooksButtonsType): JSX.Element => {
  console.log("booksStatus", booksStatus);
  return (
    <div className="ml-2 flex max-w-md items-center justify-around rounded-md bg-secondary p-1">
      <Button
        onClick={() => handleSort("title")}
        className={`flex w-24 gap-2 border border-foreground text-white ${
          sortState[booksStatus].criteria === "title"
            ? "bg-background/90 hover:bg-background/80"
            : "bg-muted-foreground/50"
        }`}
      >
        Titre
        {sortState[booksStatus].criteria === "title" &&
          (sortState[booksStatus].order === "asc" ? (
            <ChevronUp />
          ) : (
            <ChevronDown />
          ))}
      </Button>
      {booksStatus === BookStatusEnum.booksReadList && (
        <Button
          onClick={() => handleSort("date")}
          className={`flex w-24 gap-2 border border-foreground text-white ${
            sortState[booksStatus].criteria === "date"
              ? "bg-background/90 hover:bg-background/80"
              : "bg-muted-foreground/50"
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
        className={`flex w-24 gap-2 border border-foreground text-white ${
          sortState[booksStatus].criteria === "note"
            ? "bg-background/90 hover:bg-background/80"
            : "bg-muted-foreground/50"
        }`}
      >
        Note
        {sortState[booksStatus].criteria === "note" &&
          (sortState[booksStatus].order === "asc" ? (
            <ChevronUp />
          ) : (
            <ChevronDown />
          ))}
      </Button>
    </div>
  );
};

export default SortBooksButtons;
