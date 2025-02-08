// import BookInfos from "@/components/BookInfos";
// import FeedbackMessage from "@/components/FeedbackMessage";
// import BookSkeleton from "@/components/skeletons/BookSkeleton";
// import Title from "@/components/Title";
// import { getDocsByQueryFirebase } from "@/firebase/firestore";
// import useUserStore from "@/hooks/useUserStore";
// import { BookAPIType, BookType, UserType } from "@/types";
// import { useEffect, useRef, useState } from "react";
// import useSWR from "swr";

// const MAX_RESULTS = 4; // jusqu'à 40

// const useDebounce = <T extends string[]>(
//   callback: (...args: T) => void,
//   delay: number
// ) => {
//   const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

//   const onDebounce = (...args: T) => {
//     if (timeout.current) {
//       clearTimeout(timeout.current);
//     }
//     timeout.current = setTimeout(() => {
//       callback(...args);
//     }, delay);
//   };

//   return onDebounce;
// };

const FriendsBooksReadPage = (): JSX.Element => {
  //const { currentUser } = useUserStore();

  // const booksReadByFriendsFetcher = (
  //   currentUserId: string
  // ): Promise<BookType[]> => {
  // return getDocsByQueryFirebase<UserType>("users", "friends")
  //   .then((allUsers) => {
  //     console.log("otherUsersFetcher allUsers", allUsers);
  //     return allUsers.filter((user: UserType) => user.id !== currentUserId);
  //   })
  //   .then((otherUsers: UserType[]) => {
  //     console.log("otherUsersFetcher otherUsers", otherUsers);
  //     return otherUsers.filter((user) =>
  //       user.userName.toLowerCase().includes(userNameInput.toLowerCase())
  //     );
  //   })
  //   .then((filteredUsers: UserType[]) => {
  //     console.log("otherUsersFetcher filteredUsers", filteredUsers);
  //     const promises = filteredUsers.map((user: UserType) =>
  //       isUserMyFriendFirebase(user.id, currentUserId).then(
  //         (isFriend: boolean) => ({
  //           ...user,
  //           isMyFriend: isFriend,
  //         })
  //       )
  //     );
  //     return Promise.all(promises).then(
  //       (otherUsersFriendType: UserType[]) => {
  //         const sortedUsers = otherUsersFriendType.sort(
  //           (a: UserType, b: UserType) => (a.userName > b.userName ? 1 : -1)
  //         );
  //         return sortedUsers;
  //         //setOtherUsers(sortedUsers);
  //       }
  //     );
  //   });
  // };

  // useEffect(() => {
  //   const filteredUsers = otherUsers.filter((user) =>
  //     user.userName.includes(userNameInput)
  //   );
  //   setOtherUsers(filteredUsers);
  // }, [userNameInput]);

  // const {
  //   data: otherUsers = [],
  //   error,
  //   isLoading,
  // } = useSWR<UserType[]>(
  //   [userNameInput, currentUser?.uid ?? ""],
  //   ([searchUserName, currentUserId]) =>
  //     booksReadByFriendsFetcher([searchUserName, currentUserId])
  // ); // impossible to add only userNameInput as param because if it's null or "", otherUsersFetcher will not work

  //console.log("otherUsers", otherUsers);

  return (
    <div className="h-full min-h-screen sm:p-2 max-w-3xl md:m-auto md:mt-8">
      {/* <div className="flex h-full flex-col gap-6">
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
        ) : bdAndApiBooks?.length > 0 ? (
          <ul className="pb-40">
            {bdAndApiBooks.map((book: BookType) => (
              <li key={book.id}>
                {/* Ici on passe le book en props (et pas le bookId comme dans MyBooksPage) */}
      {/* <BookInfos
                  book={book}
                  //friendsWhoReadBook={friendsWhoReadBook(book.bookId)}
                />
              </li>
            ))}
          </ul>
        ) : (
          <FeedbackMessage message="Aucun livre trouvé" type="info" />
        )}
      </div> */}
    </div>
  );
};

export default FriendsBooksReadPage;
