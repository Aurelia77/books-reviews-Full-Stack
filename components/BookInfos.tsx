"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import {
//   findBookCatInUserLibraryFirebase,
//   getDocsByQueryFirebase,
// } from "@/firebase/firestore";
// import { toast } from "@/hooks/use-toast";
// import useUserStore from "@/hooks/useUserStore";
import { DEFAULT_BOOK_IMAGE, NO_DESCRIPTION } from "@/lib/constants";
import { BookType } from "@/lib/types";
import { cleanDescription, cn, getStatusColor } from "@/lib/utils";
import { BookStatus } from "@prisma/client";
import { Check, Ellipsis, Quote, Smile } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import AverageBookRating from "./AverageBookRating";
import BookUserInfo from "./BookUserInfo";
import FriendsWhoReadBook from "./FriendsWhoReadBook";
//import useSWR from "swr";
// import AverageBookRating from "./AverageBookRating";
// import BookUserInfo from "./BookUserInfo";
// import FriendsWhoReadBook from "./FriendsWhoReadBook";

// Soit à partir de BooksSearchPage => on passe un objet "book" en props car on a les info nécessaires
// Soit à partir de MyBooksPage / UserAccountPage => on passe un bookId (et ensuite on va chercher les infos nécessaires dans la BDD avec useSWR)
//// ou mettre avec hook perso.............
// userViewId = id du user à ne pas compter dans les amis qui ont lu le livre (si on est sur UserAccountPage) + qd on est sur UserAccountPage => on voit ses info et non celles du user connecté
type BookInfosProps =
  | {
      currentUserId: string | undefined;
      book: BookType;
      bookId?: never;
      userViewId?: string;
      // userId?: string | undefined;
      bookConnectedUserStatus: BookStatus | "";
    }
  | {
      currentUserId: string | undefined;
      book?: never;
      bookId: string;
      userViewId?: string;
      // userId?: string | undefined;
      bookConnectedUserStatus: BookStatus | "";
    };

const BookInfos = ({
  currentUserId,
  book,
  bookId,
  userViewId,
  // userId,
  bookConnectedUserStatus = "",
}: BookInfosProps) => {
  //console.log("❤️", book);
  ////console.log("bookId", bookId);

  // const book = await prisma.book.findUnique({
  //   where: { id: bookId },
  // });

  // console.log("💛💙💚❤️🤍🤎id", bookId);
  // console.log("book", book);

  const [bookInfos, setBookInfos] = useState<BookType | null>(book || null);
  // console.log("bookInfos description", bookInfos?.description);

  // const [bookStatus, setBookStatus] = useState<BookStatus | "">("");
  // console.log("💛 bookinmylist", bookStatus);
  const [bookInFriendList, setBookInFriendList] = useState<BookStatus | "">("");

  console.log(
    "❤️💛💚🤍❤️ bookInfos.title",
    bookInfos?.title,
    bookConnectedUserStatus,
    bookInFriendList,
    currentUserId
  );

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const res = await fetch("/api/user");
  //       const data = await res.json();
  //       setCurrentUserId(data.user?.id);
  //     } catch (error) {
  //       console.error("Erreur user :", error);
  //     }
  //   };
  //   fetchUser();
  // }, []);

  //const { currentUser } = useUserStore();

  // 1-DEBUT============================FAIRE HOOK PERSO !!! (aussi pour BookDetailPage)
  // const fetchBookInfoDB = async (bookId: string): Promise<BookType | null> => {
  //   return getDocsByQueryFirebase<BookType>("books", "id", bookId)
  //     .then((books) => {
  //       if (books.length > 0) {
  //         ////console.log("BOOKS", books);
  //         return books[0];
  //       } else {
  //         return null;
  //       }
  //     })
  //     .catch((error) => {
  //       console.error(`Error fetching book with id: ${bookId}`, error);
  //       return null;
  //     });
  // };

  // const {
  //   data: bookFromId,
  //   error,
  //   isLoading,
  // } = useSWR<BookType | null>(bookId, fetchBookInfoDB);

  // ici on utilise une constante et pas un state car le message ne change pas et s'affiche seulement si useSWR renvoie une erreur
  // const message = `Un problème est survenu dans la récupération du livre => ${error?.message}`;

  // useEffect(() => {
  //   if (bookFromId) {
  //     setBookInfos(bookFromId);
  //   }
  // }, [bookFromId]);
  // // 1-FIN==============
  // // ==============FAIRE HOOK PERSO !!!

  // useEffect(() => {
  //   console.log(
  //     "💛💙💚❤️🤍🤎 useEffect userId && bookInfos",
  //     userId,
  //     bookInfos
  //   );
  //   //ou gérer le undefined dans fonction bookInMyBooksFirebase ??????????
  //   if (userId && bookInfos) {
  //     fetch("/api/bookss/bookStatus", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ userId, bookId: bookInfos.id }),
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         if (data.status) {
  //           setBookStatus(data.status);
  //         }
  //       })
  //       .catch((error) => console.error("Error fetching book status:", error));
  //   }

  //   // if (userViewId !== currentUser?.uid)
  //   //   findBookCatInUserLibraryFirebase(bookInfos?.id, userViewId).then(
  //   //     (bookInFriendList) => setBookInFriendList(bookInFriendList)
  //   //   );
  // }, []);
  ////////// AJOUTER LES dépendance là c'était car boucle infinie !!!!!!!!!!!!!
  ////////// AJOUTER LES dépendance là c'était car boucle infinie !!!!!!!!!!!!!
  ////////// AJOUTER LES dépendance là c'était car boucle infinie !!!!!!!!!!!!!
  ////////// AJOUTER LES dépendance là c'était car boucle infinie !!!!!!!!!!!!!
  ////////// AJOUTER LES dépendance là c'était car boucle infinie !!!!!!!!!!!!!
  // }, [bookInfos?.id, userId, userViewId]);

  const handleLinkClick = () => {
    toast.error("Veuillez vous connecter pour accéder à cette page.");
  };

  {
    /* {isLoading ? (
    <BookSkeleton />
  ) : error ? (
    <FeedbackMessage message={message} type="error" />
  ) : ( */
  }
  return (
    <div>
      {book && (
        <Card className="relative">
          <Link
            href={currentUserId ? `/books/${book.id}` : "/auth/signin"}
            // Créer un ClientLink pour pouvoir mettre le toast si non connecté ???
            onClick={!currentUserId ? handleLinkClick : undefined}
          >
            <CardDescription className="absolute right-2 top-2 rounded-full bg-secondary/60 px-3 py-1 text-secondary-foreground shadow-sm shadow-foreground">
              {book.language}
            </CardDescription>
            <div>
              <div className="relative flex items-start gap-5 p-5 pt-10 shadow-md shadow-secondary/60">
                <img
                  src={book.imageLink || DEFAULT_BOOK_IMAGE}
                  // à voir mettre dans un client
                  //onError={(e) => (e.currentTarget.src = DEFAULT_BOOK_IMAGE)}
                  className="w-32 rounded-sm border border-border object-contain shadow-md shadow-foreground/70"
                  alt={`Image de couverture du livre ${book?.title}`}
                />
                <CardHeader className="gap-3 overflow-hidden">
                  <CardTitle className="line-clamp-4">{book.title}</CardTitle>
                  <CardDescription className="line-clamp-2 text-muted">
                    {book?.authors?.join(", ")}
                  </CardDescription>
                  <CardDescription className="overflow-hidden">
                    {book.categories &&
                      book.categories.map((cat: string, index: number) => (
                        <span key={index}>{index > 0 ? ` / ${cat}` : cat}</span>
                      ))}
                  </CardDescription>
                  {book.description ? (
                    <CardDescription className="relative flex gap-2">
                      <Quote className="absolute -top-1" />
                      <span className="line-clamp-3 max-w-[90%] text-foreground">
                        &ensp;&ensp;&ensp;&ensp;
                        {cleanDescription(book.description)}
                      </span>
                    </CardDescription>
                  ) : (
                    <p className="italic">{NO_DESCRIPTION} </p>
                  )}
                  <AverageBookRating bookInfos={book} />
                </CardHeader>

                {bookConnectedUserStatus && (
                  <div
                    className={cn(
                      "absolute -bottom-16 right-2 rounded-full bg-primary/50 p-1 shadow-sm shadow-foreground",
                      getStatusColor(bookConnectedUserStatus)
                    )}
                  >
                    {bookConnectedUserStatus === BookStatus.READ && (
                      <div className="flex flex-col items-center p-1 text-xs">
                        J'ai lu
                        <Check />
                      </div>
                    )}
                    {bookConnectedUserStatus === BookStatus.IN_PROGRESS && (
                      <div className="flex flex-col items-center p-1 text-xs">
                        Je lis...
                        <Ellipsis />
                      </div>
                    )}
                    {bookConnectedUserStatus === BookStatus.TO_READ && (
                      <div className="flex flex-col items-center p-1 text-xs">
                        A lire !
                        <Smile />
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="bg-pink-500">
                <p>BookUserInfo (on est ds composant BookInfo)</p>
                <p>bookConnectedUserStatus = {bookConnectedUserStatus} </p>
                <p>title = {bookInfos?.title} </p>
                <p>bookInFriendList = {bookInFriendList} </p>
                <p>userViewId = {userViewId} </p>
                <p>currentUserId = {currentUserId} </p>
              </div>
              {(bookConnectedUserStatus || userViewId) &&
                // pk j'avais mis bookInFriendList ???
                // {(bookUserStatus || bookInFriendList !== "") &&
                bookInfos &&
                currentUserId && (
                  <BookUserInfo
                    // userId={userViewId || currentUserId}
                    currentUserId={currentUserId}
                    bookId={bookInfos.id}
                    bookStatus={bookConnectedUserStatus}
                    userViewId={userViewId}
                    // friendBookStatus={bookInFriendList}
                  />
                )}
            </div>
          </Link>
          {bookInfos && currentUserId && (
            <FriendsWhoReadBook
              bookId={bookInfos.id}
              userViewId={userViewId}
              currentUserId={currentUserId}
            />
          )}
        </Card>
      )}
    </div>
  );
};

export default BookInfos;
