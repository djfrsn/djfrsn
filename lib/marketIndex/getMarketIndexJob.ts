import prisma from 'lib/db/prisma';
import { MarketIndexJob } from 'lib/interfaces';

async function getMarketIndexJob(id: number | string): Promise<MarketIndexJob> {
  const job = await prisma.job.findFirst({
    where: { modelId: Number(id) },
  })

  return { job }
}

export default getMarketIndexJob
