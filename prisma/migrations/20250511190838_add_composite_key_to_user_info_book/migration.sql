/*
  Warnings:

  - A unique constraint covering the columns `[userId,bookId]` on the table `BookInfo` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BookInfo_userId_bookId_key" ON "BookInfo"("userId", "bookId");
