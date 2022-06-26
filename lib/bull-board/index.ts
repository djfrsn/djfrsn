import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import express from 'express';
import { sp500UpdateQueue } from 'lib/db/queue';

const serverAdapter = new ExpressAdapter()

createBullBoard({
  queues: [new BullMQAdapter(sp500UpdateQueue)],
  serverAdapter: serverAdapter,
})

const app = express()

serverAdapter.setBasePath('/admin/queues')
app.use('/admin/queues', serverAdapter.getRouter())

// other configurations of your server
const PORT = 3080
app.listen(PORT, () => {
  console.log(`Running on ${PORT}...`)
  console.log(`For the UI, open http://localhost:${PORT}/admin/queues`)
  console.log('Make sure Redis is running on port 6379 by default')
})
