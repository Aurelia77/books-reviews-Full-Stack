import { getUserInfosBookFirebase } from "@/firebase/firestore";
import useUserStore from "@/hooks/useUserStore";
import { cn } from "@/lib/utils";
import { BookStatusEnum, BookType, MyInfoBookType } from "@/types";
import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const BookUserInfo = ({
  userId,
  bookInfos,
  bookStatus,
  friendBookStatus,
}: {
  userId: string | undefined;
  bookInfos: BookType;
  bookStatus: BookStatusEnum | "";
  friendBookStatus?: BookStatusEnum | "";
}) => {
  console.log("555 userId", userId);
  console.log("555 bookInfos", bookInfos);
  console.log("555 bookStatus", bookStatus);
  console.log("555 friendBookStatus", friendBookStatus);

  const [userBookInfos, setUserBookInfos] = useState<MyInfoBookType>();

  const { currentUser } = useUserStore();

  const status = (friendBookStatus || bookStatus) as BookStatusEnum;

  // Récupérer les infos données par l'utilisateur (soit le user visité si friendBookStatus !== "" soit le user connecté)
  useEffect(() => {
    if (friendBookStatus !== "" || bookStatus !== "") {
      console.log("ok123");
      console.log("5551 bookStatus", bookStatus);
      console.log("5551 friendBookStatus", friendBookStatus);
      console.log("5551 status", status);
      getUserInfosBookFirebase(userId, bookInfos.id, status).then((myBook) => {
        if (myBook) setUserBookInfos(myBook);
      });
    }
  }, [bookInfos?.id, bookStatus, friendBookStatus, userId]);
  //}, [bookInfos?.id]);  // pbm info autre membre ne s'affichaient pas, ms j'ai l'impression que maintenant ça marche même qd il manque des dépendances ??????

  console.log("444 bookInfos", bookInfos?.title, bookStatus);
  console.log("444 userId", userId);
  console.log("444 userBookInfos", userBookInfos);
  console.log("444 bookStatus", bookStatus);

  return (
    userBookInfos && (
      <div>
        {/* Pour les livres lus on a des info en plus :
                     - Livre lu par moi => on affiche mes info données sur ce livre,
                     - Livre lu par le user visité => on affiche ses info */}
        <div className="flex flex-col gap-3 rounded-sm bg-background/50 p-2 pr-6">
          <h2 className="font-semibold text-muted">
            {currentUser?.uid !== userId
              ? "Infos ajoutées par ce membre :"
              : "Mes infos :"}
          </h2>

          {status === BookStatusEnum.booksReadList && (
            <div className="flex items-center gap-3">
              <p>{userBookInfos?.year}</p>
              {userBookInfos.note ? (
                <StarRating value={userBookInfos.note} />
              ) : (
                <p className="italic">Aucune note attribuée</p>
              )}
            </div>
          )}
          <p className={cn("whitespace-pre-wrap")}>
            {userBookInfos?.commentaires ? (
              userBookInfos.commentaires
            ) : (
              <span className="italic">Aucun commentaire pour l'instant</span>
            )}
          </p>
        </div>
      </div>
    )
  );
};

export default BookUserInfo;
