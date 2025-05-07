/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "AppUser" (
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

    CONSTRAINT "AppUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AppUser_email_key" ON "AppUser"("email");
