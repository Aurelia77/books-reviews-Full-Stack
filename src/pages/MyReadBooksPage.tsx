import BookInfos from "@/components/BookInfos";
import CustomLinkButton from "@/components/CustomLinkButton";
import FeedbackMessage from "@/components/FeedbackMessage";
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
    <div className="h-full min-h-screen">
      <Title>Mes livres lus</Title>
      {myReadBooksIds && myReadBooksIds.length > 0 ? (
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
      ) : (
        <div>
          <FeedbackMessage message="Aucun livre pour l'instant" />
          <div className="flex flex-col gap-4 py-12">
            <p className="ml-1">Essayez d'aller par là !</p>
            <CustomLinkButton
              className="bg-accent/60"
              linkTo="/mybooks/searchbook"
            >
              Recherche de livre
            </CustomLinkButton>
            <CustomLinkButton className="bg-secondary/80">
              Livres de mes amis
            </CustomLinkButton>
            <CustomLinkButton className="bg-primary/50">
              Suggestions
            </CustomLinkButton>
            {/* <FeedbackMessage
            message="Vous n'avez pas encore lu de livre."
            type="error"
          /> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReadBooksPage;
