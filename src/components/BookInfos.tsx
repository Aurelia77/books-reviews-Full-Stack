import { BookData } from "@/types";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { defaultImage } from "@/constants";

// aliénor d'aquitaine l'été
const BookInfos = ({ book }: { book: BookData }) => {
  const imageUrl = book.volumeInfo.imageLinks?.thumbnail || defaultImage;

  return (
    <Link to={`/mybooks/searchbook/${book.id}`} state={{ book }}>
      <div className="my-6 flex gap-4 shadow-xl shadow-primary/30">
        <img
          src={imageUrl}
          className={clsx(imageUrl == defaultImage ? "w-32" : "")}
          alt="Image de couverture du livre"
        />
        <div>
          <p className="line-clamp-2 text-lg font-semibold">
            {book.volumeInfo?.title}
          </p>
          {book.volumeInfo?.authors.map((author: string) => {
            return <p key={author}>{author}</p>;
          })}
        </div>
        {/* <p>{book.volumeInfo?.language}</p>
      <p className="line-clamp-3">{book.volumeInfo?.description}</p>
      <p>{book.volumeInfo?.authors}</p>
      {book.volumeInfo?.categories &&
        book.volumeInfo.categories.map((cat) => {
          return <p key="cat">{cat}</p>;
        })} */}
      </div>
    </Link>
  );
};

export default BookInfos;
