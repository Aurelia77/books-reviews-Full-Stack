import { BookStatusEnum, SortStateType } from "@/types";
import React from "react";
import BookInfos from "./BookInfos";
import BooksSortControls from "./BooksSortControls";
import FeedbackMessage from "./FeedbackMessage";
import { TabsContent } from "./ui/tabs";

type BooksTabContentProps = {
  value: BookStatusEnum | string;
  activeTab: BookStatusEnum;
  sortState: SortStateType;
  setSortState: React.Dispatch<React.SetStateAction<SortStateType>>;
  displayedBooksIds: string[];
  userId: string;
};

const BooksTabContent = ({
  value,
  activeTab,
  sortState,
  setSortState,
  displayedBooksIds,
  userId,
}: BooksTabContentProps) => (
  <TabsContent value={value}>
    <BooksSortControls
      booksStatus={activeTab}
      sortState={sortState}
      setSortState={setSortState}
    />
    {displayedBooksIds.length > 0 ? (
      displayedBooksIds.map((bookId: string) => (
        <div className="mb-4" key={bookId}>
          <BookInfos bookId={bookId} userViewId={userId} />
        </div>
      ))
    ) : (
      <FeedbackMessage message="Aucun livre pour l'instant" className="mt-8" />
    )}
  </TabsContent>
);

export default BooksTabContent;
