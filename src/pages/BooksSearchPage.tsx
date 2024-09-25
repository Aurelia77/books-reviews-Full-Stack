import BookInfos from "@/components/BookInfos";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
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
import { books } from "@/data";
import { friendsWhoReadBook } from "@/lib/utils";
import { BookType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";
import useSWR from "swr";
import { z } from "zod";

const MAX_RESULTS = 2; // pas plus de 40

type BookAPIType = {
  id: string;
  volumeInfo: {
    title: string;
    authors: string[];
    imageLinks: {
      thumbnail: string;
      smallThumbnail: string;
    };
    language: string;
    description: string;
    categories: string[];
    pageCount: number;
    publishedDate: string;
    publisher: string;
  };
};

type SearchBooksFormType = {
  bookTitle: string;
  bookAuthors: string;
  bookStatus: BookStatusEnum;
};

enum BookStatusEnum {
  read = "read",
  inProgress = "inProgress",
  toRead = "toRead",
}

const bookFormSchema = z
  .object({
    bookTitle: z.string().optional(),
    bookAuthors: z.string().optional(),
    bookStatus: z.nativeEnum(BookStatusEnum),
  })
  .refine((data) => data.bookTitle || data.bookAuthors, {
    message: "Entrez un titre ou un auteur.",
    path: ["bookTitle"],
  });

const BooksSearchPage = (): JSX.Element => {
  const [booksFromBDD, setBooksFromBDD] = useState(books);

  // FORMULAIRE
  const form = useForm<SearchBooksFormType>({
    resolver: zodResolver(bookFormSchema),
    // Tjs mettre des valeurs par défaut sinon ERREUR : Warning: A component is changing an uncontrolled input to be controlled
    defaultValues: {
      bookTitle: "",
      bookAuthors: "",
      bookStatus: BookStatusEnum.read,
    },
  });

  const title = form.watch("bookTitle");
  //const author = watch("bookAuthors");
  // const title = watch("bookTitle") || "aliénor d'aquitaine";
  // const author = watch("bookAuthors") || "elizabeth chadwick";
  //console.log("title", title);

  const onSubmit: SubmitHandler<SearchBooksFormType> = (formData) =>
    console.log(formData);

  // APPEL API
  const [searchUrl, setSearchUrl] = useState(
    `https://www.googleapis.com/books/v1/volumes?q=subject:general&maxResults=${MAX_RESULTS}`
  );

  // Fonction de mélange (shuffle) utilisant l'algorithme de Fisher-Yates
  const shuffleBooksArray = (array: BookType[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const fetcher = (...args: [RequestInfo, RequestInit?]): Promise<BookType[]> =>
    fetch(...args)
      .then((res: Response): Promise<{ items: BookAPIType[] }> => res.json())
      //.then((res) => res.json())    // idem sans TS
      .then((data) => data.items)
      .then((items) => {
        const booksFromAPI: BookType[] = items.map((book: BookAPIType) => {
          return {
            id: book.id,
            title: book.volumeInfo.title,
            author: book.volumeInfo?.authors?.[0] ?? "Auteur inconnu",
            description: book.volumeInfo.description,
            categories: book.volumeInfo.categories,
            pageCount: book.volumeInfo.pageCount,
            publishedDate: book.volumeInfo.publishedDate,
            publisher: book.volumeInfo.publisher,
            imageLink: book.volumeInfo.imageLinks?.thumbnail,
            language: book.volumeInfo.language,
          };
        });
        return booksFromAPI;
      })
      .then((booksFromAPI) => {
        const books = [...booksFromBDD, ...booksFromAPI];
        return shuffleBooksArray(books);
      });

  const { data, error, isLoading } = useSWR(searchUrl, fetcher);

  const getRandomChar = (): string => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    const randomIndex = Math.floor(Math.random() * chars.length);
    return chars[randomIndex];
  };

  useEffect(() => {
    if (!title) {
      setSearchUrl(
        //`https://www.googleapis.com/books/v1/volumes?q=subject:general&maxResults=${MAX_RESULTS}` => Tous les livres, mais toujours les mêmes résultats (même ordre)
        `https://www.googleapis.com/books/v1/volumes?q=${getRandomChar()}&maxResults=${MAX_RESULTS}`
      );
      setBooksFromBDD(books);
    } else {
      setSearchUrl(
        `https://www.googleapis.com/books/v1/volumes?q=${title}&maxResults=${MAX_RESULTS}`
      );
      setBooksFromBDD(
        books.filter((book) =>
          book.title.toLowerCase().includes(title.toLowerCase())
        )
      );
    }
  }, [title]);

  return (
    <div>
      <Title>Recherche de livre</Title>
      <div className="flex flex-col gap-6">
        <Form {...form}>
          <form
            className="flex flex-col gap-3 bg-foreground py-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="bookTitle"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Titre" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bookAuthors"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Auteur" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      <RadioGroupItem value={BookStatusEnum.read} id="read" />
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
            <Button type="submit">Ajouter</Button>
          </form>
        </Form>
        {/* <Search className="text-primary/60 drop-shadow-lg" size={40} /> */}
        {/*  */}
        {isLoading ? (
          <ClipLoader
            className="m-auto"
            color="#09f"
            loading={isLoading}
            size={36}
          />
        ) : (
          data && (
            <div className="mb-40 p-1">
              <ul>
                {data.map((book: BookType) => {
                  return (
                    <li key={book.id}>
                      <BookInfos
                        book={book}
                        friendsWhoReadBook={friendsWhoReadBook(book.id)}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          )
        )}
        {error && (
          <p className="text-destructive">
            Un problème est survenu lors de la recherche de livres.
          </p>
        )}
      </div>
    </div>
  );
};

export default BooksSearchPage;
