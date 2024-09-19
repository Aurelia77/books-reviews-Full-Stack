import BackPageArrow from "@/components/BackPageArrow";
import BookInfos from "@/components/bookInfos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BookData } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import useSWR from "swr";
import { z } from "zod";

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
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<InputsFormType>({ resolver: zodResolver(bookFormSchema) });

  const onSubmit: SubmitHandler<InputsFormType> = (formData) =>
    console.log(formData);

  const title = watch("bookTitle");
  const author = watch("bookAuthors");
  // const title = watch("bookTitle") || "aliénor d'aquitaine";
  // const author = watch("bookAuthors") || "elizabeth chadwick";

  const fetcher = (...args: [RequestInfo, RequestInit?]): Promise<BookData[]> =>
    fetch(...args)
      .then((res) => res.json())
      .then((data) => data.items);

  const { data, error, isLoading } = useSWR(
    `https://www.googleapis.com/books/v1/volumes?q=${title}`,
    // `https://www.googleapis.com/books/v1/volumes?q=${title}+inauthor:${author}`,
    fetcher
  );

  return (
    <div className="flex flex-col gap-6 p-4">
      <BackPageArrow />
      {/* <Link to="/myBooks">
        <ArrowLeft />
      </Link> */}
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
      {isLoading && (
        <span className="text-primary">LOADING........................</span>
      )}
      {data && (
        <div>
          <ul>
            {data.map((book: BookData) => (
              <li key={book.id}>
                <BookInfos book={book} />
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
    </div>
  );
};

export default BookSearch;
