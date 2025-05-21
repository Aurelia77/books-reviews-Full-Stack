"use client";

import { MONTHS } from "@/lib/constants";
import { UserInfoBookType } from "@/lib/types";
import { BookStatus } from "@prisma/client";
import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const BookUserInfo = ({
  userId,
  currentUserId,
  bookId,
  bookStatus,
  userViewId,
}: // friendBookStatus,
//currentUserId,
{
  userId: string | undefined;
  currentUserId: string | undefined;
  bookId: string;
  bookStatus: BookStatus | "";
  userViewId: string | undefined;
  // friendBookStatus?: BookStatus | "";
  //currentUserId: string;
}) => {
  //console.log("555 userId", userId);
  //console.log("555 bookInfosId", bookInfosId);
  //console.log("555 bookStatus", bookStatus);
  //console.log("555 friendBookStatus", friendBookStatus);

  const [userBookInfos, setUserBookInfos] = useState<UserInfoBookType>();

  // console.log("💛💚🤍 userBookInfos", userBookInfos);
  console.log("💛💚🤍 userBookInfos.bookId", userBookInfos?.bookId);
  console.log("💛💚 userId", userId);
  console.log("💛💚 userViewId", userViewId);
  console.log("💛💚 bookStatus", bookStatus);

  //console.log("789", userBookInfos?.month);

  // const status = (userViewId || bookStatus) as BookStatus;

  const [userName, setUserName] = useState<string | null>(null);

  // Récupérer les infos données par l'utilisateur (soit le user visité si friendBookStatus !== "" soit le user connecté)
  useEffect(() => {
    if (userViewId || bookStatus !== "") {
      (async () => {
        try {
          const response = await fetch(
            `/api/userInfoBook/getOne?userId=${userId}&bookId=${bookId}`
          );
          if (response.ok) {
            const myBook = await response.json();
            setUserBookInfos(myBook);
          } else {
            console.error(
              "Failed to fetch user book info:",
              response.statusText
            );
          }
        } catch (error) {
          console.error("Error fetching user book info:", error);
        }
      })();
    }
    // if (friendBookStatus !== "" || bookStatus !== "") {
    //   getUserInfosBookFirebase(userId, bookInfosId, status).then((myBook) => {
    //     if (myBook) setUserBookInfos(myBook);
    //   });
    // }
  }, [bookId, bookStatus, userViewId, userId, status]);
  //}, [bookInfos?.id]);  // pbm info autre membre ne s'affichaient pas, ms j'ai l'impression que maintenant ça marche même qd il manque des dépendances ??????

  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const res = await fetch(`/api/appUser/${userId}`);

        if (res.ok) {
          const user = await res.json();
          setUserName(user.userName);
        } else {
          setUserName(null);
        }
      } catch (err) {
        setUserName(null);
      }
    })();
    // getDocsByQueryFirebase<UserType>("users", "id", userId).then((user) => {
    //   if (user) {
    //     setUserName(user[0].userName);
    //   }
    // });
  }, [userId]);

  return (
    userBookInfos && (
      <div>
        <p className="bg-cyan-500">On est dans BookUserInfo</p>
        <p className="bg-cyan-500">userId {userId} </p>
        <p className="bg-cyan-500">currentUserId {currentUserId} </p>
        {/* Pour les livres lus on a des info en plus :
                     - Livre lu par moi => on affiche mes info données sur ce livre,
                     - Livre lu par le user visité => on affiche ses info */}
        <div className="flex flex-col gap-3 rounded-sm bg-background/50 p-2 md:p-3 pr-6">
          <h2 className="font-semibold text-muted">
            {currentUserId !== userId
              ? "Info et Avis de " + userName + "\u00A0:"
              : "Mes Infos et Avis :"}
          </h2>

          {/* {status === BookStatus.READ && ( */}
          <div className="flex items-center justify-around">
            <p>
              {userBookInfos &&
                userBookInfos.month !== undefined &&
                userBookInfos.month !== null &&
                userBookInfos.month !== 0 &&
                `   ${MONTHS[userBookInfos?.month]} `}
              {userBookInfos?.year}
            </p>
            {userBookInfos.note ? (
              <StarRating value={userBookInfos.note} forReadBook />
            ) : (
              <p className="italic">Aucune note</p>
            )}
          </div>
          {/* )} */}

          <p className="whitespace-pre-wrap">
            {userBookInfos?.comments ? (
              userBookInfos.comments
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
