import { MarketIndex, Ticker } from '@prisma/client';
import { isSameDay } from 'lib/dates';
import FMPApi from 'lib/FMPApi';
import prisma from 'lib/prisma';
import moment from 'moment';

const fmpApi = new FMPApi()

interface createSP500TickerOptions {
  marketIndex: MarketIndex
}

export default async function createSP500Ticker(
  options: createSP500TickerOptions
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
      const tickerExist = existingTickersDict[ticker.symbol]
      if (tickerExist) updateTickerList.push(ticker)
      return !tickerExist
    })
    const transactions = [
      prisma.ticker.updateMany({
        where: marketIndexId,
        data: {
          marketIndexId: null,
        },
      }),
    ]

    console.log('createTickerList', createTickerList.length)
    console.log('updateTickerList', updateTickerList.length)

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
