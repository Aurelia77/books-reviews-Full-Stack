import AddOrUpdateBookOrBookStatus from "@/components/AddOrUpdateBookOrBookStatus";
import AverageBookRating from "@/components/AverageBookRating";
import FeedbackMessage from "@/components/FeedbackMessage";
import FriendsWhoReadBook from "@/components/FriendsWhoReadBook";
import BookSkeleton from "@/components/skeletons/BookSkeleton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UserReview from "@/components/UserReview";
import {
  getDocsByQueryFirebase,
  getUsersWhoReadBookCommentsAndNotesFirebase,
} from "@/firebase/firestore";
import useUserStore from "@/hooks/useUserStore";
import {
  DEFAULT_BOOK_IMAGE,
  GOOGLE_BOOKS_API_URL,
  NO_DESCRIPTION,
} from "@/lib/constants";
import { BookAPIType, BookType, UserBookInfoType } from "@/lib/types";
import { cleanDescription } from "@/utils";
import { Quote } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useSWR, { useSWRConfig } from "swr";

const fetchBookInfoDB = async (bookId: string): Promise<BookType | null> => {
  return getDocsByQueryFirebase<BookType>("books", "id", bookId)
    .then((books: BookType[]) => {
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

const BookDetailPage = (): JSX.Element => {
  const [bookInfos, setBookInfos] = useState<BookType>();
  const [isBookInDB, setIsBookInDB] = useState<boolean>(true);
  const [
    usersWhoReadBookCommentsAndNotes,
    setUsersWhoReadBookCommentsAndNotes,
  ] = useState<UserBookInfoType[]>([]);

  const bookId = useParams().bookId;

  const { mutate } = useSWRConfig();

  const { currentUser } = useUserStore();

  const handleUpdate = () => {
    // To rerender this page when the user updates the component AddOrUpdateBookOrBookStatus
    mutate(bookId);
  };

  // 1-BEGINING==================================
  // Function called first: fetches the book info based on its id (if present in our DB)
  const {
    data: fetchedBookFromId,
    error,
    isLoading,
  } = useSWR<BookType | null>(currentUser ? bookId : null, fetchBookInfoDB);

  const message = `Un problème est survenu dans la récupération du livre => ${error?.message}`;

  useEffect(() => {
    if (fetchedBookFromId === null) {
      setIsBookInDB(false);
    } else {
      setBookInfos(fetchedBookFromId);
    }
  }, [fetchedBookFromId, currentUser]);

  // 1-END============================

  // 2-BEGINING============================
  const fetchAPIBooks = (booksApiUrl: string): Promise<BookType> => {
    return fetch(booksApiUrl)
      .then((res: Response): Promise<BookAPIType> => res.json())
      .then((data) => {
        const bookFromAPI: BookType = {
          id: data.id,
          title: data.volumeInfo.title,
          authors: data.volumeInfo.authors,
          description: data.volumeInfo.description,
          categories: data.volumeInfo.categories,
          pageCount: data.volumeInfo.pageCount,
          publishedDate: data.volumeInfo.publishedDate,
          publisher: data.volumeInfo.publisher,
          imageLink: data.volumeInfo.imageLinks?.thumbnail,
          language: data.volumeInfo.language,
          isFromAPI: true,
          rating: {
            totalRating: 0,
            count: 0,
          },
        };
        return bookFromAPI;
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
        throw error;
      });
  };

  const {
    data: fetchedBookFromApi,
    error: apiBooksError,
    isLoading: apiBooksIsLoading,
  } = useSWR<BookType>(
    isBookInDB === false ? `${GOOGLE_BOOKS_API_URL}/${bookId}` : null,
    fetchAPIBooks
  );
  // 2-END============================

  useEffect(() => {
    if (fetchedBookFromApi) {
      setBookInfos(fetchedBookFromApi);
    }
  }, [fetchedBookFromApi]);

  const addLineBreaks = (description: string) => {
    return (
      // Add a line break after each ".", "!", or "?" followed by an uppercase letter => for better readability
      description.replace(/([.!?])\s*(?=[A-Z])/g, "$1\n")
    );
  };

  const fillUserCommentsTab = () => {
    if (bookInfos)
      getUsersWhoReadBookCommentsAndNotesFirebase(bookInfos.id).then(
        (commentsAndNotes) => {
          setUsersWhoReadBookCommentsAndNotes(commentsAndNotes);
        }
      );
  };

  return (
    <div className="relative min-h-screen max-w-4xl md:m-auto md:mt-8">
      {isLoading || apiBooksIsLoading ? (
        <BookSkeleton />
      ) : error || apiBooksError ? (
        <FeedbackMessage message={message} type="error" />
      ) : (
        bookInfos && (
          <Card className="relative m-4">
            <CardDescription className="bg-secondary/60 text-secondary-foreground shadow-foreground absolute right-2 top-2 rounded-full px-3 py-1 shadow-sm">
              {bookInfos.language}
            </CardDescription>
            <div className="shadow-primary/30 flex items-start gap-5 p-5 py-10 shadow-xl">
              <img
                src={bookInfos.imageLink || DEFAULT_BOOK_IMAGE}
                onError={(e) => (e.currentTarget.src = DEFAULT_BOOK_IMAGE)}
                className="border-border shadow-foreground/70 w-32 rounded-sm border object-contain  shadow-md sm:w-40 md:w-48"
                alt={`Image de couverture du livre ${bookInfos?.title}`}
              />
              <CardHeader className="flex flex-col justify-between gap-4 overflow-hidden">
                <CardTitle>{bookInfos?.title}</CardTitle>
                <div className="flex flex-wrap gap-2">
                  {bookInfos?.authors &&
                    bookInfos.authors.map((author, index) => (
                      <Link
                        to={`/mybooks/searchbooks/authors/${author}`}
                        className="text-foreground underline"
                        key={index}
                      >
                        <CardDescription className="text-muted">
                          {author}
                        </CardDescription>
                      </Link>
                    ))}
                </div>
                <div className="grid grid-cols-2 gap-x-8">
                  {bookInfos?.categories?.map((cat: string, index: number) => (
                    <CardDescription key={index}>{cat}</CardDescription>
                  ))}
                </div>
                {bookInfos.rating?.count > 0 ? (
                  <div className="flex flex-col gap-2">
                    <AverageBookRating bookInfos={bookInfos} />
                    <Dialog>
                      <DialogTrigger asChild className="flex justify-center">
                        <Button onClick={fillUserCommentsTab}>
                          Avis des membres
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <>
                          <DialogHeader>
                            <DialogTitle>{bookInfos?.title}</DialogTitle>
                          </DialogHeader>
                          <ul>
                            {usersWhoReadBookCommentsAndNotes.map(
                              (userCommentsAndNote) => {
                                return (
                                  <li
                                    key={userCommentsAndNote.userId}
                                    className="bg-primary/50 m-1 rounded-md p-1"
                                  >
                                    <UserReview
                                      userCommentsAndNote={userCommentsAndNote}
                                    />
                                  </li>
                                );
                              }
                            )}
                          </ul>
                        </>
                      </DialogContent>
                    </Dialog>
                  </div>
                ) : (
                  <p className="italic">
                    Les membres n'ont pas encore noté ce livre.
                  </p>
                )}
              </CardHeader>
            </div>
            <FriendsWhoReadBook bookId={bookInfos.id} />

            <CardContent className="bg-secondary/30 shadow-primary/30 relative p-6 shadow-md">
              {currentUser?.uid && (
                <AddOrUpdateBookOrBookStatus
                  userId={currentUser?.uid}
                  bookInfos={bookInfos}
                  onUpdate={handleUpdate}
                />
              )}
              {bookInfos.description ? (
                <div className="relative flex gap-3">
                  <Quote className="absolute -top-1" />
                  <p
                    style={{ whiteSpace: "pre-line" }}
                    className="text-foreground max-w-[90%]"
                  >
                    &ensp;&ensp;&ensp;&ensp;
                    {cleanDescription(addLineBreaks(bookInfos.description))}
                  </p>
                  &ensp;&ensp;&ensp;&ensp;
                  <Quote className="absolute bottom-0 right-0 rotate-180" />
                </div>
              ) : (
                <p className="italic">{NO_DESCRIPTION} </p>
              )}
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
};

export default BookDetailPage;
