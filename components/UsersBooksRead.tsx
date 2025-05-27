"use client";

import CustomLinkButton from "@/components/CustomLinkButton";
import FeedbackMessage from "@/components/FeedbackMessage";
import { Switch } from "@/components/ui/switch";
import { BookStatusValues } from "@/lib/constants";
// import { BookTypePlusUsersWhoRead } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import BooksWithSortControls from "./BooksWithSortControls";

const UsersBooksRead = ({
  booksAndUsersWhoReadGroupedById,
  friendsOfCurrentAppUser,
}: // usersBooksReadIds,
// currentUserId,
{
  booksAndUsersWhoReadGroupedById: Record<string, string[]>;
  friendsOfCurrentAppUser: string[] | undefined;
  // usersBooksReadIds: string[];
  // currentUserId: string | undefined;
}) => {
  const [usersBooksReadIds, setUsersBooksReadIds] = useState<string[]>();

  console.log("💛💙💚❤️🤍🤎 usersBooksReadIds", usersBooksReadIds);

  const [isSearchOnFriendsBooks, setIsSearchOnFriendsBooks] = useState(false);
  // const [booksWithAllInfos, setBooksWithAllInfos] = useState<
  //   BookTypePlusUsersWhoRead[]
  // >([]);
  // const [displayedSortedBooks, setDisplayedSortedBooks] = useState<
  //   BookTypePlusUsersWhoRead[]
  // >([]);

  // const [sortState, setSortState] = useState<{ [key in BookStatusEnum]: SortStateType }>({
  // const [sortState, setSortState] = useState<any>({
  //   [BookStatusValues.READ]: { criteria: "title", order: "desc" },
  // });

  // console.log("*-*- sortState", sortState);

  useEffect(() => {
    const bookIds = Object.entries(booksAndUsersWhoReadGroupedById)
      .filter(([, userIds]) =>
        // .filter(([_, userIds]) =>
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

  // useEffect(() => {
  //   getDocsByQueryFirebase<UserType>("users", "id", currentUserId).then(
  //     (user) => {
  //       if (user) {
  //         setNbFriends(user[0].friends.length);
  //       }
  //     }
  //   );
  // }, [currentUserId]);

  // const {
  //   data: friendsOrUsersReadBooksWithInfo,
  //   error,
  //   isLoading,
  // } = useSWR<UsersBooksReadType[]>(
  //   //currentUser?.uid,
  //   //booksReadByFriendsFetcher
  //   [currentUser?.uid, isSearchOnFriendsBooks],
  //   ([currentUserId, isSearchOnFriendsBooks]: [string, boolean]) =>
  //     booksReadByUsersFetcher(currentUserId, isSearchOnFriendsBooks)
  // );

  // ici on utilise une constante et pas un state car les message ne change pas et s'affiche seulement si useSWR renvoie une erreur
  // const message = `Un problème est survenu dans la récupération des informations sur les livres => ${error?.message}`;

  // console.log(
  //   "88856 friendsReadBooks",
  //   friendsOrUsersReadBooksWithInfo?.length
  // );

  // useEffect(() => {
  //   if (friendsOrUsersReadBooksWithInfo) {
  //     const promises = friendsOrUsersReadBooksWithInfo.map(
  //       (bookUsersBooksReadType) => {
  //         return getDocsByQueryFirebase<BookType>(
  //           "books",
  //           "id",
  //           bookUsersBooksReadType.bookId
  //         ).then((booksBookType) => {
  //           console.log("books", booksBookType);
  //           return {
  //             ...booksBookType[0],
  //             usersWhoRead: bookUsersBooksReadType.usersWhoReadBook,
  //           };
  //         });
  //       }
  //     );
  //     Promise.all(promises).then((books) => {
  //       setBooksWithAllInfos(books); // Mise à jour de l'état displayedBooks
  //     });
  //   }
  // }, [friendsOrUsersReadBooksWithInfo]);

  // useEffect(() => {
  //   console.log("*-*- useEffect sortBookTypes sortState = ", sortState);
  //   const sortedBooks = sortBook(booksWithAllInfos, sortState);
  //   console.log("*-*- useEffect sortBookTypes sortedBooks = ", sortedBooks);
  //   setDisplayedSortedBooks(sortedBooks);
  // }, [sortState, booksWithAllInfos]);

  return (
    <div>
      <div className="flex h-full flex-col gap-6 my-10">
        {/* <div className="sticky top-10 z-10 flex flex-col gap-3 bg-background/70">
          <Title>Livres lus par les membres</Title>
        </div> */}
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
        {/* <p className="mr-3 text-right">
          Nombre de résultats : {friendsOrUsersReadBooksWithInfo?.length}{" "}
        </p> */}
        {/* 
        /* {isLoading ? (
          <div>
            <BookSkeleton />
            <BookSkeleton />
            <BookSkeleton />
          </div>
        ) : error ? (
          <FeedbackMessage message={message} type="error" />
        ) :  */}
        {usersBooksReadIds && usersBooksReadIds.length > 0 ? (
          // {displayedSortedBooks && displayedSortedBooks.length > 0 ? (
          // <div className="flex flex-col items-center gap-4">
          <BooksWithSortControls
            displayBookStatus={BookStatusValues.READ}
            bookIds={usersBooksReadIds}
          />
        ) : (
          // </div>
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
