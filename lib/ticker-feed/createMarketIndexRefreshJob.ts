// addSP500UpdateJobs()
import { MarketIndex } from '@prisma/client';
import { CreateMarketIndexJob, MarketIndexJob } from 'lib/types';

import initMarketIndexJobFlow from './initMarketIndexJobFlow';

async function createMarketIndexRefreshJob(
  marketIndex: MarketIndex
): CreateMarketIndexJob {
  const result: MarketIndexJob = { error: null, job: null }
  const initJobFlow = initMarketIndexJobFlow[marketIndex.name]

  if (initJobFlow) {
    result.job = await initJobFlow({ marketIndex })
  } else {
    result.error = { message: `Job flow not found for ${marketIndex.name}` }
  }

  return result
}

export default createMarketIndexRefreshJob
