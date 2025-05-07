-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "authors" TEXT[],
    "description" TEXT NOT NULL,
    "categories" TEXT[],
    "pageCount" INTEGER NOT NULL,
    "publishedDate" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "imageLink" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "isFromAPI" BOOLEAN NOT NULL,
    "totalRating" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "imgURL" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "booksRead" JSONB NOT NULL,
    "booksInProgress" JSONB NOT NULL,
    "booksToRead" JSONB NOT NULL,
    "friends" TEXT[],
    "isMyFriend" BOOLEAN,
    "isAdmin" BOOLEAN NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
