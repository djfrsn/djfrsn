import { Job } from '@prisma/client';
import chunk from 'lib/chunk';
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
  console.log('tickerListChunks', tickerListChunks.length)

  return null
  // const result = await sp500UpdateFlow.add({
  //   name: 'refresh-sp500',
  //   queueName: QUEUE.updateMarketIndex,
  //   data: { id: marketIndex.id, name: marketIndex.name },
  //   children: tickerListChunks.map((tickerListChunk: Ticker[]) => {
  //     const dict = {}

  //     const symbols = tickerListChunk.map((ticker: Ticker) => {
  //       const symbol = ticker.symbol

  //       dict[symbol] = { tickerId: ticker.id }

  //       return symbol
  //     })

  //     return {
  //       name: 'update-sp500-ticker-info',
  //       queueName: QUEUE.updateMarketIndexTickerInfo,
  //       data: { symbols, dict },
  //     }
  //   }),
  // })

  // // TODO: store result as Job

  // return result
}

export default createSP500RefreshJob
