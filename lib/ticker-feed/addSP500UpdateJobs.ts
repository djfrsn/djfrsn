import { Ticker } from '@prisma/client';
import chunk from 'lib/chunk';
import { sp500UpdateQueue } from 'lib/db/queue';
import createSP500Ticker from 'lib/ticker-feed/createSP500Ticker';

/**
 * Description: Fetch list of S&P 500 symbols and create upsert jobs in batches of 6 symbols
 * @constructor
 */
async function addSP500UpdateJobs() {
  const counts = await sp500UpdateQueue.getJobCounts('wait', 'failed')
  const activeJobs = counts.wait + counts.failed > 0
  let result: any = null

  if (!activeJobs) {
    const tickerList = await createSP500Ticker()
    const tickerListChunks = chunk(tickerList, 6)
    console.log('tickerListChunks', tickerListChunks.length)
    const jobs = await sp500UpdateQueue.addBulk(
      tickerListChunks.map((tickerListChunk: Ticker[]) => {
        const dict = {}

        const symbols = tickerListChunk.map((ticker: Ticker) => {
          const symbol = ticker.symbol

          dict[symbol] = { tickerId: ticker.id }

          return symbol
        })

        return {
          name: 'upsertSp500TickerInfo',
          data: { symbols, dict },
        }
      })
    )

    result = jobs
  } else {
    result = {
      message: `${counts.wait} waiting + ${counts.failed} failed jobs need to be processed before next update.`,
    }
  }

  return result
}

export default addSP500UpdateJobs