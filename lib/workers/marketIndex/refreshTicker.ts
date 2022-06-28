import { Job, JobNode } from 'bullmq';
import { MARKET_INDEX, QUEUE } from 'lib/const';
import prisma from 'lib/db/prisma';
import { getSp500RefreshFlow } from 'lib/db/queue';
import { RefreshMarketIndexTickerJob } from 'lib/interfaces';
import createSP500TickerInfo from 'lib/marketIndex/createSP500TickerInfo';
import { getMostRecentBusinessDay, isLatestBusinessDay, momentBusiness, normalizeDate } from 'lib/utils/dates';

let parent: JobNode | null
let progressIncrement: number | null

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
      const lastRefreshed = normalizeDate(marketIndex.lastRefreshed)
      // is marketIndex.lastRefreshedDate before today?
      const shouldRefresh = !isLatestBusinessDay(lastRefreshed)
      // get num of days passed since lastRefreshed
      const dayDiff = momentBusiness(mostRecentBusinessDay).businessDiff(
        lastRefreshed
      )
      const query =
        dayDiff > 0 && typeof marketIndex.lastRefreshed === 'string'
          ? `timeseries=${dayDiff}`
          : 'from=2020-03-12&to=2022-6-21'
      // const query =
      //   dayDiff > 1000
      //     ? `timeseries=${dayDiff}`
      //     : 'from=2020-03-12&to=2022-6-21'
      console.log('number of days passed', dayDiff)
      console.log('lastRefreshed', lastRefreshed.toISOString())
      console.log('mostRecentBusinessDay', mostRecentBusinessDay.toISOString())
      console.log('should refresh', shouldRefresh)
      const onComplete = []

      if (shouldRefresh) await createSP500TickerInfo(job.data, { query, job })
      else onComplete.push(job.updateProgress(100))

      let progress = job.data.progressIncrement + Number(parent.job.progress)

      await Promise.all([
        ...onComplete,
        parent.job.updateProgress(progress > 100 ? 100 : progress),
      ])
      break
    default:
      console.log(
        `refreshMarketIndexTicker method not found to process job: ${job.name}`
      )
  }
}
