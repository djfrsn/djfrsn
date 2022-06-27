import { Job } from 'bullmq';
import { QUEUE } from 'lib/const';
import prisma from 'lib/db/prisma';
import { RefreshMarketIndexJob } from 'lib/interfaces';
import { getMostRecentBusinessDay } from 'lib/utils/dates';

/**
 * Description: Runs after all tickers for a given index have been updated(see: refreshTicker.ts)
 * @constructor
 */
export default async function refreshMarketIndexProcessor(
  job: Job<RefreshMarketIndexJob>
) {
  console.log('start refresh market index job', job.name)

  switch (true) {
    case QUEUE.refresh.sp500 === job.name:
      await Promise.all([
        prisma.marketIndex.update({
          where: { id: job.data.id },
          // data: {
          //   lastRefreshed: normalizeDate(new Date('2022-06-21')).toISOString(),
          // },
          data: { lastRefreshed: getMostRecentBusinessDay().toISOString() },
        }),
        // prisma.tickerInfo.deleteMany(),
        // prisma.job.update({
        //   where: { modelId: job.data.id },
        //   data: { jobId: null },
        // }),
      ])
      await job.updateProgress(100)
      break
    default:
      console.log(
        `refreshMarketIndex method not found to process job: ${job.name}`
      )
  }
}
