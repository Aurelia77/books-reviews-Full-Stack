import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import useSWR from "swr";
import { z } from "zod";

type InputsFormType = {
  bookTitle: string;
  bookAuthors: string;
  bookStatus: BookStatusEnum;
};

type BookData = {
  items: {
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
    };
  }[];
  //title: string;
  //bookStatus: BookStatusEnum;
  // authors: string[];
  // description: string;
  // categories: string[];
  // pageCount: number;
  // publishedDate: string;
  // publisher: string;
  // imageLinks: {
  //   thumbnail: string;
  // };
};

enum BookStatusEnum {
  read = "read",
  inProgress = "inProgress",
  toRead = "toRead",
}

const bookSchema = z.object({
  bookTitle: z.string(),
  bookStatus: z.nativeEnum(BookStatusEnum),
  bookAuthors: z.string(),
});

const NewBook = () => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<InputsFormType>({ resolver: zodResolver(bookSchema) });

  const onSubmit: SubmitHandler<InputsFormType> = (data) => console.log(data);

  console.log("pour API", watch("bookTitle"));

  const fetcher = (...args: [RequestInfo, RequestInit?]): Promise<BookData> => {
    console.log("args :", args);
    return fetch(...args).then((res) => res.json());
  };

  const title = watch("bookTitle") || "aliénor d'aquitaine";
  const author = "elizabeth chadwick";

  const { data, error, isLoading } = useSWR(
    `https://www.googleapis.com/books/v1/volumes?q=${title}+inauthor:${author}`,
    fetcher
  );

  // const { data, error, isLoading } = useSWR(
  //   // "https://books.google.com/ebooks?id=buc0AAAAMAAJ&dq=holmes&as_brr=4&source=webstore_bookcard",
  //   "https://www.googleapis.com/books/v1/volumes?q=flowers+inauthor:keyes&key=" +
  //     "AIzaSyDLxUk1K2HPfbsyj41cGGSGZ_LFxrMa3SM",

  //   fetcher
  // );

  if (data) console.log(data);
  if (data) console.log(data.items[0]);
  if (data) console.log(data.items[0].volumeInfo);
  // if (data) console.log(data.items[1].volumeInfo.title);
  // if (data) console.log(data.items[1].volumeInfo.authors);
  // if (data) console.log(data.items[1].volumeInfo.categories);
  // if (data) console.log(data.items[2].volumeInfo.title);
  // if (data) console.log(data.items[2].volumeInfo.authors);
  // if (data) console.log(data.items[2].volumeInfo.categories);
  // if (data) console.log(data.items[3].volumeInfo.title);
  // if (data) console.log(data.items[3].volumeInfo.authors);
  // if (data) console.log(data.items[3].volumeInfo.categories);

  return (
    <div>
      {/* {data && <p>{data.items[0].}</p>} */}

      <h1 className="text-5xl">Nouveau livre</h1>
      <form
        className="flex flex-col gap-2 p-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          type="text"
          placeholder="Titre"
          {...register("bookTitle", {
            required: true,
          })}
        />
        {/* {errors.bookTitle && (
          <span className="font-bold text-destructive">Entrer un titre</span>
        )} */}
        <Input
          type="text"
          placeholder="Auteur"
          {...register("bookAuthors", {
            required: true,
          })}
        />
        {/* {errors.bookAuthors && (
          <span className="font-bold text-destructive">Entrer un auteur ou un titre</span>
        )} */}
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
        {isLoading && (
          <span className="text-primary">LOADING........................</span>
        )}
        {data && (
          <div>
            <h2>Résultats de la recherche</h2>
            {/* KEY : id ok ? */}
            <ul className="divide-y-8">
              {data.items.map((book: BookData["items"][0]) => (
                <li key={book.id}>
                  <p>1.{book.volumeInfo?.title}</p>
                  {book.volumeInfo.imageLinks?.thumbnail && (
                    <img
                      src={book.volumeInfo.imageLinks.thumbnail}
                      alt="Image de couverture du livre"
                    />
                  )}
                  <p>{book.volumeInfo?.authors}</p>
                  <p>{book.volumeInfo?.language}</p>
                  <p className="line-clamp-3">{book.volumeInfo?.description}</p>
                  <p>{book.volumeInfo?.authors}</p>
                  {book.volumeInfo?.categories &&
                    book.volumeInfo.categories.map((cat) => {
                      return <p key="cat">{cat}</p>;
                    })}
                </li>
              ))}
            </ul>
          </div>
        )}

        {error && (
          <p className="text-destructive">
            Un problème est survenu lors de la recherche de livres.
          </p>
        )}
      </form>
    </div>
  );
};

export default NewBook;
