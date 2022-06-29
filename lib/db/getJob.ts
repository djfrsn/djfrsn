import { Job } from '@prisma/client';
import prisma from 'lib/db/prisma';

async function getJob(whereOptions: {
  modelId?: number
  id?: string
}): Promise<{ job: Job }> {
  const job = await prisma.job.findFirst({
    where: whereOptions,
  })

  return { job }
}

export default getJob
