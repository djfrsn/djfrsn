import { QUEUE } from 'lib/const';
import { sp500UpdateFlow } from 'lib/db/queue';
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
    const result = await sp500UpdateFlow.getFlow({
      id: '0274f079-c84d-431d-a527-19ee28a38fa3',
      queueName: QUEUE.updateMarketIndex,
    })

    return response.status(200).send({
      message: `${result.children.length} waitingjobs need to be processed before next update.`,
    })
  } else {
    return response.status(405).send('Method not allowed')
  }
}
