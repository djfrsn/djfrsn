import { Job } from 'bullmq';
import { QUEUE } from 'lib/const';
import prisma from 'lib/db/prisma';
import { RefreshMarketIndexJob } from 'lib/interfaces';
import { today } from 'lib/utils/dates';

export default async function refreshMarketIndexProcessor(
  job: Job<RefreshMarketIndexJob>
) {
  console.log('start refresh market index job', job.name)

  switch (true) {
    case QUEUE.refresh.sp500 === job.name:
      console.log('handle sp500 refresh', job.data)
      await prisma.marketIndex.update({
        where: { id: job.data.id },
        data: { lastRefreshed: today.isoString },
      })
      await prisma.job.update({
        where: { modelId: job.data.id },
        data: { jobId: null },
      })
      break
    default:
      console.log(
        `refreshMarketIndex method not found to process job: ${job.name}`
      )
  }
}
