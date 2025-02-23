import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDocsByQueryFirebase } from "@/firebase/firestore";
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
        className="mb-16 mt-4"
        onValueChange={(value) => setActiveTab(value as BookStatusEnum)}
      >
        <TabsList className="w-full max-w-xl">
          <TabsTrigger value={BookStatusEnum.booksReadList} className="w-full">
            Lus
          </TabsTrigger>
          <TabsTrigger
            value={BookStatusEnum.booksInProgressList}
            className="w-full"
          >
            En cours
          </TabsTrigger>
          <TabsTrigger
            value={BookStatusEnum.booksToReadList}
            className="w-full"
          >
            À lire
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
