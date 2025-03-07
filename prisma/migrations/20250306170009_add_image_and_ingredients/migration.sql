/*
  Warnings:

  - Added the required column `image` to the `Food` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Food" ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "ingredients" TEXT[];
