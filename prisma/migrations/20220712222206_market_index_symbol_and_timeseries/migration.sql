/*
  Warnings:

  - Added the required column `symbol` to the `MarketIndex` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MarketIndex" ADD COLUMN     "symbol" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TickerInfo" ADD COLUMN     "marketIndexId" INTEGER;

-- CreateIndex
CREATE INDEX "TickerInfo_marketIndexId_idx" ON "TickerInfo" USING BRIN ("marketIndexId" int4_minmax_ops);

-- AddForeignKey
ALTER TABLE "TickerInfo" ADD CONSTRAINT "TickerInfo_marketIndexId_fkey" FOREIGN KEY ("marketIndexId") REFERENCES "MarketIndex"("id") ON DELETE SET NULL ON UPDATE CASCADE;
