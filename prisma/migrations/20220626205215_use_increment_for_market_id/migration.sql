/*
  Warnings:

  - The primary key for the `MarketIndex` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `MarketIndex` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `marketIndexId` column on the `Ticker` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "Ticker" DROP CONSTRAINT "Ticker_marketIndexId_fkey";

-- AlterTable
ALTER TABLE "MarketIndex" DROP CONSTRAINT "MarketIndex_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "MarketIndex_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Ticker" DROP COLUMN "marketIndexId",
ADD COLUMN     "marketIndexId" INTEGER;

-- AddForeignKey
ALTER TABLE "Ticker" ADD CONSTRAINT "Ticker_marketIndexId_fkey" FOREIGN KEY ("marketIndexId") REFERENCES "MarketIndex"("id") ON DELETE SET NULL ON UPDATE CASCADE;
