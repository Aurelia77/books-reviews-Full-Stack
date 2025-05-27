"use client";

//import BookUserInfo from "@/components/BookUserInfo";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BookStatusValues, MONTHS } from "@/lib/constants";
import {
  BookStatusType,
  BookType,
  MyInfoBookFormType,
  UserInfoBookType,
} from "@/lib/types";
import { cn, getStatusColor } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Ellipsis, Smile, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import BookUserInfo from "./BookUserInfo";
import StarRating from "./StarRating";
import { Button } from "./ui/button";
import { FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

// const MemoizedTextarea = memo(function MemoizedTextarea({
//   control,
// }: {
//   control: any;
// }) {
//   return (
//     <Controller
//       name="userComments"
//       control={control}
//       render={({ field }) => (
//         <Textarea placeholder="Mes commentaires" {...field} />
//       )}
//     />
//   );
// });
// Pour éviter les re-renders inutiles (sinon très long à chaque ajout de caractère)
// const MemoizedTextarea = memo(({ field }: { field: any }) => (
//   <Textarea placeholder="Mes commentaires" {...field} />
// ));

// const MemoizedTextarea = memo(
//   ({
//     value,
//     onChange,
//   }: {
//     value: string;
//     onChange: (value: string) => void;
//   }) => (
//     <Textarea
//       placeholder="Mes commentaires"
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//     />
//   )
// );

const currentYear = new Date().getFullYear();

const bookFormSchema = z.object({
  bookStatus: z.nativeEnum(BookStatusValues),
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
  userComments: z.string(), //.optional(),
});

type AddOrUpdateBookProps = {
  currentUserId: string;
  bookInfos: BookType;
  //onUpdate: () => void;
  userBookStatus?: BookStatusType | null;
};

const AddOrUpdateBookOrBookStatus = ({
  currentUserId,
  bookInfos,
  userBookStatus,
}: //onUpdate,
AddOrUpdateBookProps) => {
  const router = useRouter();

  //console.log("💙❤️❤️❤️🤎 currentUserId", currentUserId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // console.log("bookInMyBooks", bookInMyBooks);
  const [userBookInfos, setUserBookInfos] = useState<UserInfoBookType | null>();
  console.log("💛💙💚❤️🤍🤎 userBookInfo", userBookInfos);

  const [userBookStatusState, setUserBookStatusState] =
    useState(userBookStatus);

  //console.log("/*-/*-bookInMyBooks userBookInfos", userBookInfos);
  // console.log("/*-/*-bookInMyBooks userBookInfos", userBookInfos?.userNote);

  // console.log("789 bookInMyBooks", bookInMyBooks);

  const [refreshKey, setRefreshKey] = useState(0); // to force MyInfosBook re-render when userBookInfos changes

  //console.log("refreshKey", refreshKey);

  const defaultValues = {
    bookStatus: userBookStatusState || BookStatusValues.READ,
    year: userBookInfos?.year || currentYear,
    month: userBookInfos?.month || 0,
    userNote: userBookInfos?.note || 0,
    userComments: userBookInfos?.comments || "",
  };

  const form = useForm<MyInfoBookFormType>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: defaultValues,
  });

  const [localComments, setLocalComments] = useState(
    form.getValues("userComments") || ""
  );

  // const year = useWatch({ control: form.control, name: "year" });
  // const month = useWatch({ control: form.control, name: "month" });
  // const userNote = useWatch({ control: form.control, name: "userNote" });

  const handleUpdate = async () => {
    // Logique de mise à jour existante...

    // Appeler l'API pour actualiser la page (pour mettre à jour les infos du livre)
    await fetch("/api/revalidate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path: `/books/${bookInfos.id}` }),
    });

    // Optionnel : forcer un rafraîchissement côté client
    router.refresh();
  };

  useEffect(() => {
    console.log("💛💛💛 getOne userBookStatusState", userBookStatusState);
    if (userBookStatusState === BookStatusValues.READ) {
      console.log(
        "💛💛💛 getOne userBookStatusState READ",
        userBookStatusState
      );
      (async () => {
        try {
          const response = await fetch(
            `/api/userInfoBooks/getOne?userId=${currentUserId}&bookId=${bookInfos.id}`
          );
          if (response.ok) {
            const myBook = await response.json();
            setUserBookInfos(myBook);
          }
        } catch (error) {
          console.error("Error fetching user book info:", error);
        }
      })();
    }
  }, [bookInfos.id, currentUserId, userBookStatusState]);

  // const handleUpdate = () => {
  //   // console.log("handleUpdate");
  //   setRefreshKey((prevKey) => prevKey + 1);
  //   //onUpdate(); // Call the parent update function
  // };

  // useEffect(() => {
  //   // console.log("handleUpdate useEffect");
  //   handleUpdate();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [userBookInfos]);

  // const updateUserBookInfos = () => {
  //   // console.log("updateUserBookInfos");
  //   if (userBookStatusState && bookInfos) {
  //     // getUserInfosBookFirebase(userId, bookInfos.id, bookInMyBooks).then(
  //     //   (myBook) => {
  //     //     console.log("updateUserBookInfos !!!!!!!!!!! myBook", myBook);
  //     //     setUserBookInfos(myBook);
  //     //     // if (myBook) setUserBookInfos(myBook);
  //     //   }
  //     // );
  //   }
  // };

  // useEffect(() => {
  //   // console.log("bookInMyBooks change ??? useEffect setUserBookInfos");
  //   if (userBookStatusState && bookInfos) {
  //     // console.log("bookInMyBooks && bookInfos", bookInMyBooks, bookInfos);
  //     // getUserInfosBookFirebase(userId, bookInfos.id, bookInMyBooks).then(
  //     //   (myBook) => {
  //     //     console.log("bookInMyBooks !!!!!!!!!!!!!!", myBook);
  //     //     if (myBook) setUserBookInfos(myBook);
  //     //   }
  //     // );
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [bookInfos?.id, userBookStatusState, currentUserId]);

  // Sinon valeurs par défaut du form sont vides
  useEffect(() => {
    form.reset(defaultValues); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userBookInfos, form]);

  // ici j'utilise async/await car le .then ne fonctionne pas, pourtant normalement ça fait exactement la même chose !!!
  const handleDeleteBook = async (bookId: string) => {
    // await deleteBookFromMyBooksFirebase(userId, bookId, bookInMyBooks);

    console.log(
      "0-💙❤️🤎handleDeleteBook ds composant AddOr... ",
      currentUserId,
      bookId,
      userBookStatusState
    );
    await fetch(
      `/api/booksAndUserInfoBooks/${currentUserId}/${bookId}/${userBookStatusState}`,
      {
        method: "DELETE",
      }
    );
    setUserBookStatusState(null);
    handleUpdate(); // pour mettre à jour le parent et donc la note moyenne du livre
    //updateUserBookInfos();
  };

  const onSubmit: SubmitHandler<MyInfoBookFormType> = async (formData) => {
    formData.userComments = localComments;

    console.log("💛💙💚❤️🤍🤎 previousNote", userBookInfos?.note);

    try {
      const response = await fetch("/api/books/new-or-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentUserId,
          bookInfos,
          formData,
          previousNote: userBookInfos?.note,
        }),
      });

      console.log("💛💙💚❤️🤍🤎 response", response);
      console.log("💛💙💚❤️🤍🤎 response json", response.json());

      if (!response.ok) {
        const errorData = await response.json();
        console.log("💛💙💚❤️🤍🤎", errorData);
        console.error(
          "Erreur lors de l'ajout du livre ou des informations :",
          errorData.error,
          errorData.message
        );
        toast.error(
          "Impossible d'ajouter le livre ou les informations. Veuillez vérifier votre connexion ou réessayer plus tard."
        );
        setUserBookInfos((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            year: formData.year ?? prev.year ?? null,
            month: formData.month ?? prev.month ?? null,
            note: formData.userNote ?? prev.note ?? null,
            comments: formData.userComments ?? prev.comments ?? null,
            status: formData.bookStatus ?? prev.status,
          };
        });
      }
    } catch (error) {
      console.error(
        "Erreur lors de l'appel à l'API book/new-or-update :",
        error
      );
      toast.error(
        "Une erreur est survenue lors de la mise à jour des informations. Veuillez réessayer plus tard."
      );
    }

    setUserBookStatusState(formData.bookStatus);
    setIsDialogOpen(false);
    // ??? besoin ci-dessous ?
    setRefreshKey((prevKey) => prevKey + 1); // Increment refreshKey to trigger re-render of this component
    handleUpdate(); // pour mettre à jour le parent et donc la note moyenne du livre
  };

  useEffect(() => {
    // findBookCatInUserLibraryFirebase(bookInfos?.id, userId).then((res) =>
    //   setBookInMyBooks(res)
    // );
  }, [bookInfos, currentUserId]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}> */}
      {userBookStatusState ? (
        <div
          className={cn(
            "relative flex flex-col p-1 rounded-sm mb-4",
            getStatusColor(userBookStatusState)
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <div
              className={cn(
                "border border-border bg-secondary/60 p-4 shadow-md rounded-md shadow-foreground/70",
                getStatusColor(userBookStatusState)
              )}
            >
              {userBookStatusState === BookStatusValues.READ && (
                <div className="flex justify-center gap-2">
                  <p>Je l'ai lu !</p>
                  <Check className="rounded-full bg-primary/50 p-1  shadow-sm shadow-foreground" />
                </div>
              )}
              {userBookStatusState === BookStatusValues.IN_PROGRESS && (
                <div className="flex justify-center gap-2 items-center">
                  <p>Je suis en train de le lire</p>
                  <Ellipsis className="rounded-full bg-primary/50 p-1  shadow-sm shadow-foreground" />
                </div>
              )}
              {userBookStatusState === BookStatusValues.TO_READ && (
                <div className="flex justify-center gap-2">
                  <p>J'aimerais le lire</p>
                  <Smile className="rounded-full bg-primary/50 p-1  shadow-sm shadow-foreground" />
                </div>
              )}
            </div>
            <AlertDialog>
              <AlertDialogTrigger>
                {/* <Button
                 // role="button"
                 className="bg-red-600/70 flex items-center gap-1"
               > */}
                <div
                  className="px-4 py-2 rounded cursor-pointer bg-red-600/70 flex items-center gap-1"
                  role="button"
                  //tabIndex={0}
                  //onKeyDown={(e) => e.key === "Enter" && setIsDialogOpen(true)}
                >
                  Supprimer
                  <X className="bottom-8 mr-0 text-destructive-foreground" />
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogDescription>
                    Cette action supprimera ce livre de votre bibliothèque.
                    Cette action est irréversible.
                  </AlertDialogDescription>
                  <AlertDialogTitle className="text-foreground">
                    Etes-vous sûrs de vouloir supprimer le livre de votre liste
                    de{" "}
                    <span className="font-bold text-muted">
                      {userBookStatusState === BookStatusValues.READ &&
                        "livres lus"}
                      {userBookStatusState === BookStatusValues.IN_PROGRESS &&
                        "livres en cours"}
                      {userBookStatusState === BookStatusValues.TO_READ &&
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
          {/* ????????????????????? */}
          {/* ????????????????????? */}
          {/* ????????VOIR PK BookUserInfo a 3 ID en props !!!!                   ????????????? */}
          {/* ????????VOIR PK BookUserInfo a 3 ID en props !!!!                   ????????????? */}
          {/* ????????VOIR PK BookUserInfo a 3 ID en props !!!!                   ????????????? */}
          {/* ????????VOIR PK BookUserInfo a 3 ID en props !!!!                   ????????????? */}
          {/* ????????????????????? */}
          {/* ????????????????????? */}
          <BookUserInfo
            key={refreshKey} // refreshKey = key to force re-render when bookInfos changed
            userViewId={currentUserId}
            //  userViewId=
            bookId={bookInfos.id}
            bookStatus={userBookStatusState}
            currentUserId={currentUserId}
          />
          <DialogTrigger asChild className="flex justify-center">
            {/* <Button
             className="m-auto md:mt-2 mb-6 h-10 w-full md:w-1/2 border-2 border-background bg-primary/60 shadow-md shadow-foreground/70"
             //onClick={() => form.reset(defaultValues)}
           > */}
            <div
              className="px-4 py-2 rounded cursor-pointer m-auto md:mt-2 mb-6 h-10 w-full md:w-1/2 border-2 border-background bg-primary/60 shadow-md shadow-foreground/70"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setIsDialogOpen(true)}
            >
              Modifier mes infos
            </div>
          </DialogTrigger>
        </div>
      ) : (
        <DialogTrigger asChild className="flex justify-center">
          {/* absolute -top-1 left-1/4  */}
          {/* <Button
            role="button"
            // onClick={() =>
            //   form.reset({
            //     bookStatus: BookStatusEnum.booksReadList,
            //     year: currentYear,
            //     month: 0,
            //     userNote: 0,
            //     userComments: "",
            //   })
            // }
            className="m-auto mb-6 h-12 w-1/2 border border-border bg-secondary/60 shadow-md shadow-foreground/70"
          > */}
          <div
            className="px-4 py-2 rounded cursor-pointer m-auto mb-6 h-12 w-1/2 border border-border bg-secondary/60 shadow-md shadow-foreground/70"
            role="button"
            //tabIndex={0}
            //onKeyDown={(e) => e.key === "Enter" && setIsDialogOpen(true)}
          >
            Ajouter à mes livres
          </div>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        {currentUserId && (
          <>
            <DialogHeader>
              {userBookStatusState ? (
                <DialogTitle>MODIFIER MES INFOS</DialogTitle>
              ) : (
                <DialogTitle>AJOUTER LIVRE</DialogTitle>
              )}
              <DialogDescription>{bookInfos?.title}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Form {...form}>
                <form
                  className="sticky top-10 z-10 flex flex-col gap-3 bg-background/70 duration-500"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
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
                            value={BookStatusValues.READ}
                            id="booksRead"
                          />
                          <Label htmlFor="read">Lu</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={BookStatusValues.IN_PROGRESS}
                            id="booksInProgress"
                          />
                          <Label htmlFor="booksInProgress">En cours</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={BookStatusValues.TO_READ}
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
                    render={(
                      {
                        //field
                      }
                    ) => (
                      <FormItem>
                        <div>
                          {/* <MemoizedTextarea control={form.control} /> */}

                          {/* <Textarea placeholder="Mes commentaires" {...field} /> */}
                          <Textarea
                            //{...field}
                            value={localComments}
                            onChange={(e) => setLocalComments(e.target.value)}
                            placeholder="Mes commentaires"
                          />
                          {/* <MemoizedTextarea
                            value={field.value}
                            onChange={field.onChange}
                          /> */}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {form.watch().bookStatus === BookStatusValues.READ && (
                    // ??? SUPPRIMER le composant MemoizedFormFields ???
                    // ??? SUPPRIMER le composant MemoizedFormFields ???
                    // ??? SUPPRIMER le composant MemoizedFormFields ???
                    // <MemoizedFormFields
                    //   year={year}
                    //   month={month}
                    //   userNote={userNote}
                    //   setValue={form.setValue}
                    //   control={form.control}
                    //   //form={form}
                    //   // currentYear={currentYear}
                    //   // MONTHS={MONTHS}
                    // />
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
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

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

                  <Button type="submit">OK</Button>
                </form>
              </Form>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddOrUpdateBookOrBookStatus;
