/*
  Warnings:

  - You are about to drop the column `ageRating` on the `movies` table. All the data in the column will be lost.
  - The `language` column on the `movies` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "movies" DROP COLUMN "ageRating",
ADD COLUMN     "averageRating" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "imdbRating" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "language",
ADD COLUMN     "language" TEXT[];
