import { Queue } from 'bullmq';
import connection from 'lib/db/redis';
import { NextApiRequest, NextApiResponse } from 'next';

// import createDailyTickerFeed from './createDailyTickerFeed';
// Daily specific ticker feed

// curl -H "Content-Type: application/json" -d "{\"foo\": \"bar\"}" http://localhost:3000/api/ticker-feed/update
// curl -H "Content-Type: application/json" -d "{\"foo\": \"bar\"}" https://blockwizards.herokuapp.com/api/ticker-feed/update

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === 'GET') {
    const sp500Queue = new Queue('sp500Update', { connection })
    const counts = await sp500Queue.getJobCounts('wait', 'completed', 'failed')

    return response.status(200).send(counts)
    // return response.status(200).send(res)
  } else {
    return response.status(405).send('Method not allowed')
  }
}
