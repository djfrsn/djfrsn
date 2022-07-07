/*
  Warnings:

  - The primary key for the `MarketInterval` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `MarketInterval` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `intervalId` column on the `TickerInfo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `TickerListInfo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TickerInfo" DROP CONSTRAINT "TickerInfo_intervalId_fkey";

-- AlterTable
ALTER TABLE "MarketInterval" DROP CONSTRAINT "MarketInterval_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "MarketInterval_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "TickerInfo" DROP COLUMN "intervalId",
ADD COLUMN     "intervalId" INTEGER;

-- DropTable
DROP TABLE "TickerListInfo";

-- AddForeignKey
ALTER TABLE "TickerInfo" ADD CONSTRAINT "TickerInfo_intervalId_fkey" FOREIGN KEY ("intervalId") REFERENCES "MarketInterval"("id") ON DELETE SET NULL ON UPDATE CASCADE;
