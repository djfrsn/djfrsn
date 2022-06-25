// addSP500UpdateJobs()
import { Job, MarketIndex } from '@prisma/client';

async function createMarketIndexJob(marketIndex: MarketIndex): Promise<Job> {
  // TODO: create switch based on marketIndex.name
  console.log('createMarketIndexJobmarketIndex', marketIndex)
  return {
    id: 1,
    name: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    jobId: '',
    queueName: '',
  }
}

export default createMarketIndexJob
