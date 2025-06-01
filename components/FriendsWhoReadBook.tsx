"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await fetch(
          "/api/appUsers/getOtherFriendsWhoReadBook" +
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
        const json = await res.json();
        setFriendsWhoReadBook(json.data);
      } catch (error) {
        setFriendsWhoReadBook([]);
      }
    };
    fetchFriends();
  }, [bookId, currentUserId, userViewId]);

  return friendsWhoReadBook.length > 0 ? (
    <CardFooter className="flex gap-2 border border-friend bg-gray-500/40">
      <FriendSparkles />
      <div className="flex flex-row gap-2 ">
        {friendsWhoReadBook.length > 1 ? (
          <p className="font-semibold">Amis qui ont lu ce livre :</p>
        ) : (
          <p className="font-semibold">Ami qui a lu ce livre :</p>
        )}
        {friendsWhoReadBook.map((friend: { id: string; userName: string }) => (
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
  ) : null;
};

export default FriendsWhoReadBook;
