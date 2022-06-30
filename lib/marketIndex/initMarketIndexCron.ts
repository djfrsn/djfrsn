import { Job } from '@prisma/client';
import { Job as QueueJob } from 'bullmq';
import { QUEUE, TIMEFRAMES } from 'lib/const';
import prisma from 'lib/db/prisma';
import { defaultJobOptions, refreshMarketIndexesQueue } from 'lib/db/queue';

interface MarketIndexesRefresh {
  error?: { message: string; data?: Job }
  jobs?: Job[]
}

function validKey(key: string) {
  return key === process.env.ACCESS_KEY
}

/**
 * Description: Create a repeatable job to refresh data for each market index on all timeframes
 * NOTE: Preference would be to add the repeat option to each individual marketIndex flow, but BullMQ flows don't support repeat the option
 * IMPORTANT: Bull is smart enough not to add the same repeatable job if the repeat options are the same.
 * @constructor
 * @see {@link https://docs.bullmq.io/guide/jobs/repeatable}
 */
async function initMarketIndexCron(options: {
  access_key: string
}): Promise<MarketIndexesRefresh> {
  let result: MarketIndexesRefresh = {}

  if (validKey(options.access_key)) {
    const marketIndexes = await prisma.marketIndex.findMany()
    const queueJobs: Promise<QueueJob>[] = []

    marketIndexes.forEach(marketIndex => {
      TIMEFRAMES.forEach(timeframe => {
        // create job for each timeframe available
        queueJobs.push(
          refreshMarketIndexesQueue.add(
            `refresh-${timeframe}-${marketIndex.name}`,
            { timeframe, marketIndex },
            {
              ...defaultJobOptions,
              repeat: { cron: QUEUE.cron.marketIndexes },
            }
          )
        )
      })
    })

    const queue = await Promise.all(queueJobs)

    const whereArgs = { queueName: QUEUE.refresh.marketIndexes }

    const [_, __, jobs] = await prisma.$transaction([
      prisma.job.deleteMany({
        where: whereArgs,
      }),
      prisma.job.createMany({
        data: queue.map(job => ({
          name: job.name,
          queueName: QUEUE.refresh.marketIndexes,
          jobId: job.id,
        })),
      }),
      prisma.job.findMany({
        where: whereArgs,
      }),
    ])

    result.jobs = jobs
  } else {
    result.error = {
      message: 'Invalid access_key',
    }
  }

  return result
}

export default initMarketIndexCron
