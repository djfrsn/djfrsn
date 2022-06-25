import prisma from 'lib/db/prisma';
import createMarketIndexRefreshJob from 'lib/ticker-feed/createMarketIndexRefreshJob';
import getMarketIndexJob from 'lib/ticker-feed/getMarketIndexJob';
import { MarketIndexJob } from 'lib/types';

// import addSP500UpdateJobs from 'lib/ticker-feed/addSP500UpdateJobs'
interface handleMarketIndexJobRequestOptions {
  marketIndexId: number | string
}

async function handleMarketIndexJobRequest(
  options: handleMarketIndexJobRequestOptions
) {
  let marketIndexId = options.marketIndexId
  let result: MarketIndexJob = {}

  if (marketIndexId) {
    const marketIndex = await prisma.marketIndex.findFirst({
      where: { id: Number(marketIndexId) },
    })

    if (marketIndex) {
      result = await getMarketIndexJob(marketIndex.id)

      if (!result.job) {
        result = await createMarketIndexRefreshJob(marketIndex)
      }
    } else {
      result.error = {
        message: `MarketIndex with id ${marketIndexId} not found.`,
      }
    }
  } else {
    result.error = { message: 'marketIndexId required in body.' }
  }

  return result
}

export default handleMarketIndexJobRequest
