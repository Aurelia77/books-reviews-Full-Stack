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
    <div className="flex items-center justify-around max-w-md p-1 bg-secondary rounded-md ml-2">
      <Button
        onClick={() => handleSort("title")}
        className={`w-24 flex gap-2 text-white border border-foreground ${
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
          className={`w-24 text-white flex gap-2 border border-foreground ${
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
        className={`w-24 text-white flex gap-2 border border-foreground ${
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
