import { BookStatusType } from "@/lib/types";
import BooksWithSortControls from "./BooksWithSortControls";
import FeedbackMessage from "./FeedbackMessage";
import { TabsContent } from "./ui/tabs";

type BooksTabContentProps = {
  value: BookStatusType | string;
  activeTab: BookStatusType;
  displayedBookIds: string[];
  displayedAppUserId: string;
};

const BooksTabContent = ({
  value,
  activeTab,
  displayedBookIds,
  displayedAppUserId,
}: BooksTabContentProps) => {
  return (
    <TabsContent value={value}>
      {displayedBookIds.length > 0 ? (
        <div className="flex flex-col items-center gap-1 md:gap-4">
          <p>{displayedBookIds.length} livres</p>
          <BooksWithSortControls
            displayBookStatus={activeTab}
            bookIds={displayedBookIds}
            displayedAppUserId={displayedAppUserId}
            withDateOption={true}
          />
        </div>
      ) : (
        <FeedbackMessage
          message="Vous n'avez pas encore ajouté de livre dans cette catégorie."
          className="my-28"
        />
      )}
    </TabsContent>
  );
};

export default BooksTabContent;
