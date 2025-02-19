import BookInfos from "@/components/BookInfos";
import BookUserInfo from "@/components/BookUserInfo";
import CustomLinkButton from "@/components/CustomLinkButton";
import FeedbackMessage from "@/components/FeedbackMessage";
import BookSkeleton from "@/components/skeletons/BookSkeleton";
import Title from "@/components/Title";
import { Switch } from "@/components/ui/switch";
import {
  getDocsByQueryFirebase,
  getUserInfosBookFirebase,
  getUsersReadBooksIdsFirebase,
  getUsersWhoReadBookFirebase,
} from "@/firebase/firestore";
import useUserStore from "@/hooks/useUserStore";
import {
  BookStatusEnum,
  FriendsBooksReadType,
  FriendsWhoReadBookType,
  UserType,
} from "@/types";
import { useEffect, useState } from "react";
import useSWR from "swr";

const UsersBooksReadPage = (): JSX.Element => {
  const { currentUser } = useUserStore();
  const [isSearchOnFriendsBooks, setIsSearchOnFriendsBooks] = useState(false);
  const [nbFriends, setNbFriends] = useState<number>(0);

  useEffect(() => {
    getDocsByQueryFirebase<UserType>("users", "id", currentUser?.uid).then(
      (user) => {
        if (user) {
          setNbFriends(user[0].friends.length);
        }
      }
    );
  }, [currentUser?.uid]);

  const booksReadByFriendsFetcher = (
    currentUserId: string,
    isSearchOnFriendsBooks: boolean
  ): Promise<FriendsBooksReadType[]> => {
    console.log("8888 fetcher");
    console.log("8888 currentUserId", currentUserId);
    console.log("8888 isSearchOnFriendsBooks", isSearchOnFriendsBooks);
    return getUsersReadBooksIdsFirebase(currentUserId, isSearchOnFriendsBooks)
      .then((usersReadBooksIds) => {
        console.log("555 friendsBooksReadIds", usersReadBooksIds);
        const promises = usersReadBooksIds.map((bookId) => {
          return getUsersWhoReadBookFirebase(bookId, currentUserId).then(
            (friendsWhoReadBook) => ({
              bookId,
              friendsWhoReadBookIds: friendsWhoReadBook.map(
                (friend) => friend.id
              ),
            })
          );
        });
        return Promise.all(promises);
      })
      .then((booksIdsAndFriendsWhoReadBooksIds) => {
        console.log(
          "555666 friendsWhoReadBook",
          booksIdsAndFriendsWhoReadBooksIds
        );
        // promise2 contient une fonction async, donc on doit utiliser Promise.all(promises2) mais aussi Promise.all(promises1) car promises1 contient promises2.
        const promises1 = booksIdsAndFriendsWhoReadBooksIds.map(
          (bookIdAndFriendsWhoReadBooksIds) => {
            console.log(
              "56 bookIdAndFriendsWhoReadBooksIds",
              bookIdAndFriendsWhoReadBooksIds
            );
            const promises2 =
              bookIdAndFriendsWhoReadBooksIds.friendsWhoReadBookIds.map(
                (userId) => {
                  return getUserInfosBookFirebase(
                    userId,
                    bookIdAndFriendsWhoReadBooksIds.bookId,
                    BookStatusEnum.booksReadList
                  ).then(
                    (userInfo): FriendsWhoReadBookType => ({
                      //bookId: bookIdAndFriendsWhoReadBooksIds.bookId,
                      userId,
                      userInfoYear: userInfo?.year,
                      userInfoMonth: userInfo?.month,
                      userInfoNote: userInfo?.userNote,
                      userInfoComments: userInfo?.userComments || "",
                    })
                  );
                }
              );

            console.log(
              "555666 Promise.all(promises2)",
              Promise.all(promises2)
            );
            return Promise.all(promises2).then((friendsWhoReadBook) => ({
              bookId: bookIdAndFriendsWhoReadBooksIds.bookId,
              friendsWhoReadBook,
            }));
          }
        );
        return Promise.all(promises1);
      })
      .catch((error) => {
        console.error("Error fetching friends read books", error);
        return [];
      });
  };

  const {
    data: friendsOrUsersReadBooksWithInfo,
    error,
    isLoading,
  } = useSWR<FriendsBooksReadType[]>(
    //currentUser?.uid,
    //booksReadByFriendsFetcher
    [currentUser?.uid, isSearchOnFriendsBooks],
    ([currentUserId, isSearchOnFriendsBooks]: [string, boolean]) =>
      booksReadByFriendsFetcher(currentUserId, isSearchOnFriendsBooks)
  );

  // ici on utilise une constante et pas un state car les message ne change pas et s'affiche seulement si useSWR renvoie une erreur
  const message = `Un problème est survenu dans la récupération des informations sur les livres => ${error?.message}`;

  console.log(
    "88856 friendsReadBooks",
    friendsOrUsersReadBooksWithInfo?.length
  );

  // useEffect(() => {
  //   const filteredUsers = otherUsers.filter((user) =>
  //     user.userName.includes(userNameInput)
  //   );
  //   setOtherUsers(filteredUsers);
  // }, [userNameInput]);

  //console.log("otherUsers", otherUsers);

  return (
    <div className="h-full min-h-screen max-w-3xl sm:p-2 md:m-auto md:mt-8">
      <div className="flex h-full flex-col gap-6">
        <div className="sticky top-10 z-10 flex flex-col gap-3 bg-background/70 duration-500">
          <Title>Livres lus par les membres</Title>
        </div>
        <div className="flex gap-4 ml-3 mb-4">
          <p className={isSearchOnFriendsBooks ? "text-gray-500" : ""}>
            Tous les membres
          </p>
          <Switch
            checked={isSearchOnFriendsBooks}
            onCheckedChange={() =>
              setIsSearchOnFriendsBooks(!isSearchOnFriendsBooks)
            }
            //className="border-2 border-foreground/20"
          />
          <p className={isSearchOnFriendsBooks ? "" : "text-gray-500"}>
            Seulement mes amis
          </p>
        </div>
        <p className="text-right mr-3">
          Nombre de résultats : {friendsOrUsersReadBooksWithInfo?.length}{" "}
        </p>
        {isLoading ? (
          <div>
            <BookSkeleton />
            <BookSkeleton />
            <BookSkeleton />
          </div>
        ) : error ? (
          <FeedbackMessage message={message} type="error" />
        ) : friendsOrUsersReadBooksWithInfo &&
          friendsOrUsersReadBooksWithInfo.length > 0 ? (
          <ul>
            {friendsOrUsersReadBooksWithInfo.map(
              (book: FriendsBooksReadType) => (
                <li
                  key={book.bookId}
                  className="border-4 border-foreground/75 mb-4 rounded-sm"
                >
                  {/* Ici on passe le book en props (et pas le bookId comme dans MyBooksPage) */}
                  <BookInfos
                    bookId={book.bookId}
                    //friendsWhoReadBook={friendsWhoReadBook(book.bookId)}
                  />

                  {book.friendsWhoReadBook.map((friendBookInfo) => (
                    <div
                      className="border-4 border-primary/20 p-2"
                      key={friendBookInfo.userId}
                    >
                      <BookUserInfo
                        userId={friendBookInfo.userId}
                        bookInfosId={book.bookId}
                        bookStatus={BookStatusEnum.booksReadList}
                      />
                    </div>
                  ))}
                </li>
              )
            )}
          </ul>
        ) : (
          <FeedbackMessage message="Aucun livre pour l'instant" type="info" />
        )}
      </div>
      {isSearchOnFriendsBooks && (
        <div>
          <div className="mb-2 bg-primary/20 p-2">
            <p>Vous avez {nbFriends} amis, vous pouvez en ajouter ici :</p>
          </div>
          <CustomLinkButton className="bg-secondary/60" linkTo="/searchusers">
            Voir les Membres
          </CustomLinkButton>
        </div>
      )}
    </div>
  );
};

export default UsersBooksReadPage;
