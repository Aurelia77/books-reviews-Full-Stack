import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { defaultImage } from "@/constants";
import { getDocsByQueryFirebase } from "@/firebase";
import { BookType } from "@/types";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import useSWR from "swr";

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
    //   "Erreur simulée lors de la récupération des informations du livre"
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

  useEffect(() => {
    if (bookFromId) {
      setBookInfo(bookFromId);
    }
  }, [bookFromId]);

  return isLoading || !bookInfo ? (
    <ClipLoader className="m-auto my-8" color="#09f" loading={true} size={50} />
  ) : (
    bookInfo && (
      <div>
        <Link
          to={`/books/${bookInfo.bookId}`}
          state={{ bookInfo, friendsWhoReadBook }}
        >
          <Card className="relative mb-4">
            {friendsWhoReadBook.length > 0 && (
              <div className="relative">
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
            )}
            <CardDescription className="absolute right-2 top-2 rounded-full bg-secondary/60 px-3 py-1 text-secondary-foreground shadow-sm shadow-foreground">
              {bookInfo.bookLanguage}
            </CardDescription>
            <div className="flex items-start gap-5 p-5 pt-10 shadow-xl shadow-primary/30">
              <img
                src={bookInfo.bookImageLink || defaultImage}
                onError={(e) => (e.currentTarget.src = defaultImage)}
                className="w-32 rounded-sm object-contain"
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
              >
                <div className="flex flex-row gap-2">
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
        {error && (
          <div className="text-pink-300">
            Un problème est survenu dans la récupération du livre :{" "}
            {error.message}
          </div>
        )}
      </div>
    )
  );
};

export default BookInfos;
