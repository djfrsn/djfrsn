/*
  Warnings:

  - Added the required column `displayName` to the `MarketIndex` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MarketIndex" ADD COLUMN     "displayName" TEXT NOT NULL;
