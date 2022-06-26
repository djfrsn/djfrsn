import FMPApi from 'lib/data/FMPApi';
import prisma from 'lib/db/prisma';
import { RefreshMarketIndexTickerJob } from 'lib/interfaces';
import moment from 'moment';

const fmpApi = new FMPApi()

export default async function createSP500TickerInfo({
  tickers,
  symbolDict,
  marketInterval,
}: RefreshMarketIndexTickerJob) {
  console.log(
    'Creating sp500 ticker info for:',
    tickers.map(ticker => ticker.symbol).join(',')
  )
  const tickerPrices = await fmpApi.core.dailyHistoricalPrice(tickers)
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
