import BookInfos from "@/components/BookInfos";
import CustomLinkButton from "@/components/CustomLinkButton";
import FeedbackMessage from "@/components/FeedbackMessage";
import BookSkeleton from "@/components/skeletons/BookSkeleton";
import Title from "@/components/Title";
import { getDocsByQueryFirebase } from "@/firebase/firestore";
import useUserStore from "@/hooks/useUserStore";
import { UserType } from "@/types";
import useSWR from "swr";

const MyReadBooksPage = (): JSX.Element => {
  const { currentUser } = useUserStore();

  // console.log("USER ID", currentUser?.uid);

  const myBooksIdsFetcher = (userId: string | null): Promise<string[]> => {
    console.log("FETCHING MyReadBooksPage");
    //throw new Error("Erreur simulée !");
    if (userId)
      return getDocsByQueryFirebase<UserType>("users", "id", userId).then(
        (users) => {
          const booksReadIds = users[0].booksRead.map((book) => book.id);
          return booksReadIds;
        }
        //setMyReadBooksIds(users[0].booksRead)
      );
    //si userId est null, on retourne une promesse vide
    return Promise.resolve([]);
    //   getDocsByQueryFirebase("books", "id", bookId).then((books) => {
    //   setMyReadBooks((prevBooks) => [...prevBooks, ...books]);
    // });
  };

  const {
    data: myReadBooksIds,
    error,
    isLoading,
  } = useSWR<string[]>(currentUser?.uid ?? null, myBooksIdsFetcher);
  //console.log("myReadBooksIds", myReadBooksIds);

  // Pour debugger (LAISSER !!!)
  if (error) {
    console.error("Error fetching read books: ", error.message);
  }

  //console.log("isLoading", isLoading);
  //console.log("myReadBooksIds", myReadBooksIds);

  // ici on utilise une constante et pas un state car les message ne change pas et s'affiche seulement si useSWR renvoie une erreur
  const message =
    "Un problème est survenu dans la récupération de vos livres lus.";

  return (
    <div className="h-full min-h-screen">
      <Title>Mes livres lus</Title>

      {isLoading ? (
        <div>
          <BookSkeleton />
          <BookSkeleton />
          <BookSkeleton />
        </div>
      ) : error ? (
        <FeedbackMessage message={message} type="error" />
      ) : myReadBooksIds && myReadBooksIds.length > 0 ? (
        <ul className="flex h-full flex-col pb-16">
          {myReadBooksIds.map(
            (bookId) =>
              bookId && (
                // Ici on passe le bookId en props (et pas le book complet comme dans BooksSearchPage)
                <BookInfos
                  key={bookId}
                  bookId={bookId}
                  //friendsWhoReadBook={["Loulou"]}
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
              linkTo="/mybooks/searchbooks"
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
