// import addSP500UpdateJobs from 'lib/ticker-feed/addSP500UpdateJobs'
import { Job } from '@prisma/client';
import prisma from 'lib/prisma';
import createMarketIndexJob from 'lib/ticker-feed/createMarketIndexJob';
import getMarketIndexJob from 'lib/ticker-feed/getMarketIndexJob';

interface handleMarketIndexJobRequestOptions {
  marketIndexId: number | string
}

async function handleMarketIndexJobRequest(
  options: handleMarketIndexJobRequestOptions
) {
  let marketIndexId = options.marketIndexId
  let marketIndexJob: Job | undefined | null
  let error: { message: string }

  if (marketIndexId) {
    const marketIndex = await prisma.marketIndex.findFirst({
      where: { id: Number(marketIndexId) },
    })

    if (marketIndex) {
      marketIndexJob = await getMarketIndexJob(marketIndex.id)

      if (!marketIndexJob) {
        marketIndexJob = await createMarketIndexJob(marketIndex)
      }
    } else {
      error = { message: `MarketIndex with id ${marketIndexId} not found.` }
    }
  } else {
    error = { message: 'marketIndexId required in body.' }
  }

  return { marketIndexJob, error }
}

export default handleMarketIndexJobRequest
