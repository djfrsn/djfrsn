import { QUEUE } from 'lib/const';
import { sp500UpdateFlow } from 'lib/db/queue';
import { NextApiRequest, NextApiResponse } from 'next';

// curl http://localhost:3000/api/market-index/status?jobId=2
// curl https://blockwizards.herokuapp.com/api/market-index/status?jobId=2

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === 'GET') {
    let result
    const jobId = request.query.jobId

    if (typeof jobId === 'string') {
      const flow = await sp500UpdateFlow.getFlow({
        id: jobId,
        queueName: QUEUE.refresh.marketIndex,
      })

      if (Array.isArray(flow?.children)) {
        const state = await flow.job.getState()
        const dependencies = await flow.job.getDependencies()
        const totalJobCount =
          Object.keys(dependencies.processed).length +
          dependencies.unprocessed.length
        const jobsWaitingCount = totalJobCount - dependencies.unprocessed.length

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
