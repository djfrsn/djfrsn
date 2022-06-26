/*
  Warnings:

  - The primary key for the `Contract` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Job` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `MarketIndex` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `MarketInterval` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Ticker` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TickerInfo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TickerListInfo` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Ticker" DROP CONSTRAINT "Ticker_marketIndexId_fkey";

-- DropForeignKey
ALTER TABLE "TickerInfo" DROP CONSTRAINT "TickerInfo_intervalId_fkey";

-- DropForeignKey
ALTER TABLE "TickerInfo" DROP CONSTRAINT "TickerInfo_tickerId_fkey";

-- AlterTable
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Contract_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Contract_id_seq";

-- AlterTable
ALTER TABLE "Job" DROP CONSTRAINT "Job_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Job_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Job_id_seq";

-- AlterTable
ALTER TABLE "MarketIndex" DROP CONSTRAINT "MarketIndex_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "MarketIndex_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "MarketIndex_id_seq";

-- AlterTable
ALTER TABLE "MarketInterval" DROP CONSTRAINT "MarketInterval_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "MarketInterval_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "MarketInterval_id_seq";

-- AlterTable
ALTER TABLE "Ticker" DROP CONSTRAINT "Ticker_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "marketIndexId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Ticker_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Ticker_id_seq";

-- AlterTable
ALTER TABLE "TickerInfo" DROP CONSTRAINT "TickerInfo_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "tickerId" SET DATA TYPE TEXT,
ALTER COLUMN "intervalId" SET DATA TYPE TEXT,
ADD CONSTRAINT "TickerInfo_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "TickerInfo_id_seq";

-- AlterTable
ALTER TABLE "TickerListInfo" DROP CONSTRAINT "TickerListInfo_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "TickerListInfo_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "TickerListInfo_id_seq";

-- AddForeignKey
ALTER TABLE "Ticker" ADD CONSTRAINT "Ticker_marketIndexId_fkey" FOREIGN KEY ("marketIndexId") REFERENCES "MarketIndex"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TickerInfo" ADD CONSTRAINT "TickerInfo_intervalId_fkey" FOREIGN KEY ("intervalId") REFERENCES "MarketInterval"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TickerInfo" ADD CONSTRAINT "TickerInfo_tickerId_fkey" FOREIGN KEY ("tickerId") REFERENCES "Ticker"("id") ON DELETE SET NULL ON UPDATE CASCADE;
