"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookStatusValues } from "@/lib/constants";
import { AppUserType, BookStatusType } from "@/lib/types";
import { cn, getStatusColor } from "@/lib/utils";
import { BookOpenCheck, Ellipsis, Smile } from "lucide-react";
import { useEffect, useState } from "react";
import BooksTabContent from "./BooksTabContent";

const DEFAULT_TAB = BookStatusValues.READ;

type AllBooksListsProps = {
  displayedAppUser: AppUserType;
};

const AllBooksLists = ({ displayedAppUser }: AllBooksListsProps) => {
  //
  const [activeTab, setActiveTab] = useState<BookStatusType>(DEFAULT_TAB);
  const [displayedBookIds, setDisplayedBookIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `/api/userInfoBooks/${displayedAppUser.id}/${activeTab}`
      );

      if (!res.ok) {
        throw new Error("Erreur lors de la récupération des livres");
      }

      const json = await res.json();
      setDisplayedBookIds(json.data);
    };

    fetchData();
  }, [activeTab, displayedAppUser.id]);

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
      </Tabs>
    </div>
  );
};

export default AllBooksLists;
