import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { defaultImage } from "@/constants";
import { getDocsByQueryFirebase } from "@/firebase";
import { BookType } from "@/types";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useSWR from "swr";
import FeedbackMessage from "./FeedbackMessage";
import { Skeleton } from "./ui/skeleton";

type BookInfosProps =
  | { book: BookType; bookId?: never; friendsWhoReadBook: string[] }
  | { book?: never; bookId: string; friendsWhoReadBook: string[] };

const BookInfos = ({
  book,
  bookId,
  friendsWhoReadBook,
}: BookInfosProps): JSX.Element => {
  const [bookInfo, setBookInfo] = useState<BookType | undefined>(
    book || undefined
  );

  //console.log("bookInfo", bookInfo?.bookTitle);

  // VOIR !!!!!!!!!! avec hook Preso !!!!!!
  /////////////////////////
  //const { data: bookFromId, error, isLoading } = useBookId(bookId);

  const fetchBookInfo = async (bookId: string): Promise<BookType | null> => {
    // throw new Error(
    //   "Erreur simulée !"
    // );

    return getDocsByQueryFirebase("books", "bookId", bookId)
      .then((books) => {
        if (books.length > 0) {
          return books[0];
        } else {
          return null;
        }
      })
      .catch((error) => {
        console.error(`Error fetching book with bookId: ${bookId}`, error);
        return null;
      });
  };

  const {
    data: bookFromId,
    error,
    isLoading,
  } = useSWR<BookType | null>(bookId, fetchBookInfo);
  // } = useSWR<BookType>(bookId, fetcher);

  const message = `Un problème est survenu dans la récupération du livre => ${error?.message}`;

  useEffect(() => {
    if (bookFromId) {
      setBookInfo(bookFromId);
    }
  }, [bookFromId]);

  // {
  //   error && (
  //     <div className="text-pink-300">
  //       Un problème est survenu dans la récupération du livre : {error.message}
  //     </div>
  //   );
  // }

  //return isLoading ? <p>coucou</p> : <p>aaa</p>;
  return (
    <div>
      {/* {true && ( */}
      {isLoading && (
        <div>
          {/* <ClipLoader
            className="m-auto my-8"
            color="#09f"
            loading={true}
            size={50}
          /> */}
          <div className="flex gap-4 p-5 pt-10">
            <Skeleton className="h-48 w-32 rounded-md" />
            <div className="grow space-y-7">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-2 w-[100px]" />
              <Skeleton className="h-2 w-[80px]" />
            </div>
          </div>
        </div>
      )}
      {error && <FeedbackMessage message={message} type="error" />}
      {bookInfo && (
        <Link
          to={`/books/${bookInfo.bookId}`}
          state={{ bookInfo, friendsWhoReadBook }}
        >
          <Card className="relative mb-4">
            {friendsWhoReadBook.length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                    //className="relative"
                    >
                      <Star
                        size={48}
                        strokeWidth={3}
                        className="absolute left-[3.8rem] top-3 drop-shadow-sm text-stroke-lg"
                        color="white"
                      />
                      <Star
                        className="absolute left-16 top-[0.95rem] drop-shadow-sm text-stroke-lg"
                        size={42}
                        color="gray"
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-destructive-foreground">
                    <p>Dans la liste d'un ou plusieurs de vos amis</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <CardDescription className="absolute right-2 top-2 rounded-full bg-secondary/60 px-3 py-1 text-secondary-foreground shadow-sm shadow-foreground">
              {bookInfo.bookLanguage}
            </CardDescription>
            <div className="flex items-start gap-5 p-5 pt-10 shadow-md shadow-secondary/60">
              <img
                src={bookInfo.bookImageLink || defaultImage}
                onError={(e) => (e.currentTarget.src = defaultImage)}
                className="w-32 rounded-sm border border-border object-contain shadow-md shadow-foreground/70"
                alt={`Image de couverture du livre ${bookInfo?.bookTitle}`}
              />
              <CardHeader className="gap-3 overflow-hidden">
                <CardTitle className="line-clamp-4">
                  {bookInfo.bookTitle}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-muted">
                  {bookInfo.bookAuthor}
                </CardDescription>
                <CardDescription className="overflow-hidden">
                  {bookInfo.bookCategories &&
                    bookInfo.bookCategories.map((cat, index) => (
                      <span key={index}>{index > 0 ? ` / ${cat}` : cat}</span>
                    ))}
                </CardDescription>
              </CardHeader>
            </div>
            {friendsWhoReadBook.length > 0 && (
              <CardFooter
                // className={
                //   friendsWhoReadBook.length > 0
                //     ? "border-4 border-secondary bg-secondary/50"
                //     : ""
                // }
                className="bg-gray-500/40"
              >
                <div className="flex flex-row gap-2 ">
                  <p className="font-semibold">Dans liste de :</p>

                  {friendsWhoReadBook.map((friend, index) => (
                    <p key={index} className="font-semibold text-muted">
                      {friend}
                    </p>
                  ))}
                </div>
              </CardFooter>
            )}
          </Card>
        </Link>
      )}
    </div>
  );
};

export default BookInfos;
