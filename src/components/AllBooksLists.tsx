import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDocsByQueryFirebase } from "@/firebase/firestore";
import { cn } from "@/lib/utils";
import {
  BookStatusEnum,
  BookType,
  MyInfoBookPlusTitleAndNote,
  SortStateType,
  UserInfoBookType,
  UserType,
  UserTypePlusBooksTitleAndNote,
} from "@/types";
import { sortBooksByStatus } from "@/utils";
import { BookOpenCheck, Ellipsis, Smile } from "lucide-react";
import { useEffect, useState } from "react";
import BooksTabContent from "./BooksTabContent";

const DEFAULT_TAB = BookStatusEnum.booksReadList;

type AllBooksListsProps = {
  userInfo: UserType;
};

const AllBooksLists = ({ userInfo }: AllBooksListsProps): JSX.Element => {
  //
  const [activeTab, setActiveTab] = useState<BookStatusEnum>(DEFAULT_TAB);
  const [userInfoPlusTitleAndNote, setUserInfoPlusTitleAndNote] =
    useState<UserTypePlusBooksTitleAndNote>();
  const [displayedBooksUserInfo, setDisplayedBooksUserInfo] = useState<
    MyInfoBookPlusTitleAndNote[]
  >([]);
  const [displayedBooksIds, setDisplayedBooksIds] = useState<string[]>([]);

  console.log("zzz123 displayedBooksIds", displayedBooksIds);

  // console.log("1 - xICI !!! userInfo", userInfo.booksRead[0]);
  // console.log(
  //   "2 - xICI !!! userInfoPlusTitleAndNote",
  //   userInfoPlusTitleAndNote?.booksRead[0]
  // );
  // console.log("3 - xICI !!! displayedBooksUserInfo", displayedBooksUserInfo[0]);

  const [sortState, setSortState] = useState<SortStateType>({
    [BookStatusEnum.booksReadList]: { criteria: "date", order: "asc" },
    [BookStatusEnum.booksInProgressList]: { criteria: "date", order: "asc" },
    [BookStatusEnum.booksToReadList]: { criteria: "date", order: "asc" },
  });
  console.log("www sortState", sortState.booksRead);

  const addTitleAndNoteToBooksInfo = (booksInfo: UserInfoBookType[]) => {
    const booksInfoPlusTitle: MyInfoBookPlusTitleAndNote[] = [];

    console.log("booksInfo", booksInfo);

    const promises = booksInfo.map((bookInfo) => {
      return (
        getDocsByQueryFirebase<BookType>("books", "id", bookInfo.id)
          .then((books) => {
            console.log("books", books);
            return {
              ...bookInfo,
              bookTitle: books[0].title,
              bookNote: books[0].rating,
              // bookNote: books[0].rating?.count
              //   ? books[0].rating?.totalRating / books[0].rating?.count
              //   : null,
            };
          })
          .then((bookInfoPlusTitle) => {
            console.log("**bookInfoPlusTitle", bookInfoPlusTitle);
            if (bookInfoPlusTitle) {
              booksInfoPlusTitle.push(bookInfoPlusTitle);
              return booksInfoPlusTitle;
            }
          })
          // .then((booksInfoPlusTitle) => {
          //   console.log("booksInfoPlusTitle SSS", booksInfoPlusTitle);
          //   //setBooksInfoPlusTitle(booksInfoPlusTitle);
          // });
          .catch((error) => {
            console.error("Error getting document:", error);
          })
      );
    });

    return Promise.all(promises).then(() => {
      // console.log("www booksInfoPlusTitle", booksInfoPlusTitle);
      // console.log("www booksInfoPlusTitle.length", booksInfoPlusTitle.length);
      return booksInfoPlusTitle;
    });
  };

  useEffect(() => {
    console.log("ICI !!! USEEFFECT 11111");

    let booksReadInfoPlusTitleAndNote: MyInfoBookPlusTitleAndNote[] = [];
    let booksInProgressInfoPlusTitleAndNote: MyInfoBookPlusTitleAndNote[] = [];
    let booksToReadInfoPlusTitleAndNote: MyInfoBookPlusTitleAndNote[] = [];

    addTitleAndNoteToBooksInfo(userInfo.booksRead)
      .then((resultBooksRead) => {
        console.log("www booksInfoPlusTitle", resultBooksRead);
        booksReadInfoPlusTitleAndNote = resultBooksRead;
        return addTitleAndNoteToBooksInfo(userInfo.booksInProgress); // Retourner la promesse suivante
      })
      .then((resultBooksInProgress) => {
        console.log("www booksInProgressInfoPlusTitle", resultBooksInProgress);
        booksInProgressInfoPlusTitleAndNote = resultBooksInProgress;
        return addTitleAndNoteToBooksInfo(userInfo.booksToRead); // Retourner la promesse suivante
      })
      .then((resultBooksToRead) => {
        console.log("www booksToReadInfoPlusTitle", resultBooksToRead);
        booksToReadInfoPlusTitleAndNote = resultBooksToRead;

        // Mettre à jour l'état une fois que toutes les promesses sont résolues
        setUserInfoPlusTitleAndNote({
          ...userInfo,
          booksRead: booksReadInfoPlusTitleAndNote,
          booksInProgress: booksInProgressInfoPlusTitleAndNote,
          booksToRead: booksToReadInfoPlusTitleAndNote,
        });
      })
      .catch((error) => {
        console.error("Error fetching books info:", error);
      });
  }, [userInfo]);

  useEffect(() => {
    console.log("ICI !!! USEEFFECT 22222");

    //  Expected an assignment or function call and instead saw an expression !!!!!!!!!!!!!!!!
    //@typescript-eslint/no-unused-expressions
    if (userInfoPlusTitleAndNote) {
      setDisplayedBooksUserInfo(userInfoPlusTitleAndNote[activeTab]);
    }
  }, [userInfoPlusTitleAndNote, activeTab]);
  // }, [userInfoPlusTitle[activeTab], activeTab]);

  useEffect(() => {
    sortBooksByStatus(displayedBooksUserInfo, activeTab, sortState);
    setDisplayedBooksIds(displayedBooksUserInfo.map((book) => book.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortState, displayedBooksUserInfo]);

  return (
    <div>
      <Tabs
        defaultValue={DEFAULT_TAB}
        className="mb-16 mt-4 flex flex-col gap-4"
        onValueChange={(value) => setActiveTab(value as BookStatusEnum)}
      >
        {/* className={cn(
                                "absolute bottom-10 right-2 rounded-full bg-primary/50 p-1 shadow-sm shadow-foreground",
                                bookInMyList === BookStatusEnum.booksReadList &&
                                  "bg-green-500/50",
                                bookInMyList === BookStatusEnum.booksInProgressList &&
                                  "bg-blue-500/50",
                                bookInMyList === BookStatusEnum.booksToReadList &&
                                  "bg-pink-500/50" */}
        <TabsList
          className={cn(
            "w-full",
            activeTab === BookStatusEnum.booksReadList && "bg-green-500/40",
            activeTab === BookStatusEnum.booksInProgressList &&
              "bg-blue-500/40",
            activeTab === BookStatusEnum.booksToReadList && "bg-pink-500/40"
          )}
        >
          <TabsTrigger
            value={BookStatusEnum.booksReadList}
            className="w-full flex gap-2"
          >
            Lus
            <BookOpenCheck className="rounded-full bg-green-500/40 p-1 shadow-sm shadow-foreground" />
          </TabsTrigger>
          <TabsTrigger
            value={BookStatusEnum.booksInProgressList}
            className="w-full flex gap-2"
          >
            En cours
            <Ellipsis className="rounded-full bg-blue-500/40 p-1 shadow-sm shadow-foreground" />
          </TabsTrigger>
          <TabsTrigger
            value={BookStatusEnum.booksToReadList}
            className="w-full flex gap-2"
          >
            À lire
            <Smile className="rounded-full bg-pink-500/40 p-1 shadow-sm shadow-foreground" />
          </TabsTrigger>
        </TabsList>
        <BooksTabContent
          value={BookStatusEnum.booksReadList}
          activeTab={activeTab}
          sortState={sortState}
          setSortState={setSortState}
          displayedBooksIds={displayedBooksIds}
          userId={userInfo.id}
        />
        <BooksTabContent
          value={BookStatusEnum.booksInProgressList}
          activeTab={activeTab}
          sortState={sortState}
          setSortState={setSortState}
          displayedBooksIds={displayedBooksIds}
          userId={userInfo.id}
        />
        <BooksTabContent
          value={BookStatusEnum.booksToReadList}
          activeTab={activeTab}
          sortState={sortState}
          setSortState={setSortState}
          displayedBooksIds={displayedBooksIds}
          userId={userInfo.id}
        />
      </Tabs>
    </div>
  );
};

export default AllBooksLists;
