import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { defaultBookImage } from "@/constants";
import {
  findBookStatusInUserLibraryFirebase,
  getDocsByQueryFirebase,
  getFriendsWhoReadBookFirebase,
} from "@/firebase/firestore";
import useUserStore from "@/hooks/useUserStore";
import { BookType } from "@/types";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useSWR from "swr";
import BookSkeleton from "./BookSkeleton";
import FeedbackMessage from "./FeedbackMessage";
import FriendsWhoReadBook from "./FriendsWhoReadBook";
import Title from "./Title";

// Soit dans BooksSearchPage => on passe un objet book en props car on a les info nécessaires
// Soit dans MyReadBooksPage / UserAccountPage => on passe un bookId (et ensuite on va chercher les infos nécessaires)
// viewUserId = id du user connecté sauf si on est sur UserAccountPage : l'id du user dont on veut voir les infos
type BookInfosProps =
  | { book: BookType; bookId?: never; userIdNotToCount?: string }
  | { book?: never; bookId: string; userIdNotToCount?: string };

const BookInfos = ({
  book,
  bookId,
  userIdNotToCount,
}: //friendsWhoReadBook,
BookInfosProps): JSX.Element => {
  //console.log("!!!BOOK INFO");

  //console.log("xxxUserIdNotToCount", userIdNotToCount);

  const [bookInfos, setBookInfos] = useState<BookType | null>(book || null);
  //const [friendsWhoReadBook, setFriendsWhoReadBook] = useState<string[]>([]);
  const [friendsWhoReadBook, setFriendsWhoReadBook] = useState<
    { id: string; userName: string }[]
  >([]);
  // console.log(
  //   "xxxfriendsWhoReadBook",
  //   bookInfos?.bookTitle,
  //   friendsWhoReadBook
  // );

  const { currentUser } = useUserStore();

  ///////////////////////
  ///////////////////////
  ///////////////////////

  // console.log("bookInfo", bookInfo?.bookTitle);
  // console.log("bookInfo", bookInfo?.bookAuthor);

  // VOIR !!!!!!!!!! avec hook Perso !!!!!!
  /////////////////////////
  //const { data: bookFromId, error, isLoading } = useBookId(bookId);

  // SI BOOKID PASSE EN PROPS (donc on est sur MyReadBooksPage) :
  // On recupère les infos du livre depuis la BDD grâce à son bookId
  // Sinon => on a déjà les infos
  const fetchBookInfo = async (bookId: string): Promise<BookType | null> => {
    // throw new Error(
    //   "Erreur simulée !"
    // );

    return getDocsByQueryFirebase<BookType>("books", "bookId", bookId)
      .then((books) => {
        if (books.length > 0) {
          return books[0];
        } else {
          return null;
        }
      })
      .catch((error) => {
        console.error(`Error fetching book with bookId: ${bookId}`, error);
        return null;
      });
  };

  const {
    data: bookFromId,
    error,
    isLoading,
  } = useSWR<BookType | null>(bookId, fetchBookInfo);
  // } = useSWR<BookType>(bookId, fetcher);

  // ici on utilise une constante et pas un state car les message ne change pas et s'affiche seulement si useSWR renvoie une erreur
  const message = `Un problème est survenu dans la récupération du livre => ${error?.message}`;

  useEffect(() => {
    //console.log("xxxUseEffect bookFromId");
    if (bookFromId) {
      setBookInfos(bookFromId);

      // getMyInfosBookFirebase(user?.uid ?? "", bookFromId.bookId).then(
      //   (myBook) => {
      //     console.log("INFO LIVRE", myBook);
      //     setMyBookInfos(myBook);
      //   }
      // );
    }
  }, [bookFromId]);

  useEffect(() => {
    if (bookInfos)
      getFriendsWhoReadBookFirebase(
        bookInfos.bookId,
        currentUser?.uid ?? "", // mieux de gérer le undefined ds fonction Firebase je pense !!!???????????? (voir pour tous les user?.uid ?? "")
        userIdNotToCount
      ).then((users) => {
        //console.log("xxxFRIENDS", users);
        const friends = users.map((user) => ({
          id: user.id,
          userName: user.userName,
        }));
        setFriendsWhoReadBook(friends);
      });
  }, [bookInfos?.bookId, userIdNotToCount]);

  // {
  //   error && (
  //     <div className="text-pink-300">
  //       Un problème est survenu dans la récupération du livre : {error.message}
  //     </div>
  //   );
  // }

  //return isLoading ? <p>coucou</p> : <p>aaa</p>;

  const [bookInMyList, setBookInMyList] = useState<string>("");
  //console.log(bookInfos?.bookTitle, "xxxbookInMyList", bookInMyList);

  useEffect(() => {
    if (currentUser)
      // ou gérer le undefined dans fonction bookInMyBooksFirebase ??????????
      findBookStatusInUserLibraryFirebase(
        bookInfos?.bookId ?? "",
        currentUser.uid
      ).then((bookInMyList) => setBookInMyList(bookInMyList));
  }, [bookInfos?.bookId, currentUser]);

  return (
    <div>
      {isLoading ? (
        <BookSkeleton />
      ) : error ? (
        <FeedbackMessage message={message} type="error" />
      ) : (
        bookInfos && (
          // {/* <Link to={`/books/${bookInfos.bookId}`} state={bookInfos.bookIsFromAPI}> */}
          <Card className="relative mb-4">
            <Link
              to={`/books/${bookInfos.bookId}`}
              state={{ bookInfos, friendsWhoReadBook }}
            >
              {friendsWhoReadBook.length > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                      //className="relative"
                      >
                        <Star
                          size={48}
                          strokeWidth={3}
                          className="absolute left-[3.8rem] top-3 drop-shadow-sm text-stroke-lg"
                          color="white"
                        />
                        <Star
                          className="absolute left-16 top-[0.95rem] drop-shadow-sm text-stroke-lg"
                          size={42}
                          color="gray"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-destructive-foreground">
                      <p>
                        Livre lu par un ou plusieurs de vos amis (voir
                        ci-dessous)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              <CardDescription className="absolute right-2 top-2 rounded-full bg-secondary/60 px-3 py-1 text-secondary-foreground shadow-sm shadow-foreground">
                {bookInfos.bookLanguage}
              </CardDescription>
              <div className="flex items-start gap-5 p-5 pt-10 shadow-md shadow-secondary/60">
                <img
                  src={bookInfos.bookImageLink || defaultBookImage}
                  onError={(e) => (e.currentTarget.src = defaultBookImage)}
                  className="w-32 rounded-sm border border-border object-contain shadow-md shadow-foreground/70"
                  alt={`Image de couverture du livre ${bookInfos?.bookTitle}`}
                />
                <CardHeader className="gap-3 overflow-hidden">
                  <CardTitle className="line-clamp-4">
                    {bookInfos.bookTitle}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-muted">
                    {bookInfos.bookAuthor}
                  </CardDescription>
                  <CardDescription className="overflow-hidden">
                    {bookInfos.bookCategories &&
                      bookInfos.bookCategories.map((cat, index) => (
                        <span key={index}>{index > 0 ? ` / ${cat}` : cat}</span>
                      ))}
                  </CardDescription>
                  {bookInMyList && <Title>{bookInMyList}</Title>}
                  {/* {bookId && (
                    <div>
                      <div className="flex items-center gap-4">
                        <h2 className="font-semibold text-muted">
                          J'ai lu ce livre
                        </h2>

                        <Button className="border border-border bg-secondary/40 shadow-sm shadow-foreground/70">
                          Modifier
                        </Button>
                      </div>
                      <p>{myBookInfos?.bookYear}</p>
                      {myBookInfos?.bookNote && (
                        <StarRating value={myBookInfos.bookNote} />
                      )}
                      <p>{myBookInfos?.bookDescription}</p>
                    </div>
                  )} */}
                </CardHeader>
              </div>
            </Link>

            {friendsWhoReadBook.length > 0 && (
              <FriendsWhoReadBook friendsWhoReadBook={friendsWhoReadBook} />
            )}
          </Card>
        )
      )}
    </div>
  );
};

export default BookInfos;
