"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookStatusValues,
  DEFAULT_BOOK_IMAGE,
  NO_DESCRIPTION,
} from "@/lib/constants";
import { BookStatusType, BookType } from "@/lib/types";
import { cleanDescription, cn, getStatusColor } from "@/lib/utils";
import { Check, Ellipsis, Quote, Smile } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AverageBookRating from "./AverageBookRating";
import BookUserInfo from "./BookUserInfo";
import FriendsWhoReadBook from "./FriendsWhoReadBook";

type BookInfosProps =
  | {
      currentUserId: string | undefined;
      book: BookType;
      bookId?: never;
      userViewId?: string;
      bookConnectedUserStatus: BookStatusType | "";
    }
  | {
      currentUserId: string | undefined;
      book?: never;
      bookId: string;
      userViewId?: string;
      bookConnectedUserStatus: BookStatusType | "";
    };

const BookInfos = ({
  currentUserId,
  book,
  userViewId,
  bookConnectedUserStatus = "",
}: BookInfosProps) => {
  return (
    <div>
      {book && (
        <Card className="relative">
          <Link href={currentUserId ? `/books/${book.id}` : "/auth/signin"}>
            <CardDescription className="absolute right-2 top-2 rounded-full bg-secondary/60 px-3 py-1 text-secondary-foreground shadow-sm shadow-foreground">
              {book.language}
            </CardDescription>
            <div>
              <div className="relative flex items-start gap-5 p-5 pt-10 shadow-md shadow-secondary/60">
                <Image
                  src={book.imageLink || DEFAULT_BOOK_IMAGE}
                  className="w-32 rounded-sm border border-border object-contain shadow-md shadow-foreground/70"
                  alt={`Image de couverture du livre ${book?.title}`}
                  width={192}
                  height={288}
                  unoptimized
                />
                <CardHeader className="gap-3 overflow-hidden">
                  <CardTitle className="line-clamp-4">{book.title}</CardTitle>
                  <CardDescription className="line-clamp-2 text-muted">
                    {book?.authors?.join(", ")}
                  </CardDescription>
                  <CardDescription className="overflow-hidden">
                    {book.categories &&
                      book.categories.map((cat: string, index: number) => (
                        <span key={index}>{index > 0 ? ` / ${cat}` : cat}</span>
                      ))}
                  </CardDescription>
                  {book.description ? (
                    <CardDescription className="relative flex gap-2">
                      <Quote className="absolute -top-1" />
                      <span className="line-clamp-3 max-w-[90%] text-foreground">
                        &ensp;&ensp;&ensp;&ensp;
                        {cleanDescription(book.description)}
                      </span>
                    </CardDescription>
                  ) : (
                    <p className="italic">{NO_DESCRIPTION} </p>
                  )}
                  <AverageBookRating bookInfos={book} />
                </CardHeader>

                {bookConnectedUserStatus && (
                  <div
                    className={cn(
                      "absolute -bottom-16 right-2 rounded-full bg-primary/50 p-1 shadow-sm shadow-foreground",
                      getStatusColor(bookConnectedUserStatus)
                    )}
                  >
                    {bookConnectedUserStatus === BookStatusValues.READ && (
                      <div className="flex flex-col items-center p-1 text-xs">
                        J'ai lu
                        <Check />
                      </div>
                    )}
                    {bookConnectedUserStatus ===
                      BookStatusValues.IN_PROGRESS && (
                      <div className="flex flex-col items-center p-1 text-xs">
                        Je lis...
                        <Ellipsis />
                      </div>
                    )}
                    {bookConnectedUserStatus === BookStatusValues.TO_READ && (
                      <div className="flex flex-col items-center p-1 text-xs">
                        A lire !
                        <Smile />
                      </div>
                    )}
                  </div>
                )}
              </div>
              {(bookConnectedUserStatus || userViewId) &&
                book &&
                currentUserId && (
                  <BookUserInfo
                    currentUserId={currentUserId}
                    bookId={book.id}
                    bookStatus={bookConnectedUserStatus}
                    userViewId={userViewId}
                  />
                )}
            </div>
          </Link>
          {book && currentUserId && (
            <FriendsWhoReadBook
              bookId={book.id}
              userViewId={userViewId}
              currentUserId={currentUserId}
            />
          )}
        </Card>
      )}
    </div>
  );
};

export default BookInfos;
