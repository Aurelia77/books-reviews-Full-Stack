import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDocsByQueryFirebase } from "@/firebase/firestore";
import {
  BookStatusEnum,
  BookType,
  MyInfoBookPlusTitleAndNote,
  MyInfoBookType,
  SortStateType,
  UserType,
  UserTypePlusBooksTitleAndNote,
} from "@/types";
import { sortBooks } from "@/utils";
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

  // console.log("1 - xICI !!! userInfo", userInfo.booksRead[0]);
  // console.log(
  //   "2 - xICI !!! userInfoPlusTitleAndNote",
  //   userInfoPlusTitleAndNote?.booksRead[0]
  // );
  // console.log("3 - xICI !!! displayedBooksUserInfo", displayedBooksUserInfo[0]);

  const [sortState, setSortState] = useState<{
    [key in BookStatusEnum]: SortStateType;
  }>({
    [BookStatusEnum.booksReadList]: { criteria: "date", order: "asc" },
    [BookStatusEnum.booksInProgressList]: { criteria: "date", order: "asc" },
    [BookStatusEnum.booksToReadList]: { criteria: "date", order: "asc" },
  });
  console.log("www sortState", sortState.booksRead);

  const addTitleAndNoteToBooksInfo = (booksInfo: MyInfoBookType[]) => {
    const booksInfoPlusTitle: MyInfoBookPlusTitleAndNote[] = [];

    const promises = booksInfo.map((bookInfo) => {
      return (
        getDocsByQueryFirebase<BookType>("books", "id", bookInfo.id)
          .then((books) => {
            console.log("books", books);
            return {
              ...bookInfo,
              bookTitle: books[0].title,
              bookNote: books[0].rating?.count
                ? books[0].rating?.totalRating / books[0].rating?.count
                : null,
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

    let booksReadInfoPlusTitle: MyInfoBookPlusTitleAndNote[] = [];
    let booksInProgressInfoPlusTitle: MyInfoBookPlusTitleAndNote[] = [];
    let booksToReadInfoPlusTitle: MyInfoBookPlusTitleAndNote[] = [];

    addTitleAndNoteToBooksInfo(userInfo.booksRead)
      .then((resultBooksRead) => {
        console.log("www booksInfoPlusTitle", resultBooksRead);
        booksReadInfoPlusTitle = resultBooksRead;
        return addTitleAndNoteToBooksInfo(userInfo.booksInProgress); // Retourner la promesse suivante
      })
      .then((resultBooksInProgress) => {
        console.log("www booksInProgressInfoPlusTitle", resultBooksInProgress);
        booksInProgressInfoPlusTitle = resultBooksInProgress;
        return addTitleAndNoteToBooksInfo(userInfo.booksToRead); // Retourner la promesse suivante
      })
      .then((resultBooksToRead) => {
        console.log("www booksToReadInfoPlusTitle", resultBooksToRead);
        booksToReadInfoPlusTitle = resultBooksToRead;

        // Mettre à jour l'état une fois que toutes les promesses sont résolues
        setUserInfoPlusTitleAndNote({
          ...userInfo,
          booksRead: booksReadInfoPlusTitle,
          booksInProgress: booksInProgressInfoPlusTitle,
          booksToRead: booksToReadInfoPlusTitle,
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
    sortBooks(displayedBooksUserInfo, activeTab, sortState);
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
          displayedBooksUserInfo={displayedBooksUserInfo}
          userId={userInfo.id}
        />
        <BooksTabContent
          value={BookStatusEnum.booksInProgressList}
          activeTab={activeTab}
          sortState={sortState}
          setSortState={setSortState}
          displayedBooksUserInfo={displayedBooksUserInfo}
          userId={userInfo.id}
        />
        <BooksTabContent
          value={BookStatusEnum.booksToReadList}
          activeTab={activeTab}
          sortState={sortState}
          setSortState={setSortState}
          displayedBooksUserInfo={displayedBooksUserInfo}
          userId={userInfo.id}
        />
      </Tabs>
    </div>
  );
};

export default AllBooksLists;
