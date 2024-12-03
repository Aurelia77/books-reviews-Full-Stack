import { getMyInfosBookFirebase } from "@/firebase/firestore";
import { BookType, MyInfoBookType } from "@/types";
import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const MyInfoBook = ({
  currentUserId,
  bookInfos,
}: {
  currentUserId: string | undefined;
  bookInfos: BookType | undefined;
}) => {
  const [myBookInfos, setMyBookInfos] = useState<MyInfoBookType>();

  useEffect(() => {
    if (bookInfos)
      getMyInfosBookFirebase(currentUserId, bookInfos.id).then((myBook) => {
        if (myBook) setMyBookInfos(myBook);
      });
  }, [bookInfos?.id]);

  return (
    myBookInfos && (
      <div>
        <div className="flex items-center gap-4">
          <h2 className="font-semibold text-muted">J'ai lu ce livre</h2>
        </div>
        <p>{myBookInfos?.year}</p>
        <StarRating value={myBookInfos.note ?? 0} />
        <p className=" whitespace-pre-wrap">{myBookInfos?.description}</p>
      </div>
    )
  );
};

export default MyInfoBook;
