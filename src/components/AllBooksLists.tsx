import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookStatusEnum, MyInfoBookType, UserType } from "@/types";
import BookInfos from "./BookInfos";
import FeedbackMessage from "./FeedbackMessage";

// type BookInfosProps =
//   | { book: BookType; bookId?: never; userViewId?: string }
//   | { book?: never; bookId: string; userViewId?: string };

// const BookInfos = ({
//   book,
//   bookId,
//   userViewId,
// }: BookInfosProps): JSX.Element => {

type AllBooksListsProps = {
  userInfo: UserType;
  userIdInUrl: string | undefined;
};

const AllBooksLists = ({
  userInfo,
  userIdInUrl,
}: AllBooksListsProps): JSX.Element => {
  return (
    <div>
      <Tabs defaultValue={BookStatusEnum.booksReadList} className="mt-4">
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
        <TabsContent value="booksRead">
          {userInfo?.booksRead && userInfo?.booksRead?.length > 0 ? (
            userInfo?.booksRead
              .sort((a, b) => (a.year ?? 0) - (b.year ?? 0))
              .map((book: MyInfoBookType) => (
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
          {userInfo?.booksInProgress &&
          userInfo?.booksInProgress?.length > 0 ? (
            userInfo?.booksInProgress.map((book: MyInfoBookType) => (
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
          {userInfo?.booksToRead && userInfo?.booksToRead?.length > 0 ? (
            userInfo?.booksToRead.map((book: MyInfoBookType) => (
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
