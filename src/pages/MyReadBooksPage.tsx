import BookInfos from "@/components/BookInfos";
import Title from "@/components/Title";
import { books as booksFromBDD, users } from "@/data";

import { UserType } from "@/types";

const MyReadBooksPage = (): JSX.Element => {
  const myReadBooks =
    users
      .find((user: UserType) => user.id === "1")
      ?.booksRead.map((bookId) =>
        booksFromBDD.find((book) => book.id === bookId)
      ) ?? [];

  console.log("myReadBooks", myReadBooks);

  return (
    <div>
      <Title>Mes livres lus</Title>
      {myReadBooks && myReadBooks.length > 0 && (
        <ul>
          {myReadBooks.map(
            (readBook) =>
              readBook && (
                <BookInfos
                  key={readBook.id}
                  book={readBook}
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
