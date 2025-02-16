import { BookType } from "@/types";
import StarRating from "./StarRating";

const AverageBookRating = ({
  bookInfos,
}: {
  bookInfos: BookType;
}): JSX.Element => {
  return bookInfos.rating?.count > 0 ? (
    <div className="flex gap-2">
      <p>
        {bookInfos.rating?.totalRating} / {bookInfos.rating?.count} ={" "}
        {bookInfos.rating?.totalRating / bookInfos.rating?.count}
      </p>
      <StarRating
        value={bookInfos.rating?.totalRating / bookInfos.rating?.count}
      />
      <p>({bookInfos.rating?.count} avis)</p>
    </div>
  ) : (
    <p className="italic">Les membres n'ont pas encore noté ce livre.</p>
  );
};

export default AverageBookRating;
