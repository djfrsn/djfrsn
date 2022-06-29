import { Job } from 'bullmq';
import { QUEUE } from 'lib/const';
import { RefreshMarketIndexJob } from 'lib/interfaces';

/**
 * Description: Runs after all tickers for a given index have been updated(see: refreshTicker.ts)
 * @constructor
 */
export default async function refreshMarketIndexCronProcessor(
  job: Job<RefreshMarketIndexJob>
) {
  console.log('start refresh market indexes cron', job.name)

  switch (true) {
    case QUEUE.refresh.marketIndexes === job.queueName:
      // TODO: create worker to call handleMarketIndexJobRequest from data
      // const { error, job } = await handleMarketIndexJobRequest(request.body)
      console.log('init market index', job.data)
      await job.updateProgress(100)
      break
    default:
      console.log(
        `refreshMarketIndex method not found to process job: ${job.name}`
      )
  }
}
