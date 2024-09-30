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
import { addBookToReadFirebase } from "@/firebase";
import { cn } from "@/lib/utils";
import { BookType } from "@/types";
import { useLocation } from "react-router-dom";

const BookDetailPage = (): JSX.Element => {
  const location = useLocation();
  const { bookInfo }: { bookInfo: BookType } = location.state || {};
  const { friendsWhoReadBook }: { friendsWhoReadBook: string[] } =
    location.state || {};

  console.log("book", bookInfo);
  console.log("img", bookInfo.bookImageLink);

  return (
    <div
    // className="my-6 flex gap-4 shadow-xl shadow-primary/30"
    >
      <Card className="m-4">
        <div
          className={cn(
            "flex gap-1 shadow-xl shadow-primary/30 p-3 bg-ring/55",
            friendsWhoReadBook.length > 0 && "bg-ring/80"
          )}
        >
          <img
            src={bookInfo.bookImageLink || defaultImage}
            onError={(e) => (e.currentTarget.src = defaultImage)}
            className="w-32 rounded-sm"
            alt="Image de couverture du livre"
          />
          <CardHeader className="">
            <CardTitle>{bookInfo?.bookTitle}</CardTitle>
            <CardDescription>{bookInfo?.bookAuthor}</CardDescription>
            <CardDescription>{bookInfo?.bookLanguage}</CardDescription>
            {bookInfo?.bookCategories?.map((cat) => (
              <div key={bookInfo.bookId} className="flex gap-2">
                <CardDescription>{cat}</CardDescription>
              </div>
            ))}
          </CardHeader>
          {/* <CardContent>
          <p>Card Content</p>
        </CardContent> */}
        </div>
        <CardContent className="mt-6">
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
      <CustomLinkButton
        //linkTo="/"
        onClick={() => addBookToReadFirebase(bookInfo)}
      >
        Ajouter à mes livres
      </CustomLinkButton>
    </div>
  );
};

export default BookDetailPage;
