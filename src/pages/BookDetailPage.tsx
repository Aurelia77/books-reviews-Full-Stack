import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { defaultImage } from "@/constants";
import { addBookToReadFirebase, getDocsByQueryFirebase } from "@/firebase";
import { BookType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";

type SearchBooksFormType = {
  bookStatus: BookStatusEnum;
};

enum BookStatusEnum {
  read = "read",
  inProgress = "inProgress",
  toRead = "toRead",
}

const bookFormSchema = z.object({
  bookStatus: z.nativeEnum(BookStatusEnum),
});

const BookDetailPage = (): JSX.Element => {
  // const location = useLocation();
  // const { bookInfo }: { bookInfo: BookType } = location.state || {};
  // const { friendsWhoReadBook }: { friendsWhoReadBook: string[] } =
  //   location.state || {};

  // A VOIR UNDEFINED OU NULL ???????????????????
  const [bookInfo, setBookInfo] = useState<BookType | undefined>(undefined);
  const [friendsWhoReadBook] = useState<string[]>([]);
  // const [friendsWhoReadBook, setFriendsWhoReadBook] = useState<string[]>([]);

  // console.log("book", bookInfo);
  // console.log("img", bookInfo.bookImageLink);

  // récupérer l'id de l'url
  const { bookId } = useParams<{ bookId: string }>();

  const form = useForm<SearchBooksFormType>({
    resolver: zodResolver(bookFormSchema),
    // Tjs mettre des valeurs par défaut sinon ERREUR : Warning: A component is changing an uncontrolled input to be controlled
    defaultValues: {
      bookStatus: BookStatusEnum.read,
    },
  });

  const onSubmit: SubmitHandler<SearchBooksFormType> = (formData) =>
    console.log(formData);

  const formatDescription = (description: string) => {
    return description?.replace(/([.!?])\s*(?=[A-Z])/g, "$1\n");
  };

  useEffect(() => {
    if (bookId) {
      getDocsByQueryFirebase("books", "bookId", bookId).then((books) => {
        setBookInfo(books[0]);
      });

      // setFriendsWhoReadBook
      ///////////////////////////////
      ///////////////////////////////
      ///////////////////////////////
      ///////////////////////////////
    }
  }, [bookId]);

  return (
    <div className="min-h-screen pb-4">
      {bookInfo && (
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
            {bookInfo.bookLanguage}
          </CardDescription>

          <div className="flex items-start gap-5 p-5 py-12 shadow-xl shadow-primary/30">
            <img
              src={bookInfo.bookImageLink || defaultImage}
              onError={(e) => (e.currentTarget.src = defaultImage)}
              className="w-32 rounded-sm border border-border object-contain shadow-md shadow-foreground/70"
              alt={`Image de couverture du livre ${bookInfo?.bookTitle}`}
            />
            {/* Sozialwissenschaftliche */}
            {/* http://localhost:5173/books/FEKxFaJpFfwC   grand titre dc agrandit div img*/}
            {/* Sobrino aumentado o nuevo diccionario de las lenguas española,
          francesa y latina, compuesto de los mejores diccionarios, que hasta
          ahora han salido a luz dividido en tres tomos: ... con un diccionario
          abreviado de Geographia en donde se hallan los nombres de los reinos,
          ... Por Francisco Cormon, ... Tomo primero (-tercero) */}
            <CardHeader className="items-start gap-3 overflow-hidden">
              <CardTitle>{bookInfo?.bookTitle}</CardTitle>
              <CardDescription className="text-muted">
                {bookInfo?.bookAuthor}
              </CardDescription>
              <div className="grid grid-cols-2 gap-x-8">
                {bookInfo?.bookCategories?.map((cat, index) => (
                  <CardDescription key={index}>{cat}</CardDescription>
                ))}
              </div>
            </CardHeader>
          </div>
          <CardContent className="relative bg-secondary/30 pb-6 pt-12 shadow-md shadow-primary/30">
            <Button
              onClick={() => addBookToReadFirebase(bookInfo)}
              className="absolute -top-6 left-1/4 h-12 w-1/2 border border-border bg-secondary/60 shadow-md shadow-foreground/70"
            >
              Ajouter à mes livres
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  onClick={() => addBookToReadFirebase(bookInfo)}
                  className="absolute -top-6 left-1/4 h-12 w-1/2 border border-border bg-secondary/60 shadow-md shadow-foreground/70"
                >
                  Ajouter à mes livres
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Ajouter le livre :</DialogTitle>
                  <DialogDescription>{bookInfo?.bookTitle}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Form {...form}>
                    <form
                      className="sticky top-10 z-10 flex flex-col gap-3 bg-background/70 duration-500"
                      onSubmit={form.handleSubmit(onSubmit)}
                    >
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
                      </RadioGroup>
                    </form>
                  </Form>
                </div>
                <DialogFooter>
                  <Button type="submit">Ajouter</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {/* <p>{bookInfo.bookDescription}</p> */}
            <p style={{ whiteSpace: "pre-line" }}>
              {formatDescription(bookInfo.bookDescription)}
            </p>
          </CardContent>
          {friendsWhoReadBook.length > 0 && (
            <CardFooter className="bg-gray-500/40">
              <div className="flex flex-row gap-5">
                <p className="font-semibold">Dans liste :</p>
                {friendsWhoReadBook.map((friend, index) => (
                  <p key={index}>{friend}</p>
                ))}
              </div>
            </CardFooter>
          )}
        </Card>
      )}
    </div>
  );
};

export default BookDetailPage;
