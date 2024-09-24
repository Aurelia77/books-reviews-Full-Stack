import { defaultImage } from "@/constants";
import { BookType } from "@/types";
import { useLocation } from "react-router-dom";

const BookDetailPage = () => {
  const location = useLocation();
  const { book }: { book: BookType } = location.state || {};
  const { friendsWhoReadBook }: { friendsWhoReadBook: string[] } =
    location.state || {};

  const imageUrl = book.imageLink || defaultImage;
  console.log("book", book);

  return (
    <div
    // className="my-6 flex gap-4 shadow-xl shadow-primary/30"
    >
      <div className="m-4 flex flex-col items-center gap-4">
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
