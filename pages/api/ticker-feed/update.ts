import { NextApiRequest, NextApiResponse } from 'next';

import createDailyTickerFeed from './createDailyTickerFeed';
import createDailyTickerList from './createDailyTickerList';

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
    console.log('ticker list: ', tickerList)
    console.log('ticker length: ', tickerList.length)

    if (tickerList.length === 500) {
      await createDailyTickerFeed({
        tickerList,
      })
    }

    return response.status(200).send(true)
  } else {
    return response.status(405).send('Method not allowed')
  }
}
