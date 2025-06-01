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
} from "@/lib/types";
import { cn } from "@/lib/utils";
import { sortBook } from "@/utils";
import { useEffect, useState } from "react";
import useSWR from "swr";

const booksReadByUsersFetcher = (
  currentUserId: string,
  isSearchOnFriendsBooks: boolean
): Promise<UsersBooksReadType[]> => {
  return getUsersReadBooksIdsFirebase(currentUserId, isSearchOnFriendsBooks)
    .then((usersReadBooksIds) => {
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
      // promise2 contains an async function, so we must use Promise.all(promises2) but also Promise.all(promises1) because promises1 contains promises2.
      const promises1 = booksIdsAndFriendsWhoReadBooksIds.map(
        (bookIdAndFriendsWhoReadBooksIds) => {
          const promises2 =
            bookIdAndFriendsWhoReadBooksIds.friendsWhoReadBookIds.map(
              (userId) => {
                return getUserInfosBookFirebase(
                  userId,
                  bookIdAndFriendsWhoReadBooksIds.bookId,
                  BookStatusEnum.booksReadList
                ).then(
                  (userInfo): UsersWhoReadBookType => ({
                    userId,
                    userInfoYear: userInfo?.year,
                    userInfoMonth: userInfo?.month,
                    userInfoNote: userInfo?.userNote,
                    userInfoComments: userInfo?.userComments || "",
                  })
                );
              }
            );

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
  const [isSearchOnFriendsBooks, setIsSearchOnFriendsBooks] = useState(false);
  const [nbFriends, setNbFriends] = useState<number>(0);
  const [booksWithAllInfos, setBooksWithAllInfos] = useState<
    BookTypePlusUsersWhoRead[]
  >([]);
  const [displayedSortedBooks, setDisplayedSortedBooks] = useState<
    BookTypePlusUsersWhoRead[]
  >([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sortState, setSortState] = useState<any>({
    [BookStatusEnum.booksReadList]: { criteria: "title", order: "desc" },
  });

  const { currentUser } = useUserStore();

  const {
    data: friendsOrUsersReadBooksWithInfo,
    error,
    isLoading,
  } = useSWR<UsersBooksReadType[]>(
    [currentUser?.uid, isSearchOnFriendsBooks],
    ([currentUserId, isSearchOnFriendsBooks]: [string, boolean]) =>
      booksReadByUsersFetcher(currentUserId, isSearchOnFriendsBooks)
  );

  const message = `Un problème est survenu dans la récupération des informations sur les livres => ${error?.message}`;

  useEffect(() => {
    getDocsByQueryFirebase<UserType>("users", "id", currentUser?.uid).then(
      (user) => {
        if (user) {
          setNbFriends(user[0].friends.length);
        }
      }
    );
  }, [currentUser?.uid]);

  useEffect(() => {
    if (friendsOrUsersReadBooksWithInfo) {
      const promises = friendsOrUsersReadBooksWithInfo.map(
        (bookUsersBooksReadType) => {
          return getDocsByQueryFirebase<BookType>(
            "books",
            "id",
            bookUsersBooksReadType.bookId
          ).then((booksBookType) => {
            return {
              ...booksBookType[0],
              usersWhoRead: bookUsersBooksReadType.usersWhoReadBook,
            };
          });
        }
      );
      Promise.all(promises).then((books) => {
        setBooksWithAllInfos(books);
      });
    }
  }, [friendsOrUsersReadBooksWithInfo]);

  useEffect(() => {
    const sortedBooks = sortBook(booksWithAllInfos, sortState);
    setDisplayedSortedBooks(sortedBooks);
  }, [sortState, booksWithAllInfos]);

  return (
    <div className="h-full min-h-screen max-w-3xl sm:p-2 md:m-auto md:mt-8">
      <div className="flex h-full flex-col gap-6">
        <div className="bg-background/70 sticky top-10 z-10 flex flex-col gap-3 duration-500">
          <Title>Livres lus par les membres</Title>
        </div>
        <div className="mb-4 flex items-center justify-center gap-4 text-center">
          <p className={isSearchOnFriendsBooks ? "p-1 text-gray-500" : "p-1"}>
            Tous les membres
          </p>
          <Switch
            checked={isSearchOnFriendsBooks}
            onCheckedChange={() =>
              setIsSearchOnFriendsBooks(!isSearchOnFriendsBooks)
            }
            className="border-foreground/20 border-2"
          />
          <p
            className={cn(
              isSearchOnFriendsBooks
                ? "bg-friend p-1 px-2 md:px-3 rounded-full text-black"
                : "text-gray-500 p-1"
            )}
          >
            Seulement mes amis
          </p>
        </div>
        <p className="mr-3 text-right">
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
          <div className="flex flex-col items-center gap-4">
            <BooksSortControls
              booksStatus={BookStatusEnum.booksReadList}
              sortState={sortState}
              setSortState={setSortState}
            />
            <ul>
              {displayedSortedBooks.map((book: BookTypePlusUsersWhoRead) => (
                <li
                  key={book.id}
                  className="border-foreground/60 mb-4 rounded-xl border-4"
                >
                  {/* Here we pass the book as a prop (and not the bookId as in MyBooksPage or..) */}
                  <BookInfos bookId={book.id} />

                  {book.usersWhoRead.map((friendBookInfo) => (
                    <div
                      className="border-primary/20 border-4 p-2"
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
          <div className="bg-friend/35 mb-2 p-2">
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
