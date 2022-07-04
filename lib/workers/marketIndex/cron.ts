import { Job } from 'bullmq';
import { QUEUE } from 'lib/const';
import { MarketIndexCronJob } from 'lib/interfaces';
import handleMarketIndexJobRequest from 'lib/marketIndex/handleMarketIndexJobRequest';

/**
 * Description: Runs after all tickers for a given index have been updated(see: refreshTicker.ts)
 * @constructor
 */
export default async function refreshMarketIndexCronProcessor(
  job: Job<MarketIndexCronJob>
) {
  console.log('start refresh market indexes cron', job.name)

  switch (true) {
    case QUEUE.refresh.marketIndexes === job.queueName:
      console.log('data', job.data)
      const { error, job: dbJob } = await handleMarketIndexJobRequest({
        marketIndexId: job.data.marketIndex.id,
      })
      console.log('init market index', dbJob)
      console.log('err', error)
      await job.updateProgress(100)
      break
    default:
      console.log(
        `refreshMarketIndexCron method not found to process job: ${job.queueName}`
      )
  }
}
