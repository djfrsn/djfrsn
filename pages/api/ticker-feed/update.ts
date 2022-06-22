import { NextApiRequest, NextApiResponse } from 'next';

import createDailyTickerFeed from './createDailyTickerFeed';

// Daily specific ticker feed

// curl -H "Content-Type: application/json" -d "{\"foo\": \"bar\"}" http://localhost:3000/api/ticker-feed/update
// curl -H "Content-Type: application/json" -d "{\"foo\": \"bar\"}" https://blockwizards.herokuapp.com/api/ticker-feed/update

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === 'POST') {
    await createDailyTickerFeed({
      tickerNames: process.env.DAILY_TICKER_LIST,
    })

    return response.status(200).send(true)
  } else {
    return response.status(405).send('Method not allowed')
  }
}
