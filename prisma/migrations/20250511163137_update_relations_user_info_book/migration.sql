/*
  Warnings:

  - You are about to drop the column `booksInProgress` on the `AppUser` table. All the data in the column will be lost.
  - You are about to drop the column `booksRead` on the `AppUser` table. All the data in the column will be lost.
  - You are about to drop the column `booksToRead` on the `AppUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AppUser" DROP COLUMN "booksInProgress",
DROP COLUMN "booksRead",
DROP COLUMN "booksToRead";

-- CreateTable
CREATE TABLE "BookInfo" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "year" INTEGER,
    "month" INTEGER,
    "userNote" INTEGER,
    "comments" TEXT,
    "booksReadId" TEXT,
    "booksInProgressId" TEXT,
    "booksToReadId" TEXT,

    CONSTRAINT "BookInfo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BookInfo" ADD CONSTRAINT "BookInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AppUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookInfo" ADD CONSTRAINT "BookInfo_booksReadId_fkey" FOREIGN KEY ("booksReadId") REFERENCES "AppUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookInfo" ADD CONSTRAINT "BookInfo_booksInProgressId_fkey" FOREIGN KEY ("booksInProgressId") REFERENCES "AppUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookInfo" ADD CONSTRAINT "BookInfo_booksToReadId_fkey" FOREIGN KEY ("booksToReadId") REFERENCES "AppUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
