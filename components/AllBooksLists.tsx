"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookStatusValues } from "@/lib/constants";
import { AppUserType, BookStatusType } from "@/lib/types";
import { cn, getStatusColor } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query"; // Ajoute ce import
import { BookOpenCheck, Ellipsis, Smile } from "lucide-react";
import { useState } from "react";
import BooksTabContent from "./BooksTabContent";
import FeedbackMessage from "./FeedbackMessage";
import BookSkeleton from "./skeletons/BookSkeleton";

const DEFAULT_TAB = BookStatusValues.READ;

type AllBooksListsProps = {
  displayedAppUser: AppUserType;
};

const AllBooksLists = ({ displayedAppUser }: AllBooksListsProps) => {
  const [activeTab, setActiveTab] = useState<BookStatusType>(DEFAULT_TAB);
  //const [displayedBookIds, setDisplayedBookIds] = useState<string[]>([]);
  const {
    data: displayedBookIds,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userInfoBooks", displayedAppUser.id, activeTab],
    queryFn: async () => {
      const res = await fetch(
        `/api/userInfoBooks/${displayedAppUser.id}/${activeTab}`
      );
      if (!res.ok) throw new Error("Erreur lors de la récupération des livres");
      const json = await res.json();
      return json.data;
    },
    //placeholderData: [],
    //keepPreviousData: true,   ??????????? pour garder les données précédentes pendant le chargement,
  });

  console.log("💛💙💚❤️🤍🤎displayedBookIds", displayedBookIds);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const res = await fetch(
  //       `/api/userInfoBooks/${displayedAppUser.id}/${activeTab}`
  //     );

  //     if (!res.ok) {
  //       throw new Error("Erreur lors de la récupération des livres");
  //     }

  //     const json = await res.json();
  //     setDisplayedBookIds(json.data);
  //   };

  //   fetchData();
  // }, [activeTab, displayedAppUser.id]);

  return (
    <div>
      <Tabs
        defaultValue={DEFAULT_TAB}
        className={cn(
          "mb-16 mt-4 flex flex-col gap-4 md:rounded-lg",
          getStatusColor(activeTab)
        )}
        onValueChange={(value) => setActiveTab(value as BookStatusType)}
      >
        <TabsList>
          <TabsTrigger
            value={BookStatusValues.READ}
            className="w-full flex gap-2"
          >
            Lus
            <BookOpenCheck
              className={cn(
                "rounded-full p-1 shadow-sm shadow-foreground",
                getStatusColor(BookStatusValues.READ)
              )}
            />
          </TabsTrigger>
          <TabsTrigger
            value={BookStatusValues.IN_PROGRESS}
            className="w-full flex gap-2"
          >
            En cours
            <Ellipsis
              className={cn(
                "rounded-full p-1 shadow-sm shadow-foreground",
                getStatusColor(BookStatusValues.IN_PROGRESS)
              )}
            />
          </TabsTrigger>
          <TabsTrigger
            value={BookStatusValues.TO_READ}
            className="w-full flex gap-2"
          >
            À lire
            <Smile
              className={cn(
                "rounded-full p-1 shadow-sm shadow-foreground",
                getStatusColor(BookStatusValues.TO_READ)
              )}
            />
          </TabsTrigger>
        </TabsList>
        {isError ? (
          <FeedbackMessage
            message={`Une erreur est survenue lors de la récupération des livres : ${error.message}`}
            type="error"
          />
        ) : isLoading ? (
          <div>
            <BookSkeleton />
            <BookSkeleton />
            <BookSkeleton />
          </div>
        ) : (
          <div>
            <BooksTabContent
              value={BookStatusValues.READ}
              activeTab={activeTab}
              displayedBookIds={displayedBookIds}
              displayedAppUserId={displayedAppUser.id}
            />
            <BooksTabContent
              value={BookStatusValues.IN_PROGRESS}
              activeTab={activeTab}
              displayedBookIds={displayedBookIds}
              displayedAppUserId={displayedAppUser.id}
            />
            <BooksTabContent
              value={BookStatusValues.TO_READ}
              activeTab={activeTab}
              displayedBookIds={displayedBookIds}
              displayedAppUserId={displayedAppUser.id}
            />
          </div>
        )}
      </Tabs>
    </div>
  );
};

export default AllBooksLists;
