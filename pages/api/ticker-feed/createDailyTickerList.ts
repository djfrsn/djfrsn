import { today } from 'lib/dates';
import getTickerListInfo from 'lib/db/getTickerListInfo';
import FMPApi from 'lib/FMPApi';
import prisma from 'lib/prisma';
import { TickerType } from 'lib/types';
import moment from 'moment';

const fmpApi = new FMPApi()

export default async function createDailyTickerList(): Promise<TickerType[]> {
  const tickerListInfo = await getTickerListInfo()
  const tickerListRefreshed = moment(tickerListInfo.lastRefreshed).isSame(
    today.isoString,
    'day'
  )
  let dailyTickerList

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
    dailyTickerList = await prisma.ticker.findMany()
  } else {
    dailyTickerList = await prisma.ticker.findMany()
  }

  return dailyTickerList
}
