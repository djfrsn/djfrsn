// addSP500UpdateJobs()
import { Job, MarketIndex } from '@prisma/client';
import { IndexJob, MarketIndexJobOptions } from 'lib/interfaces';
import { InitMarketIndexFlow } from 'lib/types';

import createSP500RefreshJob from './createSP500RefreshJob';

type InitMarketIndexRefreshJob = (
  options: MarketIndexJobOptions
) => Promise<Job>

const createJob: { [name: string]: InitMarketIndexRefreshJob } = {
  async sp500(options: MarketIndexJobOptions) {
    const results = await createSP500RefreshJob(options)

    return results
  },
}

async function initMarketIndexFlow(
  marketIndex: MarketIndex
): InitMarketIndexFlow {
  let result: IndexJob = { error: null, job: null }
  const init = createJob[marketIndex.name]

  if (init) {
    result.job = await init({ marketIndex })
  } else {
    result.error = { message: `Job flow not found for ${marketIndex.name}` }
  }

  return result
}

export default initMarketIndexFlow
