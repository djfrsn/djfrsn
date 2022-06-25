import prisma from 'lib/prisma';
import { MarketIndexJob } from 'lib/types';

async function getMarketIndexJob(id: number | string): Promise<MarketIndexJob> {
  const job = await prisma.job.findFirst({
    where: { id: Number(id) },
  })

  return { job }
}

export default getMarketIndexJob
