import { sp500UpdateQueue } from 'lib/db/queue';
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
    const counts = await sp500UpdateQueue.getJobCounts(
      'wait',
      'completed',
      'failed'
    )

    return response.status(200).send(counts)
  } else {
    return response.status(405).send('Method not allowed')
  }
}
