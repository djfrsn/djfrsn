import { Job } from 'bullmq';
import { QUEUE } from 'lib/const';
import { RefreshMarketIndexTickerJob } from 'lib/interfaces';
import createSP500TickerInfo from 'lib/marketIndex/createSP500TickerInfo';

export default async function refreshMarketIndexTickerProcessor(
  job: Job<RefreshMarketIndexTickerJob>
) {
  console.log('start refresh ticker job', job.name)

  // TODO: ensure retries are working
  // TODO: get time to run first job, use data to extrapolate job time est on status route

  switch (true) {
    case QUEUE.refresh.sp500TickerInfo === job.name:
      await createSP500TickerInfo(job.data)
      break
    default:
      console.log(
        `refreshMarketIndexTicker method not found to process job: ${job.name}`
      )
  }
}
