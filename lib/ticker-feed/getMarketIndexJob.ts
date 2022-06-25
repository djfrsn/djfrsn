import { Job } from '@prisma/client';
import prisma from 'lib/prisma';

async function getMarketIndexJob(id: number | string): Promise<Job | null> {
  const marketIndexJob = await prisma.job.findFirst({
    where: { id: Number(id) },
  })

  return marketIndexJob
}

export default getMarketIndexJob
