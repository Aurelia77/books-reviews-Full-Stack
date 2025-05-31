import { BookStatusEnum, SortStateType } from "@/lib/types";
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
    {displayedBooksIds.length > 0 ? (
      <div className="flex flex-col items-center gap-1 md:gap-4">
        <p>{displayedBooksIds.length} livres</p>
        {displayedBooksIds.length > 1 && (
          <BooksSortControls
            booksStatus={activeTab}
            sortState={sortState}
            setSortState={setSortState}
            withDateOption={true}
          />
        )}
        <ul>
          {displayedBooksIds.map((bookId: string) => (
            <li className="mb-4" key={bookId}>
              <BookInfos bookId={bookId} userViewId={userId} />
            </li>
          ))}
        </ul>
      </div>
    ) : (
      <FeedbackMessage message="Aucun livre pour l'instant" className="mt-8" />
    )}
  </TabsContent>
);

export default BooksTabContent;
