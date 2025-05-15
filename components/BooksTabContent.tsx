import { SortStateType } from "@/lib/types";
import React from "react";
import BookInfos from "./BookInfos";
import BooksSortControls from "./BooksSortControls";
import FeedbackMessage from "./FeedbackMessage";
import { TabsContent } from "./ui/tabs";
import { BookStatus } from "@prisma/client";

type BooksTabContentProps = {
  value: BookStatus | string;
  activeTab: BookStatus;
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
              {/* j'ai ajouté bookUserStatus={BookStatus.READ} */}
              {/* ???????? */}
              <BookInfos
                bookId={bookId}
                userViewId={userId}
                bookUserStatus={BookStatus.READ}
              />
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
