import { Job } from '@prisma/client';
import { MarketIndexJobOptions } from 'lib/types';

const initMarketIndexJobFlow = {
  async sp500(options: MarketIndexJobOptions): Promise<Job> {
    console.log('options', options)
    return null
  },
}

export default initMarketIndexJobFlow
