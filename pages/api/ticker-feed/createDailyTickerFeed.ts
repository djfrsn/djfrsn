import AlphaVantageApi from 'lib/AlphaVantageApi';
import { getPreviousBusinessDay } from 'lib/dates';
import createTicker from 'lib/db/createTicker';
import createTickerInfo from 'lib/db/createTickerInfo';
import prisma from 'lib/prisma';
import { TickerType } from 'lib/types';

const alphaApi = new AlphaVantageApi()

export default async function createDailyTickerFeed({
  tickerList,
}: {
  tickerList: TickerType[]
}) {
  // create tickers in db
  await Promise.all(tickerList.map(ticker => createTicker(ticker.symbol)))

  // filter out tickers we have the latest info for based on prev biz day
  const filteredTickerList = (
    await Promise.all(
      tickerList.map(async (ticker, i) => {
        const tickerData = await prisma.ticker.findFirst({
          where: { symbol: ticker.symbol },
        })
        const latestTickerInfo = await prisma.tickerInfo.findFirst({
          where: {
            tickerId: tickerData.id,
            date: getPreviousBusinessDay(),
          },
        })

        return latestTickerInfo === null ? ticker : null
      })
    )
  ).filter(ticker => ticker)

  // fetch daily data for each ticker
  const res = await alphaApi.core.daily(
    filteredTickerList.slice(0, 15).map(ticker => ticker.symbol),
    'full'
  )

  const tickersData = await Promise.all(
    filteredTickerList.map(ticker =>
      prisma.ticker.findFirst({ where: { symbol: ticker.symbol } })
    )
  )

  // for each ticker data, use time series data to create TickerInfo models
  let tickerInfoUpdates = await Promise.all(
    filteredTickerList.map((ticker, i) => {
      const timeSeriesData = res[i]
      const tickerData = tickersData.find(
        tickerData => tickerData.symbol === ticker.symbol
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
