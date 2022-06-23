-- AlterTable
ALTER TABLE "Ticker" ADD COLUMN     "marketIndexId" INTEGER;

-- CreateTable
CREATE TABLE "MarketIndex" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MarketIndex_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ticker" ADD CONSTRAINT "Ticker_marketIndexId_fkey" FOREIGN KEY ("marketIndexId") REFERENCES "MarketIndex"("id") ON DELETE SET NULL ON UPDATE CASCADE;
