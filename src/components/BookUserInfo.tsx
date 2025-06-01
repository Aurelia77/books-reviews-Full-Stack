import {
  getDocsByQueryFirebase,
  getUserInfosBookFirebase,
} from "@/firebase/firestore";
import useUserStore from "@/hooks/useUserStore";
import { MONTHS } from "@/lib/constants";
import { BookStatusEnum, UserInfoBookType, UserType } from "@/lib/types";
import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const BookUserInfo = ({
  userId,
  bookInfosId,
  bookStatus,
  friendBookStatus,
}: {
  userId: string | undefined;
  bookInfosId: string;
  bookStatus: BookStatusEnum | "";
  friendBookStatus?: BookStatusEnum | "";
}) => {
  const [userBookInfos, setUserBookInfos] = useState<UserInfoBookType>();
  const [userName, setUserName] = useState<string | null>(null);

  const { currentUser } = useUserStore();

  const status = (friendBookStatus || bookStatus) as BookStatusEnum;

  // Retrieve the information provided by the user (either the visited user if friendBookStatus !== "" or the logged-in user)
  useEffect(() => {
    if (friendBookStatus !== "" || bookStatus !== "") {
      getUserInfosBookFirebase(userId, bookInfosId, status).then((myBook) => {
        if (myBook) setUserBookInfos(myBook);
      });
    }
  }, [bookInfosId, bookStatus, friendBookStatus, userId, status]);

  useEffect(() => {
    getDocsByQueryFirebase<UserType>("users", "id", userId).then((user) => {
      if (user) {
        setUserName(user[0].userName);
      }
    });
  }, [userId]);

  return (
    userBookInfos && (
      <div>
        {/* For read books, we display extra info:
            - If the book was read by me, we show my info
            - If the book was read by the visited user,
              we show their info */}
        <div className="flex flex-col gap-3 rounded-sm bg-background/50 p-2 pr-6 md:p-3">
          <h2 className="font-semibold text-muted">
            {currentUser?.uid !== userId
              ? "Info et Avis de " + userName + "\u00A0:"
              : "Mes Infos et Avis :"}
          </h2>

          {status === BookStatusEnum.booksReadList && (
            <div className="flex items-center justify-around">
              <p>
                {userBookInfos &&
                  userBookInfos.month !== undefined &&
                  userBookInfos.month !== null &&
                  userBookInfos.month !== 0 &&
                  `   ${MONTHS[userBookInfos?.month]} `}
                {userBookInfos?.year}
              </p>
              {userBookInfos.userNote ? (
                <StarRating value={userBookInfos.userNote} forReadBook />
              ) : (
                <p className="italic">Aucune note</p>
              )}
            </div>
          )}

          <p className="whitespace-pre-wrap">
            {userBookInfos?.userComments ? (
              userBookInfos.userComments
            ) : (
              <span className="italic">Aucun commentaire</span>
            )}
          </p>
        </div>
      </div>
    )
  );
};

export default BookUserInfo;
