/*
  Warnings:

  - You are about to drop the column `booksInProgressId` on the `BookInfo` table. All the data in the column will be lost.
  - You are about to drop the column `booksReadId` on the `BookInfo` table. All the data in the column will be lost.
  - You are about to drop the column `booksToReadId` on the `BookInfo` table. All the data in the column will be lost.
  - You are about to drop the column `userNote` on the `BookInfo` table. All the data in the column will be lost.
  - Added the required column `status` to the `BookInfo` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BookStatus" AS ENUM ('READ', 'IN_PROGRESS', 'TO_READ');

-- DropForeignKey
ALTER TABLE "BookInfo" DROP CONSTRAINT "BookInfo_booksInProgressId_fkey";

-- DropForeignKey
ALTER TABLE "BookInfo" DROP CONSTRAINT "BookInfo_booksReadId_fkey";

-- DropForeignKey
ALTER TABLE "BookInfo" DROP CONSTRAINT "BookInfo_booksToReadId_fkey";

-- AlterTable
ALTER TABLE "AppUser" ADD COLUMN     "books" TEXT[];

-- AlterTable
ALTER TABLE "BookInfo" DROP COLUMN "booksInProgressId",
DROP COLUMN "booksReadId",
DROP COLUMN "booksToReadId",
DROP COLUMN "userNote",
ADD COLUMN     "status" "BookStatus" NOT NULL;
