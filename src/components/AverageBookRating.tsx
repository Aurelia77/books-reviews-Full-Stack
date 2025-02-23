import { BookType } from "@/types";
import StarRating from "./StarRating";

const AverageBookRating = ({
  bookInfos,
}: {
  bookInfos: BookType;
}): JSX.Element => {
  return (
    <div className="flex gap-2 justify-around">
      <StarRating
        value={bookInfos.rating?.totalRating / bookInfos.rating?.count}
      />
      {/* <p className="text-xs">
        {bookInfos.rating?.totalRating} / {bookInfos.rating?.count}=
        {bookInfos.rating?.totalRating / bookInfos.rating?.count}
      </p> */}
      <p>sur {bookInfos.rating?.count} avis</p>
    </div>
  );
};

export default AverageBookRating;
