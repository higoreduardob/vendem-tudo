/*
  Warnings:

  - You are about to drop the column `payments` on the `Store` table. All the data in the column will be lost.
  - Added the required column `enabled` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Shipping` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Shipping` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "enabled" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Shipping" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Store" DROP COLUMN "payments",
ADD COLUMN     "payment" "StorePayment"[];
