import { QUEUE } from 'lib/const';
import gracefulShutdown from 'lib/utils/gracefulShutdown';

import marketIndexCronProcessor from './marketIndex/cron';
import refreshMarketIndexProcessor from './marketIndex/refresh';
import refreshMarketIndexTickerProcessor from './marketIndex/refreshTicker';
import { createWorker } from './worker.factory';

const {
  worker: refreshMarketIndexCronWorker,
  scheduler: refreshMarketIndexCronWorkerScheduler,
} = createWorker(QUEUE.refresh.marketIndexes, marketIndexCronProcessor)

const {
  worker: refreshMarketIndexWorker,
  scheduler: refreshMarketIndexWorkerScheduler,
} = createWorker(QUEUE.refresh.marketIndex, refreshMarketIndexProcessor)

const {
  worker: refreshMarketIndexTickerWorker,
  scheduler: refreshMarketIndexTickerWorkerScheduler,
} = createWorker(
  QUEUE.refresh.marketIndexTicker,
  refreshMarketIndexTickerProcessor,
  15
)

const onShutdown = async () => {
  console.info('SIGTERM signal received: closing queues')

  await refreshMarketIndexCronWorker.close()
  await refreshMarketIndexCronWorkerScheduler.close()
  await refreshMarketIndexWorker.close()
  await refreshMarketIndexWorkerScheduler.close()
  await refreshMarketIndexTickerWorker.close()
  await refreshMarketIndexTickerWorkerScheduler.close()

  console.info('All closed')
}

process.on('SIGTERM', onShutdown)

gracefulShutdown(() => {
  process.removeAllListeners('SIGTERM')
})
