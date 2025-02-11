import AddOrUpdateBookOrBookStatus from "@/components/AddOrUpdateBookOrBookStatus";
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
import { removeOrRemplaceHtmlTags } from "@/utils";
import { Quote } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";

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
  const bookId = useParams().bookId;
  console.log("bookId", bookId);

  const { currentUser } = useUserStore();

  const [bookInfos, setBookInfos] = useState<BookType>();
  console.log("333 bookInfos", bookInfos?.title);

  //const [bookInMyBooks, setBookInMyBooks] = useState<BookStatusEnum | "">(""); //////////////////////////////////////////////////
  //  const [bookInMyBooks, setBookInMyBooks] = useState<BookStatusEnum>();
  const [isBookInDB, setIsBookInDB] = useState<boolean>(true);
  console.log("isBookInDB", isBookInDB);

  // 1-DEBUT==================================FAIRE HOOK PERSO !!!
  // 1 - Fonction appelée en 1er : va chercher les info du livre en fonction de son id (si dans notre BDD)
  const fetchBookInfoDB = async (bookId: string): Promise<BookType | null> => {
    // throw new Error(
    //   "Erreur simulée !"
    // );

    console.log("FETCHING BookInfos", bookId);

    return getDocsByQueryFirebase<BookType>("books", "id", bookId)
      .then((books: BookType[]) => {
        console.log("FETCHING books", books);
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
  } = useSWR<BookType | null>(
    bookId,
    currentUser?.uid ? fetchBookInfoDB : null //////////////// A VOIR si besoin d'être connecté et sinon, erreur ???
  );

  console.log("after FETCHING bookFromId", bookFromId?.title);

  // ici on utilise une constante et pas un state car les message ne change pas et s'affiche seulement si useSWR renvoie une erreur
  const message = `Un problème est survenu dans la récupération du livre => ${error?.message}`; // VOIR !!!!

  useEffect(() => {
    console.log("bookFromId after FETCHING useEffect", bookFromId?.title);

    if (bookFromId) {
      console.log("22 bookFromId after FETCHING useEffect", bookFromId);
      setBookInfos(bookFromId);
    } else {
      setIsBookInDB(false);
    }
  }, [bookFromId]);
  // 1-FIN============================FAIRE HOOK PERSO !!!

  // 3-DEBUT============================FAIRE HOOK PERSO !!!
  const fetchAPIBooks = (booksApiUrl: string): Promise<BookType> => {
    console.log("booksApiUrl", booksApiUrl);

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
    data: bookFromApi,
    error: apiBooksError,
    isLoading: apiBooksIsLoading,
  } = useSWR<BookType>(
    isBookInDB === false ? `${GOOGLE_BOOKS_API_URL}/${bookId}` : null,
    fetchAPIBooks
  );
  // 3-FIN============================FAIRE HOOK PERSO !!!

  useEffect(() => {
    if (bookFromApi) {
      console.log("333 USEEFFECT apiBooks", bookFromApi?.title);
      setBookInfos(bookFromApi);
    }
  }, [bookFromApi]);

  console.log("333 data bookFromApi", bookFromApi?.title);

  // const form = useForm<MyInfoBookFormType>({
  //   resolver: zodResolver(bookFormSchema),
  //   // Tjs mettre des valeurs par défaut sinon ERREUR : Warning: A component is changing an uncontrolled input to be controlled
  //   defaultValues: {
  //     bookStatus: BookStatusEnum.booksReadList,
  //     year: currentYear,
  //     note: 0,
  //     commentaires: "",
  //   },
  // });

  // const onSubmit: SubmitHandler<MyInfoBookFormType> = (formData) => {
  //   if (bookInfos) {
  //     {
  //       if (bookInMyBooks === "") {
  //         addBookFirebase(currentUser?.uid, bookInfos, formData).then(() => {
  //           console.log(
  //             "Livre ajouté ! ",
  //             bookInfos.title,
  //             formData.bookStatus
  //           );
  //           // mettre un popup !
  //           setRefreshKey((prevKey) => prevKey + 1); // Increment refreshKey to trigger re-render
  //         });
  //       } else
  //         addOrUpdateBookInfoToMyBooksFirebase(
  //           currentUser?.uid,
  //           bookInfos.id,
  //           formData
  //         ).then(() => {
  //           console.log(
  //             "Livre ajouté ! ",
  //             bookInfos.title,
  //             formData.bookStatus
  //           );
  //           // mettre un popup !
  //           setRefreshKey((prevKey) => prevKey + 1); // Increment refreshKey to trigger re-render
  //         });
  //     }
  //   }
  //   setBookInMyBooks(formData.bookStatus);
  // };

  // useEffect(() => {
  //   findBookCatInUserLibraryFirebase(bookInfos?.id, currentUser?.uid).then(
  //     (res) => setBookInMyBooks(res)
  //   );
  // }, [bookInfos, currentUser?.uid]);

  const addLineBreaks = (description: string) => {
    return (
      // Ajoute un saut de ligne après chaque : ".", "!", ou "?" suivi d'une lettre majuscule => pour plus de lisibilité
      description.replace(/([.!?])\s*(?=[A-Z])/g, "$1\n")
    );
  };

  // const formatDescription = (description: string) => {
  //   return description
  //     ?.replace(/([.!?])\s*(?=[A-Z])/g, "$1\n")
  //     .replace(/<br\s*\/?>\s*<br\s*\/?>/g, "\n");
  // };

  return (
    <div className="relative min-h-screen max-w-4xl md:m-auto md:mt-8">
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
                className="w-32 rounded-sm border border-border object-contain shadow-md shadow-foreground/70"
                alt={`Image de couverture du livre ${bookInfos?.title}`}
              />
              <CardHeader className="items-start gap-3 overflow-hidden">
                <CardTitle>{bookInfos?.title}</CardTitle>
                <CardDescription className="text-muted">
                  {bookInfos?.author}
                </CardDescription>
                <div className="grid grid-cols-2 gap-x-8">
                  {bookInfos?.categories?.map((cat: string, index: number) => (
                    <CardDescription key={index}>{cat}</CardDescription>
                  ))}
                </div>
              </CardHeader>
            </div>
            <FriendsWhoReadBook bookId={bookInfos.id} />

            <CardContent className="relative bg-secondary/30 p-6 shadow-md shadow-primary/30">
              {currentUser?.uid && (
                <AddOrUpdateBookOrBookStatus
                  userId={currentUser?.uid}
                  bookInfos={bookInfos}
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
                <div className="flex gap-3 relative">
                  <Quote className="absolute -top-1" />
                  <p
                    style={{ whiteSpace: "pre-line" }}
                    className="text-foreground max-w-[90%]"
                  >
                    &ensp;&ensp;&ensp;&ensp;
                    {removeOrRemplaceHtmlTags(
                      addLineBreaks(bookInfos.description)
                    )}
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
