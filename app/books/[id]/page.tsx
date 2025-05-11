import AddOrUpdateBookOrBookStatus from "@/components/AddOrUpdateBookOrBookStatus";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/lib/auth-session";
import {
  DEFAULT_BOOK_IMAGE,
  GOOGLE_BOOKS_API_URL,
  NO_DESCRIPTION,
} from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { BookType } from "@/lib/types";
import { cleanDescription } from "@/lib/utils";
import { Quote } from "lucide-react";
import Link from "next/link";

const addLineBreaks = (description: string) => {
  return (
    // Ajoute un saut de ligne après chaque : ".", "!", ou "?" suivi d'une lettre majuscule => pour plus de lisibilité
    description.replace(/([.!?])\s*(?=[A-Z])/g, "$1\n")
  );
};

export default async function Post({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getUser();
  const { id } = await params;
  let book: BookType | null = await prisma.book.findUnique({
    where: { id: id },
    // include: {
    //   author: true,
    // },
  });

  if (!book) {
    book = await fetch(`${GOOGLE_BOOKS_API_URL}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const bookFromAPI: BookType = {
          id: data.id,
          title: data.volumeInfo.title,
          authors: data.volumeInfo.authors, // ?? "Auteur inconnu",
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
        //console.log("💛💙bookfromapi", bookFromAPI);
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

  const handleUpdate = () => {
 //   console.log("handleUpdate BOOKDETAIL");
    // To rerender this page when the user updates the component AddOrUpdateBookOrBookStatus
    //mutate(bookId);
  };

  return (
    book && (
      <Card className="relative m-4">
        <CardDescription className="absolute right-2 top-2 rounded-full bg-secondary/60 px-3 py-1 text-secondary-foreground shadow-sm shadow-foreground">
          {book.language}
        </CardDescription>
        <div className="flex items-start gap-5 p-5 py-10 shadow-xl shadow-primary/30">
          <img
            src={book.imageLink || DEFAULT_BOOK_IMAGE}
            //onError={(e) => (e.currentTarget.src = DEFAULT_BOOK_IMAGE)}
            className="w-32 sm:w-40 md:w-48 rounded-sm border border-border  object-contain shadow-md shadow-foreground/70"
            alt={`Image de couverture du livre ${book?.title}`}
          />
          <CardHeader className="flex flex-col justify-between overflow-hidden gap-4">
            <CardTitle>{book?.title}</CardTitle>
            <div className="flex gap-2 flex-wrap">
              {book?.authors &&
                book.authors.map((author, index) => (
                  <Link
                    href={`/mybooks/searchbooks/authors/${author}`}
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
            {/* {book.rating?.count > 0 ? (
              <div className="flex gap-2 flex-col">
                <AverageBookRating book={book} />
                <Dialog>
                  <DialogTrigger asChild className="flex justify-center">
                    <Button onClick={fillUserCommentsTab}>
                      Avis des membres
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <>
                      <DialogHeader>
                        <DialogTitle>{book?.title}</DialogTitle>
                      </DialogHeader>
                      <ul>
                        {usersWhoReadBookCommentsAndNotes.map(
                          (userCommentsAndNote) => {
                            return (
                              <li
                                key={userCommentsAndNote.userId}
                                className="m-1 rounded-md bg-primary/50 p-1"
                              >
                                <UserReview
                                  userCommentsAndNote={userCommentsAndNote}
                                />
                              </li>
                            );
                            <p>{userCommentsAndNote.userNote} </p>;
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
            )} */}
          </CardHeader>
        </div>
        {/* <FriendsWhoReadBook bookId={book.id} /> */}

        <CardContent className="relative bg-secondary/30 p-6 shadow-md shadow-primary/30">
          {user && (
            <AddOrUpdateBookOrBookStatus
              userId={user.id}
              bookInfos={book}
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
    )
  );
}
