import { Job } from 'bullmq';
import { QUEUE } from 'lib/const';
import prisma from 'lib/db/prisma';
import { RefreshMarketJob } from 'lib/interfaces';
import refreshMarketIndexTimeSeries from 'lib/marketIndex/refreshMarketIndexTimeSeries';
import { moment } from 'lib/utils/time';

/**
 * Description: Runs after all tickers for a given index have been updated(see: refreshTicker.ts)
 * @constructor
 */
export default async function refreshMarketProcessor(
  job: Job<RefreshMarketJob>
) {
  console.log('start refresh market index job', job.name)

  switch (true) {
    case QUEUE.refresh.sp500 === job.name:
      console.log('job.data', job.data)
      const marketIndex = job.data.marketIndex

      if (marketIndex.symbol) {
        await refreshMarketIndexTimeSeries(job.data, { job })
      }

      if (marketIndex) {
        await prisma.marketIndex.update({
          where: { id: marketIndex.id },
          data: { lastRefreshed: moment().toISOString() },
        })
      }

      await job.updateProgress(100)
      break
    default:
      console.log(
        `refreshMarketIndex method not found to process job: ${job.name}`
      )
  }
}
