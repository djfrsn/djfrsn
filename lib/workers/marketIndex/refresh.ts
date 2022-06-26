import { Job } from 'bullmq';
import { RefreshMarketIndexJob } from 'lib/interfaces';

export default async function refreshMarketIndexProcessor(
  job: Job<RefreshMarketIndexJob>
) {
  console.log('start refresh market index job', job)

  return null
}

// TODO: on complete remove job from postgres
// await prisma.marketIndex.update({
//   where: { id: marketIndex.id },
//   data: { lastRefreshed: today.isoString },
// })
