import BookUserInfo from "@/components/BookUserInfo";
import CustomLinkButton from "@/components/CustomLinkButton";
import FeedbackMessage from "@/components/FeedbackMessage";
import FriendsWhoReadBook from "@/components/FriendsWhoReadBook";
import BookSkeleton from "@/components/skeletons/BookSkeleton";
import StarRating from "@/components/StarRating";
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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { GOOGLE_BOOKS_API_URL } from "@/constants";
import {
  addBookFirebase,
  addOrUpdateBookInfoToMyBooksFirebase,
  deleteBookFromMyBooksFirebase,
  findBookCatInUserLibraryFirebase,
  getDocsByQueryFirebase,
} from "@/firebase/firestore";
import useUserStore from "@/hooks/useUserStore";
import {
  BookAPIType,
  BookStatusEnum,
  BookType,
  MyInfoBookFormType,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Ellipsis, Smile, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { z } from "zod";

const currentYear = new Date().getFullYear();

const bookFormSchema = z.object({
  bookStatus: z.nativeEnum(BookStatusEnum),
  year: z
    .number()
    .int()
    .min(1900, { message: "L'année doit être suppérieur à 1900" })
    .max(currentYear, {
      message: "Impossible d'ajouter une année dans le future !",
    })
    .optional(),
  note: z.number().int().min(0).max(5).optional(),
  commentaires: z.string(),
});

const BookDetailPage = (): JSX.Element => {
  const bookId = useParams().bookId;
  console.log("bookId", bookId);

  const { currentUser } = useUserStore();

  const [bookInfos, setBookInfos] = useState<BookType>();
  console.log("333 bookInfos", bookInfos?.title);

  const [bookInMyBooks, setBookInMyBooks] = useState<BookStatusEnum | "">(""); //////////////////////////////////////////////////
  //  const [bookInMyBooks, setBookInMyBooks] = useState<BookStatusEnum>();
  const [refreshKey, setRefreshKey] = useState(0); // to force MyInfosBook re-render
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

  const form = useForm<MyInfoBookFormType>({
    resolver: zodResolver(bookFormSchema),
    // Tjs mettre des valeurs par défaut sinon ERREUR : Warning: A component is changing an uncontrolled input to be controlled
    defaultValues: {
      bookStatus: BookStatusEnum.booksReadList,
      year: currentYear,
      note: 0,
      commentaires: "",
    },
  });

  const onSubmit: SubmitHandler<MyInfoBookFormType> = (formData) => {
    if (bookInfos) {
      {
        if (bookInMyBooks === "") {
          addBookFirebase(currentUser?.uid, bookInfos, formData).then(() => {
            console.log(
              "Livre ajouté ! ",
              bookInfos.title,
              formData.bookStatus
            );
            // mettre un popup !
            setRefreshKey((prevKey) => prevKey + 1); // Increment refreshKey to trigger re-render
          });
        } else
          addOrUpdateBookInfoToMyBooksFirebase(
            currentUser?.uid,
            bookInfos.id,
            formData
          ).then(() => {
            console.log(
              "Livre ajouté ! ",
              bookInfos.title,
              formData.bookStatus
            );
            // mettre un popup !
            setRefreshKey((prevKey) => prevKey + 1); // Increment refreshKey to trigger re-render
          });
      }
    }
    setBookInMyBooks(formData.bookStatus);
  };

  useEffect(() => {
    findBookCatInUserLibraryFirebase(bookInfos?.id, currentUser?.uid).then(
      (res) => setBookInMyBooks(res)
    );
  }, [bookInfos, currentUser]);

  // On revient à la ligne à chaque fin de phrase, sinon trop compacte
  const formatDescription = (description: string) => {
    return description
      ?.replace(/([.!?])\s*(?=[A-Z])/g, "$1\n")
      .replace(/<br\s*\/?>\s*<br\s*\/?>/g, "\n");
  };

  const handleDeleteBook = (bookId: string) => {
    deleteBookFromMyBooksFirebase(currentUser?.uid, bookId, bookInMyBooks).then(
      () => setBookInMyBooks("")
    );
  };

  return (
    <div className="relative min-h-screen pb-4">
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
              {/* <img
                src={bookInfos.imageLink || DEFAULT_BOOK_IMAGE}
                onError={(e) => (e.currentTarget.src = DEFAULT_BOOK_IMAGE)}
                className="w-32 rounded-sm border border-border object-contain shadow-md shadow-foreground/70"
                alt={`Image de couverture du livre ${bookInfos?.title}`}
              /> */}
              {bookInfos.imageLink ? (
                <img
                  src={bookInfos.imageLink}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                  className="w-32 rounded-sm border border-border object-contain shadow-md shadow-foreground/70"
                  alt={`Image de couverture du livre ${bookInfos?.title}`}
                />
              ) : (
                <div className="flex h-48 w-32 items-center justify-center rounded-sm border border-border bg-gray-200 shadow-md shadow-foreground/70">
                  <span className="text-gray-500">Image non disponible</span>
                </div>
              )}
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
              <Dialog>
                {bookInMyBooks === "" ? (
                  <DialogTrigger asChild className="flex justify-center">
                    {/* absolute -top-1 left-1/4  */}
                    <Button className="m-auto mb-6 h-12 w-1/2 border border-border bg-secondary/60 shadow-md shadow-foreground/70">
                      Ajouter à mes livres
                    </Button>
                  </DialogTrigger>
                ) : (
                  <div className="relative flex flex-col gap-2">
                    <div className="flex items-center justify-around">
                      <div className="mb-2 border border-border bg-secondary/60 p-2 shadow-md shadow-foreground/70">
                        {bookInMyBooks === BookStatusEnum.booksReadList && (
                          <div className="flex justify-center gap-2">
                            <p>J'ai lu ce livre</p>
                            <Check />
                          </div>
                        )}
                        {bookInMyBooks ===
                          BookStatusEnum.booksInProgressList && (
                          <div className="flex justify-center gap-2">
                            <p>Je suis en train de lire ce livre</p>
                            <Ellipsis />
                          </div>
                        )}
                        {bookInMyBooks === BookStatusEnum.booksToReadList && (
                          <div className="flex justify-center gap-2">
                            <p>J'aimerais lire ce livre</p>
                            <Smile />
                          </div>
                        )}
                      </div>
                      <X
                        className="bottom-8 mr-0 text-destructive-foreground"
                        onClick={() => handleDeleteBook(bookInfos.id)}
                      />
                    </div>
                    <BookUserInfo
                      key={refreshKey} // refreshKey = key to force re-render when bookInfos changes
                      userId={currentUser?.uid}
                      bookInfos={bookInfos}
                      bookStatus={bookInMyBooks}
                    />
                    <DialogTrigger asChild className="flex justify-center">
                      {/* absolute -top-1 left-1/4  */}
                      <Button className="m-auto mb-6 h-12 w-1/2 border border-border bg-secondary/60 shadow-md shadow-foreground/70">
                        Voir/Modifier mes infos
                      </Button>
                    </DialogTrigger>
                  </div>
                )}
                <DialogContent className="sm:max-w-[425px]">
                  {currentUser?.uid ? (
                    <>
                      <DialogHeader>
                        {bookInMyBooks === "" ? (
                          <DialogTitle>AJOUTER LIVRE</DialogTitle>
                        ) : (
                          <DialogTitle>MODIFIER MES INFOS</DialogTitle>
                        )}
                        <DialogDescription>
                          {bookInfos?.title}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <Form {...form}>
                          <form
                            className="sticky top-10 z-10 flex flex-col gap-3 bg-background/70 duration-500"
                            onSubmit={form.handleSubmit(onSubmit)}
                          >
                            {/* Sans FORMFIELD mais avec CONTROLLER (normalement pareil ms moins lisible...)
                      <RadioGroup defaultValue={BookStatusEnum.read}>
                        <Controller
                          name="bookStatus"
                          control={form.control}
                          defaultValue={BookStatusEnum.read}
                          render={({ field }) => (
                            <RadioGroup
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value={BookStatusEnum.read}
                                  id="read"
                                />
                                <Label htmlFor="read">Lu</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value={BookStatusEnum.inProgress}
                                  id="inProgress"
                                />
                                <Label htmlFor="inProgress">En cours</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value={BookStatusEnum.toRead}
                                  id="toRead"
                                />
                                <Label htmlFor="toRead">À lire</Label>
                              </div>
                            </RadioGroup>
                          )}
                        />
                      </RadioGroup> */}
                            <FormField
                              control={form.control}
                              name="bookStatus"
                              render={({ field }) => (
                                <RadioGroup
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                      value={BookStatusEnum.booksReadList}
                                      id="booksRead"
                                    />
                                    <Label htmlFor="read">Lu</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                      value={BookStatusEnum.booksInProgressList}
                                      id="booksInProgress"
                                    />
                                    <Label htmlFor="booksInProgress">
                                      En cours
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                      value={BookStatusEnum.booksToReadList}
                                      id="toRead"
                                    />
                                    <Label htmlFor="toRead">À lire</Label>
                                  </div>
                                </RadioGroup>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="commentaires"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Mes commentaires"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            {form.watch().bookStatus ===
                              BookStatusEnum.booksReadList && (
                              <div className="flex items-center justify-around">
                                <FormField
                                  control={form.control}
                                  name="year"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input
                                          placeholder="Année"
                                          type="number"
                                          {...field}
                                          //On converti en number sinon : "Expected number, received string" (sinon on pt enlever le onChange)
                                          onChange={(e) =>
                                            field.onChange(
                                              e.target.value
                                                ? parseFloat(e.target.value)
                                                : null
                                            )
                                          }
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="note"
                                  render={() => (
                                    <FormItem className="flex justify-center">
                                      <FormControl>
                                        <Controller
                                          name="note"
                                          control={form.control}
                                          render={({ field }) => (
                                            <StarRating
                                              value={field.value ?? 0}
                                              //On converti en number sinon : "Expected number, received string"
                                              onChange={(value: string) =>
                                                field.onChange(parseInt(value))
                                              }
                                            />
                                          )}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            )}

                            {/* <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="Email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      /> */}

                            <DialogFooter>
                              <DialogClose asChild>
                                <Button type="submit">OK</Button>
                              </DialogClose>
                            </DialogFooter>
                          </form>
                        </Form>
                      </div>
                    </>
                  ) : (
                    <>
                      <DialogHeader>
                        <DialogTitle>
                          <FeedbackMessage
                            message="Vous devez être connecté pour ajouter un livre"
                            type="error"
                          />
                        </DialogTitle>
                        <DialogDescription>
                          <CustomLinkButton linkTo="/login">
                            Se connecter
                          </CustomLinkButton>
                        </DialogDescription>
                      </DialogHeader>
                    </>
                  )}
                </DialogContent>
              </Dialog>
              <p style={{ whiteSpace: "pre-line" }}>
                {formatDescription(bookInfos.description)}
              </p>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
};

export default BookDetailPage;
