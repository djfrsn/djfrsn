import { Job } from '@prisma/client';
import prisma from 'lib/db/prisma';

async function createJob({
  modelName,
  modelId,
}: {
  modelName: string
  modelId: number
}): Promise<{ job: Job }> {
  const job = await prisma.job.create({
    data: {
      modelName,
      modelId,
    },
  })

  return { job }
}

export default createJob
