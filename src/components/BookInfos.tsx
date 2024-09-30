import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { defaultImage } from "@/constants";
import { cn } from "@/lib/utils";
import { BookType } from "@/types";
import { useState } from "react";
import { Link } from "react-router-dom";

const BookInfos = ({
  book,
  friendsWhoReadBook,
}: {
  book: BookType;
  friendsWhoReadBook: string[];
}): JSX.Element => {
  const [imageUrl, setImageUrl] = useState(book.imageLink || defaultImage);

  //console.log("friendsWhoReadBook", friendsWhoReadBook);

  return (
    <Link to={`/books/${book.id}`} state={{ book, friendsWhoReadBook }}>
      <Card className="mb-3">
        <div
          className={cn(
            "flex gap-1 shadow-xl shadow-primary/30 p-3 bg-ring/55 text-foreground",
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
            <CardTitle className="line-clamp-3">{book.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {book.author}
            </CardDescription>
          </CardHeader>
          {/* <CardContent>
          <p>Card Content</p>
        </CardContent> */}
        </div>
        {friendsWhoReadBook.length > 0 && (
          <CardFooter>
            <div className="mt-6 flex flex-row gap-5">
              <p className="font-semibold">Dans liste de :</p>

              {friendsWhoReadBook.map((friend, index) => (
                <p key={index}>{friend}</p>
              ))}
            </div>
          </CardFooter>
        )}
      </Card>
    </Link>
  );
};

export default BookInfos;
