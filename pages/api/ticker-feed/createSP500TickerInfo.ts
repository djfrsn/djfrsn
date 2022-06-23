import { sp500 } from 'lib/const';
import { isSameDay, today } from 'lib/dates';
import FMPApi from 'lib/FMPApi';
import prisma from 'lib/prisma';
import { TickerType } from 'lib/types';
import moment from 'moment';

const fmpApi = new FMPApi()

export default async function createSP500TickerInfo({
  tickerList,
}: {
  tickerList: TickerType[]
}) {
  const marketIndex = await prisma.marketIndex.findFirst({
    where: { name: sp500 },
  })
  const tickerSymbolDict = {}
  // filter for tickers with stale data
  const filteredTickerList = (
    await Promise.all(
      tickerList.map(async ticker => {
        const tickerData = await prisma.ticker.findFirst({
          where: { symbol: ticker.symbol, marketIndexId: marketIndex.id },
        })
        tickerSymbolDict[ticker.symbol] = ticker

        return isSameDay(tickerData?.lastRefreshed) ? null : ticker
      })
    )
  ).filter(ticker => ticker?.symbol)

  console.log('tickerList.length', tickerList.length)
  console.log('filteredTickerList.length', filteredTickerList.length)
  const tickerPrices = await fmpApi.core.dailyHistoricalPrice(
    filteredTickerList
  )
  const marketInterval = await prisma.marketInterval.findFirst({
    where: { name: '1d' },
  })

  const tickerPriceData = tickerPrices.reduce((allTickers, ticker) => {
    const historicalTickerPrices = ticker.historical.map(tick => ({
      tickerId: tickerSymbolDict[ticker.symbol].id,
      intervalId: marketInterval.id,
      date: moment(tick.date).toISOString(),
      close: String(tick.close),
    }))

    return allTickers.concat(historicalTickerPrices)
  }, [])

  const res = await prisma.tickerInfo.createMany({
    data: tickerPriceData,
    skipDuplicates: true,
  })

  await prisma.marketIndex.update({
    where: { id: marketIndex.id },
    data: { lastRefreshed: today.isoString },
  })

  return {
    ticker: { count: filteredTickerList.length },
    tickerInfo: { count: res.count },
  }
}
