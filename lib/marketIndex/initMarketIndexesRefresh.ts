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
 * @constructor
 * @see {@link https://docs.bullmq.io/guide/jobs/repeatable}
 */
async function initMarketIndexesRefresh(): Promise<MarketIndexesRefresh> {
  let result: MarketIndexesRefresh = {}
  // if prisma.job exist with this queueName...return job and message we have scheduled
  const refreshJob = await prisma.job.findFirst({
    where: { queueName: QUEUE.refresh.marketIndexes },
  })
  if (!refreshJob) {
    const marketIndexes = await prisma.marketIndex.findMany()
    // get all market indexes and schedule job for each market based on timeframe
    const jobs: Promise<QueueJob>[] = []
    marketIndexes.forEach(marketIndex => {
      TIMEFRAMES.forEach(timeframe => {
        // create queue for each timeframe available, pass marketIndexes and timeframe as data
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
    // return results of each job created as jobs
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

    // await prisma.createMany
  } else {
    result.error = {
      message: 'MarketIndexesRefresh is already initialized',
      data: refreshJob,
    }
  }

  return result
}

export default initMarketIndexesRefresh
