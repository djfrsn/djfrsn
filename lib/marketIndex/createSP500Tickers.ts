import { Ticker } from '@prisma/client';
import FMPApi from 'lib/data/FMPApi';
import prisma from 'lib/db/prisma';
import { MarketIndexJobOptions } from 'lib/interfaces';
import arrayHasItems from 'lib/utils/arrayHasItems';
import { shouldRefreshMarket } from 'lib/utils/dates';

const fmpApi = new FMPApi()

/**
 * Description: Fetch and store list of S&P 500 tickers
 * @constructor
 */
export default async function createSP500Tickers(
  options: MarketIndexJobOptions
): Promise<Ticker[]> {
  const { marketIndex } = options
  const marketIndexId = marketIndex.id
  const tickerUpdateData = { marketIndexId: marketIndex.id }
  const shouldRefresh = shouldRefreshMarket()

  console.log('createSP500Tickers => shouldRefresh', shouldRefresh)

  if (true) {
    const tickerList = await fmpApi.marketIndex.sp500()

    if (arrayHasItems(tickerList)) {
      const symbolList = tickerList.map(ticker => ticker.symbol)
      const existingTickers = await prisma.ticker.findMany({
        where: { symbol: { in: symbolList } },
      })
      const existingTickersDict = existingTickers.reduce(
        (a, existingTicker) => ({
          ...a,
          [existingTicker.symbol]: { ...existingTicker },
        }),
        {}
      )
      const updateTickerList = []
      const createTickerList = tickerList.filter(ticker => {
        const existingTicker = existingTickersDict[ticker.symbol]
        const shouldUpdate = existingTicker?.marketIndexId !== marketIndexId

        if (existingTicker && shouldUpdate) {
          updateTickerList.push(ticker)
        }

        return !existingTicker
      })

      await prisma.ticker.updateMany({
        where: { marketIndexId: marketIndexId },
        data: { marketIndexId: null },
      })

      console.log('Creating %s tickers', createTickerList.length)
      console.log('Updating %s tickers', updateTickerList.length)

      if (createTickerList.length) {
        await prisma.ticker.createMany({
          data: createTickerList.map(ticker => ({
            ...ticker,
            ...tickerUpdateData,
          })),
        })
      }

      if (updateTickerList.length) {
        const updates = await prisma.ticker.updateMany({
          where: {
            symbol: { in: updateTickerList.map(ticker => ticker.symbol) },
          },
          data: tickerUpdateData,
        })
        console.log('tickerListUpdates', updates)
      }
    }
  }

  const sp500tickerList = await prisma.ticker.findMany({
    where: tickerUpdateData,
  })

  return sp500tickerList
}
