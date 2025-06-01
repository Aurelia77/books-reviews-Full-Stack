"use client";

import { BookStatusValues, MONTHS } from "@/lib/constants";
import { BookStatusType, UserInfoBookType } from "@/lib/types";
import { useEffect, useState } from "react";
import StarRating from "./StarRating";

type BookUserInfoProps = {
  currentUserId: string | undefined;
  bookId: string;
  bookStatus: BookStatusType | "";
  userViewId: string | undefined;
};

const BookUserInfo = ({
  currentUserId,
  bookId,
  bookStatus,
  userViewId,
}: BookUserInfoProps) => {
  const [userBookInfos, setUserBookInfos] = useState<UserInfoBookType>();

  const [userName, setUserName] = useState<string | null>(null);

  // Retrieve the info provided by the user (either the visited user if friendBookStatus !== "" or the connected user)
  useEffect(() => {
    if (userViewId && bookStatus !== "") {
      (async () => {
        try {
          const response = await fetch(
            `/api/userInfoBooks/getOne?userId=${userViewId}&bookId=${bookId}`
          );
          if (response.ok) {
            const myBook = await response.json();
            setUserBookInfos(myBook);
          } else {
            console.error(
              `Failed to fetch user book info of userViewId=${userViewId} and bookId= ${bookId}. Error: `,
              response.status,
              response.statusText
            );
          }
        } catch (error) {
          console.error("Error fetching user book info:", error);
        }
      })();
    }

    if (userViewId) {
      (async () => {
        try {
          const res = await fetch(`/api/appUsers/${userViewId}`);
          if (res.ok) {
            const json = await res.json();
            setUserName(json.data.userName);
          } else {
            setUserName(null);
          }
        } catch (err) {
          setUserName(null);
        }
      })();
    }
  }, [bookId, bookStatus, userViewId]);

  return (
    userBookInfos && (
      <div>
       {/* For read books, we display extra info:
            - If the book was read by me, we show my info
            - If the book was read by the visited user,
              we show their info */}
        <div className="flex flex-col gap-3 rounded-sm bg-background/50 p-2 md:p-3 pr-6">
          <h2 className="font-semibold text-muted">
            {currentUserId !== userViewId
              ? "Infos et Avis de " + userName + "\u00A0:"
              : "Mes Infos et Avis :"}
          </h2>

          {bookStatus === BookStatusValues.READ && (
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
          )}

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
