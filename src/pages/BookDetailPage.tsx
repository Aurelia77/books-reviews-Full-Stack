import CustomLinkButton from "@/components/CustomLinkButton";
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

  //console.log("book", book);

  return (
    <div
    // className="my-6 flex gap-4 shadow-xl shadow-primary/30"
    >
      <Card className="m-4">
        <div
          className={cn(
            "flex gap-1 shadow-xl shadow-primary/30 p-3 bg-ring/55 text-foreground ",
            friendsWhoReadBook.length > 0 && "bg-ring/80"
          )}
        >
          <img
            src={imageUrl}
            onError={() => setImageUrl(defaultImage)}
            className="w-32 rounded-sm object-contain"
            alt="Image de couverture du livre"
          />
          <CardHeader>
            <CardTitle>{book.title}</CardTitle>
            <CardTitle>{book.title}</CardTitle>
            <CardTitle>{book.title}</CardTitle>
            <CardTitle>{book.title}</CardTitle>
            <CardTitle>{book.title}</CardTitle>
            <CardTitle>{book.title}</CardTitle>
            <CardTitle>{book.title}</CardTitle>
            <CardTitle>{book.title}</CardTitle>
            <CardDescription>{book.author}</CardDescription>
          </CardHeader>
          {/* <CardContent>
          <p>Card Content</p>
        </CardContent> */}
        </div>
        <CardContent className="mt-6">
          <p>{book.description}</p>
        </CardContent>
        {friendsWhoReadBook.length > 0 && (
          <CardFooter>
            <div className="flex flex-row gap-5">
              <p className="font-semibold">Dans liste :</p>

              {friendsWhoReadBook.map((friend, index) => (
                <p key={index}>{friend}</p>
              ))}
            </div>
          </CardFooter>
        )}
      </Card>
      <CustomLinkButton linkTo="/">Ajouter à mes livres</CustomLinkButton>
    </div>
  );
};

export default BookDetailPage;
