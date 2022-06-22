import { NextApiRequest, NextApiResponse } from 'next';

import createsSp500TickerFeed from './createsSP500TickerFeed';
import createDailyTickerList from './createsSP500TickerList';

// import createDailyTickerFeed from './createDailyTickerFeed';
// Daily specific ticker feed

// curl -H "Content-Type: application/json" -d "{\"foo\": \"bar\"}" http://localhost:3000/api/ticker-feed/update
// curl -H "Content-Type: application/json" -d "{\"foo\": \"bar\"}" https://blockwizards.herokuapp.com/api/ticker-feed/update

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === 'POST') {
    const tickerList = await createDailyTickerList()

    await createsSp500TickerFeed({
      tickerList,
    })

    return response.status(200).send(true)
  } else {
    return response.status(405).send('Method not allowed')
  }
}
