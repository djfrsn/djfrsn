/*
  Warnings:

  - The primary key for the `Ticker` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Ticker` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `TickerInfo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `TickerInfo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tickerId` column on the `TickerInfo` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "TickerInfo" DROP CONSTRAINT "TickerInfo_tickerId_fkey";

-- AlterTable
ALTER TABLE "Ticker" DROP CONSTRAINT "Ticker_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Ticker_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "TickerInfo" DROP CONSTRAINT "TickerInfo_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "tickerId",
ADD COLUMN     "tickerId" INTEGER,
ADD CONSTRAINT "TickerInfo_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "TickerInfo" ADD CONSTRAINT "TickerInfo_tickerId_fkey" FOREIGN KEY ("tickerId") REFERENCES "Ticker"("id") ON DELETE SET NULL ON UPDATE CASCADE;
