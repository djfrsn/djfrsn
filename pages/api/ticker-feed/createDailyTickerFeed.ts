import AlphaVantageApi from 'lib/AlphaVantageApi';
import createTicker from 'lib/db/createTicker';
import createTickerInfo from 'lib/db/createTickerInfo';
import prisma from 'lib/prisma';
import moment from 'moment-business-days';

const alphaApi = new AlphaVantageApi({
  apiKey: process.env.ALPHA_VANTAGE_API_KEY,
})

export default async function createDailyTickerFeed({
  tickerNames,
}: {
  tickerNames: string
}) {
  const tickerList =
    tickerNames === 'string'
      ? tickerNames.split(',')
      : process.env.DAILY_TICKER_LIST.split(',')

  // create tickers in db
  await Promise.all(tickerList.map(ticker => createTicker(ticker)))

  const previousBusinessDay = moment()
    .utcOffset(0)
    .startOf('day')
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    .prevBusinessDay()
    .toISOString()

  // filter out tickers we have the latest info for based on prev biz day
  const filteredTickerList = (
    await Promise.all(
      tickerList.map(async (ticker, i) => {
        const tickerData = await prisma.ticker.findFirst({
          where: { symbol: ticker },
        })
        const latestTickerInfo = await prisma.tickerInfo.findFirst({
          where: {
            tickerId: tickerData.id,
            date: previousBusinessDay,
          },
        })

        return latestTickerInfo === null ? ticker : null
      })
    )
  ).filter(ticker => ticker)

  // fetch daily data for each ticker
  const res = await alphaApi.core.daily(filteredTickerList.slice(0, 15), 'full')

  const tickersData = await Promise.all(
    filteredTickerList.map(ticker =>
      prisma.ticker.findFirst({ where: { symbol: ticker } })
    )
  )

  // for each ticker data, use time series data to create TickerInfo models
  let tickerInfoUpdates = await Promise.all(
    filteredTickerList.map((symbol, i) => {
      const timeSeriesData = res[i]
      const tickerData = tickersData.find(
        tickerData => tickerData.symbol === symbol
      )
      if (!timeSeriesData) return null

      return createTickerInfo(
        tickerData,
        timeSeriesData[`Time Series (Daily)`],
        '1d'
      )
    })
  )

  return tickerInfoUpdates
}
