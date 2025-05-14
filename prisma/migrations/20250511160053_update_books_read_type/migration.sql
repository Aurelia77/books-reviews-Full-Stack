/*
  Warnings:

  - The `booksRead` column on the `AppUser` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `booksInProgress` column on the `AppUser` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `booksToRead` column on the `AppUser` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "AppUser" DROP COLUMN "booksRead",
ADD COLUMN     "booksRead" JSONB[],
DROP COLUMN "booksInProgress",
ADD COLUMN     "booksInProgress" JSONB[],
DROP COLUMN "booksToRead",
ADD COLUMN     "booksToRead" JSONB[];
