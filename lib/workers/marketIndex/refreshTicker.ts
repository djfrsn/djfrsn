import { Job } from 'bullmq';
import { QUEUE } from 'lib/const';
import { RefreshMarketIndexTickerJob } from 'lib/interfaces';

export default async function refreshMarketIndexTickerProcessor(
  job: Job<RefreshMarketIndexTickerJob>
) {
  console.log('start refresh ticker job', job.name)

  switch (true) {
    case QUEUE.refresh.sp500TickerInfo === job.name:
      console.log('handle sp500TickerInfo refresh', job.data)
      break
    default:
      console.log(
        `refreshMarketIndexTicker method not found to process job: ${job.name}`
      )
  }
}
