import BookSkeleton from "@/components/BookSkeleton";
import CustomLinkButton from "@/components/CustomLinkButton";
import FeedbackMessage from "@/components/FeedbackMessage";
import FriendsWhoReadBook from "@/components/FriendsWhoReadBook";
import MyInfoBook from "@/components/MyInfoBook";
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
import { DEFAULT_BOOK_IMAGE, GOOGLE_BOOKS_API_URL } from "@/constants";
import {
  addBookFirebase,
  deleteBookFromMyBooksFirebase,
  findBookStatusInUserLibraryFirebase,
  getDocsByQueryFirebase,
} from "@/firebase/firestore";
import useUserStore from "@/hooks/useUserStore";
import {
  BookAPIType,
  BookStatusEnum,
  BookType,
  SearchBooksFormType,
  UserType,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
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
  description: z.string().optional(),
});

const BookDetailPage = (): JSX.Element => {
  const bookId = useParams().bookId;
  console.log("bookId", bookId);

  const { currentUser } = useUserStore();

  const [bookInfos, setBookInfos] = useState<BookType>();
  console.log("bookInfos", bookInfos);

  const [bookInMyBooks, setBookInMyBooks] = useState<keyof UserType | "">("");
  const [refreshKey, setRefreshKey] = useState(0); // to force MyInfosBook re-render
  const [isBookInDB, setIsBookInDB] = useState<boolean>();
  console.log("isBookInDB", isBookInDB);

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
          console.log("bookFromAPI", bookFromAPI);
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
    data: apiBooks,
    error: apiBooksError,
    isLoading: apiBooksIsLoading,
  } = useSWR<BookType>(
    isBookInDB ? null : `${GOOGLE_BOOKS_API_URL}/${bookId}`,
    fetchAPIBooks
  );
  // 3-FIN============================FAIRE HOOK PERSO !!!

  console.log("data", apiBooks);

  const form = useForm<SearchBooksFormType>({
    resolver: zodResolver(bookFormSchema),
    // Tjs mettre des valeurs par défaut sinon ERREUR : Warning: A component is changing an uncontrolled input to be controlled
    defaultValues: {
      bookStatus: BookStatusEnum.booksRead,
      year: currentYear,
      note: 0,
      description: "",
    },
  });

  const onSubmit: SubmitHandler<SearchBooksFormType> = (formData) => {
    if (bookInfos)
      addBookFirebase(currentUser?.uid, bookInfos, formData).then(() => {
        console.log("Livre ajouté ! ", bookInfos.title);
        // mettre un popup !
        setRefreshKey((prevKey) => prevKey + 1); // Increment refreshKey to trigger re-render
      });

    setBookInMyBooks(formData.bookStatus);
  };

  useEffect(() => {
    findBookStatusInUserLibraryFirebase(bookInfos?.id, currentUser?.uid).then(
      (res) => setBookInMyBooks(res)
    );
  }, [bookInfos, currentUser]);

  // On revient à la ligne à chaque fin de phrase, sinon trop compacte
  const formatDescription = (description: string) => {
    return description?.replace(/([.!?])\s*(?=[A-Z])/g, "$1\n");
  };

  const handleDeleteBook = (bookId: string) => {
    deleteBookFromMyBooksFirebase(currentUser?.uid, bookId, bookInMyBooks).then(
      () => setBookInMyBooks("")
    );
  };

  // 1-DEBUT==================================FAIRE HOOK PERSO !!!
  const fetchBookInfoDB = async (bookId: string): Promise<BookType | null> => {
    // throw new Error(
    //   "Erreur simulée !"
    // );

    return getDocsByQueryFirebase<BookType>("books", "id", bookId)
      .then((books: BookType[]) => {
        console.log("books", books);
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
    currentUser?.uid ? fetchBookInfoDB : null
  );

  // ici on utilise une constante et pas un state car les message ne change pas et s'affiche seulement si useSWR renvoie une erreur
  const message = `Un problème est survenu dans la récupération du livre => ${error?.message}`;

  useEffect(() => {
    if (bookFromId) {
      setBookInfos(bookFromId);
      setIsBookInDB(true); // pt être pas besoin car si ça vient là isBookInDB reste undefined
    } else {
      setIsBookInDB(false);
    }
  }, [bookFromId]);
  // 1-FIN============================FAIRE HOOK PERSO !!!

  useEffect(() => {
    console.log("apiBooks", apiBooks);
    setBookInfos(apiBooks);
  }, [apiBooks]);

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

            <CardContent className="relative bg-secondary/30 pb-6 pt-12 shadow-md shadow-primary/30">
              <Dialog>
                {bookInMyBooks === "" ? (
                  <DialogTrigger asChild>
                    <Button className="absolute -top-6 left-1/4 h-12 w-1/2 border border-border bg-secondary/60 shadow-md shadow-foreground/70">
                      Ajouter à mes livres
                    </Button>
                  </DialogTrigger>
                ) : (
                  <div className="relative">
                    <p className="absolute -top-6 left-1/4 h-12 w-1/2 border border-border bg-secondary/60 pl-2 shadow-md shadow-foreground/70">
                      Dans ma liste : {bookInMyBooks}
                    </p>
                    <X
                      className="absolute bottom-8 right-0 text-destructive-foreground"
                      onClick={() => handleDeleteBook(bookInfos.id)}
                    />
                    <MyInfoBook
                      key={refreshKey} // Use refreshKey as a key to force re-render
                      currentUserId={currentUser?.uid}
                      bookInfos={bookInfos}
                    />
                    <Button className="border border-border bg-secondary/40 shadow-sm shadow-foreground/70">
                      Modifier
                    </Button>
                  </div>
                )}
                <DialogContent className="sm:max-w-[425px]">
                  {currentUser?.uid ? (
                    <>
                      <DialogHeader>
                        <DialogTitle>AJOUTER LIVRE</DialogTitle>
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
                                      value={BookStatusEnum.booksRead}
                                      id="booksRead"
                                    />
                                    <Label htmlFor="read">Lu</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                      value={BookStatusEnum.booksInProgress}
                                      id="booksInProgress"
                                    />
                                    <Label htmlFor="booksInProgress">
                                      En cours
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                      value={BookStatusEnum.booksToRead}
                                      id="toRead"
                                    />
                                    <Label htmlFor="toRead">À lire</Label>
                                  </div>
                                </RadioGroup>
                              )}
                            />
                            {form.watch().bookStatus ===
                              BookStatusEnum.booksRead && (
                              <div className="flex flex-col gap-3">
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
                                <FormField
                                  control={form.control}
                                  name="description"
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
                                <Button type="submit">Ajouter</Button>
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
