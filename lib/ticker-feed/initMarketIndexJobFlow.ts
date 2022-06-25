import { Job } from '@prisma/client';
import { MarketIndexJobOptions } from 'lib/types';

import createSP500RefreshJob from './createSP500RefreshJob';

type InitMarketIndexRefreshJob = (
  options: MarketIndexJobOptions
) => Promise<Job>

const initMarketIndexJobFlow: { [name: string]: InitMarketIndexRefreshJob } = {
  async sp500(options: MarketIndexJobOptions): Promise<Job> {
    const job = await createSP500RefreshJob(options)

    return job
  },
}

export default initMarketIndexJobFlow
