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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DEFAULT_BOOK_IMAGE,
  GOOGLE_BOOKS_API_URL,
  NO_DESCRIPTION,
} from "@/constants";
import {
  getDocsByQueryFirebase,
  getUsersWhoReadBookCommentsAndNotesFirebase,
} from "@/firebase/firestore";
import useUserStore from "@/hooks/useUserStore";
import { BookAPIType, BookType, UserBookInfoType } from "@/types";
import { cleanDescription } from "@/utils";
import { Quote } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useSWR, { useSWRConfig } from "swr";

// const bookFormSchema = z.object({
//   bookStatus: z.nativeEnum(BookStatusEnum),
//   year: z
//     .number()
//     .int()
//     .min(1900, { message: "L'année doit être suppérieur à 1900" })
//     .max(currentYear, {
//       message: "Impossible d'ajouter une année dans le future !",
//     })
//     .optional(),
//   note: z.number().int().min(0).max(5).optional(),
//   commentaires: z.string(),
// });

const fetchBookInfoDB = async (bookId: string): Promise<BookType | null> => {
  // throw new Error(
  //   "Erreur simulée !"
  // );

  console.log("zzz FETCHING-1 BookInfos", bookId);

  return getDocsByQueryFirebase<BookType>("books", "id", bookId)
    .then((books: BookType[]) => {
      console.log(
        "zzz FETCHING-1 books (après getDocsByQueryFirebase (.then))",
        bookId,
        books[0]
      );
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
  const { mutate } = useSWRConfig();

  const bookId = useParams().bookId;
  console.log("bookId", bookId);

  const { currentUser } = useUserStore();

  console.log("zzz currentUser", currentUser?.uid);

  const [bookInfos, setBookInfos] = useState<BookType>();
  console.log("zzz bookInfos", bookInfos);
  //console.log("zzz bookInfos rating", bookInfos?.rating);

  //const [bookInMyBooks, setBookInMyBooks] = useState<BookStatusEnum | "">(""); //////////////////////////////////////////////////
  //  const [bookInMyBooks, setBookInMyBooks] = useState<BookStatusEnum>();
  const [isBookInDB, setIsBookInDB] = useState<boolean>(true);
  console.log("zzz isBookInDB", isBookInDB);

  const handleUpdate = () => {
    console.log("handleUpdate BOOKDETAIL");
    // To rerender this page when the user updates the component AddOrUpdateBookOrBookStatus
    mutate(bookId);
  };

  // useEffect(() => {
  //   const fetchUpdatedBookInfo = async () => {
  //     const updatedBookInfos = await fetchBookInfoDB(bookId!);
  //     setBookInfos(updatedBookInfos);
  //   };

  //   fetchUpdatedBookInfo();
  // }, [refreshKey]);

  // 1-DEBUT==================================FAIRE HOOK PERSO !!!
  // 1 - Fonction appelée en 1er : va chercher les info du livre en fonction de son id (si dans notre BDD)
  //  FETCHER mis en dehors

  const {
    data: fetchedBookFromId,
    error,
    isLoading,
  } = useSWR<BookType | null>(currentUser ? bookId : null, fetchBookInfoDB);

  console.log(
    "zzz after FETCHING-1 fetchedBookFromId n'est plus undefined !",
    fetchedBookFromId?.title
  );

  //////// A SUPPRIMER !!!!!!!!!!!!!!!!!
  useEffect(() => {
    console.log(
      "USEFFECT /*/*/*/*/ zzz after FETCHING-1 fetchedBookFromId n'est plus undefined !",
      fetchedBookFromId
    );
  }, [fetchedBookFromId]);

  // ici on utilise une constante et pas un state car les message ne change pas et s'affiche seulement si useSWR renvoie une erreur
  const message = `Un problème est survenu dans la récupération du livre => ${error?.message}`; // VOIR !!!!

  useEffect(() => {
    console.log(
      "USEEFFECT-1 zzz currentUser",
      currentUser?.uid,
      fetchedBookFromId
    );

    if (fetchedBookFromId === null) {
      setIsBookInDB(false);
    } else {
      setBookInfos(fetchedBookFromId);
    }

    // if (fetchedBookFromId !== null) {
    //   // bien mettre la condition !== null sinon peut causer des pbms (compliqué, j'ai pas tt compris)
    //   console.log(
    //     "fetchedBookFromId OUI zzz bookFromId after FETCHING useEffect",
    //     fetchedBookFromId
    //   );
    //   setBookInfos(fetchedBookFromId);
    // } else {
    //   console.log(
    //     "fetchedBookFromId NON zzz bookFromId after FETCHING useEffect",
    //     fetchedBookFromId
    //   );
    //   if (currentUser) {
    //     console.log("zzz currentUser OUI", currentUser?.uid);
    //     setIsBookInDB(false);
    //   } else {
    //     console.log("zzz currentUser NON");
    //   }
    // }
  }, [fetchedBookFromId, currentUser]);

  // 1-FIN============================FAIRE HOOK PERSO !!!

  // 3-DEBUT============================FAIRE HOOK PERSO !!!
  const fetchAPIBooks = (booksApiUrl: string): Promise<BookType> => {
    console.log("zzz FETCHING-2 booksApiUrl", booksApiUrl);

    //throw new Error("Erreur simulée !");
    return (
      fetch(booksApiUrl)
        //.then((res) => res.json())    // idem sans TS
        .then((res: Response): Promise<BookAPIType> => res.json())
        /// voir si je px retourner avant (res.json() ????????)
        .then((data) => {
          console.log("DATA", data);
          const bookFromAPI: BookType = {
            id: data.id,
            title: data.volumeInfo.title,
            authors: data.volumeInfo.authors, // ?? "Auteur inconnu",
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
          console.log("bookFromAPI", bookFromAPI.title);
          return bookFromAPI;
        })
        .catch((error) => {
          console.error("Error fetching books:", error);
          throw error;
        })
    );
  };

  // const [booksApiUrl, setBooksApiUrl] = useState(`${GOOGLE_BOOKS_API_URL}?q=${bookInfos.}`);
  //`${GOOGLE_BOOKS_API_URL}?q=${queryApi}&maxResults=${MAX_RESULTS}`;

  const {
    data: fetchedBookFromApi,
    error: apiBooksError,
    isLoading: apiBooksIsLoading,
  } = useSWR<BookType>(
    isBookInDB === false ? `${GOOGLE_BOOKS_API_URL}/${bookId}` : null,
    fetchAPIBooks
  );
  // 3-FIN============================FAIRE HOOK PERSO !!!

  useEffect(() => {
    console.log("zzz USEEFFECT-2 ");
    if (fetchedBookFromApi) {
      console.log("333 USEEFFECT apiBooks", fetchedBookFromApi?.title);
      setBookInfos(fetchedBookFromApi);
    }
  }, [fetchedBookFromApi]);

  console.log("333 data bookFromApi", fetchedBookFromApi?.title);

  const addLineBreaks = (description: string) => {
    return (
      // Ajoute un saut de ligne après chaque : ".", "!", ou "?" suivi d'une lettre majuscule => pour plus de lisibilité
      description.replace(/([.!?])\s*(?=[A-Z])/g, "$1\n")
    );
  };

  const [
    usersWhoReadBookCommentsAndNotes,
    setUsersWhoReadBookCommentsAndNotes,
  ] = useState<UserBookInfoType[]>([]);

  console.log(
    "usersWhoReadBookCommentsAndNotes",
    usersWhoReadBookCommentsAndNotes
  );

  const fillUserCommentsTab = () => {
    if (bookInfos)
      getUsersWhoReadBookCommentsAndNotesFirebase(bookInfos.id).then(
        (commentsAndNotes) => {
          console.log("comments", commentsAndNotes);
          setUsersWhoReadBookCommentsAndNotes(commentsAndNotes);
        }
      );
  };

  return (
    <div className="relative min-h-screen max-w-4xl md:m-auto md:mt-8">
      {isBookInDB ? (
        <p className="bg-cyan-200 p-4">BDD</p>
      ) : (
        <p className="bg-pink-300 p-4">API</p>
      )}
      {isLoading || apiBooksIsLoading ? (
        <BookSkeleton />
      ) : error || apiBooksError ? (
        <FeedbackMessage message={message} type="error" />
      ) : (
        bookInfos && (
          <Card className="relative m-4">
            <CardDescription className="absolute right-2 top-2 rounded-full bg-secondary/60 px-3 py-1 text-secondary-foreground shadow-sm shadow-foreground">
              {bookInfos.language}
            </CardDescription>
            <div className="flex items-start gap-5 p-5 py-10 shadow-xl shadow-primary/30">
              <img
                src={bookInfos.imageLink || DEFAULT_BOOK_IMAGE}
                onError={(e) => (e.currentTarget.src = DEFAULT_BOOK_IMAGE)}
                className="w-32 rounded-sm border border-border  object-contain shadow-md shadow-foreground/70"
                alt={`Image de couverture du livre ${bookInfos?.title}`}
              />
              <CardHeader className="flex flex-col justify-between overflow-hidden gap-4">
                <CardTitle>{bookInfos?.title}</CardTitle>
                <div className="flex gap-2 flex-wrap">
                  {bookInfos?.authors &&
                    bookInfos.authors.map((author, index) => (
                      <Link
                        // path="/mybooks/searchbooks/authors/:author"
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
                  <div>
                    <AverageBookRating bookInfos={bookInfos} />
                    <Dialog
                    // open={isDialogOpen} onOpenChange={setIsDialogOpen}
                    >
                      {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}> */}
                      {/* {bookInMyBooks === "" ? ( */}

                      <DialogTrigger asChild className="flex justify-center">
                        <Button onClick={fillUserCommentsTab}>
                          Commentaires et notes des membres
                        </Button>
                        {/* absolute -top-1 left-1/4  */}
                        {/* <Button
                        onClick={() =>
                          form.reset({
                            bookStatus: BookStatusEnum.booksReadList,
                            year: currentYear,
                            month: 0,
                            userNote: 0,
                            userComments: "",
                          })
                        }
                        className="m-auto mb-6 h-12 w-1/2 border border-border bg-secondary/60 shadow-md shadow-foreground/70"
                      > */}
                        {/* </Button> */}
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        {/* {userId ? ( */}
                        <>
                          <DialogHeader>
                            {/* {bookInMyBooks === "" ? ( */}
                            <DialogTitle>{bookInfos?.title}</DialogTitle>
                            {/* ) : (
                            <DialogTitle>MODIFIER MES INFOS</DialogTitle>
                          )} */}
                          </DialogHeader>
                          <DialogDescription></DialogDescription>
                          {usersWhoReadBookCommentsAndNotes.map(
                            (userCommentsAndNote) => {
                              return (
                                <div
                                  key={userCommentsAndNote.userId}
                                  className="m-1 rounded-md bg-primary/50 p-1"
                                >
                                  <Link
                                    to={`/account/${userCommentsAndNote.userId}`}
                                  >
                                    <DialogDescription className="flex">
                                      Membre :
                                      <p className="underline">
                                        &nbsp;{userCommentsAndNote.userName}
                                      </p>
                                    </DialogDescription>
                                  </Link>
                                  <DialogDescription>
                                    Commentaires :{" "}
                                    {userCommentsAndNote.userComments ||
                                      " Aucun commentaire"}
                                  </DialogDescription>
                                  <DialogDescription>
                                    Note :{" "}
                                    {userCommentsAndNote.userNote ||
                                      " Aucune note"}
                                  </DialogDescription>
                                </div>
                              );
                              <p>{userCommentsAndNote.userNote} </p>;
                            }
                          )}
                          <div className="grid gap-4 py-4"></div>
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

            <CardContent className="relative bg-secondary/30 p-6 shadow-md shadow-primary/30">
              {currentUser?.uid && (
                <AddOrUpdateBookOrBookStatus
                  userId={currentUser?.uid}
                  bookInfos={bookInfos}
                  onUpdate={handleUpdate}
                />
              )}
              {bookInfos.description ? (
                //   <CardDescription className="flex gap-2">
                //   <Quote />
                //   <p className="line-clamp-3 text-foreground max-w-[90%]">
                //
                //     {removeOrRemplaceHtmlTags(bookInfos.description)}
                //   </p>
                // </CardDescription>
                <div className="relative flex gap-3">
                  <Quote className="absolute -top-1" />
                  <p
                    style={{ whiteSpace: "pre-line" }}
                    className="max-w-[90%] text-foreground"
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
