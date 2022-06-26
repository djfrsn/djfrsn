import { Processor, QueueScheduler, QueueSchedulerOptions, Worker, WorkerOptions } from 'bullmq';
import { options as defaultOptions } from 'lib/db/queue';

interface WorkerOptionsInterface {
  worker?: WorkerOptions
  scheduler?: QueueSchedulerOptions
}

export function createWorker(
  name: string,
  processor: Processor,
  concurrency = 1,
  options: WorkerOptionsInterface = {}
) {
  if (!options?.worker) options.worker = { concurrency }
  if (!options?.scheduler) options.scheduler = { autorun: true }

  const worker = new Worker(name, processor, {
    ...defaultOptions,
    ...options.worker,
  })

  worker.on('completed', (job, err) => {
    console.log(`Completed job on queue ${name}`)
  })

  worker.on('failed', (job, err) => {
    console.error(`Failed job on queue ${name}`, err)
  })

  const scheduler = new QueueScheduler(name, {
    ...defaultOptions,
    ...options.scheduler,
  })

  return { worker, scheduler }
}
