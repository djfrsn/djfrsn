import { Job } from 'bullmq';
import { RefreshMarketIndexTickerJob } from 'lib/interfaces';

export default async function refreshMarketIndexTickerProcessor(
  job: Job<RefreshMarketIndexTickerJob>
) {
  console.log('start refresh ticker job', job.name)

  return null
}
