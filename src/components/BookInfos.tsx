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
import {
  getDocsByQueryFirebase,
  getUsersWhoReadBookFirebase,
} from "@/firebase";
import { BookType } from "@/types";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useSWR from "swr";
import BookSkeleton from "./BookSkeleton";
import FeedbackMessage from "./FeedbackMessage";

// Soit dans BooksSearchPage => on passe un objet book en props
// Soit dans MyReadBooksPage => on passe un bookId
type BookInfosProps =
  | { book: BookType; bookId?: never }
  | { book?: never; bookId: string };

const BookInfos = ({
  book,
  bookId,
}: //friendsWhoReadBook,
BookInfosProps): JSX.Element => {
  const [bookInfos, setBookInfos] = useState<BookType | null>(book || null);
  const [friendsWhoReadBook, setFriendsWhoReadBook] = useState<string[]>([]);
  //console.log("friendsWhoReadBook", bookInfos?.bookTitle, friendsWhoReadBook);

  // console.log("bookInfo", bookInfo?.bookTitle);
  // console.log("bookInfo", bookInfo?.bookAuthor);

  // VOIR !!!!!!!!!! avec hook Preso !!!!!!
  /////////////////////////
  //const { data: bookFromId, error, isLoading } = useBookId(bookId);

  // SI BOOKID PASSE EN PROPS
  // On recupère les infos du livre depuis la BDD grâce à son bookId
  const fetchBookInfo = async (bookId: string): Promise<BookType | null> => {
    // throw new Error(
    //   "Erreur simulée !"
    // );

    return getDocsByQueryFirebase<BookType>("books", "bookId", bookId)
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
      setBookInfos(bookFromId);
    }
  }, [bookFromId]);

  useEffect(() => {
    if (bookInfos)
      getUsersWhoReadBookFirebase(bookInfos.bookId).then((users) => {
        //console.log("FRIENDS", users);
        const friends = users.map((user) => user.username);
        setFriendsWhoReadBook(friends);
      });
  }, [bookInfos]);

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
      {isLoading ? (
        <BookSkeleton />
      ) : error ? (
        <FeedbackMessage message={message} type="error" />
      ) : (
        bookInfos && (
          <Link
            to={`/books/${bookInfos.bookId}`}
            state={{ bookInfos, friendsWhoReadBook }}
          >
            {/* <Link to={`/books/${bookInfos.bookId}`} state={bookInfos.bookIsFromAPI}> */}
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
                {bookInfos.bookLanguage}
              </CardDescription>
              <div className="flex items-start gap-5 p-5 pt-10 shadow-md shadow-secondary/60">
                <img
                  src={bookInfos.bookImageLink || defaultImage}
                  onError={(e) => (e.currentTarget.src = defaultImage)}
                  className="w-32 rounded-sm border border-border object-contain shadow-md shadow-foreground/70"
                  alt={`Image de couverture du livre ${bookInfos?.bookTitle}`}
                />
                <CardHeader className="gap-3 overflow-hidden">
                  <CardTitle className="line-clamp-4">
                    {bookInfos.bookTitle}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-muted">
                    {bookInfos.bookAuthor}
                  </CardDescription>
                  <CardDescription className="overflow-hidden">
                    {bookInfos.bookCategories &&
                      bookInfos.bookCategories.map((cat, index) => (
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
        )
      )}
    </div>
  );
};

export default BookInfos;
