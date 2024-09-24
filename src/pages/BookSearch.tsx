import BookInfos from "@/components/BookInfos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { books, users } from "@/data";
import { BookType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
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

type InputsFormType = {
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
    message: "Entrez un titre ou un auteur",
    path: ["bookTitle"], // Vous pouvez choisir où afficher l'erreur
  });

const BookSearch = () => {
  const [booksFromBDD, setBooksFromBDD] = useState(books);

  // FORMULAIRE
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<InputsFormType>({ resolver: zodResolver(bookFormSchema) });

  const title = watch("bookTitle");
  //const author = watch("bookAuthors");
  // const title = watch("bookTitle") || "aliénor d'aquitaine";
  // const author = watch("bookAuthors") || "elizabeth chadwick";
  console.log("title", title);

  const onSubmit: SubmitHandler<InputsFormType> = (formData) =>
    console.log(formData);

  // APPEL API
  const [searchUrl, setSearchUrl] = useState("");

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

    console.log("123", chars[randomIndex]);
    return chars[randomIndex];
  };

  useEffect(() => {
    console.log("getRandomChar", getRandomChar());

    if (!title) {
      setSearchUrl(
        `https://www.googleapis.com/books/v1/volumes?q=${getRandomChar()}&maxResults=${MAX_RESULTS}`
        // `https://www.googleapis.com/books/v1/volumes?q=subject:general&maxResults=${MAX_RESULTS}`
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

  console.log("books", booksFromBDD);
  console.log("***data", data);

  //////////////////////////

  const friendsWhoReadBook = (bookId: string): string[] => {
    return users
      .filter((user) => user.booksRead.includes(bookId))
      .map((user) => user.username);
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <h1 className="text-4xl">Recherche de livre</h1>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center gap-2">
          <div className="flex flex-[90%] flex-col gap-2">
            <Input
              type="text"
              placeholder="Titre"
              {...register("bookTitle", {
                required: true, // pas besoin apparemment...... car déjà dans schéma ZOD !!!
              })}
            />
            {errors.bookTitle && (
              <span className=" text-destructive">
                {errors.bookTitle.message}
              </span>
            )}
            <Input
              type="text"
              placeholder="Auteur"
              {...register("bookAuthors", {
                required: true,
              })}
            />
          </div>
          <Search className="text-primary/60 drop-shadow-lg" size={40} />
        </div>
        <RadioGroup defaultValue={BookStatusEnum.read}>
          <Controller
            name="bookStatus"
            control={control}
            defaultValue={BookStatusEnum.read}
            render={({ field }) => (
              <RadioGroup value={field.value} onValueChange={field.onChange}>
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
                  <RadioGroupItem value={BookStatusEnum.toRead} id="toRead" />
                  <Label htmlFor="toRead">À lire</Label>
                </div>
              </RadioGroup>
            )}
          />
        </RadioGroup>
        <Button type="submit">Ajouter</Button>
      </form>
      {isLoading ? (
        <span className="text-primary">LOADING........................</span>
      ) : (
        data && (
          <div className="mb-40">
            <ul>
              {data.map((book: BookType) => {
                console.log(friendsWhoReadBook(book.id));
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
  );
};

export default BookSearch;
