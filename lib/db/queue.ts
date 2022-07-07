import { FlowProducer, Queue } from 'bullmq';
import Events from 'events';
import { QUEUE } from 'lib/const';
import connection from 'lib/db/redis';

Events.EventEmitter.defaultMaxListeners = 15

/**
 * @see {@link https://docs.bullmq.io/}
 */
export const defaultJobOptions = {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 1000,
  },
}
export const options = {
  connection,
  defaultJobOptions,
}

export const refreshMarketsQueue = new Queue(
  QUEUE.refresh.marketIndexes,
  options
)
export const refreshMarketQueue = new Queue(QUEUE.refresh.marketIndex, options)
// export const MarketIndexesRefreshQueueScheduler = () =>
//   new QueueScheduler(QUEUE.refresh.marketIndexes, options)
// export const MarketIndexQueueScheduler = () =>
//   new QueueScheduler(QUEUE.refresh.marketIndex, options)
// export const MarketIndexTickerQueueScheduler = () =>
//   new QueueScheduler(QUEUE.refresh.marketIndexTicker, options)
export const sp500RefreshFlow = new FlowProducer(options)
export const getSp500RefreshFlow = (id, depth = 0) =>
  sp500RefreshFlow.getFlow({
    id,
    queueName: QUEUE.refresh.marketIndex,
    depth,
  })
