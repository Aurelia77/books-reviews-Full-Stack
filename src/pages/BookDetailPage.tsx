import AddOrUpdateBookOrBookStatus from "@/components/AddOrUpdateBookOrBookStatus";
import AverageBookRating from "@/components/AverageBookRating";
import FeedbackMessage from "@/components/FeedbackMessage";
import FriendsWhoReadBook from "@/components/FriendsWhoReadBook";
import BookSkeleton from "@/components/skeletons/BookSkeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DEFAULT_BOOK_IMAGE,
  GOOGLE_BOOKS_API_URL,
  NO_DESCRIPTION,
} from "@/constants";
import { getDocsByQueryFirebase } from "@/firebase/firestore";
import useUserStore from "@/hooks/useUserStore";
import { BookAPIType, BookType } from "@/types";
import { cleanDescription } from "@/utils";
import { Quote } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

const BookDetailPage = (): JSX.Element => {
  const { mutate } = useSWRConfig();

  const bookId = useParams().bookId;
  console.log("bookId", bookId);

  const { currentUser } = useUserStore();

  console.log("zzz currentUser", currentUser?.uid);

  const [bookInfos, setBookInfos] = useState<BookType>();
  console.log("zzz bookInfos", bookInfos);
  console.log("zzz bookInfos rating", bookInfos?.rating);

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

  const {
    data: fetchedBookFromId,
    error,
    isLoading,
  } = useSWR<BookType | null>(
    // currentUser?.uid && bookId ? `book-${bookId}-${currentUser.uid}` : null,
    // () => fetchBookInfoDB(bookId!)
    // avec ces 2 lignes ci-dessous le fetcher ne s'éxecutait pas qd currentUser se mettait à jour (je comprends pas pk car l'autre useSWR de cette page s'éxecute bien qd isBookInDB change) => donc copilot m'a conseillé la ligne ci-dessus : ça marche !
    bookId,
    currentUser?.uid ? fetchBookInfoDB : null //////////////// A VOIR si besoin d'être connecté et sinon, erreur ???
  );

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
            author: data.volumeInfo?.authors?.[0] ?? "Auteur inconnu",
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

            <div className="flex gap-5 p-5 py-10 shadow-xl shadow-primary/30">
              <img
                src={bookInfos.imageLink || DEFAULT_BOOK_IMAGE}
                onError={(e) => (e.currentTarget.src = DEFAULT_BOOK_IMAGE)}
                className="w-32 rounded-sm border border-border object-contain shadow-md shadow-foreground/70"
                alt={`Image de couverture du livre ${bookInfos?.title}`}
              />
              <CardHeader className="flex flex-col justify-between overflow-hidden">
                <CardTitle>{bookInfos?.title}</CardTitle>
                <CardDescription className="text-muted">
                  {bookInfos?.author}
                </CardDescription>
                <div className="grid grid-cols-2 gap-x-8">
                  {bookInfos?.categories?.map((cat: string, index: number) => (
                    <CardDescription key={index}>{cat}</CardDescription>
                  ))}
                </div>
                <AverageBookRating bookInfos={bookInfos} />
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
