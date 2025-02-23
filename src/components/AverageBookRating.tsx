import { BookType } from "@/types";
import StarRating from "./StarRating";

const AverageBookRating = ({
  bookInfos,
}: {
  bookInfos: BookType;
}): JSX.Element => {
  return (
    <div className="flex gap-2">
      <StarRating
        value={bookInfos.rating?.totalRating / bookInfos.rating?.count}
      />
      <p className="text-xs">
        {bookInfos.rating?.totalRating} / {bookInfos.rating?.count}=
        {bookInfos.rating?.totalRating / bookInfos.rating?.count}
      </p>
      <p>({bookInfos.rating?.count} notation(s))</p>
    </div>
  );
};

export default AverageBookRating;
