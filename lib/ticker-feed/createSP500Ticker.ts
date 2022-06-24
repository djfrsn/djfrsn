import { MARKET_INDEX } from 'lib/const';
import { isSameDay } from 'lib/dates';
import FMPApi from 'lib/FMPApi';
import prisma from 'lib/prisma';
import { TickerType } from 'lib/types';
import moment from 'moment';

const fmpApi = new FMPApi()

export default async function createSP500Ticker(): Promise<TickerType[]> {
  const marketIndex = await prisma.marketIndex.findFirst({
    where: { name: MARKET_INDEX.sp500 },
  })
  const marketIndexId = { marketIndexId: marketIndex.id }
  const tickerListRefreshed = isSameDay(moment(marketIndex.lastRefreshed))
  let sp500tickerList

  if (!tickerListRefreshed) {
    // load ticker list from api
    const tickerList = await fmpApi.marketIndex.sp500()
    // TODO: use upsert/transactions to avoid recreating tickers everytime - https://stackoverflow.com/questions/70821501/how-to-upsert-many-fields-in-prisma-orm
    const existingTickers = await prisma.ticker.findMany({
      where: { symbol: { in: tickerList.map(ticker => ticker.symbol) } },
    })
    await prisma.ticker.deleteMany()
    await prisma.tickerInfo.deleteMany()
    console.log('existingTickers', existingTickers.length)
    // clear existing tickers marked as sp500
    // await prisma.$transaction([
    //   prisma.ticker.updateMany({
    //     where: marketIndexId,
    //     data: {
    //       marketIndexId: null,
    //     },
    //   }),
    //   prisma.ticker.createMany({
    //     data: tickerList.map(ticker => ({
    //       ...ticker,
    //       ...marketIndexId,
    //     })),
    //   }),
    // ])
    // return list of all tickers
    sp500tickerList = await prisma.ticker.findMany({
      where: marketIndexId,
    })
  } else {
    sp500tickerList = await prisma.ticker.findMany({ where: marketIndexId })
  }

  return sp500tickerList
}
