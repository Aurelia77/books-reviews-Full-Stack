import AddOrUpdateBookOrBookStatus from "@/components/AddOrUpdateBookOrBookStatus";
import AverageBookRating from "@/components/AverageBookRating";
import FeedbackMessage from "@/components/FeedbackMessage";
import FriendsWhoReadBook from "@/components/FriendsWhoReadBook";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UserReview from "@/components/UserReview";
import { getUser } from "@/lib/auth-session";
import {
  BookStatusValues,
  DEFAULT_BOOK_IMAGE,
  GOOGLE_BOOKS_API_URL,
  NO_DESCRIPTION,
} from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { BookStatusType, BookType } from "@/lib/types";
import { cleanDescription } from "@/lib/utils";
import { Quote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const addLineBreaks = (description: string) => {
  return (
    // Add a line break after each ".", "!", or "?" followed by an uppercase letter => for better readability
    description.replace(/([.!?])\s*(?=[A-Z])/g, "$1\n")
  );
};

const Book = async ({ params }: { params: Promise<{ id: string }> }) => {
  const currentUser = await getUser();
  const { id } = await params;

  const usersInfoWhoReadBook = await prisma.userInfoBook.findMany({
    where: {
      bookId: id,
      status: BookStatusValues.READ,
    },
    include: {
      user: {
        select: {
          id: true,
          userName: true,
          imgURL: true,
        },
      },
    },
  });

  const usersWhoReadBookCommentsAndNotes = usersInfoWhoReadBook.map(
    (item: any) => ({
      userName: item.user.userName,
      imgURL: item.user.imgURL,
      userId: item.user.id,
      userComments: item.comments ?? "",
      userNote: item.note ?? undefined,
    })
  );

  // 1-We check if the book is in our database
  let book: BookType | null = await prisma.book.findUnique({
    where: { id: id },
  });

  let userBookStatus: BookStatusType | null = null;

  if (book && currentUser) {
    // 2-If the book exists (so it is on the DB), we look for the book status for the connected user
    const userInfo = await prisma.userInfoBook.findUnique({
      where: {
        userId_bookId: {
          userId: currentUser?.id,
          bookId: id,
        },
      },
    });
    userBookStatus = userInfo?.status ?? null;

    // 3-If it's not, we fetch the book from the Google Books API
  } else {
    book = await fetch(`${GOOGLE_BOOKS_API_URL}/${id}`)
      .then((res) => res.json())
      .then((data: any) => {
        const bookFromAPI: BookType = {
          id: data.id,
          title: data.volumeInfo.title,
          authors: data.volumeInfo.authors,
          description: data.volumeInfo.description,
          categories: data.volumeInfo.categories,
          pageCount: data.volumeInfo.pageCount,
          publishedDate: data.volumeInfo.publishedDate,
          publisher: data.volumeInfo.publisher,
          imageLink: data.volumeInfo.imageLinks?.thumbnail,
          language: data.volumeInfo.language,
          isFromAPI: true,
          countRating: 0,
          totalRating: 0,
        };

        return bookFromAPI;
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération du livre depuis l'API Google Books :",
          error
        );
        return null;
      });
  }

  return book ? (
    <Card className="relative m-4">
      <CardDescription className="absolute right-2 top-2 rounded-full bg-secondary/60 px-3 py-1 text-secondary-foreground shadow-sm shadow-foreground">
        {book.language}
      </CardDescription>
      <div className="flex items-start gap-5 p-5 py-10 shadow-xl shadow-primary/30">
        <Image
          src={book.imageLink || DEFAULT_BOOK_IMAGE}
          className="w-32 sm:w-40 md:w-48 rounded-sm border border-border  object-contain shadow-md shadow-foreground/70"
          alt={`Image de couverture du livre ${book?.title}`}
          width={192}
          height={288}
          unoptimized
        />
        <CardHeader className="flex flex-col justify-between overflow-hidden gap-4">
          <CardTitle>{book?.title}</CardTitle>
          <div className="flex gap-2 flex-wrap">
            {book?.authors &&
              book.authors.map((author, index) => (
                <Link
                  href={`/books?author=${author}`}
                  className="text-foreground underline"
                  key={index}
                >
                  <CardDescription className="text-muted">
                    {author}
                  </CardDescription>
                </Link>
              ))}
          </div>
          <div className="grid grid-cols-2 gap-x-8">
            {book?.categories?.map((cat: string, index: number) => (
              <CardDescription key={index}>{cat}</CardDescription>
            ))}
          </div>
          {book.countRating > 0 ? (
            <div className="flex gap-2 flex-col">
              <AverageBookRating bookInfos={book} />
              <Dialog>
                <DialogTrigger asChild className="flex justify-center">
                  <Button>Avis des membres</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <>
                    <DialogHeader>
                      <DialogTitle>{book?.title}</DialogTitle>
                    </DialogHeader>
                    <ul>
                      {usersWhoReadBookCommentsAndNotes.map(
                        (userWhoReadBookCommentsAndNotes: any) => {
                          return (
                            <li
                              key={userWhoReadBookCommentsAndNotes.userId}
                              className="m-1 rounded-md bg-primary/50 p-1"
                            >
                              <UserReview
                                currentUserId={currentUser?.id}
                                userCommentsAndNote={
                                  userWhoReadBookCommentsAndNotes
                                }
                              />
                            </li>
                          );
                        }
                      )}
                    </ul>

                    <div className="grid gap-4 py-4"></div>
                  </>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <p className="italic">
              Les membres n'ont pas encore noté ce livre.
            </p>
          )}
        </CardHeader>
      </div>
      {currentUser && (
        <FriendsWhoReadBook bookId={book.id} currentUserId={currentUser?.id} />
      )}

      <CardContent className="relative bg-secondary/30 p-6 shadow-md shadow-primary/30">
        {currentUser && (
          <AddOrUpdateBookOrBookStatus
            currentUserId={currentUser.id}
            bookInfos={book}
            userBookStatus={userBookStatus}
            //onUpdate={handleUpdate}
          />
        )}
        {book.description ? (
          <div className="relative flex gap-3">
            <Quote className="absolute -top-1" />
            <p
              style={{ whiteSpace: "pre-line" }}
              className="max-w-[90%] text-foreground"
            >
              &ensp;&ensp;&ensp;&ensp;
              {cleanDescription(addLineBreaks(book.description))}
            </p>
            &ensp;&ensp;&ensp;&ensp;
            <Quote className="absolute bottom-0 right-0 rotate-180" />
          </div>
        ) : (
          <p className="italic">{NO_DESCRIPTION} </p>
        )}
      </CardContent>
    </Card>
  ) : (
    <FeedbackMessage message="Livre introuvable." />
  );
};

export default Book;
