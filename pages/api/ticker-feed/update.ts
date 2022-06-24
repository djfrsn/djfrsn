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
  if (request.method === 'POST') {
    const sp500Queue = new Queue('sp500Update', { connection })
    console.log('sp500Update', sp500Queue)
    // const tickerList = await createSP500Ticker()

    // const res = await createSP500TickerInfo({
    //   tickerList,
    // })

    return response.status(200).send(true)
    // return response.status(200).send(res)
  } else {
    return response.status(405).send('Method not allowed')
  }
}
