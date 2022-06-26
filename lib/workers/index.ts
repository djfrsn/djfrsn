import { QUEUE } from 'lib/const';

import refreshMarketIndexProcessor from './marketIndex/refresh';
import refreshMarketIndexTickerProcessor from './marketIndex/refreshTicker';
import { createWorker } from './worker.factory';

// TODO: get time to run first job, use data to extrapolate job time est on status route

const {
  worker: refreshMarketIndexWorker,
  scheduler: refreshMarketIndexWorkerScheduler,
} = createWorker(QUEUE.refreshMarketIndex, refreshMarketIndexProcessor)

const {
  worker: refreshMarketIndexTickerWorker,
  scheduler: refreshMarketIndexTickerWorkerScheduler,
} = createWorker(
  QUEUE.refreshMarketIndexTicker,
  refreshMarketIndexTickerProcessor
)

process.on('SIGTERM', async () => {
  console.info('SIGTERM signal received: closing queues')

  await refreshMarketIndexWorker.close()
  await refreshMarketIndexWorkerScheduler.close()
  await refreshMarketIndexTickerWorker.close()
  await refreshMarketIndexTickerWorkerScheduler.close()

  console.info('All closed')
})
