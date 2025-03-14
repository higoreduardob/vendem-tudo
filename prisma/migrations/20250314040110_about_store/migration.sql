/*
  Warnings:

  - Added the required column `about` to the `Store` table without a default value. This is not possible if the table is not empty.
  - Made the column `whatsApp` on table `Store` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "about" TEXT NOT NULL,
ALTER COLUMN "whatsApp" SET NOT NULL;
