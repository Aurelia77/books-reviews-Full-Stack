import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { defaultImage } from "@/constants";
import { cn } from "@/lib/utils";
import { BookType } from "@/types";
import { useState } from "react";
import { useLocation } from "react-router-dom";

const BookDetailPage = (): JSX.Element => {
  const location = useLocation();
  const { book }: { book: BookType } = location.state || {};
  const { friendsWhoReadBook }: { friendsWhoReadBook: string[] } =
    location.state || {};

  const [imageUrl, setImageUrl] = useState(book.imageLink || defaultImage);

  console.log("book", book);

  return (
    <div
    // className="my-6 flex gap-4 shadow-xl shadow-primary/30"
    >
      <Card className="mb-3">
        <div
          className={cn(
            "flex gap-4 shadow-xl shadow-primary/30 p-2 bg-ring/55 text-foreground",
            friendsWhoReadBook.length > 0 && "bg-ring/80"
          )}
        >
          <img
            src={imageUrl}
            onError={() => setImageUrl(defaultImage)}
            className="w-32 rounded-sm"
            alt="Image de couverture du livre"
          />
          <CardHeader>
            <CardTitle>{book.title}</CardTitle>
            <CardDescription>{book.author}</CardDescription>
          </CardHeader>
          {/* <CardContent>
          <p>Card Content</p>
        </CardContent> */}
        </div>
        {friendsWhoReadBook.length > 0 && (
          <CardFooter>
            <div className="mt-6 flex flex-row gap-5">
              <p className="font-semibold">Dans liste :</p>

              {friendsWhoReadBook.map((friend, index) => (
                <p key={index}>{friend}</p>
              ))}
            </div>
          </CardFooter>
        )}
      </Card>
      <Card className="m-4">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>

      <div className="m-4 flex flex-col items-center gap-4 bg-foreground p-2">
        <p className="text-lg font-semibold">{book.title}</p>
        <div>
          <img
            src={imageUrl}
            // className={cn(imageUrl == defaultImage ? "w-32" : "")}
            className="w-32" // ???
            alt="Image de couverture du livre"
          />
        </div>
        <p className="text-lg">{book.author}</p>
        <p className="line-clamp-3">{book.description}</p>
        {book.categories &&
          book.categories.map((cat: string) => {
            return <p key="cat">{cat}</p>;
          })}
        <p>{book.language}</p>
        <div className="">
          <p className="font-semibold">Liste de mes amis :</p>
          {friendsWhoReadBook.map((friend, index) => (
            <p key={index}>{friend}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
