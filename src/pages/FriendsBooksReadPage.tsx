import BookInfos from "@/components/BookInfos";
import BookUserInfo from "@/components/BookUserInfo";
import CustomLinkButton from "@/components/CustomLinkButton";
import FeedbackMessage from "@/components/FeedbackMessage";
import BookSkeleton from "@/components/skeletons/BookSkeleton";
import Title from "@/components/Title";
import {
  getDocsByQueryFirebase,
  getFriendsReadBooksIdsFirebase,
  getFriendsWhoReadBookFirebase,
  getUserInfosBookFirebase,
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

const FriendsBooksReadPage = (): JSX.Element => {
  const { currentUser } = useUserStore();
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
    currentUserId: string
  ): Promise<FriendsBooksReadType[]> => {
    return getFriendsReadBooksIdsFirebase(currentUserId)
      .then((friendsBooksReadIds) => {
        console.log("555 friendsBooksReadIds", friendsBooksReadIds);
        const promises = friendsBooksReadIds.map((bookId) => {
          return getFriendsWhoReadBookFirebase(bookId, currentUserId).then(
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
      .then((xxx) => {
        console.log("555666888 xxx", xxx);
        return xxx;
      });
  };

  const {
    data: friendsReadBooksWithInfo,
    error,
    isLoading,
  } = useSWR<FriendsBooksReadType[]>(
    currentUser?.uid,
    booksReadByFriendsFetcher
  );

  // ici on utilise une constante et pas un state car les message ne change pas et s'affiche seulement si useSWR renvoie une erreur
  const message = `Un problème est survenu dans la récupération des informations sur les livres => ${error?.message}`;

  console.log("88856 friendsReadBooks", friendsReadBooksWithInfo?.length);

  // useEffect(() => {
  //   const filteredUsers = otherUsers.filter((user) =>
  //     user.userName.includes(userNameInput)
  //   );
  //   setOtherUsers(filteredUsers);
  // }, [userNameInput]);

  //console.log("otherUsers", otherUsers);

  return (
    <div className="min-h-screen h-full max-w-3xl md:m-auto md:mt-8 sm:p-2">
      <div className="flex h-full flex-col gap-6">
        <div className="sticky top-10 z-10 flex flex-col gap-3 bg-background/70 duration-500">
          <Title>Livres lus par mes amis</Title>
        </div>
        {isLoading ? (
          <div>
            <BookSkeleton />
            <BookSkeleton />
            <BookSkeleton />
          </div>
        ) : error ? (
          <FeedbackMessage message={message} type="error" />
        ) : friendsReadBooksWithInfo && friendsReadBooksWithInfo.length > 0 ? (
          <ul>
            {friendsReadBooksWithInfo.map((book: FriendsBooksReadType) => (
              <li key={book.bookId} className="border-8">
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
            ))}
          </ul>
        ) : (
          <FeedbackMessage message="Aucun livre pour l'instant" type="info" />
        )}
      </div>
      <div className="mb-2 p-2 bg-primary/20">
        <p>Vous avez {nbFriends} amis, vous pouvez en ajouter ici :</p>
      </div>
      <CustomLinkButton className="bg-secondary/60" linkTo="/searchusers">
        Voir les Membres
      </CustomLinkButton>
    </div>
  );
};

export default FriendsBooksReadPage;
