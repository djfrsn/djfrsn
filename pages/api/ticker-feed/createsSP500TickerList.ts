import { isSameDay, today } from 'lib/dates';
import getTickerListInfo from 'lib/db/getTickerListInfo';
import FMPApi from 'lib/FMPApi';
import prisma from 'lib/prisma';
import { TickerType } from 'lib/types';
import moment from 'moment';

const fmpApi = new FMPApi()

export default async function createsSP500TickerList(): Promise<TickerType[]> {
  const tickerListInfo = await getTickerListInfo()
  // TODO: migrate to lastRefreshed date of MarketIndex and delete TickerListInfo model
  const tickerListRefreshed = isSameDay(moment(tickerListInfo.lastRefreshed))
  let sp500tickerList

  if (!tickerListRefreshed) {
    // load ticker list from api
    const tickerList = await fmpApi.marketIndex.sp500()
    // delete existing tickers
    await prisma.ticker.deleteMany()
    // create new tickers
    await prisma.ticker.createMany({ data: tickerList })
    // update latest refreshed date on TickerListInfo
    await prisma.tickerListInfo.update({
      where: { id: tickerListInfo.id },
      data: { lastRefreshed: today.isoString },
    })
    // return list of all tickers
    sp500tickerList = await prisma.ticker.findMany()
  } else {
    sp500tickerList = await prisma.ticker.findMany()
  }

  return sp500tickerList
}
