import { Queue, QueueScheduler } from 'bullmq';

import { QUEUE } from '../const';
import connection from '../db/redis';

// Docs: https://docs.bullmq.io/
const options = {
  connection,
}

export const sp500QueueScheduler = new QueueScheduler(
  QUEUE.updateMarketIndex,
  options
)

export const sp500UpdateQueue = new Queue(QUEUE.updateMarketIndex, options)
