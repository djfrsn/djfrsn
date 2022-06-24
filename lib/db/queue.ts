import { Queue, QueueScheduler } from 'bullmq';
import { QUEUE } from 'lib/const';
import connection from 'lib/db/redis';

// Docs: https://docs.bullmq.io/
const options = {
  connection,
}

export const sp500QueueScheduler = new QueueScheduler(
  QUEUE.updateSP500,
  options
)
export const sp500UpdateQueue = new Queue(QUEUE.updateSP500, options)
