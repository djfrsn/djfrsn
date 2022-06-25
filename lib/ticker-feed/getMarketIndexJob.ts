import prisma from 'lib/prisma';
import { CreateMarketIndexJobInterface } from 'lib/types';

async function getMarketIndexJob(
  id: number | string
): CreateMarketIndexJobInterface {
  const job = await prisma.job.findFirst({
    where: { id: Number(id) },
  })

  return { job }
}

export default getMarketIndexJob
