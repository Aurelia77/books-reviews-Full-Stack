import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useEffect, useState } from "react";
import BookInfos from "./BookInfos";
import FeedbackMessage from "./FeedbackMessage";
import SortBooksButtons from "./SortBooksButtons";

const DEFAULT_TAB = BookStatusEnum.booksReadList;

type AllBooksListsProps = {
  userInfo: UserType;
  userIdInUrl: string | undefined;
};

const AllBooksLists = ({
  userInfo,
  userIdInUrl,
}: AllBooksListsProps): JSX.Element => {
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

  const handleSort = (criteria: "title" | "date" | "note") => {
    //console.log("wwwx criteria", criteria);
    //console.log("wwwx activeTab", activeTab);

    setSortState((prevState) => ({
      ...prevState,
      [activeTab]: {
        criteria,
        order:
          prevState[activeTab].criteria === criteria
            ? prevState[activeTab].order === "asc"
              ? "desc"
              : "asc"
            : "asc",
      },
    }));
  };

  const sortBooks = (
    books: MyInfoBookPlusTitleAndNote[]
  ): MyInfoBookPlusTitleAndNote[] => {
    const { criteria, order } = sortState[activeTab];

    return books.sort((a, b) => {
      let comparison = 0;
      let yearComparison = 0;

      switch (criteria) {
        case "title":
          comparison = a.bookTitle.localeCompare(b.bookTitle);
          break;
        case "date":
          yearComparison = (a.year ?? 0) - (b.year ?? 0);
          if (yearComparison !== 0) {
            comparison = yearComparison;
          } else {
            comparison = (a.month ?? 0) - (b.month ?? 0);
          }
          break;
        case "note":
          comparison = (a.bookNote ?? 0) - (b.bookNote ?? 0);
          break;
      }
      return order === "asc" ? comparison : -comparison;
    });
  };

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
    sortBooks(displayedBooksUserInfo);
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
        <TabsContent value={BookStatusEnum.booksReadList}>
          <SortBooksButtons
            booksStatus={activeTab}
            sortState={sortState}
            handleSort={handleSort}
          />
          {displayedBooksUserInfo && displayedBooksUserInfo.length > 0 ? (
            displayedBooksUserInfo.map((book: MyInfoBookType) => (
              <BookInfos
                key={book.id}
                bookId={book.id}
                userViewId={userInfo.id}
              />
            ))
          ) : (
            <FeedbackMessage
              message="Aucun livre pour l'instant"
              className="mt-8"
            />
          )}
        </TabsContent>
        <TabsContent value="booksInProgress">
          <SortBooksButtons
            booksStatus={activeTab}
            sortState={sortState}
            handleSort={handleSort}
          />
          {/*     {userInfo?.booksInProgress &&
                  userInfo?.booksInProgress?.length > 0 ? (
                    userInfo?.booksInProgress.map((book: MyInfoBookType) => ( */}
          {displayedBooksUserInfo && displayedBooksUserInfo.length > 0 ? (
            displayedBooksUserInfo.map((book: MyInfoBookType) => (
              <BookInfos
                key={book.id}
                bookId={book.id}
                userViewId={userInfo.id}
              />
            ))
          ) : (
            <FeedbackMessage
              message="Aucun livre pour l'instant"
              className="mt-8"
            />
          )}
        </TabsContent>
        <TabsContent value="booksToRead">
          <SortBooksButtons
            booksStatus={activeTab}
            sortState={sortState}
            handleSort={handleSort}
          />
          {displayedBooksUserInfo && displayedBooksUserInfo.length > 0 ? (
            displayedBooksUserInfo.map((book: MyInfoBookType) => (
              <BookInfos
                key={book.id}
                bookId={book.id}
                userViewId={userIdInUrl}
              />
            ))
          ) : (
            <FeedbackMessage
              message="Aucun livre pour l'instant"
              className="mt-8"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AllBooksLists;
