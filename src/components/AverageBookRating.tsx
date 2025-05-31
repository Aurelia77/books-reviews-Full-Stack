import { BookType } from "@/lib/types";
import StarRating from "./StarRating";

const AverageBookRating = ({
  bookInfos,
}: {
  bookInfos: BookType;
}): JSX.Element => {
  return (
    <div className="flex items-center justify-around gap-2">
      <StarRating
        value={bookInfos.rating?.totalRating / bookInfos.rating?.count}
      />
      <p>sur {bookInfos.rating?.count} avis</p>
    </div>
  );
};

export default AverageBookRating;
