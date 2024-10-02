import BookInfos from "@/components/BookInfos";
import Title from "@/components/Title";
import { users } from "@/data";

import { UserType } from "@/types";
import { useEffect, useState } from "react";

const MyReadBooksPage = (): JSX.Element => {
  const [myReadBooksIds, setMyReadBooksIds] = useState<string[] | undefined>(
    []
  );

  // const fetcher = (bookId: string) => {
  //   getDocsByQueryFirebase("books", "bookId", bookId).then((books) => {
  //     setMyReadBooks((prevBooks) => [...prevBooks, ...books]);
  //   });
  // };

  // const {
  //   data: booksFromAPI,
  //   error,
  //   isLoading,
  // } = useSWR<BookType[]>(searchUrl, fetcher);

  useEffect(() => {
    setMyReadBooksIds(
      users.find((user: UserType) => user.id === "1")?.booksRead
    );
  }, []);

  // const myReadBooks =
  //   users
  //     .find((user: UserType) => user.id === "1")
  //     ?.booksRead.map((bookId) =>
  //       booksFromBDD.find((book) => book.bookId === bookId)
  //     ) ?? [];

  console.log("myReadBooks", myReadBooksIds);

  return (
    <div className="h-full">
      <Title>Mes livres lus</Title>
      {myReadBooksIds && myReadBooksIds.length > 0 && (
        <ul className="flex h-full flex-col pb-16">
          {myReadBooksIds.map(
            (bookId) =>
              bookId && (
                <BookInfos
                  key={bookId}
                  bookId={bookId}
                  friendsWhoReadBook={["Loulou"]}
                />
              )
          )}
        </ul>
      )}
    </div>
  );
};

export default MyReadBooksPage;
