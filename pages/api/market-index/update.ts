import initMarketIndexCron from 'lib/marketIndex/initMarketIndexCron';
import { NextApiRequest, NextApiResponse } from 'next';

// curl -H "Content-Type: application/json" -d "{\"access_key\": \"x\"}" http://localhost:3000/api/market-index/update
// curl -H "Content-Type: application/json" -d "{\"access_key\": \"secret\"}" https://blockwizards.herokuapp.com/api/market-index/update

/**
 * Description: Schedule a repeatable job to update market indexes and related ticker info data
 * @constructor
 */
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === 'POST') {
    const { error, jobs } = await initMarketIndexCron(request.body)

    console.log('error', error)
    console.log('jobs', jobs?.length)

    return error
      ? response.status(405).send(error)
      : response.status(200).send(jobs)
  } else {
    return response.status(405).send({ message: 'Method not allowed' })
  }
}
