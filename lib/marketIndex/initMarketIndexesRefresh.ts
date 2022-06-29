import { Job } from '@prisma/client';
import { Job as QueueJob } from 'bullmq';
import { QUEUE, TIMEFRAMES } from 'lib/const';
import prisma from 'lib/db/prisma';
import { defaultJobOptions, refreshMarketIndexesQueue } from 'lib/db/queue';

interface MarketIndexesRefresh {
  error?: { message: string; data?: Job }
  jobs?: Job[]
}

/**
 * Description: Create a repeatable job to refresh data for each market index on all timeframes
 * NOTE: Preference would be to add the repeat option to each individual marketIndex flow, but BullMQ flows don't support repeat the option
 * IMPORTANT: Bull is smart enough not to add the same repeatable job if the repeat options are the same.
 * @constructor
 * @see {@link https://docs.bullmq.io/guide/jobs/repeatable}
 */
async function initMarketIndexesRefresh(): Promise<MarketIndexesRefresh> {
  let result: MarketIndexesRefresh = {}
  const marketIndexes = await prisma.marketIndex.findMany()
  const jobs: Promise<QueueJob>[] = []

  await prisma.job.deleteMany({
    where: { queueName: QUEUE.refresh.marketIndexes },
  })

  marketIndexes.forEach(marketIndex => {
    TIMEFRAMES.forEach(timeframe => {
      // create queue for each timeframe available
      jobs.push(
        refreshMarketIndexesQueue.add(
          `refresh-${timeframe}-${marketIndex.name}`,
          { timeframe, marketIndex },
          {
            ...defaultJobOptions,
            repeat: { cron: '*/10 * * * * *' },
          }
        )
      )
    })
  })

  const queueJobs = await Promise.all(jobs)

  const data = queueJobs.map(job => ({
    name: job.name,
    queueName: QUEUE.refresh.marketIndexes,
    jobId: job.id,
  }))

  await prisma.job.createMany({ data })

  result.jobs = await prisma.job.findMany({
    where: { queueName: QUEUE.refresh.marketIndexes },
  })

  return result
}

export default initMarketIndexesRefresh
