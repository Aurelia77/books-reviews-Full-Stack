import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DEFAULT_BOOK_IMAGE, NO_DESCRIPTION } from "@/constants";
import {
  findBookCatInUserLibraryFirebase,
  getDocsByQueryFirebase,
} from "@/firebase/firestore";
import { toast } from "@/hooks/use-toast";
import useUserStore from "@/hooks/useUserStore";
import { BookStatusEnum, BookType } from "@/types";
import { cleanDescription } from "@/utils";
import { Check, Ellipsis, Quote, Smile } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useSWR from "swr";
import AverageBookRating from "./AverageBookRating";
import BookUserInfo from "./BookUserInfo";
import FeedbackMessage from "./FeedbackMessage";
import FriendsWhoReadBook from "./FriendsWhoReadBook";
import BookSkeleton from "./skeletons/BookSkeleton";

// Soit à partir de BooksSearchPage => on passe un objet "book" en props car on a les info nécessaires
// Soit à partir de MyBooksPage / UserAccountPage => on passe un bookId (et ensuite on va chercher les infos nécessaires dans la BDD avec useSWR)
//// ou mettre avec hook perso.............
// userViewId = id du user à ne pas compter dans les amis qui ont lu le livre (si on est sur UserAccountPage) + qd on est sur UserAccountPage => on voit ses info et non celles du user connecté
type BookInfosProps =
  | { book: BookType; bookId?: never; userViewId?: string }
  | { book?: never; bookId: string; userViewId?: string };

const BookInfos = ({
  book,
  bookId,
  userViewId,
}: BookInfosProps): JSX.Element => {
  ////console.log("bookId", bookId);

  const [bookInfos, setBookInfos] = useState<BookType | null>(book || null);
  console.log("bookInfos", bookInfos);
  console.log("bookInfos description", bookInfos?.description);

  const [bookInMyList, setBookInMyList] = useState<BookStatusEnum | "">("");
  const [bookInFriendList, setBookInFriendList] = useState<BookStatusEnum | "">(
    ""
  );

  //   const [bookInMyList, setBookInMyList] = useState<BookStatusEnum>();

  //   (bookInMyList) => setBookInMyList(BOOK_STATUS_TRANSLATIONS[bookInMyList])
  // );

  const { currentUser } = useUserStore();

  //console.log("5555 userViewId", userViewId);
  //console.log("5555 currentUser", currentUser?.uid);
  //console.log("55555 bookInMyList", bookInMyList);
  //console.log("55555 bookInFriendList", bookInFriendList);
  // VOIR !!!!!!!!!! avec hook Perso !!!!!!
  //const { data: bookFromId, error, isLoading } = useBookId(bookId);

  // 1-DEBUT============================FAIRE HOOK PERSO !!! (aussi pour BookDetailPage)
  const fetchBookInfoDB = async (bookId: string): Promise<BookType | null> => {
    // throw new Error(
    //   "Erreur simulée !"
    // );

    ////console.log("FETCHING BookInfos", bookId);

    return getDocsByQueryFirebase<BookType>("books", "id", bookId)
      .then((books) => {
        if (books.length > 0) {
          ////console.log("BOOKS", books);
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
  // 1-FIN==============
  // ==============FAIRE HOOK PERSO !!!

  useEffect(() => {
    // ou gérer le undefined dans fonction bookInMyBooksFirebase ??????????
    if (currentUser)
      findBookCatInUserLibraryFirebase(bookInfos?.id, currentUser?.uid).then(
        (bookInMyList) => setBookInMyList(bookInMyList)
      );

    if (userViewId !== currentUser?.uid)
      findBookCatInUserLibraryFirebase(bookInfos?.id, userViewId).then(
        (bookInFriendList) => setBookInFriendList(bookInFriendList)
      );
  }, [bookInfos?.id, currentUser, userViewId]);

  const handleLinkClick = () => {
    if (!currentUser?.uid) {
      toast({
        title: "Veuillez vous connecter pour accéder à cette page.",
      });
    }
  };

  return (
    <div>
      {isLoading ? (
        <BookSkeleton />
      ) : error ? (
        <FeedbackMessage message={message} type="error" />
      ) : (
        bookInfos && (
          <Card className="relative">
            <Link
              to={currentUser?.uid ? `/books/${bookInfos.id}` : "/login"}
              className="relative"
              onClick={handleLinkClick}
            >
              <CardDescription className="absolute right-2 top-2 rounded-full bg-secondary/60 px-3 py-1 text-secondary-foreground shadow-sm shadow-foreground">
                {bookInfos.language}
              </CardDescription>
              <div>
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
                      {bookInfos?.authors?.join(", ")}
                    </CardDescription>
                    <CardDescription className="overflow-hidden">
                      {bookInfos.categories &&
                        bookInfos.categories.map(
                          (cat: string, index: number) => (
                            <span key={index}>
                              {index > 0 ? ` / ${cat}` : cat}
                            </span>
                          )
                        )}
                    </CardDescription>
                    {bookInfos.description ? (
                      <CardDescription className="relative flex gap-2">
                        <Quote className="absolute -top-1" />
                        <span className="line-clamp-3 max-w-[90%] text-foreground">
                          &ensp;&ensp;&ensp;&ensp;
                          {cleanDescription(bookInfos.description)}
                        </span>
                      </CardDescription>
                    ) : (
                      <p className="italic">{NO_DESCRIPTION} </p>
                    )}
                    <AverageBookRating bookInfos={bookInfos} />
                  </CardHeader>

                  {bookInMyList && (
                    <div className="absolute bottom-10 right-2 rounded-full bg-primary/50 p-1  shadow-sm shadow-foreground">
                      {bookInMyList === BookStatusEnum.booksReadList && (
                        <div className="flex flex-col items-center p-1 text-xs">
                          J'ai lu
                          <Check />
                        </div>
                      )}
                      {bookInMyList === BookStatusEnum.booksInProgressList && (
                        <div className="flex flex-col items-center p-1 text-xs">
                          Je lis...
                          <Ellipsis />
                        </div>
                      )}
                      {bookInMyList === BookStatusEnum.booksToReadList && (
                        <div className="flex flex-col items-center p-1 text-xs">
                          Je veux lire !
                          <Smile />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {(bookInMyList !== "" || bookInFriendList !== "") && (
                  <BookUserInfo
                    userId={userViewId || currentUser?.uid}
                    bookInfosId={bookInfos.id}
                    bookStatus={bookInMyList}
                    friendBookStatus={bookInFriendList}
                  />
                )}
              </div>
            </Link>
            <FriendsWhoReadBook bookId={bookInfos.id} userViewId={userViewId} />
          </Card>
        )
      )}
    </div>
  );
};

export default BookInfos;
