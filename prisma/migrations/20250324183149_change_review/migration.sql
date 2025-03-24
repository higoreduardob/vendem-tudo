/*
  Warnings:

  - You are about to drop the `FoodReview` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FoodReview" DROP CONSTRAINT "FoodReview_customerId_fkey";

-- DropForeignKey
ALTER TABLE "FoodReview" DROP CONSTRAINT "FoodReview_foodId_fkey";

-- AlterTable
ALTER TABLE "Food" ADD COLUMN     "reviews" INTEGER;

-- DropTable
DROP TABLE "FoodReview";
