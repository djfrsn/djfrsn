-- CreateIndex
CREATE INDEX "Ticker_marketIndexId_idx" ON "Ticker" USING BRIN ("marketIndexId" int4_bloom_ops);

-- CreateIndex
CREATE INDEX "TickerInfo_date_idx" ON "TickerInfo" USING BRIN ("date" timestamp_bloom_ops);

-- CreateIndex
CREATE INDEX "TickerInfo_tickerId_idx" ON "TickerInfo" USING BRIN ("tickerId" int4_bloom_ops);
