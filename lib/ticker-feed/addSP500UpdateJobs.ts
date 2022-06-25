import { Ticker } from '@prisma/client';
import chunk from 'lib/chunk';
import { QUEUE } from 'lib/const';
import { sp500UpdateFlow } from 'lib/db/queue';
import { MarketIndexJobOptions } from 'lib/types';

import createSP500Ticker from './createSP500Ticker';

/**
 * Description: Fetch list of S&P 500 symbols and create upsert jobs in batches of 6 symbols
 * @constructor
 */
async function addSP500UpdateJobs(options: MarketIndexJobOptions) {
  // TODO: create get route with latest activejobs for a given marketIndexId
  // {
  //     message: `${activeJobs} waiting + ${activeJobs} failed jobs need to be processed before next update.`,
  //   }
  // const result = await sp500UpdateFlow.getFlow({
  //   id: '0274f079-c84d-431d-a527-19ee28a38fa3',
  //   queueName: QUEUE.updateMarketIndex,
  // })
  // const activeJobs = counts.children.length > 0
  // let result: any = null
  // // console.log('activeJobs', activeJobs)
  // // if (!activeJobs) {
  const { marketIndex } = options
  const tickerList = await createSP500Ticker({ marketIndex })
  const tickerListChunks = chunk(tickerList, 6)
  console.log('tickerListChunks', tickerListChunks.length)
  const result = await sp500UpdateFlow.add({
    name: 'update-sp500',
    queueName: QUEUE.updateMarketIndex,
    data: { id: marketIndex.id, name: marketIndex.name },
    children: tickerListChunks.map((tickerListChunk: Ticker[]) => {
      const dict = {}

      const symbols = tickerListChunk.map((ticker: Ticker) => {
        const symbol = ticker.symbol

        dict[symbol] = { tickerId: ticker.id }

        return symbol
      })

      return {
        name: 'update-sp500-ticker-info',
        queueName: QUEUE.updateMarketIndexTickerInfo,
        data: { symbols, dict },
      }
    }),
  })

  // TODO: store flow id as Job

  return result
}

export default addSP500UpdateJobs
