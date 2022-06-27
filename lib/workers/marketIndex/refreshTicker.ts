import { Job } from 'bullmq';
import { MARKET_INDEX, QUEUE } from 'lib/const';
import prisma from 'lib/db/prisma';
import { RefreshMarketIndexTickerJob } from 'lib/interfaces';
import createSP500TickerInfo from 'lib/marketIndex/createSP500TickerInfo';
import { getMostRecentBusinessDay, isLatestBusinessDay, momentBusiness, normalizeDate } from 'lib/utils/dates';

export default async function refreshMarketIndexTickerProcessor(
  job: Job<RefreshMarketIndexTickerJob>
) {
  console.log('start refresh ticker job', job.name)
  // TODO: ensure retries are working
  // TODO: how can we update the parent job progress?

  switch (true) {
    case QUEUE.refresh.sp500TickerInfo === job.name:
      // check if marketIndex.lastRefreshedDate before today
      const marketIndex = await prisma.marketIndex.findFirst({
        where: { name: MARKET_INDEX.sp500 },
      })
      const mostRecentBusinessDay = getMostRecentBusinessDay()
      const lastRefreshed = normalizeDate(marketIndex.lastRefreshed)
      const shouldRefresh = !isLatestBusinessDay(lastRefreshed)
      // get num of days passed since lastRefreshed
      const dayDiff = momentBusiness(mostRecentBusinessDay).businessDiff(
        lastRefreshed
      )
      const query = dayDiff > 0 ? `timeseries=${dayDiff}` : ''
      // const query =
      //   dayDiff > 1000
      //     ? `timeseries=${dayDiff}`
      //     : 'from=2020-03-12&to=2022-6-21'
      // pass as query timeseries = num
      console.log('number of days passed', dayDiff)
      console.log('lastRefreshed', lastRefreshed)
      console.log('mostRecentBusinessDay', mostRecentBusinessDay)
      console.log('should refresh', shouldRefresh)
      if (shouldRefresh) await createSP500TickerInfo(job.data, { query, job })
      // do nothing if marketIndex.lastRefreshedDate not before today and log message
      break
    default:
      console.log(
        `refreshMarketIndexTicker method not found to process job: ${job.name}`
      )
  }
}
