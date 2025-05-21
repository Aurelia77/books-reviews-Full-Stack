import { SortStateType } from "@/lib/types";
import { BookStatus } from "@prisma/client";
import React from "react";
import BooksWithSortControls from "./BooksWithSortControls";
import FeedbackMessage from "./FeedbackMessage";
import { TabsContent } from "./ui/tabs";

type BooksTabContentProps = {
  value: BookStatus | string;
  activeTab: BookStatus;
  // sortState: SortStateType;
  // setSortState: React.Dispatch<React.SetStateAction<SortStateType>>;
  displayedBookIds: string[];
  displayedAppUserId: string;
};

const BooksTabContent = ({
  value,
  activeTab,
  // A SUPP !!!!!!!!!!!
  // sortState,
  // setSortState,
  displayedBookIds,
  displayedAppUserId,
}: BooksTabContentProps) => (
  <TabsContent value={value}>
    {displayedBookIds.length > 0 ? (
      <div className="flex flex-col items-center gap-1 md:gap-4">
        <p>{displayedBookIds.length} livres</p>
        <BooksWithSortControls
          displayBookStatus={activeTab}
          bookIds={displayedBookIds}
          // sortState={sortState}
          // setSortState={setSortState}
          displayedAppUserId={displayedAppUserId}
          withDateOption={true}
        />
        {/* {displayedBookIds.length > 1 && (
          <BooksSortControls
            booksStatus={activeTab}
            sortState={sortState}
            setSortState={setSortState}
            withDateOption={true}
          />
        )}
        <ul>
          {displayedBookIds.map((bookId: string) => (
            <li className="mb-4" key={bookId}>
              <BookInfos
                bookId={bookId}
                userViewId={userId}
                bookUserStatus={BookStatus.READ}
                />
            </li>
          ))}
        </ul> */}
        {/* j'ai ajouté bookUserStatus={BookStatus.READ} */}
      </div>
    ) : (
      <FeedbackMessage message="Aucun livre pour l'instant" className="mt-8" />
    )}
  </TabsContent>
);

export default BooksTabContent;
