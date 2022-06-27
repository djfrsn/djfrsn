import FMPApi from 'lib/data/FMPApi';
import prisma from 'lib/db/prisma';
import { CreateSp500TickerOptions, RefreshMarketIndexTickerJob } from 'lib/interfaces';
import { normalizeDate } from 'lib/utils/dates';

const fmpApi = new FMPApi()

/**
 * Description: Fetch and store tickerInfo from FMP daily historical API, compare new data with existing to prevent dupes
 * @constructor
 */
export default async function createSp500TickerInfo(
  { tickers, symbolDict, marketInterval }: RefreshMarketIndexTickerJob,
  options: CreateSp500TickerOptions
) {
  console.log(
    'Creating sp500 ticker info for:',
    tickers.map(ticker => ticker.symbol).join(',')
  )
  let res = { count: 0 }
  const [tickerPrices, existingTickerInfo] = await Promise.all([
    fmpApi.core.dailyHistoricalPrice(tickers, options.query),
    prisma.tickerInfo.findMany({
      where: { tickerId: { in: tickers.map(ticker => ticker.tickerId) } },
    }),
  ])

  const existingTickerInfoDict = existingTickerInfo.reduce(
    (a, existingTickerInfo) => ({
      ...a,
      [normalizeDate(existingTickerInfo.date).toISOString()]: {
        ...existingTickerInfo,
      },
    }),
    {}
  )

  await options.job.updateProgress(50)

  const tickerPriceData = tickerPrices.reduce((allTickers, ticker) => {
    const historicalTickerPrices = ticker.historical.reduce(
      (historicalInfo, tick) => {
        const date = normalizeDate(tick.date).toISOString()
        const shouldUpdate = !existingTickerInfoDict[date]

        if (shouldUpdate) {
          historicalInfo.push({
            tickerId: symbolDict[ticker.symbol].tickerId,
            intervalId: marketInterval.id,
            date,
            close: String(tick.close),
          })
        }

        return historicalInfo
      },
      []
    )

    if (historicalTickerPrices.length) {
      console.log(
        'Updating',
        historicalTickerPrices.length,
        'out of',
        ticker.historical.length,
        'tickers'
      )
      allTickers = allTickers.concat(historicalTickerPrices)
    }

    return allTickers
  }, [])

  console.log('ticker info update count', tickerPriceData.length)

  if (tickerPriceData.length) {
    res = await prisma.tickerInfo.createMany({
      data: tickerPriceData,
      skipDuplicates: true,
    })
  }

  await options.job.updateProgress(100)

  return {
    ticker: { count: tickers.length },
    tickerInfo: { count: res.count },
  }
}
