import { BookStatusEnum, SortStateType } from "@/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";

type BooksSortControlsType = {
  booksStatus: BookStatusEnum;
  sortState: any;
  // {
  //   [key in BookStatusEnum]: SortStateType;
  // };
  setSortState: any;
  // React.Dispatch<
  //   React.SetStateAction<{ [key in BookStatusEnum]: SortStateType }>
  // >;
  withDateOption?: boolean;
};

const BooksSortControls = ({
  booksStatus = BookStatusEnum.booksReadList,
  sortState,
  setSortState,
  withDateOption = false,
}: BooksSortControlsType): JSX.Element => {
  console.log("booksStatus", booksStatus);

  console.log("*-*-sortState", sortState);
  console.log("*-*-sortState", sortState[booksStatus]);

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

  return (
    <div className="flex items-center justify-around rounded-md bg-secondary p-1 sm:gap-1 w-full max-w-lg">
      <Button
        onClick={() => handleSort("title")}
        className={`flex w-[25%] gap-1 sm:gap-2 border border-foreground text-white ${
          sortState[booksStatus].criteria === "title"
            ? "bg-background/90 hover:bg-background/80"
            : "bg-muted-foreground/50"
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
          className={`flex w-[25%] gap-1 sm:gap-2 border border-foreground text-white ${
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
        className={`flex w-[25%] gap-1 sm:gap-2 border border-foreground text-white ${
          sortState[booksStatus].criteria === "note"
            ? "bg-background/90 hover:bg-background/80"
            : "bg-muted-foreground/50"
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
        className={`flex w-[25%] gap-2 border border-foreground text-white ${
          sortState[booksStatus].criteria === "reviews"
            ? "bg-background/90 hover:bg-background/80"
            : "bg-muted-foreground/50"
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
