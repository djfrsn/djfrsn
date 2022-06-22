import AlphaVantageApi from 'lib/AlphaVantageApi';
import { isSameDay } from 'lib/dates';
import prisma from 'lib/prisma';
import { TickerType } from 'lib/types';

const alphaApi = new AlphaVantageApi()

export default async function createsSP500TickerFeed({
  tickerList,
}: {
  tickerList: TickerType[]
}) {
  const marketIndex = await prisma.marketIndex.findFirst({
    where: { name: 'sp500' },
  })
  // console.log('tickerList', tickerList)

  // filter out tickers we have the latest info for based on prev biz day
  const filteredTickerList = (
    await Promise.all(
      tickerList.map(async ticker => {
        const tickerData = await prisma.ticker.findFirst({
          where: { symbol: ticker.symbol, marketIndexId: marketIndex.id },
        })

        console.log('tickerData.lastRefreshed', tickerData?.lastRefreshed)

        return isSameDay(tickerData?.lastRefreshed) ? null : ticker
      })
    )
  ).filter(ticker => ticker)
  console.log('tickerList.length', tickerList.length)
  console.log('filteredTickerList.length', filteredTickerList)
  // fetch daily data for each ticker
  // const res = await alphaApi.core.daily(
  //   filteredTickerList.slice(0, 5).map(ticker => ticker.symbol),
  //   'full'
  // )
  // const tickersData = await Promise.all(
  //   filteredTickerList.map(ticker =>
  //     prisma.ticker.findFirst({ where: { symbol: ticker.symbol } })
  //   )
  // )
  // // for each ticker data, use time series data to create TickerInfo models
  // TODO: createTickerInfo should take a list and do a bulk insertion
  // TODO: update last refreshed for all filteredTickers
  // let tickerInfoUpdates = await Promise.all(
  //   filteredTickerList.map((ticker, i) => {
  //     const timeSeriesData = res[i]
  //     const tickerData = tickersData.find(
  //       tickerData => tickerData.symbol === ticker.symbol
  //     )
  //     if (!timeSeriesData) return null
  //     return createTickerInfo(
  //       tickerData,
  //       timeSeriesData[`Time Series (Daily)`],
  //       '1d'
  //     )
  //   })
  // )
  // return tickerInfoUpdates
}
