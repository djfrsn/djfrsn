import createJob from 'lib/db/createJob';
import getJob from 'lib/db/getJob';
import prisma from 'lib/db/prisma';
import { IndexJob } from 'lib/interfaces';
import initMarketIndexFlow from 'lib/marketIndex/initMarketIndexFlow';

interface handleMarketIndexJobRequestOptions {
  marketIndexId: number | string
}

async function handleMarketIndexJobRequest(
  options: handleMarketIndexJobRequestOptions
) {
  let marketIndexId = options.marketIndexId
  let result: IndexJob = {}

  if (marketIndexId) {
    const marketIndex = await prisma.marketIndex.findFirst({
      where: { id: Number(marketIndexId) },
    })

    if (marketIndex) {
      result = await getJob({ modelId: marketIndex.id })

      if (!result.job) {
        result = await createJob({
          modelName: 'marketIndex',
          modelId: marketIndex.id,
        })
      }

      if (!result.job.jobId) {
        result = await initMarketIndexFlow(marketIndex)
      }
    }
  } else {
    result.error = { message: 'marketIndexId required in body.' }
  }

  return result
}

export default handleMarketIndexJobRequest