/*
  Warnings:

  - Added the required column `cik` to the `Ticker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateFirstAdded` to the `Ticker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `founded` to the `Ticker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `headQuarter` to the `Ticker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Ticker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sector` to the `Ticker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subSector` to the `Ticker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ticker" ADD COLUMN     "cik" TEXT NOT NULL,
ADD COLUMN     "dateFirstAdded" TEXT NOT NULL,
ADD COLUMN     "founded" TEXT NOT NULL,
ADD COLUMN     "headQuarter" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "sector" TEXT NOT NULL,
ADD COLUMN     "subSector" TEXT NOT NULL;
