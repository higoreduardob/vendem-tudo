/*
  Warnings:

  - A unique constraint covering the columns `[name,storeId]` on the table `FoodCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "FoodCategory_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "FoodCategory_name_storeId_key" ON "FoodCategory"("name", "storeId");
