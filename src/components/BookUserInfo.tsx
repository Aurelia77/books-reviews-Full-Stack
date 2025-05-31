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
  //console.log("555 userId", userId);
  //console.log("555 bookInfosId", bookInfosId);
  //console.log("555 bookStatus", bookStatus);
  //console.log("555 friendBookStatus", friendBookStatus);

  const [userBookInfos, setUserBookInfos] = useState<UserInfoBookType>();

  //console.log("789", userBookInfos?.month);

  const { currentUser } = useUserStore();

  const status = (friendBookStatus || bookStatus) as BookStatusEnum;

  const [userName, setUserName] = useState<string | null>(null);

  // Récupérer les infos données par l'utilisateur (soit le user visité si friendBookStatus !== "" soit le user connecté)
  useEffect(() => {
    if (friendBookStatus !== "" || bookStatus !== "") {
      //console.log("ok123");
      //console.log("5551 bookStatus", bookStatus);
      //console.log("5551 friendBookStatus", friendBookStatus);
      //console.log("5551 status", status);
      getUserInfosBookFirebase(userId, bookInfosId, status).then((myBook) => {
        if (myBook) setUserBookInfos(myBook);
      });
    }
  }, [bookInfosId, bookStatus, friendBookStatus, userId, status]);
  //}, [bookInfos?.id]);  // pbm info autre membre ne s'affichaient pas, ms j'ai l'impression que maintenant ça marche même qd il manque des dépendances ??????

  ////console.log("444 bookInfos", bookInfos?.title, bookStatus);
  //console.log("444 userId", userId);
  //console.log("444 userBookInfos", userBookInfos);
  //console.log("444 bookStatus", bookStatus);

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
        {/* Pour les livres lus on a des info en plus :
                     - Livre lu par moi => on affiche mes info données sur ce livre,
                     - Livre lu par le user visité => on affiche ses info */}
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
