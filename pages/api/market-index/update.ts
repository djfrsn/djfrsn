import initMarketIndexesRefresh from 'lib/marketIndex/initMarketIndexesRefresh';
import { NextApiRequest, NextApiResponse } from 'next';

// curl -H "Content-Type: application/json" -d "{\"marketIndexId\": \"1\"}" http://localhost:3000/api/market-index/update
// curl -H "Content-Type: application/json" -d "{\"marketIndexId\": \"1\"}" https://blockwizards.herokuapp.com/api/market-index/update

/**
 * Description: Schedule a repeatable job to update market indexes and related ticker info data
 * @constructor
 */
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === 'POST') {
    const { error, jobs } = await initMarketIndexesRefresh()

    console.log('error', error)
    console.log('jobs', jobs)

    return error
      ? response.status(405).send(error)
      : response.status(200).send(jobs)
  } else {
    return response.status(405).send({ message: 'Method not allowed' })
  }
}
