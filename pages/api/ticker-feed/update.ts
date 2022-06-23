import { NextApiRequest, NextApiResponse } from 'next';

import createSP500Ticker from './createSP500Ticker';
import createSP500TickerInfo from './createSP500TickerInfo';

// import createDailyTickerFeed from './createDailyTickerFeed';
// Daily specific ticker feed

// curl -H "Content-Type: application/json" -d "{\"foo\": \"bar\"}" http://localhost:3000/api/ticker-feed/update
// curl -H "Content-Type: application/json" -d "{\"foo\": \"bar\"}" https://blockwizards.herokuapp.com/api/ticker-feed/update

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === 'POST') {
    const tickerList = await createSP500Ticker()

    const res = await createSP500TickerInfo({
      tickerList,
    })

    return response.status(200).send(res)
  } else {
    return response.status(405).send('Method not allowed')
  }
}
