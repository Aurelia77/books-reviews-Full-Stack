import { BookType } from "@/lib/types";
import StarRating from "./StarRating";

const AverageBookRating = ({ bookInfos }: { bookInfos: BookType }) => {
  return (
    <div className="flex gap-2 justify-around items-center">
      <StarRating value={bookInfos.totalRating / bookInfos.countRating} />
      {/* <p className="text-xs">
        {bookInfos.rating?.totalRating} / {bookInfos.countRating}=
        {bookInfos.rating?.totalRating / bookInfos.countRating}
      </p> */}
      <p>sur {bookInfos.countRating} avis</p>
    </div>
  );
};

export default AverageBookRating;
