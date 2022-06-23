-- CreateTable
CREATE TABLE "TickerListInfo" (
    "id" SERIAL NOT NULL,
    "lastRefreshed" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TickerListInfo_pkey" PRIMARY KEY ("id")
);
