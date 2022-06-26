import prisma from 'lib/db/prisma';
import { IndexJob } from 'lib/interfaces';

async function getJob(whereOptions: {
  modelId?: number
  id?: number
}): Promise<IndexJob> {
  const job = await prisma.job.findFirst({
    where: whereOptions,
  })

  return { job }
}

export default getJob
