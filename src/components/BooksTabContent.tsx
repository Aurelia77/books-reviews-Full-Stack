import React from "react";
import BooksSortControls from "./BooksSortControls";
import BookInfos from "./BookInfos";
import FeedbackMessage from "./FeedbackMessage";
import { MyInfoBookType, SortStateType, BookStatusEnum } from "@/types";
import { TabsContent } from "./ui/tabs";

type BooksTabContentProps = {
  value: BookStatusEnum | string;
  activeTab: BookStatusEnum;
  sortState: { [key in BookStatusEnum]: SortStateType };
  setSortState: React.Dispatch<
    React.SetStateAction<{ [key in BookStatusEnum]: SortStateType }>
  >;
  displayedBooksUserInfo: MyInfoBookType[];
  userId: string;
};

const BooksTabContent = ({
  value,
  activeTab,
  sortState,
  setSortState,
  displayedBooksUserInfo,
  userId,
}: BooksTabContentProps) => (
  <TabsContent value={value}>
    <BooksSortControls
      booksStatus={activeTab}
      sortState={sortState}
      setSortState={setSortState}
    />
    {displayedBooksUserInfo && displayedBooksUserInfo.length > 0 ? (
      displayedBooksUserInfo.map((book: MyInfoBookType) => (
        <div className="mb-4" key={book.id}>
          <BookInfos bookId={book.id} userViewId={userId} />
        </div>
      ))
    ) : (
      <FeedbackMessage message="Aucun livre pour l'instant" className="mt-8" />
    )}
  </TabsContent>
);

export default BooksTabContent;
