import { Ticker } from '@prisma/client';
import FMPApi from 'lib/data/FMPApi';
import prisma from 'lib/db/prisma';
import { MarketIndexJobOptions } from 'lib/interfaces';
import { isSameDay } from 'lib/utils/dates';
import moment from 'moment';

const fmpApi = new FMPApi()

/**
 * Description: Fetch and store list of S&P 500 tickers, only update the db for tickers were missing
 * @constructor
 */
export default async function createSP500Tickers(
  options: MarketIndexJobOptions
): Promise<Ticker[]> {
  const { marketIndex } = options
  const marketIndexId = { marketIndexId: marketIndex.id }
  const tickerListRefreshed = isSameDay(moment(marketIndex.lastRefreshed))

  if (!tickerListRefreshed) {
    const tickerList = await fmpApi.marketIndex.sp500()

    const existingTickers = await prisma.ticker.findMany({
      where: { symbol: { in: tickerList.map(ticker => ticker.symbol) } },
    })
    const existingTickersDict = existingTickers.reduce(
      (a, v) => ({ ...a, [v.symbol]: true }),
      {}
    )
    const updateTickerList = []
    const createTickerList = tickerList.filter(ticker => {
      const existingTicker = existingTickersDict[ticker.symbol]
      const shouldUpdate = existingTicker.marketIndexId !== marketIndexId

      if (existingTicker && shouldUpdate) {
        updateTickerList.push(ticker)
      }

      return !existingTicker
    })
    const transactions = [
      prisma.ticker.updateMany({
        where: marketIndexId,
        data: {
          marketIndexId: null,
        },
      }),
    ]

    console.log('Creating %s tickers', createTickerList.length)
    console.log('Updating %s tickers', updateTickerList.length)

    if (createTickerList.length) {
      transactions.push(
        prisma.ticker.createMany({
          data: createTickerList.map(ticker => ({
            ...ticker,
            ...marketIndexId,
          })),
        })
      )
    }

    if (updateTickerList.length) {
      transactions.push(
        prisma.ticker.updateMany({
          where: {
            symbol: { in: updateTickerList.map(ticker => ticker.symbol) },
          },
          data: marketIndexId,
        })
      )
    }

    await prisma.$transaction(transactions)
  }

  const sp500tickerList = await prisma.ticker.findMany({ where: marketIndexId })

  return sp500tickerList
}
