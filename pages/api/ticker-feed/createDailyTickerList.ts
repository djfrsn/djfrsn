import { today } from 'lib/dates';
import getTickerListInfo from 'lib/db/getTickerListInfo';
import FMPApi from 'lib/FMPApi';
import prisma from 'lib/prisma';
import { TickerType } from 'lib/types';
import moment from 'moment';

const fmpApi = new FMPApi()

// TODO: create TickerListInfo model lastRefreshed: DateTime

export default async function createDailyTickerList(): Promise<TickerType[]> {
  // get method should createTickerListInfo if it isn't created
  const tickerListInfo = await getTickerListInfo()
  console.log('tickerListInfo', tickerListInfo)
  // if latest refreshed date is today...return Ticker[]
  const tickerListRefreshed = moment(tickerListInfo.lastRefreshed).isSame(
    today.isoString,
    'day'
  )
  let dailyTickerList

  if (!tickerListRefreshed) {
    // load ticker list file
    const tickerList = await fmpApi.marketIndex.sp500()

    console.log('tickerList', tickerList.length)
    // create ticker if not created with lastActiveDate

    // update ticker lastActiveDate if already created

    // update latest refreshed date on TickerListInfo

    // return list of all tickers
    dailyTickerList = await prisma.ticker.findMany()
  } else {
    dailyTickerList = await prisma.ticker.findMany()
  }

  console.log('dailyTickerList', dailyTickerList.length)

  return dailyTickerList
}
