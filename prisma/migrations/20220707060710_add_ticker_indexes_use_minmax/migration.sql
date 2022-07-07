-- DropIndex
DROP INDEX "Ticker_marketIndexId_idx";

-- DropIndex
DROP INDEX "TickerInfo_date_idx";

-- DropIndex
DROP INDEX "TickerInfo_tickerId_idx";

-- CreateIndex
CREATE INDEX "Ticker_marketIndexId_idx" ON "Ticker" USING BRIN ("marketIndexId" int4_minmax_ops);

-- CreateIndex
CREATE INDEX "TickerInfo_date_idx" ON "TickerInfo" USING BRIN ("date" timestamp_minmax_ops);

-- CreateIndex
CREATE INDEX "TickerInfo_tickerId_idx" ON "TickerInfo" USING BRIN ("tickerId" int4_minmax_ops);
