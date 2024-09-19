import BackPageArrow from "@/components/BackPageArrow";
import { defaultImage } from "@/constants";
import clsx from "clsx";
import { useLocation } from "react-router-dom";

const BookDetailPage = () => {
  const location = useLocation();
  const { book } = location.state || {};

  const imageUrl = book.volumeInfo.imageLinks?.thumbnail || defaultImage;
  console.log("book", book);

  return (
    <div
    // className="my-6 flex gap-4 shadow-xl shadow-primary/30"
    >
      <BackPageArrow />
      <div className="m-4 flex flex-col items-center gap-4">
        <p className="text-lg font-semibold">{book.volumeInfo?.title}</p>
        <div>
          <img
            src={imageUrl}
            className={clsx(imageUrl == defaultImage ? "w-32" : "")}
            alt="Image de couverture du livre"
          />
        </div>
        <div>
          {book.volumeInfo?.authors.map((author: string) => {
            return <p key={author}>{author}</p>;
          })}
        </div>
        <p className="line-clamp-3">{book.volumeInfo?.description}</p>
        {book.volumeInfo?.categories &&
          book.volumeInfo.categories.map((cat: string) => {
            return <p key="cat">{cat}</p>;
          })}
        <p>{book.volumeInfo?.language}</p>
      </div>
    </div>
  );
};

export default BookDetailPage;
