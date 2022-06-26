import { Job, Ticker } from '@prisma/client';
import { MARKET_INTERVAL, QUEUE } from 'lib/const';
import prisma from 'lib/db/prisma';
import { sp500RefreshFlow } from 'lib/db/queue';
import { MarketIndexJobOptions } from 'lib/interfaces';
import chunk from 'lib/utils/chunk';

import createSP500Tickers from './createSP500Tickers';

/**
 * Description: Fetch list of S&P 500 symbols and create jobs in batches of 6 symbols
 * @constructor
 */
async function createSP500RefreshJob(
  options: MarketIndexJobOptions
): Promise<Job> {
  const { marketIndex } = options
  const tickerList = await createSP500Tickers(options)
  const tickerListChunks = chunk(tickerList, 6)
  const name = QUEUE.refresh.sp500
  const queueName = QUEUE.refresh.marketIndex
  const marketInterval = await prisma.marketInterval.findFirst({
    where: { name: MARKET_INTERVAL.oneday },
  })

  console.log(
    'Creating',
    tickerListChunks.length,
    'sp500 refresh jobs for',
    tickerList.length,
    'tickers'
  )

  const result = await sp500RefreshFlow.add({
    name,
    queueName,
    data: { id: marketIndex.id, name: marketIndex.name },
    children: tickerListChunks.map((tickerListChunk: Ticker[]) => {
      const symbolDict = {}
      const tickers = tickerListChunk.map((ticker: Ticker) => {
        const symbol = ticker.symbol
        const tickerId = ticker.id

        symbolDict[symbol] = { tickerId }

        return { symbol, tickerId }
      })

      return {
        name: QUEUE.refresh.sp500TickerInfo,
        queueName: QUEUE.refresh.marketIndexTicker,
        data: {
          tickers,
          symbolDict,
          marketInterval,
        },
      }
    }),
  })

  const job = await prisma.job.update({
    where: { modelId: marketIndex.id },
    data: {
      name,
      jobId: result.job.id,
      queueName,
    },
  })

  return job
}

export default createSP500RefreshJob
