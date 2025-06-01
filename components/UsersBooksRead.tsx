"use client";

import CustomLinkButton from "@/components/CustomLinkButton";
import FeedbackMessage from "@/components/FeedbackMessage";
import { Switch } from "@/components/ui/switch";
import { BookStatusValues } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import BooksWithSortControls from "./BooksWithSortControls";

const UsersBooksRead = ({
  booksAndUsersWhoReadGroupedById,
  friendsOfCurrentAppUser,
}: {
  booksAndUsersWhoReadGroupedById: Record<string, string[]>;
  friendsOfCurrentAppUser: string[] | undefined;
}) => {
  const [usersBooksReadIds, setUsersBooksReadIds] = useState<string[]>();
  const [isSearchOnFriendsBooks, setIsSearchOnFriendsBooks] = useState(false);

  useEffect(() => {
    const bookIds = Object.entries(booksAndUsersWhoReadGroupedById)
      .filter(([, userIds]) =>
        !isSearchOnFriendsBooks
          ? true
          : userIds.some((id) => friendsOfCurrentAppUser?.includes(id))
      )
      .map(([bookId]) => bookId);
    setUsersBooksReadIds(bookIds);
  }, [
    booksAndUsersWhoReadGroupedById,
    isSearchOnFriendsBooks,
    friendsOfCurrentAppUser,
  ]);

  return (
    <div>
      <div className="flex h-full flex-col gap-6 my-10">
        <div className="mb-8 flex items-center justify-center gap-4 text-center">
          <p className={isSearchOnFriendsBooks ? "p-1 text-gray-500" : "p-1"}>
            Tous les membres
          </p>
          <Switch
            checked={isSearchOnFriendsBooks}
            onCheckedChange={() =>
              setIsSearchOnFriendsBooks(!isSearchOnFriendsBooks)
            }
            className="border-2 border-foreground/20"
          />
          <p
            className={cn(
              isSearchOnFriendsBooks
                ? "bg-yellow-400 p-1 px-2 md:px-3 rounded-full text-black"
                : "text-gray-500 p-1"
            )}
          >
            Seulement mes amis
          </p>
        </div>

        {usersBooksReadIds && usersBooksReadIds.length > 0 ? (
          <BooksWithSortControls
            displayBookStatus={BookStatusValues.READ}
            bookIds={usersBooksReadIds}
          />
        ) : (
          <FeedbackMessage message="Aucun livre pour l'instant" type="info" />
        )}
      </div>
      {isSearchOnFriendsBooks && (
        <div>
          <div className="mb-3 bg-yellow-400/35 p-2">
            <p>
              Vous avez {friendsOfCurrentAppUser?.length || 0} amis, vous pouvez
              en ajouter ici :
            </p>
          </div>
          <CustomLinkButton className="bg-secondary/60" linkTo="/users">
            Voir les Membres
          </CustomLinkButton>
        </div>
      )}
    </div>
  );
};

export default UsersBooksRead;
