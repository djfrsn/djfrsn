import { JobNode } from 'bullmq';
import cronstrue from 'cronstrue';
import { QUEUE } from 'lib/const';
import { getSp500RefreshFlow, refreshMarketIndexesQueue } from 'lib/db/queue';
import { getDependenciesCount } from 'lib/utils/bullmq';
import { NextApiRequest, NextApiResponse } from 'next';

async function getJobData(
  queueName: string,
  jobId: string
): Promise<JobNode | any> {
  let res

  switch (true) {
    case queueName === QUEUE.refresh.sp500:
      return await getSp500RefreshFlow(jobId)
    case queueName === QUEUE.refresh.marketIndexes:
      res = await refreshMarketIndexesQueue.getJob(jobId)
      return {
        job: res,
        message: `Scheduled: ${cronstrue.toString(res?.opts.repeat.cron)}`,
      }
  }
}

// curl http://localhost:3000/api/market-index/status?jobId=2
// curl https://blockwizards.herokuapp.com/api/market-index/status?jobId=2

/**
 * Description: Return list of jobs in Redis + BullMQ
 * @constructor
 */
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === 'GET') {
    let result
    const jobId = request.query.jobId
    const queueName = request.query.queueName
    const validJobId = typeof jobId === 'string'
    const validQueueName = typeof queueName === 'string'

    if (validJobId && validQueueName) {
      const data = await getJobData(queueName, jobId)

      if (data) {
        const state = await data.job.getState()
        const dependencies = await data.job.getDependencies()
        const totalJobCount = getDependenciesCount(dependencies)
        const jobsWaitingCount = totalJobCount - dependencies.unprocessed.length

        // BUG: job.children doesn't return all children
        result = {
          state,
          message: data.message
            ? data.message
            : `${jobsWaitingCount}/${totalJobCount} jobs have been processed.`,
          job: {
            id: data.job.id,
            name: data.job.name,
            createdAt: data.job.timestamp,
            progress: data.job.progress,
            attemptsMade: data.job.attemptsMade,
            children: Array.isArray(data?.children)
              ? data.children.map(childJob => ({
                  id: childJob.job.id,
                  name: childJob.job.name,
                  timestamp: childJob.job.timestamp,
                  progress: childJob.job.progress,
                  attemptsMade: childJob.job.attemptsMade,
                  data: childJob.job.data,
                }))
              : null,
          },
        }
      } else {
        result = {
          message:
            typeof jobId === 'string' && jobId !== 'null'
              ? `Job ${jobId} not found`
              : 'queue empty',
        }
      }
    } else {
      result = {
        message: `jobId and/or jobName query not found`,
      }
    }

    return response.status(200).send(result)
  } else {
    return response.status(405).send('Method not allowed')
  }
}
