/*
  Warnings:

  - A unique constraint covering the columns `[storeId,neighborhood]` on the table `Shipping` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Shipping_storeId_neighborhood_key" ON "Shipping"("storeId", "neighborhood");
