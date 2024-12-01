import FriendsWhoReadBook from "@/components/FriendsWhoReadBook";
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
import { defaultBookImage } from "@/constants";
import {
  addBookFirebase,
  deleteBookFromMyBooksFirebase,
  findBookStatusInUserLibraryFirebase,
  getMyInfosBookFirebase,
} from "@/firebase/firestore";
import useUserStore from "@/hooks/useUserStore";
import {
  BookStatusEnum,
  BookType,
  MyInfoBookType,
  SearchBooksFormType,
  UserType,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
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
  const location = useLocation();
  const {
    bookInfos,
    friendsWhoReadBook,
  }: {
    bookInfos: BookType;
    friendsWhoReadBook: { id: string; userName: string }[];
  } = location.state || {};
  console.log("bookInfos", bookInfos);
  // const isBookFromApi: boolean = location.state || {};
  //console.log("isBookFromApi", isBookFromApi);

  const { currentUser } = useUserStore();

  const [bookInMyBooks, setBookInMyBooks] = useState<keyof UserType | "">("");

  // const { friendsWhoReadBook }: { friendsWhoReadBook: string[] } =
  //   location.state || {};

  // A VOIR UNDEFINED OU NULL ?????????(!!! NULL !!) => voir de partout où j'ai mis UNDEFINED
  // => undefined est généralement utilisé par JavaScript pour indiquer qu'une variable n'a pas été initialisée, tandis que null est utilisé par les développeurs pour indiquer explicitement l'absence de valeur.
  //const [bookInfos, setBookInfos] = useState<BookType | undefined>(undefined);
  //const [friendsWhoReadBook, setFriendsWhoReadBook] = useState<string[]>([]);

  //console.log("book", bookInfos);
  // console.log("img", bookInfo.bookImageLink);

  // récupérer l'id de l'url
  // const { bookId } = useParams<{ bookId: string }>();
  // console.log("bookId", bookId);

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

  console.log("form WATCH", form.watch());

  const onSubmit: SubmitHandler<SearchBooksFormType> = (formData) => {
    console.log("SUBMIT !!! formData", formData);

    addBookFirebase(currentUser?.uid ?? "", bookInfos, formData).then(() => {
      console.log("Livre ajouté ! ", bookInfos.bookTitle);
    });

    setBookInMyBooks(formData.bookStatus);
  };

  useEffect(() => {
    findBookStatusInUserLibraryFirebase(
      bookInfos?.bookId ?? "",
      currentUser?.uid ?? ""
    ).then((res) => setBookInMyBooks(res));
  }, [bookInfos, currentUser]);

  // const onSubmit: SubmitHandler<LoginFormType> = (data) => {
  //   console.log("data", data);
  //   registerFirebase(data.email, data.password)
  //     .then((newUser) => {
  //       addOrUpdateUserFirebase(newUser.uid, {
  //         ...emptyUser,
  //         email: data.email,
  //         id: newUser.uid,
  //       });
  //       navigate("/");
  //     })
  //     .catch((error) => {
  //       console.error("Firebase register error:", error.message);
  //       setFirebaseError("L'email est déjà utilisé.");
  //     });
  // };

  // On revient à la ligne à chaque fin de phrase, sinon trop compacte
  const formatDescription = (description: string) => {
    return description?.replace(/([.!?])\s*(?=[A-Z])/g, "$1\n");
  };

  // useEffect(() => {
  //   if (bookId) {
  //     console.log("useEffect");

  //     isBookFromApi ? getDocsByQueryFirebase("books", "bookId", bookId).then((books) => {
  //       setBookInfo(books[0]);
  //       console.log(books[0]);
  //     }) :
  //     });

  //     // setFriendsWhoReadBook
  //     ///////////////////////////////
  //     ///////////////////////////////
  //     ///////////////////////////////
  //     ///////////////////////////////
  //   }
  // }, [bookId]);

  const [myBookInfos, setMyBookInfos] = useState<MyInfoBookType | null>(null);

  useEffect(() => {
    getMyInfosBookFirebase(currentUser?.uid ?? "", bookInfos.bookId).then(
      (myBook) => {
        //console.log("INFO LIVRE", myBook);
        setMyBookInfos(myBook);
      }
    );
  }, [bookInfos.bookId]);

  const handleDeleteBook = (bookId: string) => {
    deleteBookFromMyBooksFirebase(currentUser?.uid, bookId, bookInMyBooks).then(
      () => setBookInMyBooks("")
    );
  };

  return (
    <div className="min-h-screen pb-4">
      {bookInfos && (
        <Card className="relative m-4">
          {friendsWhoReadBook.length > 0 && (
            <div className="relative">
              <Star
                size={65}
                strokeWidth={2}
                className="absolute left-[3.25rem] top-[0.54rem] drop-shadow-sm text-stroke-lg"
                color="white"
              />
              <Star
                className="absolute left-[3.56rem] top-[0.9rem] drop-shadow-sm text-stroke-lg"
                size={55}
                color="gray"
              />
            </div>
          )}
          <CardDescription className="absolute right-2 top-2 rounded-full bg-secondary/60 px-3 py-1 text-secondary-foreground shadow-sm shadow-foreground">
            {bookInfos.bookLanguage}
          </CardDescription>

          <div className="flex items-start gap-5 p-5 py-12 shadow-xl shadow-primary/30">
            <img
              src={bookInfos.bookImageLink || defaultBookImage}
              onError={(e) => (e.currentTarget.src = defaultBookImage)}
              className="w-32 rounded-sm border border-border object-contain shadow-md shadow-foreground/70"
              alt={`Image de couverture du livre ${bookInfos?.bookTitle}`}
            />
            <CardHeader className="items-start gap-3 overflow-hidden">
              <CardTitle>{bookInfos?.bookTitle}</CardTitle>
              <CardDescription className="text-muted">
                {bookInfos?.bookAuthor}
              </CardDescription>
              <div className="grid grid-cols-2 gap-x-8">
                {bookInfos?.bookCategories?.map((cat, index) => (
                  <CardDescription key={index}>{cat}</CardDescription>
                ))}
              </div>
            </CardHeader>
          </div>
          <CardContent className="relative bg-secondary/30 pb-6 pt-12 shadow-md shadow-primary/30">
            {/* <Button
              onClick={() => addBookFirebase(bookInfo)}
              className="absolute -top-6 left-1/4 h-12 w-1/2 border border-border bg-secondary/60 shadow-md shadow-foreground/70"
            >
              Ajouter à mes livres
            </Button> */}
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
                    onClick={() => handleDeleteBook(bookInfos.bookId)}
                  />
                  <div>
                    <div className="flex items-center gap-4">
                      <h2 className="font-semibold text-muted">
                        J'ai lu ce livre
                      </h2>

                      <Button className="border border-border bg-secondary/40 shadow-sm shadow-foreground/70">
                        Modifier
                      </Button>
                    </div>
                    <p>{myBookInfos?.bookYear}</p>
                    {myBookInfos?.bookNote && (
                      <StarRating value={myBookInfos.bookNote} />
                    )}
                    <p>{myBookInfos?.bookDescription}</p>
                  </div>
                </div>
              )}
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>AJOUTER LIVRE</DialogTitle>
                  <DialogDescription>{bookInfos?.bookTitle}</DialogDescription>
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
                              <Label htmlFor="booksInProgress">En cours</Label>
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
                      {form.watch().bookStatus === BookStatusEnum.booksRead && (
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
              </DialogContent>
            </Dialog>
            {/* <p>{bookInfo.bookDescription}</p> */}
            <p style={{ whiteSpace: "pre-line" }}>
              {formatDescription(bookInfos.bookDescription)}
            </p>
          </CardContent>
          {friendsWhoReadBook.length > 0 && (
            <FriendsWhoReadBook friendsWhoReadBook={friendsWhoReadBook} />
          )}
        </Card>
      )}
    </div>
  );
};

export default BookDetailPage;
