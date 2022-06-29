import getJob from 'lib/db/getJob';
import prisma from 'lib/db/prisma';
import { IndexJob } from 'lib/interfaces';
import initMarketIndexFlow from 'lib/marketIndex/initMarketIndexFlow';

interface handleMarketIndexJobRequestOptions {
  marketIndexId: number | string
}

async function handleMarketIndexJobRequest(
  options: handleMarketIndexJobRequestOptions
): Promise<IndexJob> {
  let marketIndexId = options.marketIndexId
  let result: IndexJob = {}

  if (marketIndexId) {
    await prisma.job.update({
      where: { modelId: Number(marketIndexId) },
      data: { jobId: null },
    })
    const marketIndex = await prisma.marketIndex.findFirst({
      where: { id: Number(marketIndexId) },
    })

    if (marketIndex) {
      result = await getJob({ modelId: marketIndex.id })

      if (!result.job || !result.job?.jobId) {
        result = await initMarketIndexFlow(marketIndex)
      }
    } else {
      result.error = {
        message: `MarketIndex with id of ${marketIndexId} not found`,
      }
    }
  } else {
    result.error = { message: 'marketIndexId required in body.' }
  }

  return result
}

export default handleMarketIndexJobRequest
