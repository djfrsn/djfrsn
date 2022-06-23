/*
  Warnings:

  - Added the required column `lastRefreshed` to the `Ticker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ticker" ADD COLUMN     "lastRefreshed" TIMESTAMP(3) NOT NULL;
