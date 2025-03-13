/*
  Warnings:

  - You are about to drop the column `foodItemId` on the `FoodItemOption` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[foodItemAdditionalId,optionId]` on the table `FoodItemOption` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `FoodItemAdditional` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `foodItemAdditionalId` to the `FoodItemOption` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FoodItemOption" DROP CONSTRAINT "FoodItemOption_foodItemId_fkey";

-- DropIndex
DROP INDEX "FoodItemOption_foodItemId_optionId_key";

-- AlterTable
ALTER TABLE "FoodItemAdditional" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "FoodItemAdditional_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "FoodItemOption" DROP COLUMN "foodItemId",
ADD COLUMN     "foodItemAdditionalId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "FoodItemOption_foodItemAdditionalId_optionId_key" ON "FoodItemOption"("foodItemAdditionalId", "optionId");

-- AddForeignKey
ALTER TABLE "FoodItemOption" ADD CONSTRAINT "FoodItemOption_foodItemAdditionalId_fkey" FOREIGN KEY ("foodItemAdditionalId") REFERENCES "FoodItemAdditional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
