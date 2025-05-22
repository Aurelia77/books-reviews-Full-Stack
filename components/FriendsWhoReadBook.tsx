"use client";

// import { getUsersWhoReadBookFirebase } from "@/firebase/firestore";
// import useUserStore from "@/hooks/useUserStore";
import { useEffect, useState } from "react";
import Link from "next/link";
import FriendSparkles from "./FriendSparkles";
import { CardFooter } from "./ui/card";

type FriendsWhoReadBookType = {
  bookId: string;
  userViewId?: string;
  currentUserId: string;
};

const FriendsWhoReadBook = ({
  bookId,
  userViewId,
  currentUserId,
}: FriendsWhoReadBookType) => {
  const [friendsWhoReadBook, setFriendsWhoReadBook] = useState<
    {
      id: string;
      userName: string;
    }[]
  >([]);
  // console.log("***friendsWhoReadBook", friendsWhoReadBook);

  // useEffect(() => {
  //   if (userBookStatusState === BookStatus.READ) {
  //     (async () => {
  //       try {
  //         const response = await fetch(
  //           `/api/userInfoBook/getOne?userId=${currentUserId}&bookId=${bookInfos.id}`
  //         );
  //         if (response.ok) {
  //           const myBook = await response.json();
  //           setUserBookInfos(myBook);
  //         }
  //       } catch (error) {
  //         console.error("Error fetching user book info:", error);
  //       }
  //     })();
  //   }
  // }, [bookInfos.id, currentUserId, userBookStatusState]);

  useEffect(() => {
    console.log("💛💙💚❤️🤍🤎 xxx", bookId);
    const fetchFriends = async () => {
      try {
        const res = await fetch(
          "/api/appUser/getOtherFriendsWhoReadBook" +
            "?connectedUserId=" +
            currentUserId +
            "&bookId=" +
            bookId +
            "&excludeUserId=" +
            userViewId
        );
        if (!res.ok) {
          throw new Error("Erreur serveur");
        }
        const data = await res.json();
        setFriendsWhoReadBook(data);
      } catch (error) {
        setFriendsWhoReadBook([]);
      }
    };
    fetchFriends();
  }, [bookId, currentUserId]);

  // useEffect(() => {
  //   getUsersWhoReadBookFirebase(bookId, currentUser?.uid, userViewId).then(
  //     (users) => {
  //       console.log("xxx***USERS", users);
  //       const friends = users.map((user) => ({
  //         id: user.id,
  //         userName: user.userName,
  //       }));
  //       //console.log("xxx***FRIENDS", friends);
  //       setFriendsWhoReadBook(friends);
  //     }
  //   );
  // }, [bookId, userViewId, currentUser?.uid]);

  return friendsWhoReadBook.length > 0 ? (
    <CardFooter className="flex gap-2 border border-friend bg-gray-500/40">
      <FriendSparkles />
      <div className="flex flex-row gap-2 ">
        {friendsWhoReadBook.length > 1 ? (
          <p className="font-semibold">Amis qui ont lu ce livre :</p>
        ) : (
          <p className="font-semibold">Ami qui a lu ce livre :</p>
        )}
        {friendsWhoReadBook.map((friend) => (
          <Link
            key={friend.id}
            href={`/users/${friend.id}`}
            className="font-semibold text-muted"
          >
            {friend.userName}
          </Link>
        ))}
      </div>
    </CardFooter>
  ) : (
    <p></p>
  );
};

export default FriendsWhoReadBook;
