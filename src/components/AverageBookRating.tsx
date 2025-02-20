import { BookType } from "@/types";
import StarRating from "./StarRating";

const AverageBookRating = ({
  bookInfos,
}: {
  bookInfos: BookType;
}): JSX.Element => {
  return (
    <div className="flex gap-2">
      <p>
        {bookInfos.rating?.totalRating} / {bookInfos.rating?.count} ={" "}
        {bookInfos.rating?.totalRating / bookInfos.rating?.count}
      </p>
      <StarRating
        value={bookInfos.rating?.totalRating / bookInfos.rating?.count}
      />
      <p>({bookInfos.rating?.count} notation(s))</p>
    </div>
  );
};

export default AverageBookRating;
