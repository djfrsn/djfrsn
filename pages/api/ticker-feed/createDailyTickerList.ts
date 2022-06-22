import AlphaVantageApi from 'lib/AlphaVantageApi';
import { today } from 'lib/dates';
import getTickerListInfo from 'lib/db/getTickerListInfo';
import prisma from 'lib/prisma';
import { TickerType } from 'lib/types';
import moment from 'moment';

const alphaApi = new AlphaVantageApi({
  apiKey: process.env.ALPHA_VANTAGE_API_KEY,
})

// TODO: create TickerListInfo model lastRefreshed: DateTime

export default async function createDailyTickerList(): Promise<TickerType[]> {
  // get latest refreshed date from TickerListInfo...get method should createTickerListInfo if it isn't created
  const lastRefreshedDate = await getTickerListInfo()
  console.log('lastRefreshedDate', lastRefreshedDate)
  // if latest refreshed date is today...return Ticker[]
  const tickerListRefreshed = moment(lastRefreshedDate.lastRefreshed).isSame(
    today.isoString,
    'day'
  )
  let dailyTickerList

  if (!tickerListRefreshed) {
    // load ticker list

    // create ticker if not created with lastActiveDate

    // update ticker lastActiveDate if already created

    // update latest refreshed date on TickerListInfo

    // return list of all tickers
    dailyTickerList = await prisma.ticker.findMany()
  } else {
    dailyTickerList = await prisma.ticker.findMany()
  }

  console.log('dailyTickerList', dailyTickerList)

  return dailyTickerList
}
