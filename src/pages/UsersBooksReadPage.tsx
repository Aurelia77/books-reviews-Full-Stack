import BookInfos from "@/components/BookInfos";
import BooksSortControls from "@/components/BooksSortControls";
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
  BookType,
  BookTypePlusUsersWhoRead,
  UsersBooksReadType,
  UsersWhoReadBookType,
  UserType,
} from "@/types";
import { sortBook } from "@/utils";
import { useEffect, useState } from "react";
import useSWR from "swr";

const booksReadByUsersFetcher = (
  currentUserId: string,
  isSearchOnFriendsBooks: boolean
): Promise<UsersBooksReadType[]> => {
  console.log("8888 fetcher");
  console.log("8888 currentUserId", currentUserId);
  console.log("8888 isSearchOnFriendsBooks", isSearchOnFriendsBooks);
  return getUsersReadBooksIdsFirebase(currentUserId, isSearchOnFriendsBooks)
    .then((usersReadBooksIds) => {
      console.log("555 friendsBooksReadIds", usersReadBooksIds);
      const promises = usersReadBooksIds.map((bookId) => {
        ///////////////
        ///////////////
        ///////////////
        ///////////////
        ///////////////
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
                  (userInfo): UsersWhoReadBookType => ({
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

          console.log("555666 Promise.all(promises2)", Promise.all(promises2));
          return Promise.all(promises2).then((usersWhoReadBook) => ({
            bookId: bookIdAndFriendsWhoReadBooksIds.bookId,
            usersWhoReadBook,
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

const UsersBooksReadPage = (): JSX.Element => {
  const { currentUser } = useUserStore();
  const [isSearchOnFriendsBooks, setIsSearchOnFriendsBooks] = useState(false);
  const [nbFriends, setNbFriends] = useState<number>(0);
  const [booksWithAllInfos, setBooksWithAllInfos] = useState<
    BookTypePlusUsersWhoRead[]
  >([]);
  const [displayedSortedBooks, setDisplayedSortedBooks] = useState<
    BookTypePlusUsersWhoRead[]
  >([]);

  console.log("*-*-displayedSortedBooks", displayedSortedBooks);

  console.log("*-*-displayedBooks", booksWithAllInfos);
  console.log("*-*-displayedBooks 0", booksWithAllInfos[0]?.title);

  // const [sortState, setSortState] = useState<{ [key in BookStatusEnum]: SortStateType }>({
  const [sortState, setSortState] = useState<any>({
    [BookStatusEnum.booksReadList]: { criteria: "title", order: "desc" },
  });

  console.log("*-*- sortState", sortState);

  useEffect(() => {
    getDocsByQueryFirebase<UserType>("users", "id", currentUser?.uid).then(
      (user) => {
        if (user) {
          setNbFriends(user[0].friends.length);
        }
      }
    );
  }, [currentUser?.uid]);

  const {
    data: friendsOrUsersReadBooksWithInfo,
    error,
    isLoading,
  } = useSWR<UsersBooksReadType[]>(
    //currentUser?.uid,
    //booksReadByFriendsFetcher
    [currentUser?.uid, isSearchOnFriendsBooks],
    ([currentUserId, isSearchOnFriendsBooks]: [string, boolean]) =>
      booksReadByUsersFetcher(currentUserId, isSearchOnFriendsBooks)
  );

  // ici on utilise une constante et pas un state car les message ne change pas et s'affiche seulement si useSWR renvoie une erreur
  const message = `Un problème est survenu dans la récupération des informations sur les livres => ${error?.message}`;

  console.log(
    "88856 friendsReadBooks",
    friendsOrUsersReadBooksWithInfo?.length
  );

  useEffect(() => {
    if (friendsOrUsersReadBooksWithInfo) {
      const promises = friendsOrUsersReadBooksWithInfo.map(
        (bookUsersBooksReadType) => {
          return getDocsByQueryFirebase<BookType>(
            "books",
            "id",
            bookUsersBooksReadType.bookId
          ).then((booksBookType) => {
            console.log("books", booksBookType);
            return {
              ...booksBookType[0],
              usersWhoRead: bookUsersBooksReadType.usersWhoReadBook,
            };
          });
        }
      );
      Promise.all(promises).then((books) => {
        setBooksWithAllInfos(books); // Mise à jour de l'état displayedBooks
      });
    }
  }, [friendsOrUsersReadBooksWithInfo]);

  useEffect(() => {
    console.log("*-*- useEffect sortBookTypes sortState = ", sortState);
    const sortedBooks = sortBook(booksWithAllInfos, sortState);
    console.log("*-*- useEffect sortBookTypes sortedBooks = ", sortedBooks);
    setDisplayedSortedBooks(sortedBooks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortState, booksWithAllInfos]);

  return (
    <div className="h-full min-h-screen max-w-3xl sm:p-2 md:m-auto md:mt-8">
      <div className="flex h-full flex-col gap-6">
        <div className="sticky top-10 z-10 flex flex-col gap-3 bg-background/70 duration-500">
          <Title>Livres lus par les membres</Title>
        </div>
        <div className="flex gap-4 mb-4 items-center justify-center">
          <p className={isSearchOnFriendsBooks ? "text-gray-500 p-1" : "p-1"}>
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
            className={
              isSearchOnFriendsBooks
                ? "bg-friend p-1 px-2 md:px-3 rounded-full text-black"
                : "text-gray-500 p-1"
            }
          >
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
        ) : displayedSortedBooks && displayedSortedBooks.length > 0 ? (
          <div className="flex flex-col gap-4 items-center">
            <BooksSortControls
              booksStatus={BookStatusEnum.booksReadList}
              sortState={sortState}
              setSortState={setSortState}
            />
            <ul>
              {displayedSortedBooks.map((book: BookTypePlusUsersWhoRead) => (
                <li
                  key={book.id}
                  className="border-4 border-foreground/60 mb-4 rounded-xl"
                >
                  {/* Ici on passe le book en props (et pas le bookId comme dans MyBooksPage) */}
                  <BookInfos
                    bookId={book.id}
                    //friendsWhoReadBook={friendsWhoReadBook(book.bookId)}
                  />

                  {book.usersWhoRead.map((friendBookInfo) => (
                    <div
                      className="border-4 border-primary/20 p-2"
                      key={friendBookInfo.userId}
                    >
                      <BookUserInfo
                        userId={friendBookInfo.userId}
                        bookInfosId={book.id}
                        bookStatus={BookStatusEnum.booksReadList}
                      />
                    </div>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <FeedbackMessage message="Aucun livre pour l'instant" type="info" />
        )}
      </div>
      {isSearchOnFriendsBooks && (
        <div>
          <div className="mb-2 bg-friend/35 p-2">
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
