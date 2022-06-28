import { getSp500RefreshFlow } from 'lib/db/queue';
import { getDependenciesCount } from 'lib/utils/bullmq';
import { NextApiRequest, NextApiResponse } from 'next';

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

    if (typeof jobId === 'string') {
      const flow = await getSp500RefreshFlow(jobId)

      if (Array.isArray(flow?.children)) {
        const state = await flow.job.getState()
        const dependencies = await flow.job.getDependencies()
        const totalJobCount = getDependenciesCount(dependencies)
        const jobsWaitingCount = totalJobCount - dependencies.unprocessed.length

        // BUG: job.children doesn't return all children

        result = {
          state,
          message: `${jobsWaitingCount}/${totalJobCount} jobs have been processed.`,
          job: {
            id: flow.job.id,
            name: flow.job.name,
            createdAt: flow.job.timestamp,
            progress: flow.job.progress,
            attemptsMade: flow.job.attemptsMade,
            children: flow.children.map(childJob => ({
              id: childJob.job.id,
              name: childJob.job.name,
              timestamp: childJob.job.timestamp,
              progress: childJob.job.progress,
              attemptsMade: childJob.job.attemptsMade,
              data: childJob.job.data,
            })),
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
        message: `jobId query not found`,
      }
    }

    return response.status(200).send(result)
  } else {
    return response.status(405).send('Method not allowed')
  }
}
