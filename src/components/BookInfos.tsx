import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DEFAULT_BOOK_IMAGE } from "@/constants";
import {
  findBookStatusInUserLibraryFirebase,
  getDocsByQueryFirebase,
} from "@/firebase/firestore";
import useUserStore from "@/hooks/useUserStore";
import { BookType } from "@/types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useSWR from "swr";
import FeedbackMessage from "./FeedbackMessage";
import FriendsWhoReadBook from "./FriendsWhoReadBook";
import MyInfoBook from "./MyInfoBook";
import BookSkeleton from "./skeletons/BookSkeleton";
import Title from "./Title";

// Soit à partir de BooksSearchPage => on passe un objet "book" en props car on a les info nécessaires
// Soit à partir de MyReadBooksPage / UserAccountPage => on passe un bookId (et ensuite on va chercher les infos nécessaires dans la BDD avec useSWR)
//// ou mettre avec hook perso.............
// userIdNotToCount = id du user à ne pas compter dans les amis qui ont lu le livre (si on est sur UserAccountPage)
type BookInfosProps =
  | { book: BookType; bookId?: never; userIdNotToCount?: string }
  | { book?: never; bookId: string; userIdNotToCount?: string };

const BookInfos = ({
  book,
  bookId,
  userIdNotToCount,
}: BookInfosProps): JSX.Element => {
  //console.log("bookId", bookId);

  const [bookInfos, setBookInfos] = useState<BookType | null>(book || null);
  console.log("bookInfos", bookInfos);
  const [bookInMyList, setBookInMyList] = useState<string>("");

  //   const [bookInMyList, setBookInMyList] = useState<BookStatusEnum>();

  //   (bookInMyList) => setBookInMyList(BOOK_STATUS_TRANSLATIONS[bookInMyList])
  // );

  const { currentUser } = useUserStore();
  // VOIR !!!!!!!!!! avec hook Perso !!!!!!
  //const { data: bookFromId, error, isLoading } = useBookId(bookId);

  // 1-DEBUT============================FAIRE HOOK PERSO !!! (aussi pour BookDetailPage)
  const fetchBookInfoDB = async (bookId: string): Promise<BookType | null> => {
    // throw new Error(
    //   "Erreur simulée !"
    // );

    //console.log("FETCHING BookInfos", bookId);

    return getDocsByQueryFirebase<BookType>("books", "id", bookId)
      .then((books) => {
        if (books.length > 0) {
          //console.log("BOOKS", books);
          return books[0];
        } else {
          return null;
        }
      })
      .catch((error) => {
        console.error(`Error fetching book with id: ${bookId}`, error);
        return null;
      });
  };

  const {
    data: bookFromId,
    error,
    isLoading,
  } = useSWR<BookType | null>(bookId, fetchBookInfoDB);

  // ici on utilise une constante et pas un state car le message ne change pas et s'affiche seulement si useSWR renvoie une erreur
  const message = `Un problème est survenu dans la récupération du livre => ${error?.message}`;

  useEffect(() => {
    if (bookFromId) {
      setBookInfos(bookFromId);
    }
  }, [bookFromId]);
  // 1-FIN============================FAIRE HOOK PERSO !!!

  useEffect(() => {
    // ou gérer le undefined dans fonction bookInMyBooksFirebase ??????????
    findBookStatusInUserLibraryFirebase(bookInfos?.id, currentUser?.uid).then(
      (bookInMyList) => setBookInMyList(bookInMyList)
    );
  }, [bookInfos?.id, currentUser]);

  return (
    <div>
      {isLoading ? (
        <BookSkeleton />
      ) : error ? (
        <FeedbackMessage message={message} type="error" />
      ) : (
        bookInfos && (
          <Card className="relative mb-4">
            <Link to={`/books/${bookInfos.id}`}>
              <CardDescription className="absolute right-2 top-2 rounded-full bg-secondary/60 px-3 py-1 text-secondary-foreground shadow-sm shadow-foreground">
                {bookInfos.language}
              </CardDescription>
              <div className="flex items-start gap-5 p-5 pt-10 shadow-md shadow-secondary/60">
                <img
                  src={bookInfos.imageLink || DEFAULT_BOOK_IMAGE}
                  onError={(e) => (e.currentTarget.src = DEFAULT_BOOK_IMAGE)}
                  className="w-32 rounded-sm border border-border object-contain shadow-md shadow-foreground/70"
                  alt={`Image de couverture du livre ${bookInfos?.title}`}
                />
                <CardHeader className="gap-3 overflow-hidden">
                  <CardTitle className="line-clamp-4">
                    {bookInfos.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-muted">
                    {bookInfos.author}
                  </CardDescription>
                  <CardDescription className="overflow-hidden">
                    {bookInfos.categories &&
                      bookInfos.categories.map((cat: string, index: number) => (
                        <span key={index}>{index > 0 ? ` / ${cat}` : cat}</span>
                      ))}
                  </CardDescription>
                  {bookInMyList && <Title>{bookInMyList}</Title>}
                  <MyInfoBook
                    currentUserId={currentUser?.uid}
                    bookInfos={bookInfos}
                  />
                </CardHeader>
              </div>
            </Link>
            <FriendsWhoReadBook
              bookId={bookInfos.id}
              userIdNotToCount={userIdNotToCount}
            />
          </Card>
        )
      )}
    </div>
  );
};

export default BookInfos;
