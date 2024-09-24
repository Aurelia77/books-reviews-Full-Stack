import { defaultImage } from "@/constants";
import { cn } from "@/lib/utils";
import { BookType } from "@/types";
import { useState } from "react";
import { Link } from "react-router-dom";

// aliénor d'aquitaine l'été
const BookInfos = ({
  book,
  friendsWhoReadBook,
}: {
  book: BookType;
  friendsWhoReadBook: string[];
}) => {
  const [imageSrc, setImageSrc] = useState(book.imageLink || defaultImage);

  const handleImageError = () => {
    // if image not found
    setImageSrc(defaultImage);
  };

  console.log("friendsWhoReadBook", friendsWhoReadBook);

  return (
    <Link
      to={`/mybooks/searchbook/${book.id}`}
      state={{ book, friendsWhoReadBook }}
    >
      <div
        className={cn(
          "my-6 flex gap-4 shadow-xl shadow-primary/30",
          friendsWhoReadBook.length > 0 && "bg-primary/10"
        )}
      >
        <img
          src={imageSrc}
          onError={handleImageError}
          className="w-32"
          alt="Image de couverture du livre"
        />
        <div>
          <p className="line-clamp-2 text-lg font-semibold">{book.title}</p>
          <p className="line-clamp-2 text-lg">{book.author}</p>
        </div>
        {/* <p>{book.volumeInfo?.language}</p>
      <p className="line-clamp-3">{book.volumeInfo?.description}</p>
      <p>{book.volumeInfo?.authors}</p>
      {book.volumeInfo?.categories &&
        book.volumeInfo.categories.map((cat) => {
          return <p key="cat">{cat}</p>;
        })} */}
        <div className="ml-auto">
          <p className="font-semibold">Liste :</p>
          {friendsWhoReadBook.map((friend, index) => (
            <p key={index}>{friend}</p>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default BookInfos;
