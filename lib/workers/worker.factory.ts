import { Processor, QueueScheduler, Worker } from 'bullmq';
import { options } from 'lib/db/queue';
import connection from 'lib/db/redis';

export function createWorker(
  name: string,
  processor: Processor,
  concurrency = 1
) {
  const worker = new Worker(name, processor, {
    connection,
    concurrency,
  })

  worker.on('completed', (job, err) => {
    console.log(`Completed job on queue ${name}`)
  })

  worker.on('failed', (job, err) => {
    console.error(`Failed job on queue ${name}`, err)
  })

  const scheduler = new QueueScheduler(name, options)

  return { worker, scheduler }
}
