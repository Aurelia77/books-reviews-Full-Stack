"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { getDocsByQueryFirebase } from "@/firebase/firestore";
import {
  MyInfoBookPlusTitleAndNote,
  SortStateType,
  UserType,
  UserTypePlusBooksTitleAndNote,
} from "@/lib/types";
import { cn, sortBooksByStatus } from "@/lib/utils";
import { BookStatus } from "@prisma/client";
import { BookOpenCheck, Ellipsis, Smile } from "lucide-react";
import { useEffect, useState } from "react";
import BooksTabContent from "./BooksTabContent";

const DEFAULT_TAB = BookStatus.READ;

type AllBooksListsProps = {
  displayedAppUser: UserType;
};

const AllBooksLists = ({ displayedAppUser }: AllBooksListsProps) => {
  //
  const [activeTab, setActiveTab] = useState<BookStatus>(DEFAULT_TAB);

  //console.log("💛💙💚❤️ activeTab", activeTab);

  const [userInfoPlusTitleAndNote, setUserInfoPlusTitleAndNote] =
    useState<UserTypePlusBooksTitleAndNote>();
  const [displayedBooksUserInfo, setDisplayedBooksUserInfo] = useState<
    MyInfoBookPlusTitleAndNote[]
  >([]);
  const [displayedBookIds, setDisplayedBookIds] = useState<string[]>([]);

  console.log("zzz123 displayedBookIds", displayedBookIds);

  // const [sortState, setSortState] = useState<SortStateType>({
  //   [BookStatus.READ]: { criteria: "date", order: "asc" },
  //   [BookStatus.IN_PROGRESS]: { criteria: "date", order: "asc" },
  //   [BookStatus.TO_READ]: { criteria: "date", order: "asc" },
  // });

  useEffect(() => {
    // console.log(
    //   "💙💚🤍🤎 USEEFFECT displayedBookIds",
    //   displayedAppUser.id,
    //   activeTab
    // );
    // console.log(
    //   "USEEFFECT URL FETCH =",
    //   `/api/book/${displayedAppUser.id}/${activeTab}`
    // );

    const fetchBooks = async () => {
      // const res = await fetch(`/api/book/${userInfo.id}/` + `${activeTab}`);
      const res = await fetch(`/api/book/${displayedAppUser.id}/${activeTab}`);

      if (!res.ok) {
        throw new Error("Erreur lors de la récupération des livres");
      }

      const data = await res.json();
      setDisplayedBookIds(data);
    };
    fetchBooks();
  }, [activeTab, displayedAppUser.id]);

  console.log(
    "💛💙💚❤️🤍🤎 displayedBookIds",
    displayedAppUser.id,
    activeTab,
    displayedBookIds
  );

  // const addTitleAndNoteToBooksInfo = async (booksInfo: UserInfoBookType[]) => {
  //   const booksInfoPlusTitle: MyInfoBookPlusTitleAndNote[] = [];

  //   const promises = booksInfo.map(async (bookInfo) => {
  //     const res = await fetch(`/api/book/${bookInfo.id}`);
  //     const book = await res.json();
  //     return {
  //       ...bookInfo,
  //       bookTitle: book.title,
  //       bookNote: book.rating,
  //     };
  //   });
  //   return Promise.all(promises).then((results) => {
  //     results.forEach((r) => {
  //       booksInfoPlusTitle.push(r);
  //     });
  //     return booksInfoPlusTitle;
  //   });
  // };

  // const addTitleAndNoteToBooksInfo = (booksInfo: UserInfoBookType[]) => {
  //   const booksInfoPlusTitle: MyInfoBookPlusTitleAndNote[] = [];

  //   console.log("booksInfo", booksInfo);

  //   // const promises = booksInfo.map((bookInfo) => {
  //   //   return (
  //   //     getDocsByQueryFirebase<BookType>("books", "id", bookInfo.id)
  //   //       .then((books) => {
  //   //         console.log("books", books);
  //   //         return {
  //   //           ...bookInfo,
  //   //           bookTitle: books[0].title,
  //   //           bookNote: books[0].rating,
  //   //           // bookNote: books[0].rating?.count
  //   //           //   ? books[0].rating?.totalRating / books[0].rating?.count
  //   //           //   : null,
  //   //         };
  //   //       })
  //   //       .then((bookInfoPlusTitle) => {
  //   //         console.log("**bookInfoPlusTitle", bookInfoPlusTitle);
  //   //         if (bookInfoPlusTitle) {
  //   //           booksInfoPlusTitle.push(bookInfoPlusTitle);
  //   //           return booksInfoPlusTitle;
  //   //         }
  //   //       })
  //   //       // .then((booksInfoPlusTitle) => {
  //   //       //   console.log("booksInfoPlusTitle SSS", booksInfoPlusTitle);
  //   //       //   //setBooksInfoPlusTitle(booksInfoPlusTitle);
  //   //       // });
  //   //       .catch((error) => {
  //   //         console.error("Error getting document:", error);
  //   //       })
  //   //   );
  //   // });

  //   // return Promise.all(promises).then(() => {
  //   //   // console.log("www booksInfoPlusTitle", booksInfoPlusTitle);
  //   //   // console.log("www booksInfoPlusTitle.length", booksInfoPlusTitle.length);
  //   //   return booksInfoPlusTitle;
  //   // });
  // };

  useEffect(() => {
    console.log("ICI !!! USEEFFECT 11111");

    let booksReadInfoPlusTitleAndNote: MyInfoBookPlusTitleAndNote[] = [];
    let booksInProgressInfoPlusTitleAndNote: MyInfoBookPlusTitleAndNote[] = [];
    let booksToReadInfoPlusTitleAndNote: MyInfoBookPlusTitleAndNote[] = [];

    // addTitleAndNoteToBooksInfo(userInfo.booksRead)
    //   .then((resultBooksRead) => {
    //     console.log("www booksInfoPlusTitle", resultBooksRead);
    //     booksReadInfoPlusTitleAndNote = resultBooksRead;
    //     return addTitleAndNoteToBooksInfo(userInfo.booksInProgress); // Retourner la promesse suivante
    //   })
    //   .then((resultBooksInProgress) => {
    //     console.log("www booksInProgressInfoPlusTitle", resultBooksInProgress);
    //     booksInProgressInfoPlusTitleAndNote = resultBooksInProgress;
    //     return addTitleAndNoteToBooksInfo(userInfo.booksToRead); // Retourner la promesse suivante
    //   })
    //   .then((resultBooksToRead) => {
    //     console.log("www booksToReadInfoPlusTitle", resultBooksToRead);
    //     booksToReadInfoPlusTitleAndNote = resultBooksToRead;

    //     // Mettre à jour l'état une fois que toutes les promesses sont résolues
    //     setUserInfoPlusTitleAndNote({
    //       ...userInfo,
    //       booksRead: booksReadInfoPlusTitleAndNote,
    //       booksInProgress: booksInProgressInfoPlusTitleAndNote,
    //       booksToRead: booksToReadInfoPlusTitleAndNote,
    //     });
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching books info:", error);
    //   });
  }, [displayedAppUser]);

  useEffect(() => {
    console.log("ICI !!! USEEFFECT 22222");

    //  Expected an assignment or function call and instead saw an expression !!!!!!!!!!!!!!!!
    //@typescript-eslint/no-unused-expressions
    if (userInfoPlusTitleAndNote) {
      //setDisplayedBooksUserInfo(userInfoPlusTitleAndNote[activeTab]);
    }
  }, [userInfoPlusTitleAndNote, activeTab]);
  // }, [userInfoPlusTitle[activeTab], activeTab]);

  // UTILS ?????????????????????
  // UTILS ?????????????????????
  // UTILS ?????????????????????
  // UTILS ?????????????????????
  // UTILS ?????????????????????
  // useEffect(() => {
  //   sortBooksByStatus(displayedBooksUserInfo, activeTab, sortState);
  //   setDisplayedBookIds(displayedBooksUserInfo.map((book) => book.id));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [sortState, displayedBooksUserInfo]);

  return (
    <div>
      <Tabs
        defaultValue={DEFAULT_TAB}
        className="mb-16 mt-4 flex flex-col gap-4"
        onValueChange={(value) => setActiveTab(value as BookStatus)}
      >
        {/* className={cn(
                                "absolute bottom-10 right-2 rounded-full bg-primary/50 p-1 shadow-sm shadow-foreground",
                                bookInMyList === BookStatus.READ &&
                                  "bg-green-500/50",
                                bookInMyList === BookStatus.booksInProgressList &&
                                  "bg-blue-500/50",
                                bookInMyList === BookStatus.booksToReadList &&
                                  "bg-pink-500/50" */}
        <TabsList
          className={cn(
            "w-full",
            activeTab === BookStatus.READ && "bg-green-500/40",
            activeTab === BookStatus.IN_PROGRESS && "bg-blue-500/40",
            activeTab === BookStatus.TO_READ && "bg-pink-500/40"
          )}
        >
          <TabsTrigger value={BookStatus.READ} className="w-full flex gap-2">
            Lus
            <BookOpenCheck className="rounded-full bg-green-500/40 p-1 shadow-sm shadow-foreground" />
          </TabsTrigger>
          <TabsTrigger
            value={BookStatus.IN_PROGRESS}
            className="w-full flex gap-2"
          >
            En cours
            <Ellipsis className="rounded-full bg-blue-500/40 p-1 shadow-sm shadow-foreground" />
          </TabsTrigger>
          <TabsTrigger value={BookStatus.TO_READ} className="w-full flex gap-2">
            À lire
            <Smile className="rounded-full bg-pink-500/40 p-1 shadow-sm shadow-foreground" />
          </TabsTrigger>
        </TabsList>
        {/* <BooksWithSortControls
          displayBookStatus={BookStatus.READ}
          userId={userInfo.id}
          /////////////// Ici gérer si on passe de id et non des BookType !!!!!!!!!
          /////////////// Ici gérer si on passe de id et non des BookType !!!!!!!!!
          /////////////// Ici gérer si on passe de id et non des BookType !!!!!!!!!
          /////////////// Ici gérer si on passe de id et non des BookType !!!!!!!!!
          /////////////// Ici gérer si on passe de id et non des BookType !!!!!!!!!
          /////////////// Ici gérer si on passe de id et non des BookType !!!!!!!!!
          books={displayedBookIds}
          withDateOption={true}
        /> */}
        <BooksTabContent
          value={BookStatus.READ}
          activeTab={activeTab}
          // sortState={sortState}
          // setSortState={setSortState}
          displayedBookIds={displayedBookIds}
          displayedAppUserId={displayedAppUser.id}
        />
        <BooksTabContent
          value={BookStatus.IN_PROGRESS}
          activeTab={activeTab}
          // sortState={sortState}
          // setSortState={setSortState}
          displayedBookIds={displayedBookIds}
          displayedAppUserId={displayedAppUser.id}
        />
        <BooksTabContent
          value={BookStatus.TO_READ}
          activeTab={activeTab}
          // sortState={sortState}
          // setSortState={setSortState}
          displayedBookIds={displayedBookIds}
          displayedAppUserId={displayedAppUser.id}
        />
      </Tabs>
    </div>
  );
};

export default AllBooksLists;
