/*
  Warnings:

  - You are about to drop the column `interval` on the `TickerInfo` table. All the data in the column will be lost.
  - You are about to drop the column `lastRefreshed` on the `TickerInfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TickerInfo" DROP COLUMN "interval",
DROP COLUMN "lastRefreshed",
ADD COLUMN     "intervalId" INTEGER,
ALTER COLUMN "open" DROP NOT NULL,
ALTER COLUMN "high" DROP NOT NULL,
ALTER COLUMN "low" DROP NOT NULL,
ALTER COLUMN "volume" DROP NOT NULL;

-- CreateTable
CREATE TABLE "MarketInterval" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,

    CONSTRAINT "MarketInterval_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TickerInfo" ADD CONSTRAINT "TickerInfo_intervalId_fkey" FOREIGN KEY ("intervalId") REFERENCES "MarketInterval"("id") ON DELETE SET NULL ON UPDATE CASCADE;
