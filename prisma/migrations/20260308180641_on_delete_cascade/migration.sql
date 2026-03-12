-- DropForeignKey
ALTER TABLE "orderItem" DROP CONSTRAINT "orderItem_mealId_fkey";

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_mealId_fkey";

-- AddForeignKey
ALTER TABLE "orderItem" ADD CONSTRAINT "orderItem_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
