/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `movies` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "movies" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "movies_slug_key" ON "movies"("slug");
