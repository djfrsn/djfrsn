import { FlowProducer, Queue, QueueScheduler } from 'bullmq';
import { QUEUE } from 'lib/const';

import connection from './redis';

// Docs: https://docs.bullmq.io/
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

export const sp500UpdateQueue = new Queue(QUEUE.refresh.marketIndex, options)
export const MarketIndexQueueScheduler = () =>
  new QueueScheduler(QUEUE.refresh.marketIndex, options)
export const MarketIndexTickerQueueScheduler = () =>
  new QueueScheduler(QUEUE.refresh.marketIndexTicker, options)
export const sp500RefreshFlow = new FlowProducer(options)
export const getSp500RefreshFlow = (id, depth = 0) =>
  sp500RefreshFlow.getFlow({
    id,
    queueName: QUEUE.refresh.marketIndex,
    depth,
  })
