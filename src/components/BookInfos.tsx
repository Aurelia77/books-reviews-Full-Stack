import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { defaultImage } from "@/constants";
import { getDocsByQueryFirebase } from "@/firebase";
import { cn } from "@/lib/utils";
import { BookType } from "@/types";
import { useState } from "react";
import { Link } from "react-router-dom";
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

  console.log("bookInfo", bookInfo?.bookTitle);

  const fetchBookInfo = async (bookId: string): Promise<BookType | null> => {
    try {
      const books = await getDocsByQueryFirebase("books", "bookId", bookId);
      if (books.length > 0) {
        setBookInfo(books[0]);
        return books[0];
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Error fetching book with bookId: ${bookId}`, error);
      return null;
    }
  };

  const {
    data: bookFromId,
    error,
    isLoading,
  } = useSWR<BookType | null>(bookId, fetchBookInfo);
  // } = useSWR<BookType>(bookId, fetcher);

  console.log("data", bookFromId?.bookTitle);
  console.log("data", bookFromId?.bookImageLink);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!bookInfo) return <div>No book information available.</div>;

  return (
    bookInfo && (
      <Link
        to={`/books/${bookInfo.bookId}`}
        state={{ bookInfo, friendsWhoReadBook }}
      >
        <Card className="mb-3">
          <div
            className={cn(
              "flex gap-4 shadow-xl shadow-primary/30 p-2 bg-ring/55 text-foreground",
              friendsWhoReadBook.length > 0 && "bg-ring/80"
            )}
          >
            <img
              src={bookInfo.bookImageLink || defaultImage}
              onError={(e) => (e.currentTarget.src = defaultImage)}
              className="w-32 rounded-sm"
              alt="Image de couverture du livre"
            />
            <CardHeader>
              <CardTitle>{bookInfo.bookTitle}</CardTitle>
              <CardDescription>{bookInfo.bookAuthor}</CardDescription>
            </CardHeader>
            {/* <CardContent>
          <p>Card Content</p>
        </CardContent> */}
          </div>
          {friendsWhoReadBook.length > 0 && (
            <CardFooter>
              <div className="mt-6 flex flex-row gap-5">
                <p className="font-semibold">Dans liste de :</p>

                {friendsWhoReadBook.map((friend, index) => (
                  <p key={index}>{friend}</p>
                ))}
              </div>
            </CardFooter>
          )}
        </Card>
      </Link>
    )
  );
};

export default BookInfos;
