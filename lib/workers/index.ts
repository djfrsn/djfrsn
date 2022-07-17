import { QUEUE } from 'lib/const';
import gracefulShutdown from 'lib/utils/gracefulShutdown';

import marketIndexCronProcessor from './marketIndex/cron';
import refreshMarketIndexProcessor from './marketIndex/refresh';
import refreshMarketIndexTickerProcessor from './marketIndex/refreshTicker';
import { createWorker } from './worker.factory';

const Sentry = require('@sentry/node')
require('@sentry/tracing')

const start = () => {
  console.info('Starting workers...')

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
    5
  )

  const onShutdown = async () => {
    console.info('SIGTERM signal received: closing workers')

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

  console.info('Workers startup complete')
}

Sentry.init({
  dsn: process.env.SENTRY_WORKER_DSN,

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
})

try {
  start()
} catch (e) {
  Sentry.captureException(e)
}

export default start
