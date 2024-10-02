import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { defaultImage } from "@/constants";
import { addBookToReadFirebase } from "@/firebase";
import { BookType } from "@/types";
import { Star } from "lucide-react";
import { useLocation } from "react-router-dom";

const BookDetailPage = (): JSX.Element => {
  const location = useLocation();
  const { bookInfo }: { bookInfo: BookType } = location.state || {};
  const { friendsWhoReadBook }: { friendsWhoReadBook: string[] } =
    location.state || {};

  console.log("book", bookInfo);
  console.log("img", bookInfo.bookImageLink);

  return (
    <div className="pb-4">
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

        <div className="flex gap-5 p-5 py-12 shadow-xl shadow-primary/30">
          <img
            src={bookInfo.bookImageLink || defaultImage}
            onError={(e) => (e.currentTarget.src = defaultImage)}
            className="w-32 rounded-sm object-contain"
            alt={`Image de couverture du livre ${bookInfo?.bookTitle}`}
          />

          {/* Sozialwissenschaftliche */}

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
          {/* <CardContent>
          <p>Card Content</p>
        </CardContent> */}
        </div>
        <CardContent className="relative bg-secondary/30 pb-6 pt-12 shadow-xl shadow-primary/30">
          <Button
            onClick={() => addBookToReadFirebase(bookInfo)}
            className="absolute -top-5 left-1/4 h-12 w-1/2 bg-secondary/70"
          >
            Ajouter à mes livres
          </Button>
          <p>{bookInfo.bookDescription}</p>
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
    </div>
  );
};

export default BookDetailPage;
