/*
  Warnings:

  - You are about to drop the column `rgIe` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[foodOrderId]` on the table `Address` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "StorePayment" AS ENUM ('PIX', 'CASH', 'VISA_DEBIT_CARD', 'MASTER_DEBIT_CARD', 'VISA_CREDIT_CARD', 'MASTER_CREDIT_CARD', 'MEAL_VOUCHER');

-- CreateEnum
CREATE TYPE "ShippingRole" AS ENUM ('PICK_UP_ON_STORE', 'DELIVERY');

-- CreateEnum
CREATE TYPE "OrderHistoryProgress" AS ENUM ('PENDING', 'ACCEPT', 'DELIVERY', 'DELIVERED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "foodOrderId" TEXT;

-- AlterTable
ALTER TABLE "Food" ADD COLUMN     "reviewsAmount" INTEGER,
ADD COLUMN     "reviewsAvg" INTEGER,
ADD COLUMN     "sales" INTEGER;

-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "payments" "StorePayment"[],
ADD COLUMN     "shippingRole" "ShippingRole"[];

-- AlterTable
ALTER TABLE "User" DROP COLUMN "rgIe";

-- CreateTable
CREATE TABLE "Schedule" (
    "day" INTEGER NOT NULL,
    "open" TIMESTAMP(3) NOT NULL,
    "close" TIMESTAMP(3) NOT NULL,
    "storeId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Shipping" (
    "id" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "fee" INTEGER,
    "deadlineAt" INTEGER,
    "minimumAmount" INTEGER,
    "role" "ShippingRole" NOT NULL DEFAULT 'DELIVERY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "storeId" TEXT NOT NULL,

    CONSTRAINT "Shipping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderHistory" (
    "id" TEXT NOT NULL,
    "progress" "OrderHistoryProgress" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoodOrder" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "moneyChange" INTEGER,
    "payment" "StorePayment" NOT NULL,
    "shippingRole" "ShippingRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "storeId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "shippingId" TEXT,

    CONSTRAINT "FoodOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderHistoryFoodOrder" (
    "orderHistoryId" TEXT NOT NULL,
    "foodOrderId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "FoodItem" (
    "id" TEXT NOT NULL,
    "reviewed" BOOLEAN NOT NULL DEFAULT false,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "amount" INTEGER NOT NULL,
    "obs" TEXT,
    "orderId" TEXT NOT NULL,
    "foodId" TEXT NOT NULL,

    CONSTRAINT "FoodItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoodItemAdditional" (
    "foodItemId" TEXT NOT NULL,
    "additionalId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "FoodItemOption" (
    "foodItemId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "amount" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "FoodReview" (
    "id" TEXT NOT NULL,
    "stars" SMALLINT DEFAULT 0,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "foodId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,

    CONSTRAINT "FoodReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_day_storeId_key" ON "Schedule"("day", "storeId");

-- CreateIndex
CREATE UNIQUE INDEX "OrderHistoryFoodOrder_orderHistoryId_foodOrderId_key" ON "OrderHistoryFoodOrder"("orderHistoryId", "foodOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "FoodItemAdditional_foodItemId_additionalId_key" ON "FoodItemAdditional"("foodItemId", "additionalId");

-- CreateIndex
CREATE UNIQUE INDEX "FoodItemOption_foodItemId_optionId_key" ON "FoodItemOption"("foodItemId", "optionId");

-- CreateIndex
CREATE UNIQUE INDEX "Address_foodOrderId_key" ON "Address"("foodOrderId");

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_foodOrderId_fkey" FOREIGN KEY ("foodOrderId") REFERENCES "FoodOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipping" ADD CONSTRAINT "Shipping_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodOrder" ADD CONSTRAINT "FoodOrder_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodOrder" ADD CONSTRAINT "FoodOrder_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodOrder" ADD CONSTRAINT "FoodOrder_shippingId_fkey" FOREIGN KEY ("shippingId") REFERENCES "Shipping"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderHistoryFoodOrder" ADD CONSTRAINT "OrderHistoryFoodOrder_orderHistoryId_fkey" FOREIGN KEY ("orderHistoryId") REFERENCES "OrderHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderHistoryFoodOrder" ADD CONSTRAINT "OrderHistoryFoodOrder_foodOrderId_fkey" FOREIGN KEY ("foodOrderId") REFERENCES "FoodOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodItem" ADD CONSTRAINT "FoodItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "FoodOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodItem" ADD CONSTRAINT "FoodItem_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodItemAdditional" ADD CONSTRAINT "FoodItemAdditional_foodItemId_fkey" FOREIGN KEY ("foodItemId") REFERENCES "FoodItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodItemAdditional" ADD CONSTRAINT "FoodItemAdditional_additionalId_fkey" FOREIGN KEY ("additionalId") REFERENCES "FoodAdditional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodItemOption" ADD CONSTRAINT "FoodItemOption_foodItemId_fkey" FOREIGN KEY ("foodItemId") REFERENCES "FoodItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodItemOption" ADD CONSTRAINT "FoodItemOption_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "FoodOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodReview" ADD CONSTRAINT "FoodReview_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodReview" ADD CONSTRAINT "FoodReview_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
