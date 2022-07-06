import { Job, JobNode } from 'bullmq';
import { MARKET_INDEX, QUEUE } from 'lib/const';
import prisma from 'lib/db/prisma';
import { getSp500RefreshFlow } from 'lib/db/queue';
import { RefreshMarketIndexTickerJob } from 'lib/interfaces';
import createSP500TickerInfo from 'lib/marketIndex/createSP500TickerInfo';
import { getDependenciesCount } from 'lib/utils/bullmq';
import { getMostRecentBusinessDay, momentBusiness, normalizeDate } from 'lib/utils/dates';

let parent: JobNode | null

export default async function refreshMarketIndexTickerProcessor(
  job: Job<RefreshMarketIndexTickerJob>
) {
  console.log('start refresh ticker job', job.name)

  switch (true) {
    case QUEUE.refresh.sp500TickerInfo === job.name:
      if (parent?.job?.id !== job.parent.id) {
        parent = await getSp500RefreshFlow(job.parent.id, 1)
      }

      const marketIndex = await prisma.marketIndex.findFirst({
        where: { name: MARKET_INDEX.sp500 },
      })
      const mostRecentBusinessDay = getMostRecentBusinessDay()
      const lastRefreshed =
        marketIndex.lastRefreshed && normalizeDate(marketIndex.lastRefreshed)
      // get num of days passed since lastRefreshed
      const dayDiff = lastRefreshed
        ? momentBusiness(mostRecentBusinessDay).businessDiff(lastRefreshed)
        : null
      const query =
        dayDiff > 0 && typeof marketIndex.lastRefreshed === 'string'
          ? `timeseries=${dayDiff}`
          : ''
      const onComplete = []

      await createSP500TickerInfo(job.data, { query, job })

      await job.updateProgress(100)

      const dependencies = await parent.job.getDependencies()
      const totalJobCount = getDependenciesCount(dependencies)
      const progressIncrement = Number((100 / totalJobCount).toFixed(2))
      let progress = progressIncrement + Number(parent.job.progress)

      await Promise.all([
        ...onComplete,
        parent.job.updateProgress(
          progress > 99.9 ? 100 : Number(progress.toFixed(2))
        ),
      ])
      break
    default:
      console.log(
        `refreshMarketIndexTicker method not found to process job: ${job.name}`
      )
  }
}
