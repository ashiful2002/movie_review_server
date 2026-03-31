/*
  Warnings:

  - You are about to drop the `Watchlist` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Like` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Watchlist" DROP CONSTRAINT "Watchlist_movieId_fkey";

-- DropForeignKey
ALTER TABLE "Watchlist" DROP CONSTRAINT "Watchlist_userId_fkey";

-- AlterTable
ALTER TABLE "Like" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "ageRating" TEXT,
ADD COLUMN     "awards" TEXT[],
ADD COLUMN     "banner" TEXT,
ADD COLUMN     "boxOffice" DOUBLE PRECISION,
ADD COLUMN     "budget" DOUBLE PRECISION,
ADD COLUMN     "cast" TEXT[],
ADD COLUMN     "country" TEXT,
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "language" TEXT,
ADD COLUMN     "rating" DOUBLE PRECISION,
ADD COLUMN     "status" TEXT,
ADD COLUMN     "subtitles" TEXT[],
ADD COLUMN     "thumbnail" TEXT,
ADD COLUMN     "trailerLink" TEXT;

-- DropTable
DROP TABLE "Watchlist";

-- CreateTable
CREATE TABLE "id" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "id_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "id_userId_movieId_key" ON "id"("userId", "movieId");

-- AddForeignKey
ALTER TABLE "id" ADD CONSTRAINT "id_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "id" ADD CONSTRAINT "id_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
