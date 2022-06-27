import FMPApi from 'lib/data/FMPApi';
import prisma from 'lib/db/prisma';
import { CreateSp500TickerOptions, RefreshMarketIndexTickerJob } from 'lib/interfaces';
import { normalizeDate } from 'lib/utils/dates';

const fmpApi = new FMPApi()

export default async function createSp500TickerInfo(
  { tickers, symbolDict, marketInterval }: RefreshMarketIndexTickerJob,
  options: CreateSp500TickerOptions
) {
  console.log(
    'Creating sp500 ticker info for:',
    tickers.map(ticker => ticker.symbol).join(',')
  )
  const tickerPrices = await fmpApi.core.dailyHistoricalPrice(
    tickers,
    options.query
  )

  await options.job.updateProgress(50)

  const tickerPriceData = tickerPrices.reduce((allTickers, ticker) => {
    const historicalTickerPrices = ticker.historical.map(tick => ({
      tickerId: symbolDict[ticker.symbol].tickerId,
      intervalId: marketInterval.id,
      date: normalizeDate(tick.date).toISOString(),
      close: String(tick.close),
    }))

    return allTickers.concat(historicalTickerPrices)
  }, [])

  console.log('latest date', tickerPriceData[0].date)

  const res = await prisma.tickerInfo.createMany({
    data: tickerPriceData,
  })

  await options.job.updateProgress(100)

  return {
    ticker: { count: tickers.length },
    tickerInfo: { count: res.count },
  }
}
