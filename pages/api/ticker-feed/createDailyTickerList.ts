import AlphaVantageApi from 'lib/AlphaVantageApi';
import { TickerType } from 'lib/types';

const alphaApi = new AlphaVantageApi({
  apiKey: process.env.ALPHA_VANTAGE_API_KEY,
})

// TODO: create TickerListInfo model lastRefreshed: DateTime

export default async function createDailyTickerFeed(): Promise<TickerType[]> {
  // get latest refreshed date from TickerListInfo

  // if latest refreshed date is today...return Ticker[]

  // load ticker list

  // create ticker if not created with lastActiveDate

  // update ticker lastActiveDate if already created

  // update latest refreshed date on TickerListInfo

  // return list of all tickers

  return [{ id: 1, symbol: '', timeSeries: [] }]
}
