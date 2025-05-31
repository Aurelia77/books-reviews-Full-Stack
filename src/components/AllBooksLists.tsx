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
} from "@/lib/types";
import { cn } from "@/lib/utils";
import { sortBooksByStatus } from "@/utils";
import { BookOpenCheck, Ellipsis, Smile } from "lucide-react";
import { useEffect, useState } from "react";
import BooksTabContent from "./BooksTabContent";

const DEFAULT_TAB = BookStatusEnum.booksReadList;

type AllBooksListsProps = {
  userInfo: UserType;
};

const AllBooksLists = ({ userInfo }: AllBooksListsProps): JSX.Element => {
  const [activeTab, setActiveTab] = useState<BookStatusEnum>(DEFAULT_TAB);
  const [userInfoPlusTitleAndNote, setUserInfoPlusTitleAndNote] =
    useState<UserTypePlusBooksTitleAndNote>();
  const [displayedBooksUserInfo, setDisplayedBooksUserInfo] = useState<
    MyInfoBookPlusTitleAndNote[]
  >([]);
  const [displayedBooksIds, setDisplayedBooksIds] = useState<string[]>([]);

  const [sortState, setSortState] = useState<SortStateType>({
    [BookStatusEnum.booksReadList]: { criteria: "date", order: "asc" },
    [BookStatusEnum.booksInProgressList]: { criteria: "date", order: "asc" },
    [BookStatusEnum.booksToReadList]: { criteria: "date", order: "asc" },
  });

  const addTitleAndNoteToBooksInfo = (booksInfo: UserInfoBookType[]) => {
    const booksInfoPlusTitle: MyInfoBookPlusTitleAndNote[] = [];

    const promises = booksInfo.map((bookInfo) => {
      return (
        getDocsByQueryFirebase<BookType>("books", "id", bookInfo.id)
          .then((books) => {
            return {
              ...bookInfo,
              bookTitle: books[0].title,
              bookNote: books[0].rating,
            };
          })
          .then((bookInfoPlusTitle) => {
            if (bookInfoPlusTitle) {
              booksInfoPlusTitle.push(bookInfoPlusTitle);
              return booksInfoPlusTitle;
            }
          })
          .catch((error) => {
            console.error("Error getting document:", error);
          })
      );
    });

    return Promise.all(promises).then(() => {
      return booksInfoPlusTitle;
    });
  };

  useEffect(() => {
    let booksReadInfoPlusTitleAndNote: MyInfoBookPlusTitleAndNote[] = [];
    let booksInProgressInfoPlusTitleAndNote: MyInfoBookPlusTitleAndNote[] = [];
    let booksToReadInfoPlusTitleAndNote: MyInfoBookPlusTitleAndNote[] = [];

    addTitleAndNoteToBooksInfo(userInfo.booksRead)
      .then((resultBooksRead) => {
        booksReadInfoPlusTitleAndNote = resultBooksRead;
        return addTitleAndNoteToBooksInfo(userInfo.booksInProgress);
      })
      .then((resultBooksInProgress) => {
        booksInProgressInfoPlusTitleAndNote = resultBooksInProgress;
        return addTitleAndNoteToBooksInfo(userInfo.booksToRead);
      })
      .then((resultBooksToRead) => {
        booksToReadInfoPlusTitleAndNote = resultBooksToRead;

        // Update state once all promises are resolved
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
    //@typescript-eslint/no-unused-expressions
    if (userInfoPlusTitleAndNote) {
      setDisplayedBooksUserInfo(userInfoPlusTitleAndNote[activeTab]);
    }
  }, [userInfoPlusTitleAndNote, activeTab]);

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
            className="flex w-full gap-2"
          >
            Lus
            <BookOpenCheck className="shadow-foreground rounded-full bg-green-500/40 p-1 shadow-sm" />
          </TabsTrigger>
          <TabsTrigger
            value={BookStatusEnum.booksInProgressList}
            className="flex w-full gap-2"
          >
            En cours
            <Ellipsis className="shadow-foreground rounded-full bg-blue-500/40 p-1 shadow-sm" />
          </TabsTrigger>
          <TabsTrigger
            value={BookStatusEnum.booksToReadList}
            className="flex w-full gap-2"
          >
            À lire
            <Smile className="shadow-foreground rounded-full bg-pink-500/40 p-1 shadow-sm" />
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
