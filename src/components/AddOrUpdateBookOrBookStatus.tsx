import BookUserInfo from "@/components/BookUserInfo";
import CustomLinkButton from "@/components/CustomLinkButton";
import FeedbackMessage from "@/components/FeedbackMessage";
import StarRating from "@/components/StarRating";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { MONTHS } from "@/constants";
import {
  addBookFirebase,
  addOrUpdateBookInfoToMyBooksFirebase,
  deleteBookFromMyBooksFirebase,
  findBookCatInUserLibraryFirebase,
  getUserInfosBookFirebase,
} from "@/firebase/firestore";
import {
  BookStatusEnum,
  BookType,
  MyInfoBookFormType,
  UserInfoBookType,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Ellipsis, Smile, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

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
  month: z.number().int().min(0).max(12).optional(), // 0 = non précisé
  userNote: z.number().int().min(0).max(5).optional(),
  userComments: z.string().optional(),
});

type AddOrUpdateBookProps = {
  userId: string;
  bookInfos: BookType;
  onUpdate: () => void;
};

const AddOrUpdateBookOrBookStatus = ({
  userId,
  bookInfos,
  onUpdate,
}: AddOrUpdateBookProps): JSX.Element => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bookInMyBooks, setBookInMyBooks] = useState<BookStatusEnum | "">("");
  console.log("bookInMyBooks", bookInMyBooks);
  const [userBookInfos, setUserBookInfos] = useState<UserInfoBookType | null>();

  console.log("/*-/*-bookInMyBooks userBookInfos", userBookInfos);
  console.log("/*-/*-bookInMyBooks userBookInfos", userBookInfos?.userNote);

  console.log("123456", bookInfos.rating);
  // console.log("789 bookInMyBooks", bookInMyBooks);

  const [refreshKey, setRefreshKey] = useState(0); // to force MyInfosBook re-render when userBookInfos changes

  console.log("refreshKey", refreshKey);

  const handleUpdate = () => {
    console.log("handleUpdate");
    setRefreshKey((prevKey) => prevKey + 1);
    onUpdate(); // Call the parent update function
  };

  useEffect(() => {
    console.log("handleUpdate useEffect");
    handleUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userBookInfos]);

  const defaultValues = {
    bookStatus: bookInMyBooks || BookStatusEnum.booksReadList,
    year: userBookInfos?.year || currentYear,
    month: userBookInfos?.month || 0,
    userNote: userBookInfos?.userNote || 0,
    userComments: userBookInfos?.userComments || "",
  };

  const form = useForm<MyInfoBookFormType>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: defaultValues,
  });

  const updateUserBookInfos = () => {
    console.log("updateUserBookInfos");
    if (bookInMyBooks && bookInfos) {
      getUserInfosBookFirebase(userId, bookInfos.id, bookInMyBooks).then(
        (myBook) => {
          console.log("updateUserBookInfos !!!!!!!!!!! myBook", myBook);
          setUserBookInfos(myBook);
          // if (myBook) setUserBookInfos(myBook);
        }
      );
    }
  };

  useEffect(() => {
    console.log("bookInMyBooks change ??? useEffect setUserBookInfos");
    if (bookInMyBooks && bookInfos) {
      console.log("bookInMyBooks && bookInfos", bookInMyBooks, bookInfos);
      getUserInfosBookFirebase(userId, bookInfos.id, bookInMyBooks).then(
        (myBook) => {
          console.log("bookInMyBooks !!!!!!!!!!!!!!", myBook);
          if (myBook) setUserBookInfos(myBook);
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookInfos?.id, bookInMyBooks, userId]);

  useEffect(() => {
    form.reset(defaultValues); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userBookInfos, form]);

  // ici j'utilise async/await car le .then ne fonctionne pas, pourtant normalement ça fait exactement la même chose !!!
  const handleDeleteBook = async (bookId: string) => {
    await deleteBookFromMyBooksFirebase(userId, bookId, bookInMyBooks);
    setBookInMyBooks("");
    updateUserBookInfos();
    // deleteBookFromMyBooksFirebase(userId, bookId, bookInMyBooks).then(() => {
    //   setBookInMyBooks("");
    //   handleUpdate();
    // });
  };

  // ici j'utilise async/await car le .then ne fonctionne pas, pourtant normalement ça fait exactement la même chose !!!
  const onSubmit: SubmitHandler<MyInfoBookFormType> = async (formData) => {
    // console.log("789 formData", formData);
    // console.log("789 bookInMyBooks", bookInMyBooks);
    // console.log("789 bookInfos", bookInfos);

    if (bookInfos) {
      {
        if (bookInMyBooks === "") {
          console.log("bookInMyBooks", bookInMyBooks);

          await addBookFirebase(userId, bookInfos, formData); // Ajout de await ici
          console.log("Livre ajouté ! ", bookInfos.title, formData.bookStatus);
          updateUserBookInfos();
          // addBookFirebase(userId, bookInfos, formData).then(() => {
          //   console.log(
          //     "Livre ajouté ! ",
          //     bookInfos.title,
          //     formData.bookStatus
          //   );

          //   updateUserBookInfos();
          // });
        } else
          addOrUpdateBookInfoToMyBooksFirebase(
            userId,
            bookInfos.id,
            formData,
            userBookInfos?.userNote
          ).then(() => {
            updateUserBookInfos();
            console.log(
              "Livre ajouté ! ",
              bookInfos.title,
              formData.bookStatus
            );
          });
      }
    }
    setBookInMyBooks(formData.bookStatus);
    setIsDialogOpen(false);
    setRefreshKey((prevKey) => prevKey + 1); // Increment refreshKey to trigger re-render of this component
  };

  useEffect(() => {
    findBookCatInUserLibraryFirebase(bookInfos?.id, userId).then((res) =>
      setBookInMyBooks(res)
    );
  }, [bookInfos, userId]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}> */}
      {bookInMyBooks === "" ? (
        <DialogTrigger asChild className="flex justify-center">
          {/* absolute -top-1 left-1/4  */}
          <Button
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
          >
            Ajouter à mes livres
          </Button>
        </DialogTrigger>
      ) : (
        <div className="relative flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div className="border border-border bg-secondary/60 p-2 shadow-md rounded-md shadow-foreground/70">
              {bookInMyBooks === BookStatusEnum.booksReadList && (
                <div className="flex justify-center gap-2">
                  <p>Je l'ai lu !</p>
                  <Check className="rounded-full bg-primary/50 p-1  shadow-sm shadow-foreground" />
                </div>
              )}
              {bookInMyBooks === BookStatusEnum.booksInProgressList && (
                <div className="flex justify-center gap-2 items-center">
                  <p>Je suis en train de le lire</p>
                  <Ellipsis className="rounded-full bg-primary/50 p-1  shadow-sm shadow-foreground" />
                </div>
              )}
              {bookInMyBooks === BookStatusEnum.booksToReadList && (
                <div className="flex justify-center gap-2">
                  <p>J'aimerais le lire</p>
                  <Smile className="rounded-full bg-primary/50 p-1  shadow-sm shadow-foreground" />
                </div>
              )}
            </div>
            <AlertDialog>
              <AlertDialogTrigger>
                <Button className="bg-red-600/70 flex items-center gap-1">
                  Supprimer
                  <X className="bottom-8 mr-0 text-destructive-foreground" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-foreground">
                    Etes-vous sûrs de vouloir supprimer le livre de votre liste
                    de{" "}
                    <span className="font-bold text-muted">
                      {bookInMyBooks === BookStatusEnum.booksReadList &&
                        "livres lus"}
                      {bookInMyBooks === BookStatusEnum.booksInProgressList &&
                        "livres en cours"}
                      {bookInMyBooks === BookStatusEnum.booksToReadList &&
                        "livres à lire"}
                    </span>{" "}
                    ?
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-none bg-primary">
                    Annuler
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDeleteBook(bookInfos.id)}
                    className="bg-red-600/70"
                  >
                    Oui !
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <BookUserInfo
            key={refreshKey} // refreshKey = key to force re-render when bookInfos changed
            userId={userId}
            bookInfosId={bookInfos.id}
            bookStatus={bookInMyBooks}
          />
          <DialogTrigger asChild className="flex justify-center">
            {/* absolute -top-1 left-1/4  */}
            <Button
              className="m-auto md:mt-2 mb-6 h-10 w-full md:w-1/2 border-2 border-background bg-primary/60 shadow-md shadow-foreground/70"
              onClick={() => form.reset(defaultValues)}
            >
              Modifier mes infos
            </Button>
          </DialogTrigger>
        </div>
      )}
      <DialogContent className="sm:max-w-[425px]">
        {userId ? (
          <>
            <DialogHeader>
              {bookInMyBooks === "" ? (
                <DialogTitle>AJOUTER LIVRE</DialogTitle>
              ) : (
                <DialogTitle>MODIFIER MES INFOS</DialogTitle>
              )}
              <DialogDescription>{bookInfos?.title}</DialogDescription>
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
                          <Label htmlFor="booksInProgress">En cours</Label>
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
                    name="userComments"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea placeholder="Mes commentaires" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {form.watch().bookStatus === BookStatusEnum.booksReadList && (
                    <div className="flex items-center justify-around">
                      <FormField
                        control={form.control}
                        name="year"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select
                                value={
                                  field.value?.toString() ??
                                  currentYear.toString()
                                }
                                onValueChange={(value) =>
                                  field.onChange(parseInt(value))
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Année" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.from(
                                    { length: currentYear - 1900 + 1 },
                                    (_, i) => currentYear - i
                                  ).map((year) => (
                                    <SelectItem
                                      key={year}
                                      value={year.toString()}
                                    >
                                      {year}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="month"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select
                                value={field.value?.toString() ?? ""}
                                onValueChange={(value) =>
                                  field.onChange(parseInt(value))
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Mois (optionnel)" />
                                </SelectTrigger>
                                <SelectContent>
                                  {MONTHS.map((month, index) => (
                                    <SelectItem
                                      key={index}
                                      value={index.toString()}
                                    >
                                      {month}
                                    </SelectItem>
                                  ))}
                                  {/* {MONTHS.map((month) => (
                                    <SelectItem
                                      key={month.value}
                                      value={month.value.toString()}
                                    >
                                      {month.label}
                                    </SelectItem>
                                  ))} */}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* <FormField
                        control={form.control}
                        name="month"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Mois"
                                type="number"
                                {...field}
                                value={field.value ?? currentMonth}
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
                      /> */}
                      <FormField
                        control={form.control}
                        name="userNote"
                        render={() => (
                          <FormItem className="flex justify-center">
                            <FormControl>
                              <Controller
                                name="userNote"
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
                      {form.watch().userNote !== 0 && (
                        <X onClick={() => form.setValue("userNote", 0)} />
                      )}
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

                  {/* <DialogFooter>
                    <DialogClose asChild> */}
                  <Button type="submit">OK</Button>
                  {/* </DialogClose>
                  </DialogFooter> */}
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
  );
};

export default AddOrUpdateBookOrBookStatus;
