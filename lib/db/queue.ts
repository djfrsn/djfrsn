import { FlowProducer, Queue } from 'bullmq';
import { QUEUE } from 'lib/const';

import connection from './redis';

// Docs: https://docs.bullmq.io/

export const options = {
  connection,
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 1000,
  },
}

export const sp500UpdateQueue = new Queue(QUEUE.refresh.marketIndex, options)
export const sp500RefreshFlow = new FlowProducer(options)
export const getSp500RefreshFlow = id =>
  sp500RefreshFlow.getFlow({
    id,
    queueName: QUEUE.refresh.marketIndex,
    depth: 1,
  })
