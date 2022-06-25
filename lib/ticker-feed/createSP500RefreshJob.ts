import { Job, Ticker } from '@prisma/client';
import chunk from 'lib/chunk';
import { QUEUE } from 'lib/const';
import { sp500UpdateFlow } from 'lib/db/queue';
import prisma from 'lib/prisma';
import { MarketIndexJobOptions } from 'lib/types';

import createSP500Ticker from './createSP500Ticker';

/**
 * Description: Fetch list of S&P 500 symbols and create upsert jobs in batches of 6 symbols
 * @constructor
 */
async function createSP500RefreshJob(
  options: MarketIndexJobOptions
): Promise<Job> {
  const { marketIndex } = options
  const tickerList = await createSP500Ticker(options)
  const tickerListChunks = chunk(tickerList, 6)
  const name = QUEUE.marketIndexRefresh.sp500
  const queueName = QUEUE.refreshMarketIndex
  console.log('tickerListChunks', tickerListChunks.length)

  const result = await sp500UpdateFlow.add({
    name,
    queueName,
    data: { id: marketIndex.id, name: marketIndex.name },
    children: tickerListChunks.map((tickerListChunk: Ticker[]) => {
      const dict = {}

      const symbols = tickerListChunk.map((ticker: Ticker) => {
        const symbol = ticker.symbol

        dict[symbol] = { tickerId: ticker.id }

        return symbol
      })

      return {
        name: QUEUE.marketIndexRefresh.sp500TickerInfo,
        queueName: QUEUE.refreshMarketIndexTickerInfo,
        data: { symbols, dict },
      }
    }),
  })

  const job = await prisma.job.create({
    data: {
      name,
      modelName: 'marketIndex',
      modelId: marketIndex.id,
      jobId: result.job.id,
      queueName,
    },
  })

  return job
}

export default createSP500RefreshJob
