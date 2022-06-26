import { MARKET_INTERVAL } from 'lib/const';
import FMPApi from 'lib/data/FMPApi';
import prisma from 'lib/db/prisma';
import { RefreshMarketIndexTickerJob } from 'lib/interfaces';
import moment from 'moment';

const fmpApi = new FMPApi()

export default async function createSP500TickerInfo({
  tickers,
  symbolDict,
}: RefreshMarketIndexTickerJob) {
  // const marketIndex = await prisma.marketIndex.findFirst({
  //   where: { name: MARKET_INDEX.sp500 },
  // })
  // filter for tickers with stale data
  // const filteredTickerList = (
  //   await Promise.all(
  //     tickerList.map(async ticker => {
  //       const tickerData = await prisma.ticker.findFirst({
  //         where: { symbol: ticker.symbol, marketIndexId: marketIndex.id },
  //       })
  //       tickerSymbolDict[ticker.symbol] = ticker

  //       return isSameDay(tickerData?.lastRefreshed) ? null : ticker
  //     })
  //   )
  // ).filter(ticker => ticker?.symbol)

  const symbols = tickers.map(ticker => ticker.symbol).join(',')

  console.log('Creating sp500 ticker info for:', symbols)

  const tickerPrices = await fmpApi.core.dailyHistoricalPrice(
    symbols.slice(0, 3)
  )
  const marketInterval = await prisma.marketInterval.findFirst({
    where: { name: MARKET_INTERVAL.oneday },
  })

  console.log('tickerPrices', tickerPrices)

  const tickerPriceData = tickerPrices.reduce((allTickers, ticker) => {
    const historicalTickerPrices = ticker.historical.map(tick => ({
      tickerId: symbolDict[ticker.symbol].tickerId,
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

  return {
    ticker: { count: tickers.length },
    tickerInfo: { count: res.count },
  }
}
