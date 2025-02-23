import { BookStatusEnum, SortStateType } from "@/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";

type BooksSortControls = {
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
}: BooksSortControls): JSX.Element => {
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
          (sortState[booksStatus].order === "desc" ? (
            <ChevronUp />
          ) : (
            <ChevronDown />
          ))}
      </Button>
      {booksStatus === BookStatusEnum.booksReadList && withDateOption && (
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
      <Button
        onClick={() => handleSort("reviews")}
        className={`flex w-24 gap-2 border border-foreground text-white ${
          sortState[booksStatus].criteria === "reviews"
            ? "bg-background/90 hover:bg-background/80"
            : "bg-muted-foreground/50"
        }`}
      >
        Avis
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
