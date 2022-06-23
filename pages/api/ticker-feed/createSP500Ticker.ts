import { sp500 } from 'lib/const';
import { isSameDay } from 'lib/dates';
import FMPApi from 'lib/FMPApi';
import prisma from 'lib/prisma';
import { TickerType } from 'lib/types';
import moment from 'moment';

const fmpApi = new FMPApi()

export default async function createSP500Ticker(): Promise<TickerType[]> {
  const _marketIndex = await prisma.marketIndex.findFirst({
    where: { name: sp500 },
  })
  const tickerListRefreshed = isSameDay(moment(_marketIndex.lastRefreshed))
  let sp500tickerList

  if (!tickerListRefreshed) {
    // load ticker list from api
    const tickerList = await fmpApi.marketIndex.sp500()
    // delete existing tickers
    // TODO: use upsert/transactions once we introduce tickers outside of the sp500 we will need to update instead of delete - https://stackoverflow.com/questions/70821501/how-to-upsert-many-fields-in-prisma-orm
    await prisma.ticker.deleteMany()
    // create new tickers
    await prisma.ticker.createMany({
      data: tickerList.map(ticker => ({
        ...ticker,
        marketIndexId: _marketIndex.id,
      })),
    })
    // return list of all tickers
    sp500tickerList = await prisma.ticker.findMany()
  } else {
    sp500tickerList = await prisma.ticker.findMany()
  }

  return sp500tickerList
}
