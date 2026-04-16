/*
  Warnings:

  - Added the required column `closeTime` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `openTime` to the `Business` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "closeTime" INTEGER NOT NULL,
ADD COLUMN     "openTime" INTEGER NOT NULL,
ADD COLUMN     "photos" TEXT[];
