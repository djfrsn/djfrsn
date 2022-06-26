import prisma from 'lib/db/prisma';
import { IndexJob } from 'lib/interfaces';

async function createJob({
  modelName,
  modelId,
}: {
  modelName: string
  modelId: number
}): Promise<IndexJob> {
  const job = await prisma.job.create({
    data: {
      modelName,
      modelId,
    },
  })

  return { job }
}

export default createJob
